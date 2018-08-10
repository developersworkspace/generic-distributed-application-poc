import { ICommand } from './interfaces/command';
import { INodeTransportProtocol } from './interfaces/node-transport-protocol';
import { QuorumPromiseHelper } from './helpers/quorum-promise';
import { CommandInvoker } from './command-invoker';

export class Coordinator {
  constructor(
    protected nodes: Array<INodeTransportProtocol>,
    protected timeout: number,
    protected commandInvoker: CommandInvoker, // TODO: Create interface
  ) {}

  public async execute(command: ICommand, index: number): Promise<boolean> {
    const canExecute: boolean = await this.canExecute(command, index);

    if (!canExecute) {
      await this.undo(command, index);

      return false;
    }

    const preExecute: boolean = await this.preExecute(command, index);

    if (!preExecute) {
      await this.undo(command, index);

      return false;
    }

    const doExecute: boolean = await this.doExecute(command, index);

    if (!doExecute) {
      await this.undo(command, index);

      return false;
    }

    return true;
  }

  protected async canExecute(command: ICommand, index: number): Promise<boolean> {
    const canExecutePromises: Array<Promise<boolean>> = this.nodes.map((node: INodeTransportProtocol) => {
      return node.canExecute(command, index);
    });

    canExecutePromises.push(this.commandInvoker.invokeCanExecute(command, index));

    const canExecuteResults: Array<boolean> = await QuorumPromiseHelper.execute<boolean>(
      canExecutePromises,
      this.timeout,
      (result: boolean) => {
        return result;
      },
    );

    if (!canExecuteResults) {
      return false;
    }

    return true;
  }

  protected async doExecute(command: ICommand, index: number): Promise<boolean> {
    const doExecutePromises: Array<Promise<boolean>> = this.nodes.map((node: INodeTransportProtocol) => {
      return node.doExecute(command, index);
    });

    doExecutePromises.push(this.commandInvoker.invokeDoExecute(command, index));

    const doExecuteResults: Array<boolean> = await QuorumPromiseHelper.execute<boolean>(
      doExecutePromises,
      this.timeout,
      (result: boolean) => {
        return result;
      },
    );

    if (!doExecuteResults) {
      return false;
    }

    return true;
  }

  protected async preExecute(command: ICommand, index: number): Promise<boolean> {
    const preExecutePromises: Array<Promise<boolean>> = this.nodes.map((node: INodeTransportProtocol) => {
      return node.preExecute(command, index);
    });

    preExecutePromises.push(this.commandInvoker.invokePreExecute(command, index));

    const preExecuteResults: Array<boolean> = await QuorumPromiseHelper.execute<boolean>(
      preExecutePromises,
      this.timeout,
      (result: boolean) => {
        return result;
      },
    );

    if (!preExecuteResults) {
      return false;
    }

    return true;
  }

  protected async undo(command: ICommand, index: number): Promise<void> {
    const undoPromises: Array<Promise<void>> = this.nodes.map((node: INodeTransportProtocol) => {
      return node.undo(command, index);
    });

    undoPromises.push(this.commandInvoker.invokeUndo(command, index));

    await undoPromises;
  }
}
