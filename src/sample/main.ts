import { INodeTransportProtocol } from '../interfaces/node-transport-protocol';
import { InMemoryNodeTransportProtocol } from '../node-transport-protocols/in-memory';
import { ICommandBuilder } from '../interfaces/command-builder';
import { CommandBuilder } from './command-builder';
import { PersonRepository } from './repositories/person';
import { Coordinator } from '../coordinator';
import { Person } from './models/person';
import { CreatePersonCommand } from './commands/create-person';

const node1PersonRepository: PersonRepository = new PersonRepository(1);
const node2PersonRepository: PersonRepository = new PersonRepository(2);
const node3PersonRepository: PersonRepository = new PersonRepository(3);
const node4PersonRepository: PersonRepository = new PersonRepository(4);
const node5PersonRepository: PersonRepository = new PersonRepository(5);

const node1CommandBuilder: ICommandBuilder = new CommandBuilder(node1PersonRepository);
const node2CommandBuilder: ICommandBuilder = new CommandBuilder(node2PersonRepository);
const node3CommandBuilder: ICommandBuilder = new CommandBuilder(node3PersonRepository);
const node4CommandBuilder: ICommandBuilder = new CommandBuilder(node4PersonRepository);
const node5CommandBuilder: ICommandBuilder = new CommandBuilder(node5PersonRepository);

const node1: INodeTransportProtocol = new InMemoryNodeTransportProtocol(node1CommandBuilder);
const node2: INodeTransportProtocol = new InMemoryNodeTransportProtocol(node2CommandBuilder);
const node3: INodeTransportProtocol = new InMemoryNodeTransportProtocol(node3CommandBuilder);
const node4: INodeTransportProtocol = new InMemoryNodeTransportProtocol(node4CommandBuilder);
const node5: INodeTransportProtocol = new InMemoryNodeTransportProtocol(node5CommandBuilder);

const coordinator1: Coordinator = new Coordinator([node2, node3, node4, node5], 100);

// TEMP
node2PersonRepository.insert(new Person('Barend', 'Erasmus', '9605235100085'));
node3PersonRepository.insert(new Person('Barend', 'Erasmus', '9605235100085'));
node4PersonRepository.insert(new Person('Barend', 'Erasmus', '9605235100085'));
node5PersonRepository.insert(new Person('Barend', 'Erasmus', '9605235100085'));

(async () => {
  const result: boolean = await coordinator1.execute(
    new CreatePersonCommand('Barend', 'Erasmus', '9605235100085', node1PersonRepository),
  );

  console.log(result);
})();
