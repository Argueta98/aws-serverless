import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import createError from 'http-errors';
import commonMiddleware from "../../lib/commonMiddleware"


const dynamo = new DynamoDBClient({});

const getVideogames = async (event) => {
  try {
    const { Items } = await dynamo.send(new ScanCommand({
      TableName: "VideogamesTable",
    }));

    const formattedItems = Items.map((item) => {
      const formattedItem = {};
      for (const key in item) {
        formattedItem[key] = item[key].S;
      }
      formattedItem.fechaIng = new Date().toLocaleDateString();
      return formattedItem;
    });

    const headers = {
      'Content-Type' : 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Credentials': true,
      
    }

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(formattedItems),
    };
  } catch (error) {
    console.error(error);
  throw new createError.InternalServerError(error);
  }

};
export const handler = commonMiddleware(getVideogames)