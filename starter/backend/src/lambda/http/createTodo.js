import { createTodo } from "../../businessLogic/todo.mjs";
import { getUserId } from "../utils.mjs";

export async function handler(event) {
  const body = JSON.parse(event.body)
  const userId = getUserId(event);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  };

  try {
    const newTodo = await createTodo(body, userId);
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        item: newTodo,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error?.message }),
    };
  }
}

