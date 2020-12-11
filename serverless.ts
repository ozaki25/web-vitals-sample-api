import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'web-vitals-sample-api',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'ap-northeast-1',
    profile: 'aa',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    analytics: {
      handler: 'handler.analytics',
      events: [
        {
          http: {
            method: 'post',
            path: 'analytics',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
