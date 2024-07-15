const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  return next();
};

module.exports = {
  validateLogin,
};
