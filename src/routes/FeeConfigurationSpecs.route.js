import { Router } from "express";
import feeConfigurationController from "../controllers/FeeConfigurationSpecs.controller";

export default new (class FeeConfigurationRoute {
  constructor() {
    this.router = Router();
    this.#initRoute();
  }

  #initRoute = () => {
    this.router.post("/", feeConfigurationController.ParseConfigurationSpecsAsync);
  };
})();
