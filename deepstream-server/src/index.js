const DeepstreamServer = require('deepstream.io');
const RdbC = require('deepstream.io-storage-rethinkdb');
const server = new DeepstreamServer();

// Set host and port for browser / engine.io communication
server.set( 'host', '0.0.0.0' ); //default 0.0.0.0
server.set( 'port', 6020 ); //default 6020

server.set( 'storage', new RdbC({ 
  port: 28015, 
  host: 'localhost',
  splitChar: '/',
  database: 'location'
}));


server.start();