import { Router } from "express";
import feeConfigurationController from "../controllers/FeeConfigurationSpecs.controller";

export default new (class FeeConfigurationRoute {
  public readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoute();
  }

  private initRoute = () => {
    this.router.post(
      "/",
      feeConfigurationController.ParseConfigurationSpecsAsync
    );
  };
})();
