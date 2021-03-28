const advancedMiddleWare = (model, populate) => async (req, res, next) => {
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
  query = model.find(JSON.parse(queryStr));

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
  let total = await model.countDocuments();

  query = query.skip(startIndex).limit(toLimit);

  if(populate){
      query = query.populate(populate);
  }

  // Finding and executing query
  const results = await query;

  // Setting up the pagination fields
  // Pagination result
  const pagination = { next: {}, prev: {} };

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

  res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
  }

  next();
}

module.exports = advancedMiddleWare;