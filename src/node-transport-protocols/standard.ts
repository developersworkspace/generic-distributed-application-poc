import { INodeTransportProtocol } from '../interfaces/node-transport-protocol';
import { ICommand } from '../interfaces/command';
import { ICommandBuilder } from '../interfaces/command-builder';

export class StandardNodeTransportProtocol implements INodeTransportProtocol {
  protected correlationActions: {} = {};

  constructor(
    protected commandBuilder: ICommandBuilder,
    protected timeout: number,
    protected sendFn: (obj: any) => void,
  ) {}

  public canExecute(command: ICommand): Promise<boolean> {
    return this.sendCommand<boolean>(command, 'canExecute');
  }

  public doExecute(command: ICommand): Promise<boolean> {
    return this.sendCommand<boolean>(command, 'doExecute');
  }

  public async preExecute(command: ICommand): Promise<boolean> {
    return this.sendCommand<boolean>(command, 'preExecute');
  }

  public async undo(command: ICommand): Promise<void> {
    return this.sendCommand<void>(command, 'undo');
  }

  public async receive(obj: any): Promise<void> {
    const command: ICommand = this.commandBuilder.reset().build(obj.command);

    if (obj.type === 'canExecuteRequest') {
      await this.handleCanExecuteRequest(command);
    } else if (obj.type === 'canExecuteResponse') {
      await this.handleCanExecuteResponse(command, obj.success);
    } else if (obj.type === 'doExecuteRequest') {
      throw new Error('Not Implemented Yet');
    } else if (obj.type === 'doExecuteResponse') {
      throw new Error('Not Implemented Yet');
    } else if (obj.type === 'preExecuteRequest') {
      throw new Error('Not Implemented Yet');
    } else if (obj.type === 'preExecuteResponse') {
      throw new Error('Not Implemented Yet');
    } else if (obj.type === 'undoRequest') {
      throw new Error('Not Implemented Yet');
    } else if (obj.type === 'undoResponse') {
      throw new Error('Not Implemented Yet');
    }
  }

  protected async handleCanExecuteRequest(command: ICommand): Promise<void> {
    const canExecuteResult: boolean = await command.canExecute();

    if (!canExecuteResult) {
      await this.sendFn({
        command: command.serialize(),
        success: false,
        type: 'canExecuteResponse',
      });

      return;
    }

    await this.sendFn({
      command: command.serialize(),
      success: true,
      type: 'canExecuteResponse',
    });
  }

  protected async handleCanExecuteResponse(command: ICommand, success: boolean): Promise<void> {
    const commandId: string = command.getId();

    if (!this.correlationActions[`${commandId}-canExecute`]) {
      return;
    }

    this.correlationActions[`${commandId}-canExecute`].resolve(success);

    delete this.correlationActions[`${commandId}-canExecute`];
  }

  protected sendCommand<T>(command: ICommand, type: string): Promise<T> {
    return new Promise<T>((resolve: (result: T) => void, reject: (error: Error) => void) => {
      const commandId: string = command.getId();

      this.correlationActions[`${commandId}-${type}`] = {
        resolve,
        reject,
      };

      setTimeout(() => {
        if (!this.correlationActions[`${commandId}-${type}`]) {
          return;
        }

        reject(new Error('Timeout'));

        delete this.correlationActions[`${commandId}-${type}`];
      }, this.timeout);

      this.sendFn({
        command: command.serialize(),
        type: `${type}Request`,
      });
    });
  }
}
