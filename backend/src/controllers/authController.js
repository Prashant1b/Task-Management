const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// Send the JWT as an httpOnly cookie and also in the JSON body
// (the body token is handy for Swagger/Postman Bearer testing).
const sendTokenResponse = (res, statusCode, user, message) => {
  const token = generateToken(user._id);

  const days = parseInt(process.env.JWT_EXPIRE) || 7;
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: days * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: formatUser(user),
  });
};

// POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const safeRole = role === "admin" ? "admin" : "user";
  const user = await User.create({ name, email, password, role: safeRole });

  sendTokenResponse(res, 201, user, "User registered successfully");
});

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  sendTokenResponse(res, 200, user, "Login successful");
});

// GET /api/v1/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: formatUser(req.user) });
});

// POST /api/v1/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = { register, login, getMe, logout };
