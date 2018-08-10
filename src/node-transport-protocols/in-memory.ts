import { INodeTransportProtocol } from '../interfaces/node-transport-protocol';
import { ICommand } from '../interfaces/command';
import { ICommandBuilder } from '../interfaces/command-builder';
import { CommandInvoker } from '../command-invoker';

export class InMemoryNodeTransportProtocol implements INodeTransportProtocol {
  constructor(protected commandBuilder: ICommandBuilder, protected commandInvoker: CommandInvoker) {}

  public canExecute(command: any, index: number): Promise<boolean> {
    command = this.commandBuilder.reset().build(command);

    return this.commandInvoker.invokeCanExecute(command, index);
  }

  public doExecute(command: ICommand, index: number): Promise<boolean> {
    command = this.commandBuilder.reset().build(command);

    return this.commandInvoker.invokeDoExecute(command, index);
  }

  public preExecute(command: ICommand, index: number): Promise<boolean> {
    command = this.commandBuilder.reset().build(command);

    return this.commandInvoker.invokePreExecute(command, index);
  }

  public undo(command: ICommand, index: number): Promise<void> {
    command = this.commandBuilder.reset().build(command);

    return this.commandInvoker.invokeUndo(command, index);
  }
}
