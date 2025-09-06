export enum ErrorCode {
  INVALID_PARAMETER = "INVALID_PARAMETER",
  INVALID_DATE = "INVALID_DATE",
  NOT_FOUND = "NOT_FOUND",
  EVENT_ALREADY_EXISTS = "EVENT_ALREADY_EXISTS",
}

export class InvalidParameterError extends Error {
  code = ErrorCode.INVALID_PARAMETER
  constructor(parameter: string) {
    super(`Invalid parameter: ${parameter}`)
  }
}

export class NotFoundError extends Error {
  code = ErrorCode.NOT_FOUND
  constructor(message: string) {
    super(message)
  }
}

export class UnauthorizedError extends Error {
  code = ErrorCode.NOT_FOUND
  constructor(message: string) {
    super(message)
  }
}

export class EventAlreadyExistsError extends Error {
  code = ErrorCode.EVENT_ALREADY_EXISTS
  constructor() {
    super("Event already exists")
  }
}
