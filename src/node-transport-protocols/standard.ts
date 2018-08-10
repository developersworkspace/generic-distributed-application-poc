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

  public async canExecute(command: ICommand): Promise<boolean> {
    return new Promise<boolean>((resolve: (result: boolean) => void, reject: (error: Error) => void) => {
      const commandId: string = command.getId();

      this.correlationActions[`${commandId}-canExecute`] = {
        resolve,
        reject,
      };

      setTimeout(() => {
        if (!this.correlationActions[`${commandId}-canExecute`]) {
          return;
        }

        reject(new Error('Timeout'));

        delete this.correlationActions[`${commandId}-canExecute`];
      }, this.timeout);

      this.sendFn({
        command,
        type: 'canExecuteRequest',
      });
    });
  }

  public async doExecute(command: ICommand): Promise<boolean> {
    return null;
  }

  public async preExecute(command: ICommand): Promise<boolean> {
    return null;
  }

  public async undo(command: ICommand): Promise<void> {
    return null;
  }

  public async receive(obj: any): Promise<void> {
    const command: ICommand = this.commandBuilder.reset().build(obj.command);

    if (obj.type === 'canExecuteRequest') {
      await this.handleCanExecuteRequest(command);
    } else if (obj.type === 'canExecuteResponse') {
      await this.handleCanExecuteResponse(command, obj.success);
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
}
