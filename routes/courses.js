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
  deleteAllCourses
} = require("../controllers/courses");

router.route("/").get(getCourses).post(addCourse).delete(deleteAllCourses);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
