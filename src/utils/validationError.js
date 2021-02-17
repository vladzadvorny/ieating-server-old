export class ValidationError extends Error {
  constructor(
    message = 'Message',
    code = '',
    fields = [],
    allowable = {},
    ...params
  ) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }

    // Custom debugging information
    this.fields = fields
    this.code = code
    this.message = message
    this.date = new Date()
    this.allowable = allowable
  }
}

export const errorResponse = error => {
  return {
    error: {
      message: error.message,
      code: error.code || '',
      fields: error.fields || [],
      allowable: error.allowable || {}
    }
  }
}
