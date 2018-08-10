export interface ICommand {

    canExecute(): Promise<boolean>;

    doExecute(): Promise<boolean>;

    getId(): Promise<string>

    preExecute(): Promise<boolean>;

    serialize(): Promise<any>;

    undo(): Promise<boolean>;

}
