
class ResponseStatus {

  constructor() {
    this.statusCode = null;
    this.status = null;
    this.message = null;
  }

  /**
   *
   * @param res Response Object
   * @param statusCode success status code
   * @param message optional response message
   */
  setSuccess(
    res,
    statusCode,
    message
  ) {
    this.statusCode = statusCode;
    this.status = "ok";
    this.message = message;
    this.#send(res);
  }

  /**
   *
   * @param res Response object
   * @param statusCode error status code
   * @param message error message
   */
  setError(res, statusCode, message) {
    this.statusCode = statusCode;
    this.status = "failed";
    this.message = message;
    this.#send(res);
  }

  #send = (res) => {
    const result = {
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
