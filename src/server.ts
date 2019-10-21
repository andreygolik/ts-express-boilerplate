import { Server } from 'http';

import app from './app';

/*** Start Express server ****************************************************/
const server: Server = app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(`Server is running in ${app.get('env')} mode on port ${app.get('port')}`);
  console.log('Press CTRL-C to stop');
}).on('error', console.error);

/*****************************************************************************/
export default server;
