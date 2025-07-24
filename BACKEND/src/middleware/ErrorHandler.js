export const ErrorMiddleware = (err, req, res, next) => {
  const statusCode = 500 || err.statusCode;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
