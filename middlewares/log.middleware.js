const onFinished = require("on-finished");
const logger = require("../configs/logger.config");

const logWare = (req, res, next) => {
  const currentDate = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  logger.info("Request message", {
    body: req.body,
    formattedDate: currentDate,
  });

  onFinished(res, (err, res) => {
    logger.info("Response message", {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      formattedDate: currentDate,
    });
  });

  next();
};

module.exports = logWare;