import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';
import * as AWSXRay from "aws-xray-sdk";

import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

const XAWS = AWSXRay.captureAWS(AWS);

const bucketName = process.env.TODOITEM_S3_BUCKET_NAME;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

import {TodoAccess} from "../../utils/TodoAccess";

const todoAccess = new TodoAccess();

/**
 * Generate a signed url to upload images to s3
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const attachmentId = uuid.v4();

  logger.info("Generated upload URL:", {
    todoId: todoId,
    attachmentId: attachmentId
  });

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: parseInt(urlExpiration)
  });

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  await todoAccess.updateTodoAttachmentUrl(todoId, userId, attachmentId);

  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
};
