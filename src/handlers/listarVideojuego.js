import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({})); 
export const listarVideojuego = async (event, context) => {
  try {
  /*  let videojuegos;

    const result = await dynamo.send(new ScanCommand({
      TableName: "VideojuegosTable",
    }));

    videojuegos = result.Items;

    //const totalRegistros = videojuegos.length;*/

    const params = {
      TableName: "VideojuegosTable",
    };

    const result = await dynamo.send(new ScanCommand(params));

    const videojuegos = result.Items.map(item => {
      const formattedItem = {};
      for (const [key, value] of Object.entries(item)) {
          formattedItem[key] = value;
      }
      return formattedItem;
    });


    const totalRegistros = videojuegos.length;

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    };

    return {
        statusCode: 201,
        headers: headers,
        body: JSON.stringify({
          totalRegistros: totalRegistros,
          videojuegos: videojuegos,
        }),
      }
   

    
  } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(listarVideojuego);
