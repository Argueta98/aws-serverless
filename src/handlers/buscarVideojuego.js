import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({})); 
export const buscarVideojuego = async (event, context) => {
  try {
    const { id } = event.pathParameters;


    // Crea el comando GetCommand
    const command = new GetCommand({
        TableName: "VideojuegosTable",
        Key: { id }
    });

    // Realiza la búsqueda utilizando el comando GetCommand
    const { Item } = await dynamo.send(command);

    if (!Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Registro no encontrado" }),
        };
    }

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    };

    return {
        statusCode: 201,
        headers: headers,
        body: JSON.stringify(Item),
      }
   

    
  } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(buscarVideojuego);
