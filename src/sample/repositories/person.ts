import { Person } from '../models/person';

export class PersonRepository {
  protected persons: Array<Person> = [];

  constructor(protected id: number) {

  }

  public delete(identificationNumber: string): void {
    const person: Person = this.persons.find((person: Person) => person.identificationNumber === identificationNumber);

    if (!person) {
      return;
    }

    const index: number = this.persons.indexOf(person);

    if (index === -1) {
      return null;
    }

    this.persons.splice(index, 1);
  }

  public find(identificationNumber: string): Person {
    return this.persons.find((person: Person) => person.identificationNumber === identificationNumber);
  }

  public insert(person: Person): void {
    this.persons.push(person);
  }
}
