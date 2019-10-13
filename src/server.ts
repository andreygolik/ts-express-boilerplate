import { Server } from 'http';
import errorHandler from 'errorhandler';

import app from './app';
import log from './config/logger';

// Error Handler. Provides full stack. Development only.
if (app.get('env') === 'development') {
  app.use(errorHandler);
}

/*** Start Express server ****************************************************/
const server: Server = app.listen(app.get('port'), '0.0.0.0', () => {
  log.info(`Server is listening on port ${app.get('port')}`);
  log.info('Press CTRL-C to stop');
});

export default server;
