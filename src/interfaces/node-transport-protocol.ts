import { ICommand } from './command';

export interface INodeTransportProtocol {
  canExecute(command: ICommand): Promise<boolean>;

  doExecute(command: ICommand): Promise<boolean>;

  preExecute(command: ICommand): Promise<boolean>;

  undo(command: ICommand): Promise<void>;
}
