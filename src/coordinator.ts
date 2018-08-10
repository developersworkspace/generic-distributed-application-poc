import { ICommand } from './interfaces/command';
import { INodeTransportProtocol } from './interfaces/node-transport-protocol';
import { QuorumPromiseHelper } from './helpers/quorum-promise';

export class Coordinator {
  constructor(protected nodes: Array<INodeTransportProtocol>) {}

  public async execute(command: ICommand): Promise<boolean> {
    const canExecute: boolean = await this.canExecute(command);

    if (!canExecute) {
      await this.undo(command);

      return false;
    }

    const preExecute: boolean = await this.preExecute(command);

    if (!preExecute) {
      await this.undo(command);

      return false;
    }

    const doExecute: boolean = await this.doExecute(command);

    if (!doExecute) {
      await this.undo(command);

      return false;
    }

    return true;
  }

  protected async canExecute(command: ICommand): Promise<boolean> {
    const canExecutePromises: Array<Promise<boolean>> = this.nodes.map((node: INodeTransportProtocol) => {
      return node.canExecute(command);
    });

    const canExecuteResults: Array<boolean> = await QuorumPromiseHelper.execute<boolean>(
      canExecutePromises,
      (result: boolean) => {
        return result;
      },
    );

    if (!canExecuteResults) {
      return false;
    }

    return true;
  }

  protected async doExecute(command: ICommand): Promise<boolean> {
    const doExecutePromises: Array<Promise<boolean>> = this.nodes.map((node: INodeTransportProtocol) => {
      return node.doExecute(command);
    });

    const doExecuteResults: Array<boolean> = await QuorumPromiseHelper.execute<boolean>(
      doExecutePromises,
      (result: boolean) => {
        return result;
      },
    );

    if (!doExecuteResults) {
      return false;
    }

    return true;
  }

  protected async preExecute(command: ICommand): Promise<boolean> {
    const preExecutePromises: Array<Promise<boolean>> = this.nodes.map((node: INodeTransportProtocol) => {
      return node.preExecute(command);
    });

    const preExecuteResults: Array<boolean> = await QuorumPromiseHelper.execute<boolean>(
      preExecutePromises,
      (result: boolean) => {
        return result;
      },
    );

    if (!preExecuteResults) {
      return false;
    }

    return true;
  }

  protected async undo(command: ICommand): Promise<void> {
    const undoPromises: Array<Promise<void>> = this.nodes.map((node: INodeTransportProtocol) => {
      return node.undo(command);
    });

    await undoPromises;
  }
}
