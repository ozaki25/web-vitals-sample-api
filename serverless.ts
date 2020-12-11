import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'web-vitals-sample-api',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    defaultStage: 'dev',
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'ap-northeast-1',
    profile: 'aa',
    stage: '${opt:stage, self:custom.defaultStage}',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DYNAMODB_TABLE: '${self:service}-${self:provider.stage}',
      ANALYTICS_TABLE: '${self:provider.environment.DYNAMODB_TABLE}-analytics',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource:
          'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}*',
      },
    ],
  },
  functions: {
    createAnalytics: {
      handler: 'handler.createAnalytics',
      events: [
        {
          http: {
            method: 'post',
            path: 'analytics',
          },
        },
      ],
    },
    getAnalytics: {
      handler: 'handler.getAnalytics',
      events: [
        {
          http: {
            method: 'get',
            path: 'analytics',
            request: {
              parameters: {
                querystrings: {
                  name: false,
                },
              },
            },
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      Analytics: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.ANALYTICS_TABLE}',
          AttributeDefinitions: [
            {
              AttributeName: 'name',
              AttributeType: 'S',
            },
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'name',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'id',
              KeyType: 'RANGE',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
