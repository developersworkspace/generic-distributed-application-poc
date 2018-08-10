import { ICommand } from './command';

export interface ICommandBuilder {
  build(obj: any): ICommand;

  reset(): ICommandBuilder;
}
