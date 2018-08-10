import { ICommand } from './interfaces/command';

export class Cohort {
  public canExecute(command: ICommand): Promise<boolean> {
    return command.canExecute();
  }

  public doExecute(command: ICommand): Promise<boolean> {
    return command.doExecute();
  }

  public preExecute(command: ICommand): Promise<boolean> {
    return command.preExecute();
  }

  public undo(command: ICommand): Promise<boolean> {
    return command.undo();
  }
}
