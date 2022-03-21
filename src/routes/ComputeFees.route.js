import { Router } from "express";
import computeTransactionFeesController from "../controllers/ComputeFees.controller";

export default new (class ComputeTransactionFeesRoute {
  constructor() {
    this.router = Router();
    this.#initRoute();
  }

  #initRoute = () => {
    this.router.post(
      "/",
      computeTransactionFeesController.ComputeTransactionFees
    );
  };
})();
