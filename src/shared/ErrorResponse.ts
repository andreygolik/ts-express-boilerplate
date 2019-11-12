class ErrorResponse extends Error {
  statusCode: number;

  value: any;

  message: any;

  code: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorResponse;
