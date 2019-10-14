import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import lusca from 'lusca';
import morgan from 'morgan';
import { Express } from 'express-serve-static-core';

/*** Configs *****************************************************************/
import { ENVIRONMENT, PORT } from './config/config';
import log from './config/logger';
import { setConsoleLogLevel } from './config/logger';

/*** Express configuration ***************************************************/
const app: Express = express();

app.set('port', PORT);
app.set('env', ENVIRONMENT);

log.info(`Application started in ${app.get('env')} mode`);

// Morgan logger
app.use(
  morgan(
    ENVIRONMENT === 'development' ? 'dev' : 'short',
    // attach morgan to winston
    { stream: { write: (message: string) => log.verbose(message.slice(0, -1)) } }
  )
);

// Security middleware
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*** Routes ******************************************************************/
require('./routes').indexRoutes(app);

/*** Error Handler ***********************************************************/
interface ResponseError extends Error {
  status?: number;
}

// 404
app.use((req: express.Request, res: express.Response, next: Function) => {
  const err: ResponseError = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err: ResponseError, req: express.Request, res: express.Response, next: Function) => {
  res.status(err.status || 500).render('error', {
    title: app.get('name'),
    message: err.message,
    error: app.get('env') === 'development' ? err : {},
  });
});

/*****************************************************************************/
export default app;
