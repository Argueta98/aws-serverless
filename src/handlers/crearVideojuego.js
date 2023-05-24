import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({})); 
export const handler = async (event, context) => {
  try {
    const videojuego = JSON.parse(event.body);

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
      return { statusCode : 500,
      body: JSON.stringify({ message: error.message })};
  }
};