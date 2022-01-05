const field_validation = require("../middlewares/field_validation");
const jwt_validation = require("../middlewares/jwt_validation");
const role_validation = require("../middlewares/role_validation");

module.exports = { ...field_validation, ...jwt_validation, ...role_validation };
