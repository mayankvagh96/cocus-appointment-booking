import express = require('express');
import jwt = require('jsonwebtoken');
import { IErrorBuilder } from "../interface/IErrorBuilder";
import ErrorBuilder = require('./ErrorBuilder');
import log from "../logger/index";

/**
 * For user authentication
 * 
 * @class AuthenticateUtil
 */
class AuthenticateUtil {

    /**
     * Simple route middle-ware to ensure user is authenticated.
     * Use this route middle-ware on any resource that needs to be protected.  If
     * the request is authenticated (typically via a persistent login session),
     * the request will proceed. Otherwise, the user will be redirected to the
     * login page.
     *
     * @param {express.Request} request
     * @param {express.Response} response
     * @param next
     * @returns {any}
     * @memberOf AuthenticateUtil
     */
    public static ensureAuthenticated(request: any, response: express.Response, next: express.NextFunction) {
        log.info("Utility function :: AuthenticateUtil.ensureAuthenticated :: Executed");

        const token: string | undefined = request.header("x-auth-token");

        if (!token) {
            let error: IErrorBuilder = ErrorBuilder.buildError(401, "Unauthorized", 401, "Access denied. No token provided");
            log.error("Utility function :: AuthenticateUtil.ensureAuthenticated :: Error :: " + JSON.stringify(error));
            return response.status(error.statusCode).send(error);
        }

        try {
            const decoded: string | jwt.JwtPayload = jwt.verify(token, "jwtPrivateKey");
            request.user = decoded;
        } catch (error: any) {
            let errorMessage: IErrorBuilder = ErrorBuilder.buildError(401, "Unauthorized", 401, "Token expired");
            log.error("Utility function :: AuthenticateUtil.ensureAuthenticated :: Error :: " + JSON.stringify(error));
            return response.status(errorMessage.statusCode).send(errorMessage);
        }
        log.info("Utility function :: AuthenticateUtil.ensureAuthenticated :: User authenticated successfully.");
        next();
    };

}

export = AuthenticateUtil;