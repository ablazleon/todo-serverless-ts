import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserIdFromEvent } from '../../auth/utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {TodoAccess} from "../../utils/TodoAccess";

/**
 * Create a todo
 **/

const todoAccess = new TodoAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const userId = getUserIdFromEvent(event);

  // TODO: Implement creating a new TODO item

  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const todoId = await todoAccess.createTodo(userId, newTodo);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item:
          {
            todoId: todoId,
            ...newTodo
          }
    })
  };
};
