const express = require("express");

const router = express.Router(
  { mergeParams: true } //we are merging url parameters of courses and bootcamps
);

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  deleteAllCourses,
} = require("../controllers/courses");

const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp", // the name of the property defined in schema
      select: "name description website",
    }),
    getCourses
  )
  .post(addCourse)
  .delete(deleteAllCourses);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
