import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";




const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({})); 
export const crearVideojuego = async (event, context) => {
  try {
    const videojuego = event.body;

    const newVideojuego = {
        ...videojuego,
        status: "Ingresado",
        fechaIng: new Date().toLocaleDateString(),
        id: uuid(),
    };

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    };

    await dynamo.send(new PutCommand({
      TableName: "VideojuegosTable",
      Item: newVideojuego,
  }));

    return {
      statusCode: 201,
      headers: headers,
      body: JSON.stringify(newVideojuego)
    };
    
  } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(crearVideojuego);
