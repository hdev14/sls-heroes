module.exports = (fn, schema, field) => {
  return async function (event) {
    const data = JSON.parse(event[field]);

    console.log(data);

    const { error, value } = schema.validate(data, { abortEarly: true });

    event[field] = value;

    if (!error) {
      return fn.apply(this, arguments);
    }

    return {
      statusCode: 422,
      body: error.message,
    }
  }
}