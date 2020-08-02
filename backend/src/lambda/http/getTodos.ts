import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserIdFromEvent} from "../../auth/utils";
import {TodoAccess} from "../../utils/TodoAccess";

const todoAccess = new TodoAccess();

/**
 * Get dodos
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    const userId = getUserIdFromEvent(event);

    const todos = await todoAccess.getTodos(userId);

    // Send results
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: todos
        })
    }
};
