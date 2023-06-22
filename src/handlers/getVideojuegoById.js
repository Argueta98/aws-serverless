import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import createError from 'http-errors';
import commonMiddleware from "../../lib/commonMiddleware"


const dynamo = new DynamoDBClient({});

const getVideogameById = async (event) => {
  try {
    const { id } = event.pathParameters;

    const { Item } = await dynamo.send(new GetItemCommand({
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

    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Videojuego no encontrado" }),
      };
    }

    const formattedItem = {};
    for (const key in Item) {
      formattedItem[key] = Item[key].S;
    }

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(formattedItem),
    };
  } catch (error) {
    console.error(error);
  throw new createError.InternalServerError(error);
  }

};
export const handler = commonMiddleware(getVideogameById)
