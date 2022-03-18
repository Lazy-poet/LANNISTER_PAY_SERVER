import { Router } from "express";
import ComputeTransactionFeesController from "../controllers/ComputeFees.controller";

export default new (class ComputeTransactionFeesRoute extends ComputeTransactionFeesController {
  public readonly router: Router;
  constructor() {
    super();
    this.router = Router();
    this.initRoute();
  }

  private initRoute = () => {
    this.router.post("/", this.ComputeTransactionFees);
  };
})();
