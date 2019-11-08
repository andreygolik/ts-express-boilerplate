import express, { Express, Request, Response, NextFunction } from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import lusca from 'lusca';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import compression from 'compression';
import sassMiddleware from 'node-sass-middleware';

/*** Config ******************************************************************/
import logger from './config/logger';
import { ENVIRONMENT, PORT, APP_NAME, CORS, JWT_COOKIE } from './config/config';
import connectDB from './config/mongo';

/*** Routes ******************************************************************/
import indexRoutes from './routes/index.routes';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import playgroundRoutes from './routes/playground.routes';

/*** Other Imports ***********************************************************/
import ErrorResponse from './shared/ErrorResponse';
import errorHandler from './middlewares/errorHandler';
import xssClean from './middlewares/xssClean';

/*** Database Initialization *************************************************/
connectDB();

/*** Express configuration ***************************************************/
const app: Express = express();

app.set('env', ENVIRONMENT);
app.set('port', PORT);
app.set('name', APP_NAME);

logger.info(`Application started in ${ENVIRONMENT} mode`);

// Morgan logger
app.use(
  morgan(
    ENVIRONMENT === 'development' ? 'dev' : 'short',
    // attach morgan to winston
    { stream: { write: (message: string) => logger.verbose(message.slice(0, -1)) } }
  )
);

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (JWT_COOKIE) {
  app.use(cookieParser());
}

// Security middleware
app.disable('x-powered-by');
app.use(helmet());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(xssClean());
app.use(mongoSanitize());
if (CORS === true) {
  app.use(cors());
  logger.info('Cross-Origin Resource Sharing (CORS) enabled');
}

// Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

/*** Routes ******************************************************************/
app.use('/', indexRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);

// if (ENVIRONMENT === "development") {
  app.use('/api/v1/playground', playgroundRoutes);
// }

// Static routes
app.use(express.static(path.join(__dirname, 'public')));

// Scss middleware
// compiles SCSS on the fly and respond with CSS
// only if CSS is missing in public folder, only in development
if (ENVIRONMENT === 'development') {
  app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    response: true,
    outputStyle: 'expanded',
    debug: false,
  }));
}

/*** Error Handler ***********************************************************/
// 404
app.use((req, res, next: NextFunction) => next(new ErrorResponse('Not Found', 404)));

// Custom error handler
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`unhandledRejection: ${err}`);
});

/*****************************************************************************/
export default app;
