import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import indexRoutes from "./routes/index.js";
import compression from "compression";

const app = express();
app.use(compression());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));

app.get("/", (_req, res) => {
  res.redirect("/api/lannister-pay");
});
app.use("/api/lannister-pay", indexRoutes);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});
// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "local" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app;
