import { validationResult } from 'express-validator';

/**
 * Validation runner middleware.
 * Wraps an array of express-validator checks, executes them sequentially against
 * the request object, and inspects the validation results.
 *
 * @param {Array<import('express-validator').ValidationChain>} validations - Array of validation rules
 * @returns {import('express').RequestHandler} Middleware function
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // 1. Run all validations in the chain against the request object
    for (const validation of validations) {
      await validation.run(req);
    }

    // 2. Extract errors
    const errors = validationResult(req);

    // 3. Short-circuit if validation errors exist
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      }));

      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    }

    next();
  };
};

export default validate;
