export class ApiError extends Error {
    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequestError(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static UnauthorizedError() {
        return new ApiError(401, 'User is not authorized.', []);
    }

    static ForbiddenError(message, errors = []) {
        return new ApiError(403, message, errors);
    }

    static ServerError(message, errors = []) {
        return new ApiError(500, message, errors);
    }
}