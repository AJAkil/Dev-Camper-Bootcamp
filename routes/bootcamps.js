const express = require("express");

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
  uploadPhoto,
} = require("../controllers/bootcamp");

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

const { protect } = require('../middleware/auth')

// Reroute into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(protect, uploadPhoto);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootCamps)
  .post(protect, createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(protect,updateBootCamp)
  .delete(protect, deleteBootCamp);

module.exports = router;
