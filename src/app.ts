import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import lusca from 'lusca';
import morgan from 'morgan';
import compression from 'compression';
import { Express, Request, Response, NextFunction } from 'express-serve-static-core';

/*** Config ******************************************************************/
import log from './config/logger';
import { ENVIRONMENT, PORT, APP_NAME, CORS } from './config/config';
// import postgres from './config/postgres';
// import passport from './config/passport';

/*** Routes ******************************************************************/
import routes from './routes';

/*** Express configuration ***************************************************/
const app: Express = express();

app.set('env', ENVIRONMENT);
app.set('port', PORT);
app.set('name', APP_NAME);

log.info(`Application started in ${ENVIRONMENT} mode`);

// Morgan logger
app.use(
  morgan(
    ENVIRONMENT === 'development' ? 'dev' : 'short',
    // attach morgan to winston
    { stream: { write: (message: string) => log.verbose(message.slice(0, -1)) } }
  )
);

// Security middleware
if (CORS === true) {
  app.use(cors());
  log.info('Cross-Origin Resource Sharing (CORS) enabled');
}
app.use(helmet());
app.disable('x-powered-by');
// app.use(lusca.xframe('SAMEORIGIN'));
//app.use(lusca.xframe('ALLOW-FROM ' + config.cookieDomain));
app.use(lusca.xssProtection(true));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(passport.initialize());
// app.use(passport.session());
interface IRequest extends Request { user: any; }
app.use((req: IRequest, res: Response, next: NextFunction) => {
  res.locals.user = req.user;
  next();
});

// Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

/*** Routes ******************************************************************/
app.use('/', routes);

// Static routes
app.use(express.static(path.join(__dirname, 'public')));

/*** Error Handler ***********************************************************/
interface IResponseError extends Error { status?: number; }

// 404
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: IResponseError = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err: IResponseError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500)
    .render("error", {
      message: err.message,
      error: ENVIRONMENT === "development" ? err : { status: err.status },
    });
});

/*****************************************************************************/
export default app;
