import { createTodo } from "../../businessLogic/todo.mjs";
import { createLogger } from "../../utils/logger.mjs";
import { getUserId } from "../utils.mjs";

const logger = createLogger("createTodo");

export async function handler(event) {
  const body = JSON.parse(event.body)
  const userId = getUserId(event);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  };

  try {
    logger.info("Creating todo with body: ", body)
    const newTodo = await createTodo(body, userId);
    logger.info("Creating is success ");
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

