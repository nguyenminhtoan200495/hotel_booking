module.exports = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (err) {
    console.log('err: ', err);
    next(err);
  }
};
