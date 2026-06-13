const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      ...req.body,
      ...req.params
    });

    if (!result.success) {
      const errors = result.error?.errors?.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      })) ?? [];

      return res.status(400).json({
        success: false,
        message: errors.map(e => e.message).join(' · '),
        errors
      });
    }

    req.validated = result.data;
    next();
  };
};

module.exports = validateRequest;
