import { createServer, Server } from 'http';

import app from './app';

const server: Server = createServer(app);
const port = app.get('port') || 3000;

server.on('listening', onListening);
server.on('error', onError);

// Start Express Server
server.listen(port, '0.0.0.0');

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log(`Server is listening on ${bind}`);
  console.log('Press CTRL-C to stop');
}

// Event listener for HTTP server "error" event.
function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

export default server;
