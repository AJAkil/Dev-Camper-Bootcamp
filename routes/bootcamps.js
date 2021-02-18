const express = require("express");
const router = express.Router();

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamp");

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootCamps).post(createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
