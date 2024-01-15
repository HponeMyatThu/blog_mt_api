const VAR = require("../constants/global")
const userStatus = {
  active: VAR.ACTIVE,
  suspended: VAR.SUSPENDED,
};

const postStatus = {
  pending: VAR.PENDING,
  rejected: VAR.REJECTED,
  approved: VAR.APPROVEED,
};

module.exports = { userStatus, postStatus };
