import { Request, Response } from "express";
import ParseConfigService from "../services/ParseConfigurationSpecs.service";
import CatchAsyncError from "../utils/catchAsyncError";
import response from "../utils/response";
import Redis from "../redis.setup";
import validateFeeConfiguration from "../validations/validateFeeConfiguration";
export default class FeeConfigurationController extends ParseConfigService {
  protected ParseConfigurationSpecsAsync = CatchAsyncError(
    async (req: Request, res: Response) => {
      if (!("FeeConfigurationSpec" in req.body)) {
        response.setError(res, 400, "invalid request body");
      }
      const { FeeConfigurationSpec } = req.body;

      const parsedConfigSpecs =
        this.parseConfigSpecIntoJSON(FeeConfigurationSpec);

      const error = validateFeeConfiguration(parsedConfigSpecs);
      if (error) {
        return response.setError(res, 400, error);
      }
      const RedisClient = new Redis();
      //save parsed config specs in redis cache
      const resp = await RedisClient.setData("config", parsedConfigSpecs);

      if (resp) {
        response.setSuccess(res, 200, "");
      } else {
        response.setError(res, 400, resp);
      }
    },
    "invalid configuration spec"
  );
}