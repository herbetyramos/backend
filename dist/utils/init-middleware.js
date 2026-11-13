"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initMiddleware;
// utils/init-middleware.ts
function initMiddleware(middleware) {
    return (req, res) => new Promise((resolve, reject) => {
        middleware(req, res, (result) => {
            if (result instanceof Error)
                return reject(result);
            return resolve(result);
        });
    });
}
