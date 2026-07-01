const ApiError = require("../utils/ApiError");

// authorize("admin") or authorize("admin", "user"). Runs after protect.
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Not authorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Role '${req.user.role}' is not allowed to access this resource`
      );
    }

    next();
  };
};

module.exports = { authorize };
