import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware"
import { randomUUID } from "crypto";

const dynamo =  DynamoDBDocumentClient.from(new DynamoDBClient({}));

const createVideogame = async (event, context) => {
  try {
    const videojuego = event.body;

    const newVideojuego = {
      ...videojuego,
      id: randomUUID(),
      fechaIng: new Date().toLocaleDateString(),
    };

    const headers = {
      'Content-Type' : 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Credentials': true,
      
    }

    await dynamo.send(new PutCommand({
      TableName: "VideogamesTable",
      Item: newVideojuego,
    }));
    return {
      statusCode: 201,
      headers: headers,
      body: JSON.stringify(newVideojuego),
    }
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

};



export const handler = commonMiddleware(createVideogame)
