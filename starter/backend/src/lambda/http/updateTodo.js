import { updateTodo } from '../../businessLogic/todo.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  const headers = {
    'Access-Control-Allow-Origin': '*'
    //'Access-Control-Allow-Credentials': true
  }

  try {
    await updateTodo(updatedTodo, todoId)
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
      body: JSON.stringify({ error })
    }
  }
}
