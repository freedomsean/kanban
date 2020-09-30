export interface ResponseCodeAndMessage {
  code: HttpStatusCode;
  message: string | Function | any;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500
}

interface ResponseFormat {
  USER_NOT_FOUND: ResponseCodeAndMessage;
  LOGIN_FAILED: ResponseCodeAndMessage;
  SYSTEM_ERROR: ResponseCodeAndMessage;
  API_NOT_FOUND: ResponseCodeAndMessage;
}

export const RESPONSE_MESSAGES: ResponseFormat = {
  USER_NOT_FOUND: {
    code: HttpStatusCode.NOT_FOUND,
    message: 'Not found any existed user.'
  },
  LOGIN_FAILED: {
    code: HttpStatusCode.NOT_FOUND,
    message: 'Login info is wrong.'
  },
  SYSTEM_ERROR: {
    code: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: 'System error'
  },
  API_NOT_FOUND: {
    code: HttpStatusCode.NOT_FOUND,
    message: 'API is not found'
  }
};
