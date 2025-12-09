export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    // console.log(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateQuery = (schema) => (req, res, next) => {
  req.queryData = schema.parse(req.query); //after validate -> query Data
  next();
};
