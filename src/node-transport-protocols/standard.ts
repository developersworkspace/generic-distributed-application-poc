import { INodeTransportProtocol } from '../interfaces/node-transport-protocol';
import { ICommand } from '../interfaces/command';

export class StandardNodeTransportProtocol implements INodeTransportProtocol {
  protected correlationActions: {} = {};

  constructor(protected sendFn: (obj: any) => void) {}

  public async canExecute(command: ICommand): Promise<boolean> {
    return null;
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

  public async receive(obj: { command: any; type: string }): Promise<void> {
    const command: ICommand = obj.command; // TODO: Implement command builder her

    if (obj.type === 'canExecuteRequest') {
        await this.handleCanExecuteRequest(command);
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
}
