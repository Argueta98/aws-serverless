import { DynamoDBClient, DeleteItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import createError from 'http-errors';
import commonMiddleware from "../../lib/commonMiddleware"


const dynamo = new DynamoDBClient({});

const deleteVideogame = async (event) => {
  try {
    const { id } = event.pathParameters;

    // Verificar si el videojuego existe antes de eliminarlo
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

    await dynamo.send(new DeleteItemCommand({
      TableName: "VideogamesTable",
      Key: {
        id: { S: id },
      },
    }));

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: "Videojuego eliminado exitosamente" }),
    };
  } catch (error) {
    console.error(error);
  throw new createError.InternalServerError(error);
  }

};
export const handler = commonMiddleware(deleteVideogame)