import { Router } from "express";
import computeTransactionFeesController from "../controllers/ComputeFees.controller";

export default new (class ComputeTransactionFeesRoute {
  public readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoute();
  }

  private initRoute = () => {
    this.router.post(
      "/",
      computeTransactionFeesController.ComputeTransactionFees
    );
  };
})();
