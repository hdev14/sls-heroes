const AWS = require('aws-sdk');
const Joi = require('@hapi/joi');
const uuid = require('uuid');
const validatorDecorator = require('./validatorDecorator');

class Handler {
  constructor({ dynamodb }) {
    this.dynamodb = dynamodb;
    this.table = process.env.DYNAMODB_TABLE;
  }

  static getValidationSchema() {
    return Joi.object({
      nome: Joi.string().max(100).min(2).required(),
      poder: Joi.string().max(20).required(),
    })
  }

  async main(event) {
    try {
      const data = event.body;

      const params = {
        TableName: this.table,
        Item: {
          ...data,
          id: uuid.v1(),
          createdAt: new Date().toISOString(),
        }
      };

      console.log(params);
      
      await this.dynamodb.put(params).promise();

      return {
        statusCode: 201,
        body: JSON.stringify({}),
      }
    } catch (error) {
      console.error('Error**', error.stack);

      return {
        statusCode: 500,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Error no servidor',
      };
    }
  }
}


function createHandler() {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const handler = new Handler({ dynamodb });

  return validatorDecorator(handler.main.bind(handler), Handler.getValidationSchema(), 'body');
}

module.exports = createHandler();