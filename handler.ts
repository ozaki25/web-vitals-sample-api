import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
};

export const analytics: APIGatewayProxyHandler = async event => {
  console.log(event.body);
  const body = JSON.stringify(event.body);
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  };
};
