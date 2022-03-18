import { Response } from "express";

class ResponseStatus {
  statusCode: number | null;
  status: "ok" | "failed" | null;
  message: string | null;

  constructor() {
    this.statusCode = null;
    this.status = null;
    this.message = null;
  }

  /**
   *
   * @param res Response Object
   * @param statusCode success status code
   * @param data response data if any
   * @param message optional response message
   */
  public setSuccess(
    res: Response,
    statusCode: number,
    message: string | null
  ): void {
    this.statusCode = statusCode;
    this.status = "ok";
    this.message = message;
    this.send(res);
  }

  /**
   *
   * @param res Response object
   * @param statusCode error status code
   * @param message error message
   */
  public setError(res: Response, statusCode: number, message: string): void {
    this.statusCode = statusCode;
    this.status = "failed";
    this.message = message;
    this.send(res);
  }

  private send(res: Response): Response {
    const result: {
      status: "ok" | "failed" | null;
      message?: string;
    } = {
      status: this.status,
    };
    if (this.message) result.message = this.message;
    if (this.status === "ok") {
      return res.status(this.statusCode ? this.statusCode : 200).json(result);
    }

    return res.status(this.statusCode ? this.statusCode : 500).json({
      status: this.status,
      message: this.message,
    });
  }
}
export default new ResponseStatus();
