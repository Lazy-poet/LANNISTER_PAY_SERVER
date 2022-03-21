import { Router } from "express";
import FeeConfigurationRoute from "./FeeConfigurationSpecs.route";
import ComputeTransactionFeesRoute from "./ComputeFees.route";

class Routes {
  constructor() {
    this.router = Router();
    this.initApplicationRoutes();
  }

  initApplicationRoutes = () => {
    this.router.get("/", (_, res) => {
      res.send("Welcome to lannister pay! Powered by FLUTTERWAVE™️");
    });
    this.router.use("/fees", FeeConfigurationRoute.router);
    this.router.use("/compute-transaction-fee", ComputeTransactionFeesRoute.router);
  };
}

export default new Routes().router;
