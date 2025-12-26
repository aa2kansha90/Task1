# contracts.md

## Overview
This document defines the **input, output, and error contracts** for the Content Moderation Filter workflow.  
All requests and responses must strictly adhere to the schemas defined below.  
Any deviation results in a deterministic validation error.

---

## 1. Input Contract

The workflow expects a **single JSON object** as input.

### JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Content Moderation Filter Input",
  "type": "object",
  "properties": {
    "contentText": {
      "type": "string",
      "description": "The raw text content to be moderated.",
      "minLength": 1,
      "maxLength": 10000
    },
    "userId": {
      "type": "string",
      "description": "Unique identifier of the user submitting the content.",
      "pattern": "^[a-zA-Z0-9_-]+$"
    },
    "contentCategory": {
      "type": "string",
      "description": "Optional context for rule adjustment.",
      "enum": [
        "forum_post",
        "profile_bio",
        "product_review",
        "comment",
        "direct_message"
      ],
      "default": "forum_post"
    }
  },
  "required": ["contentText", "userId"],
  "additionalProperties": false
}


```
### Example Valid Input
```json
{
  "contentText": "This is a sample post to be checked.",
  "userId": "user_12345",
  "contentCategory": "forum_post"
}

```
### 2. Output Contract
The workflow returns a deterministic JSON object representing the moderation decision.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Content Moderation Filter Output",
  "type": "object",
  "properties": {
    "decision": {
      "type": "string",
      "description": "The final moderation verdict.",
      "enum": ["APPROVE", "FLAG_FOR_REVIEW", "REJECT"]
    },
    "score": {
      "type": "number",
      "description": "Calculated severity score between 0 and 1.",
      "minimum": 0,
      "maximum": 1
    },
    "flaggedRules": {
      "type": "array",
      "description": "List of rule identifiers triggered during analysis.",
      "items": {
        "type": "string",
        "enum": [
          "PROFANITY",
          "HATE_SPEECH",
          "EXCESSIVE_LINKS",
          "REPETITIVE_CHARS",
          "SPAM_PHRASE"
        ]
      },
      "uniqueItems": true
    }
  },
  "required": ["decision", "score", "flaggedRules"],
  "additionalProperties": false
}

```
### Example Output
 ```json
 {
  "decision": "FLAG_FOR_REVIEW",
  "score": 0.65,
  "flaggedRules": ["PROFANITY", "EXCESSIVE_LINKS"]
}

```
### 3. Error & Invalid Input Handling
The workflow must fail gracefully with structured, machine-readable error responses.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Error Response",
  "type": "object",
  "properties": {
    "error": {
      "type": "boolean",
      "const": true
    },
    "message": {
      "type": "string",
      "description": "Human-readable error description."
    },
    "code": {
      "type": "string",
      "description": "Machine-readable error code.",
      "enum": ["VALIDATION_ERROR", "INTERNAL_ERROR"]
    },
    "details": {
      "type": "array",
      "description": "Optional array of specific validation failures.",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "issue": {
            "type": "string"
          }
        }
      }
    }
  },
  "required": ["error", "message", "code"]
}


```
### 4. Handling Rules
Validation Errors (VALIDATION_ERROR)
Returned when input does not conform to the schema.
Cases:
- Missing required fields (contentText, userId)
- Invalid data types
- Constraint violations:
Empty contentText
Invalid userId pattern
Invalid contentCategory value
- Presence of unexpected properties


### Internal Errors (INTERNAL_ERROR)
Returned for unhandled exceptions during processing.

### Example Error Responses
Missing Required Field

```json
{
  "error": true,
  "message": "Invalid input provided.",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "userId",
      "issue": "Field is required."
    }
  ]
}
```
### Invalid Data Type
 
```json
{
  "error": true,
  "message": "Invalid input provided.",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "contentText",
      "issue": "Expected type 'string', got 'number'."
    }
  ]
}

```
### Internal Error
```json
{
  "error": true,
  "message": "An unexpected error occurred during processing.",
  "code": "INTERNAL_ERROR"
}


