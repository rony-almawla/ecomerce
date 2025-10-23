function validate(schema) {
  return (request, reply, done) => {
    const { error } = schema.validate(request.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(d => d.message);
      return reply.status(400).send({ error: 'Validation error', details: messages });
    }
    done();
  };
}

module.exports = {validate};