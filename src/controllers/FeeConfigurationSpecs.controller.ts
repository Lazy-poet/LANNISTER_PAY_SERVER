import { Request, Response } from "express";
import ParseConfigService from "../services/ParseConfigurationSpecs.service";
import CatchAsyncError from "../utils/catchAsyncError";
import response from "../utils/response";
// import Redis from "../models/redis.model";
import LocalDB from "../models/LocalDB.model";
import validateFeeConfiguration from "../validations/validateFeeConfiguration";
export default class FeeConfigurationController extends ParseConfigService {
  protected ParseConfigurationSpecsAsync = CatchAsyncError(
    async (req: Request, res: Response) => {
      if (!("FeeConfigurationSpec" in req.body)) {
        return response.setError(res, 400, "invalid request body");
      }
      const { FeeConfigurationSpec } = req.body;

      const parsedConfigSpecs =
        this.parseConfigSpecIntoJSON(FeeConfigurationSpec);

      const error = validateFeeConfiguration(parsedConfigSpecs);
      if (error) {
        return response.setError(res, 400, error);
      }
      //save parsed config specs in redis cache
      // const RedisClient = new Redis();
      // await RedisClient.setData("config", parsedConfigSpecs);
      await new LocalDB().addDataToDB(parsedConfigSpecs);
      response.setSuccess(res, 200, "");
    },
    "error parsing configuration spec"
  );
}
