const express = require("express");

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamp");

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Reroute into other resource router

router.use('/:bootcampId/courses', courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootCamps).post(createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
