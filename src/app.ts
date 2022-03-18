import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
const app = express();
import indexRoutes from './routes';

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
  res.locals.error = req.app.get('env') === 'local' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app;
