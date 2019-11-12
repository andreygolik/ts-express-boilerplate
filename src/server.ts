/* eslint no-console: 0 */

import { createServer, Server } from 'http';

import app from './app';

const server: Server = createServer(app);
const port = app.get('port') || 3000;

// Event listener for HTTP server "listening" event.
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Server is listening on ${bind}`);
  console.log('Press CTRL-C to stop');
};

// Event listener for HTTP server "error" event.
const onError = (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      return process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      return process.exit(1);
    default:
      throw error;
  }
};

server.on('listening', onListening);
server.on('error', onError);

// *** Start Express Server *** //
server.listen(port, '0.0.0.0');

export default server;
