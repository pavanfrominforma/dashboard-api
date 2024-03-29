export class DashboardError extends Error {}

/** Base HttpError */
export class HttpError extends DashboardError {
    constructor(
        public statusCode: number,
        public message: string,
        public error: any
    ) {
        super();
    }
}

export class DbConnectionError extends DashboardError {}

export class BadRequestError extends HttpError {}
