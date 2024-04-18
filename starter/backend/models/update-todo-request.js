{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "create-todo",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "pattern": "^[a-zA-Z0-9]+$",
        "minLength": 5,
        "maxLength": 20
      },
      "dueDate": {
       "type": "string",
       "pattern": "[0-9]{4}-[0-9]{2}-[0-9]{2}"
      },
      "done": {
        "type": "boolean"
      }
    },
    "required": ["name", "dueDate", "attachmentUrl"],
    "additionalProperties": false
  }