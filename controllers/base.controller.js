const { itemNotFoundError } = require("../errors/db.error");
const jwt = require("jsonwebtoken");

const success = (res, message, data) => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

exports.ok = (res, message, data = null) => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

exports.error = (res, message, data = null) => {
  return res.status(500).json({
    status: "error",
    message,
    data,
  });
};

exports.badRequest = (res, message, data = null) => {
  return res.status(400).json({
    status: "badRequest",
    message,
    data,
  })
}

exports.created = (res, message, data = null) => {
  return res.status(201).json({
    status: "success",
    message,
    data,
  });
};

exports.accepted = (res, message, data = null) => {
  return res.status(202).json({
    status: "success",
    message,
    data,
  });
};

exports.response = (res, status = 200, message, data = null) => {
  return res.status(status).json({
    status: "success",
    message,
    data,
  });
};

exports.retrieved = (res, name, message, data = null) => {
  if (!data) {
    throw itemNotFoundError(name);
  }
  return res.status(200).json({
    status: "success",
    name,
    message,
    data,
  });
};

exports.deleted = (res, name, data = null) => {
  if (!data) {
    throw itemNotFoundError(name);
  }
  return success(res, name, data);
};

exports.paginatedData = (req, content, pageable) => {
  return req.query, page && req.query.size ? { content, pageable } : content;
};

exports.getAdmin = (req) => {
  try {
    return jwt.verify(req.header.token, "admin");
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.authFail = (res) => [
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    }),
]
