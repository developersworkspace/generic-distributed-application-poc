import { ICommandBuilder } from '../interfaces/command-builder';
import { ICommand } from '../interfaces/command';
import { CreatePersonCommand } from './commands/create-person';
import { PersonRepository } from './repositories/person';

export class CommandBuilder implements ICommandBuilder {
  constructor(protected personRepository: PersonRepository) {}

  public build(obj: any): ICommand {
    return new CreatePersonCommand(obj.firstName, obj.lastName, obj.identificationNumber, this.personRepository);
  }

  public reset(): ICommandBuilder {
    return this;
  }
}
