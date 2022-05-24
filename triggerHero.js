module.exports = async (event) => {
  console.log(JSON.stringify(event, null, 2));

  return { statusCode: 200 };
} 