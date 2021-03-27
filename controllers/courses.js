const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc     Get all courses
// @route    GET /api/v1/courses
// @route    GET /api/v1/bootcamps/:bootcampId/courses
//@access     Public
exports.getCourses = asyncHandler(async (req, res, next) => {

  let query; // a query variable

  // test to see if there is a bootcampID?
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });

    // if we cannot find the bootcamp
    if (!query) {
      return next(
        new ErrorResponse(`Bootcamp not found with the id ${req.params.bootcampId}`, 404)
      );
    }

  } else {
    query = Course.find().populate({
      path: 'bootcamp',// the name of the property defined in schema
      select: 'name description website'
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});



// @desc     Get a single course
// @route    GET /api/v1/course/:id
//@access     Public
exports.getCourse = asyncHandler(async (req, res, next) => {

  let query; // a query variable

  query = Course.findById(req.params.id).populate({
    path: 'bootcamp',// the name of the property defined in schema
    select: 'name description website'
  });

  if(!query){
    return next(
      new ErrorResponse(`Course not found with the id ${req.params.id}`, 404)
    );
  }
  
  const course = await query;

  res.status(200).json({
    success: true,
    data: course,
  });
});


// @desc     Create a single course for a particular bootcamp
// @route    POST /api/v1/bootcamps/:bootcampId/courses
//@access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  
  // setting the bootcampID
  req.body.bootcamp = req.params.bootcampId;

  // searching the bootcamp to see if it's on db
  let bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp){
    return next(
      new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404)
    );
  }

  // creating a new course on the coures schema
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});


// @desc     Update a single course
// @route    PUT /api/v1/courses/:id
//@access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

  let course = await Course.findById(req.params.id);

  if(!course){
    return next(
      new ErrorResponse(`Course not found with the id ${req.params.id}`, 404)
    );
  }

  // updating a new course on the coures schema
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});


// @desc     Delete a single course
// @route    DELETE /api/v1/courses/:id
//@access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

  const course = await Course.findById(req.params.id);

  if(!course){
    return next(
      new ErrorResponse(`Course not found with the id ${req.params.id}`, 404)
    );
  }

  // deleting a course on the coures schema
  await course.remove();

  res.status(200).json({
    success: true,
    data: [],
  });
});



// @desc     Delete all course
// @route    DELETE /api/v1/courses
//@access    Private
exports.deleteAllCourses = asyncHandler(async (req, res, next) => {


  await Course.remove({});

  res.status(200).json({
    success: true,
    data: [],
  });
});
