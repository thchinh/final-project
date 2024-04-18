import { updateTodo } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs';

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const updatedTodo = JSON.parse(event.body)

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }

  try {
    await updateTodo(updatedTodo, todoId, userId);
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        isSuccess: true
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error })
    }
  }
}
