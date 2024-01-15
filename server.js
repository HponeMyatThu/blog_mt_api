const express = require("express");
const env = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const i18n = require("i18n");
const cookieParser = require("cookie-parser");
const logger = require("./configs/logger.config");
const onFinished = require("on-finished");

const router = require("./routers/index");
const errorHandler = require("./middlewares/error.handler");
const createDefaultUser = require("./utils/creatDefaultUser");
const createDefaultBlog = require("./utils/createDefaultBlog");
const createDefaultImage = require("./utils/createDefaultImage");
const logWare = require("./middlewares/log.middleware");
const createDefaultCategories = require("./utils/createDefaultCategories");

const app = express();
i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/locales",
});

app.use(i18n.init);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_PORT,
    credentials: true,
  })
);
createDefaultUser();
createDefaultBlog();
createDefaultImage();
createDefaultCategories();

require("./configs/db")();

app.use(logWare);

app.use("/api/v1", router);

app.use(errorHandler.handler);

app.listen(process.env.PORT, function () {
  console.log("Server listening on", process.env.PORT);
});
