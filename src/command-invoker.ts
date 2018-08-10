import { ICommand } from './interfaces/command';
import { IWriteAheadLog } from './interfaces/write-ahead-log';

export class CommandInvoker {
  constructor(protected writeAheadLog: IWriteAheadLog) {}

  public async invokeCanExecute(command: ICommand, index: number): Promise<boolean> {
    const currentIndex: number = await this.writeAheadLog.getCurrentIndex();

    if (currentIndex + 1 !== index) {
      // TODO: Implement SYNC
      return false;
    }

    await this.writeAheadLog.append({ command: await command.serialize(), index, type: 'canExecute' });

    return command.canExecute();
  }

  public async invokeDoExecute(command: ICommand, index: number): Promise<boolean> {
    const currentIndex: number = await this.writeAheadLog.getCurrentIndex();

    if (currentIndex + 1 !== index) {
      // TODO: Implement SYNC
      return false;
    }

    await this.writeAheadLog.append({ command: await command.serialize(), index, type: 'doExecute' });

    return command.doExecute();
  }

  public async invokePreExecute(command: ICommand, index: number): Promise<boolean> {
    const currentIndex: number = await this.writeAheadLog.getCurrentIndex();

    if (currentIndex + 1 !== index) {
      // TODO: Implement SYNC
      return false;
    }

    await this.writeAheadLog.append({ command: await command.serialize(), index, type: 'preExecute' });

    return command.preExecute();
  }

  public async invokeUndo(command: ICommand, index: number): Promise<void> {
    const currentIndex: number = await this.writeAheadLog.getCurrentIndex();

    if (currentIndex + 1 !== index) {
      // TODO: Implement SYNC
      return;
    }

    await this.writeAheadLog.append({ command: await command.serialize(), index, type: 'undo' });

    return command.undo();
  }
}
