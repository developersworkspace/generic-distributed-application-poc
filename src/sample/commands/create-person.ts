import { ICommand } from '../../interfaces/command';
import { PersonRepository } from '../repositories/person';
import { Person } from '../models/person';

export class CreatePersonCommand implements ICommand {
  public id: number = null;

  constructor(
    public firstName: string,
    public lastName: string,
    public identificationNumber: string,
    protected personRepository: PersonRepository,
  ) {
    this.id = Math.floor(Math.random() * 100000);
  }

  public async canExecute(): Promise<boolean> {
    return true;
  }

  public async doExecute(): Promise<boolean> {
    return true;
  }

  public getId(): string {
    return this.id.toString();
  }

  public async preExecute(): Promise<boolean> {
    const existingPerson: Person = this.personRepository.find(this.identificationNumber);

    if (existingPerson) {
      return false;
    }

    this.personRepository.insert(new Person(this.firstName, this.lastName, this.identificationNumber));

    return true;
  }

  public async serialize(): Promise<any> {
    return {
      id: this.id,
      firstName: this.firstName,
      identificationNumber: this.identificationNumber,
      lastName: this.lastName,
    };
  }

  public async undo(): Promise<void> {
    this.personRepository.delete(this.identificationNumber);
  }
}
