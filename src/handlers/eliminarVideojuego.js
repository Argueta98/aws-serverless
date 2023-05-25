import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({})); 
export const eliminarVideojuego = async (event, context) => {
  try {
    const { id } = event.pathParameters;

    const command = new DeleteCommand({
      TableName: "VideojuegosTable",
      Key: {
        id: id
      }
    });

    await dynamo.send(command);

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    };

    
    return {
        statusCode: 201,
        headers: headers,
        body: JSON.stringify({ message: "Registro eliminado exitosamente" }),
      }
    
  } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(eliminarVideojuego);
