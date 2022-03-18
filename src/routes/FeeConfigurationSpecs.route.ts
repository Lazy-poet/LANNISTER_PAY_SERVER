
import { Router } from "express";
import FeeConfigurationController from "../controllers/FeeConfigurationSpecs.controller";

export default new (class FeeConfigurationRoute extends FeeConfigurationController {
  public readonly router: Router;
  constructor() {
    super();
    this.router = Router();
    this.initRoute();
  }

  private initRoute = () => {
    this.router.post("/", this.ParseConfigurationSpecsAsync);
  };
})();
