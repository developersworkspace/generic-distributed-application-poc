import { ICommand } from './command';

export interface IWriteAheadLog {
  append(entry: { command: ICommand; index: number; type: string }): Promise<void>;

  getCurrentIndex(): Promise<number>;
}
