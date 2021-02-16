const Bootcamp = require("../models/Bootcamp");

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
//@acess     Public

exports.getBootCamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc     Get a specific bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access     Public
exports.getBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc     Create a new bootcamp
// @route    POST /api/v1/bootcamps
// @access    Private
exports.createBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc     Create bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootCamp = async (req, res, next) => {
  const updatedBootCamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBootCamp) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: updatedBootCamp });
};

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootCamp = async (req, res, next) => {
  try {
    const deletedBootCamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!deletedBootCamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    return res.status(400).json({ success: false });
  }
};
