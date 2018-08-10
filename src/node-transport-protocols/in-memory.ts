import { INodeTransportProtocol } from '../interfaces/node-transport-protocol';
import { ICommand } from '../interfaces/command';
import { ICommandBuilder } from '../interfaces/command-builder';

export class InMemoryNodeTransportProtocol implements INodeTransportProtocol {
  constructor(protected commandBuilder: ICommandBuilder) {}

  public canExecute(command: ICommand): Promise<boolean> {
    command = this.commandBuilder.reset().build(command);

    return command.canExecute();
  }

  public doExecute(command: ICommand): Promise<boolean> {
    command = this.commandBuilder.reset().build(command);

    return command.doExecute();
  }

  public preExecute(command: ICommand): Promise<boolean> {
    command = this.commandBuilder.reset().build(command);

    return command.preExecute();
  }

  public undo(command: ICommand): Promise<void> {
    command = this.commandBuilder.reset().build(command);

    return command.undo();
  }
}
