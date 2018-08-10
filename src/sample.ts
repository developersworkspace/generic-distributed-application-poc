import { INodeTransportProtocol } from './interfaces/node-transport-protocol';
import { ICommand } from './interfaces/command';
import { ICommandBuilder } from './interfaces/command-builder';
import { InMemoryNodeTransportProtocol } from './node-transport-protocols/in-memory';
import { Coordinator } from './coordinator';


export class DemoCommand implements ICommand {
    constructor(protected id: string, protected nodeId: string) {}
  
    public async canExecute(): Promise<boolean> {
      console.log(`${this.nodeId}: canExecute()`);
  
      return true;
    }
  
    public async doExecute(): Promise<boolean> {
      console.log(`${this.nodeId}: doExecute()`);
  
      return true;
    }
  
    public getId(): string {
      return this.id;
    }
  
    public async preExecute(): Promise<boolean> {
      console.log(`${this.nodeId}: preExecute()`);
  
      return true;
    }
  
    public async serialize(): Promise<any> {
      throw new Error('Method not implemented.');
    }
  
    public async undo(): Promise<void> {
      console.log(`${this.nodeId}: undo()`);
    }
  }
  

const node1CommandBuilder: ICommandBuilder = {
  build: (obj: any) => {
    return new DemoCommand(obj.id, 'A');
  },
  reset: () => {
    return node1CommandBuilder;
  },
};

const node2CommandBuilder: ICommandBuilder = {
  build: (obj: any) => {
    return new DemoCommand(obj.id, 'B');
  },
  reset: () => {
    return node2CommandBuilder;
  },
};

const node3CommandBuilder: ICommandBuilder = {
  build: (obj: any) => {
    return new DemoCommand(obj.id, 'C');
  },
  reset: () => {
    return node3CommandBuilder;
  },
};

const node4CommandBuilder: ICommandBuilder = {
  build: (obj: any) => {
    return new DemoCommand(obj.id, 'D');
  },
  reset: () => {
    return node4CommandBuilder;
  },
};

const node1: INodeTransportProtocol = new InMemoryNodeTransportProtocol(node1CommandBuilder);
const node2: INodeTransportProtocol = new InMemoryNodeTransportProtocol(node2CommandBuilder);
const node3: INodeTransportProtocol = new InMemoryNodeTransportProtocol(node3CommandBuilder);
const node4: INodeTransportProtocol = new InMemoryNodeTransportProtocol(node4CommandBuilder);

const coordinator: Coordinator = new Coordinator([
    node1,
    node2,
    node3,
    node4,
], 100);

coordinator.execute(new DemoCommand('123', null));
