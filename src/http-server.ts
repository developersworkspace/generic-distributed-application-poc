import * as http from 'http';
import { INodeTransportProtocol } from './interfaces/node-transport-protocol';
import { StandardNodeTransportProtocol } from './node-transport-protocols/standard';
import { ICommandBuilder } from './interfaces/command-builder';
import { Coordinator } from './coordinator';

const commandBuilder: ICommandBuilder = null;

const peers: Array<string> = ['localhost:8081', 'localhost:8082', 'localhost:8083', 'localhost:8084', 'localhost:8085'];

const nodeTransportProtocols: Array<INodeTransportProtocol> = peers.map((peer: string) => {
    return new StandardNodeTransportProtocol(commandBuilder, 1000, (obj: any) => {
        // TODO: Send to peer
    });
});

const coordinator: Coordinator = new Coordinator(nodeTransportProtocols, 1000);

const server: http.Server = http.createServer(async (request: http.IncomingMessage, response: http.ServerResponse) => {
  const body: string = await readBody(request);

  // TODO: Call coordinator or node transport protocol

  response.end('Hello Node.js Server!');
});

function readBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((resolve: (body: string) => void, reject: (error: Error) => void) => {
    const buffers: Array<Buffer> = [];

    request
      .on('data', (chunk: Buffer) => {
        buffers.push(chunk);
      })
      .on('end', () => {
        resolve(Buffer.concat(buffers).toString());
      });
  });
}

server.listen(8080);
