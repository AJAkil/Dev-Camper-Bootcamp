const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
//@acess     Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over the removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query String
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, $lt, $lte, $in)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // The main query is done here
  query = Bootcamp.find(JSON.parse(queryStr));

  // selecting certain fields after the query is made
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query.sort(sortBy);
  } else {
    query.sort("-createdAt");
  }

  // Pagination
  let page = parseInt(req.query.page, 10) || 1;
  let toLimit = parseInt(req.query.limit, 10) || 25;
  let startIndex = (page - 1) * toLimit; // we skip by this amount
  let endIndex = page * toLimit;
  let total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(toLimit);

  // Finding and executing query
  const bootcamps = await query;

  // Setting up the pagination fields
  // Pagination result
  const pagination = { next: {}, prev: {}};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: toLimit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: toLimit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination: pagination,
    data: bootcamps,
  });
});

// @desc     Get a specific bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access     Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc     Create a new bootcamp
// @route    POST /api/v1/bootcamps
// @access    Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc     Create bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const updatedBootCamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: updatedBootCamp });
});

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const deletedBootCamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!deletedBootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
