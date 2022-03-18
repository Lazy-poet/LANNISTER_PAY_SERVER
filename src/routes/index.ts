import { Router, Response } from "express";
class Routes {
  public readonly router: Router;
  constructor() {
    this.router = Router();
    this.initApplicationRoutes();
  }

  private initApplicationRoutes = () => {
    this.router.get("/", (_, res: Response) => {
      res.send("Welcome to lannister pay! Powered by FLUTTERWAVE™️");
    });
  };
}

export default new Routes().router;
