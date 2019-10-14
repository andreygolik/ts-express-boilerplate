import { Server } from 'http';

import app from './app';

/*** Start Express server ****************************************************/
const server: Server = app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(`Server is listening on port ${app.get('port')}`);
  console.log('Press CTRL-C to stop');
});

/*****************************************************************************/
export default server;
