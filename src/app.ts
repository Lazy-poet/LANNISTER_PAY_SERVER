import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
const app = express();
import indexRoutes from './routes';
// import { serverAdapter } from './queues/MyEmailer';

app.use(cors());

//set security http headers
app.use(helmet());
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, '../public')));

// route for bull-board to view all queues
// serverAdapter.setBasePath('/queues');
// app.use('/queues', serverAdapter.getRouter());

// using logger after serverAdapter so we dont spam our logs with requests from bull-board(which sends logs like almost every second)
app.use(logger('dev'));
app.get('/', (_req, res: Response) => {
  res.redirect('/api/lannister-pay');
});
app.use('/api/lannister-pay', indexRoutes);

// catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
});
// error handler
app.use((err: Error & { status: number }, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
