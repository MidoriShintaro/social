class HandleError extends Error {
  message: string;
  statusCode: number;
  status: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "false" : "success";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HandleError;
