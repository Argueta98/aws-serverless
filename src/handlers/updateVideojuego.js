import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import createError from 'http-errors';
import commonMiddleware from "../../lib/commonMiddleware"


const dynamo = new DynamoDBClient({ });

const updateVideogame = async (event) => {
  try {
    const { id } = event.pathParameters;
    const requestBody = event.body;

    // Verificar si el videojuego existe antes de actualizarlo
    const getItemResponse = await dynamo.send(new GetItemCommand({
      TableName: "VideogamesTable",
      Key: {
        id: { S: id },
      },
    }));

    const headers = {
      'Content-Type' : 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Credentials': true,
    }

    if (!getItemResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Videojuego no encontrado" }),
      };
    }

    const updateExpression = [];
    const expressionAttributeValues = {};

    for (const key in requestBody) {
      updateExpression.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = { S: requestBody[key] };
    }

    await dynamo.send(new UpdateItemCommand({
      TableName: "VideogamesTable",
      Key: {
        id: { S: id },
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
    }));

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: "Videojuego actualizado exitosamente" }),
    };
  }catch (error) {
    console.error(error);
  throw new createError.InternalServerError(error);
  }

};
export const handler = commonMiddleware(updateVideogame)