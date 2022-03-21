import response from "./response";
import env from "../config/env.config";

const NODE_ENV = env.getValue("NODE_ENV");

class AsyncError {
  /**
   *
   * @param asyncFn The async controller function
   * @param errorMessage The error message to be sent if an error is caught
   * @returns an async function wrapped in the trycatch block
   */
  catchAsyncError = (
    asyncFn,
    errorMessage
  ) => {
    return async (req, res) => {
      try {
        await asyncFn(req, res);
      } catch (error) {
        NODE_ENV === "local" && console.log(error); //log error to console in dev mode
        return response.setError(res, 500, errorMessage);
      }
    };
  };
}

export default new AsyncError().catchAsyncError;
