import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({})); 
export const actualizarVideojuego = async (event, context) => {
  try {
    const { id } = event.pathParameters;
    const videojuego = event.body;

    const updatedVideoJuego = {
        ...videojuego,
        id: id,
    };

    await dynamo.send(new PutCommand({
        TableName: "VideojuegosTable",
        Item: updatedVideoJuego,
    }));

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    };

    
    return {
        statusCode: 201,
        headers: headers,
        body: JSON.stringify(updatedVideoJuego),
      }
    
  } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(actualizarVideojuego);
