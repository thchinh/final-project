import { getTodos } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs';

export async function handler(event) {
  const userId = getUserId(event);
  // const userId = event.pathParameters.userId;
  const items = await getTodos(userId);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items
    })
  }
}
