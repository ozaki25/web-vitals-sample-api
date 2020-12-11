import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import 'source-map-support/register';

type AnalyticsTableType = {
  name: string;
  id: string;
  value: number;
  delta: number;
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
};

const dynamo = new DynamoDB.DocumentClient();

const putAnalytics = ({ name, id, value, delta }: AnalyticsTableType) => {
  const params = {
    TableName: process.env.ANALYTICS_TABLE,
    Item: { name, id, value, delta },
  };
  return dynamo.put(params).promise();
};

export const analytics: APIGatewayProxyHandler = async event => {
  console.log(event.body);
  const body = JSON.parse(event.body) as AnalyticsTableType;
  await putAnalytics(body);
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  };
};
