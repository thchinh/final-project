import { getTodos } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs';

export async function handler(event) {
  console.log("Event: "+ JSON.stringify(event));
  const userId = getUserId(event);
  // const userId = event.pathParameters.userId;
  const items = await getTodos(userId);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items
    })
  }
}
