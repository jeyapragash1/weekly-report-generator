# API Contracts

This document records request and response contracts that integration tests and clients should use.

## Response Shape

Successful responses use a consistent `data` wrapper:

```json
{
  "data": {}
}
```

List endpoints return an array in `data`, including when no records exist:

```json
{
  "data": []
}
```

Error responses use a consistent `error` wrapper:

```json
{
  "error": {
    "message": "Validation failed",
    "details": {}
  }
}
```

## Auth

### POST `/api/v1/auth/logout`

Requires a valid bearer access token and a refresh token in the JSON body.

Expected body:

```json
{
  "refreshToken": "refresh-token-issued-by-login-or-register"
}
```

Expected success response:

```json
{
  "data": {
    "message": "Logged out successfully"
  }
}
```

If `refreshToken` is missing or not a string, the API returns `422` with the standard validation error shape.

## Reports

### POST `/api/v1/reports`

Reports must reference an existing project using `projectId`. The legacy `project` string field is not accepted.

Expected body:

```json
{
  "weekStartDate": "2026-07-06",
  "weekEndDate": "2026-07-12",
  "projectId": "project-id",
  "tasksCompleted": "Completed planned API work.",
  "tasksPlanned": "Continue integration testing.",
  "blockers": "None",
  "hoursWorked": 40,
  "notes": "Optional notes"
}
```

Archived projects cannot receive new reports.
