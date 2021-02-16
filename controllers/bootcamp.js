// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
//@acess     Public

exports.getBootCamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show All Bootcamp'});
}

// @desc     Get a specific bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access     Public
exports.getBootCamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Show Bootcamp ${req.params.id}`})
}

// @desc     Create a new bootcamp
// @route    POST /api/v1/bootcamps
// @access    Private
exports.createBootCamp = (req, res, next) => {
    console.log(req.body);
    res.status(200).json({ success: true, msg: 'Create New Bootcamp'})
}

// @desc     Create bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootCamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}`})
}

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootCamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Delete bootcamp ${req.params.id}`})
}

