const User = require("../models/Users");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");


// @desc     Resgister User
// @route    GET /api/v1/auth/register
//@acess     Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(200).json({
    sucess: true,
  });
});
