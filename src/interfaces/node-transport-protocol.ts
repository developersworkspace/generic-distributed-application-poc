import { ICommand } from './command';

export interface INodeTransportProtocol {
  canExecute(command: ICommand, index: number): Promise<boolean>;

  doExecute(command: ICommand, index: number): Promise<boolean>;

  preExecute(command: ICommand, index: number): Promise<boolean>;

  undo(command: ICommand, index: number): Promise<void>;
}
