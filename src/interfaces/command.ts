export interface ICommand {
    
    canExecute(): Promise<boolean>;

    doExecute(): Promise<boolean>;

    getId(): string;

    preExecute(): Promise<boolean>;

    serialize(): Promise<any>;

    undo(): Promise<void>;

}
