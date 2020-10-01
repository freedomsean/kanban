import { Env, ENV_PRODUCTION_MODE } from '../constant/env.constant';
import { HttpStatusCode } from '../constant/response-msg.constant';

/**
 * Abstract Http Response.
 */
export abstract class HttpResponse {
  /**
   * Http status code.
   */
  statusCode: number;

  constructor(defaultCode: number, code?: HttpStatusCode) {
    this.processCode(defaultCode, code);
  }

  private processCode(defaultCode: number, code?: HttpStatusCode) {
    const statusCode = code ?? defaultCode;
    this.statusCode = statusCode;
  }

  abstract toJson(): any;
  abstract getData(): any;

  protected successResponse(): any {
    return {
      data: this.getData()
    };
  }

  protected errorResponse(): any {
    return {
      // In the production mode, it won't show any error detail.
      error: Env.NODE_ENV === ENV_PRODUCTION_MODE ? '' : this.getData()
    };
  }
}

/**
 * For 2xx HTTP code to use. Default is 200.
 */
export class HttpSuccessResponse extends HttpResponse {
  data: any;

  constructor(data: any, code?: HttpStatusCode) {
    super(HttpStatusCode.OK, code);
    const realData = data;
    this.data = realData;
  }

  getData(): any {
    return this.data;
  }

  toJson(): any {
    return this.successResponse();
  }
}

/**
 * For 409.
 */
export class HttpConflictResponse extends HttpResponse {
  error: any;

  constructor(error: any) {
    super(HttpStatusCode.CONFLICT);
    this.error = error;
  }

  toJson() {
    return this.errorResponse();
  }

  getData() {
    return this.error;
  }
}

/**
 * For 422.
 */
export class HttpUnprocessableEntityResponse extends HttpResponse {
  errors: any[];

  constructor(errors: any[]) {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }

  toJson() {
    return this.errorResponse();
  }

  getData() {
    return { validateErrors: this.errors };
  }
}

/**
 * For 401.
 */
export class HttpUnauthorizedResponse extends HttpResponse {
  constructor() {
    super(HttpStatusCode.UNAUTHORIZED);
  }

  toJson() {
    return this.errorResponse();
  }

  getData() {
    return 'UNAUTHORIZED';
  }
}

/**
 * For 401.
 */
export class HttpForbiddenResponse extends HttpResponse {
  constructor() {
    super(HttpStatusCode.FORBIDDEN);
  }

  toJson() {
    return this.errorResponse();
  }

  getData() {
    return 'FOBIDDEN';
  }
}

/**
 * For 404.
 */
export class HttpNotFoundResponse extends HttpResponse {
  constructor() {
    super(HttpStatusCode.NOT_FOUND);
  }

  toJson() {
    return this.errorResponse();
  }

  getData() {
    return 'NOT_FOUND';
  }
}

/**
 * System Error Response, 5XX.
 */
export class HttpSystemErrorResponse extends HttpResponse {
  error: any;

  constructor(data: any, code?: HttpStatusCode) {
    super(HttpStatusCode.INTERNAL_SERVER_ERROR, code);
    const realData = data;
    this.error = realData;
  }

  getData(): any {
    return this.error;
  }

  toJson(): any {
    return this.errorResponse();
  }
}
