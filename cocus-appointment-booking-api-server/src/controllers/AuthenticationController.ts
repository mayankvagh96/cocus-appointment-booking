import express = require('express');
import jwt = require('jsonwebtoken');
import config from "config";
import bcrypt = require('bcrypt');
import { IErrorBuilder } from "../interface/IErrorBuilder";
import ErrorBuilder = require('../utilities/ErrorBuilder');
import log from "../logger/index";


/**
 * Controller for user authentication
 * 
 * @class AuthenticationController
 */
class AuthenticationController {

    /**
     * Authenticate username and password and returns token
     * 
     * @static
     * @param {express.Request} request
     * @param {express.Response} response
     * 
     * @memberOf AuthenticationController
     */
    public static async getAuthenticationToken(request: express.Request, response: express.Response) {

        log.info("Utility function :: AuthenticationController.getAuthenticationToken :: Executed");

        const users: any = config.get("userCredentials");

        if (!request.body.username) {
            let error: IErrorBuilder = ErrorBuilder.buildError(400, "Bad Request Exception", 400, "Missing property 'username' in request body");
            log.error("Utility function :: AuthenticationController.getAuthenticationToken :: Error :: " + JSON.stringify(error));
            return response.status(error.statusCode).send(error);
        }

        if (!request.body.password) {
            let error: IErrorBuilder = ErrorBuilder.buildError(400, "Bad Request Exception", 400, "Missing property 'password' in request body");
            log.error("Utility function :: AuthenticationController.getAuthenticationToken :: Error :: " + JSON.stringify(error));
            return response.status(error.statusCode).send(error);
        }

        // Get to user from the database, if the user is not there return error
        let user: any = users.find((u: { username: any; }) => u.username === request.body.username);
        if (!user) {
            let error: IErrorBuilder = ErrorBuilder.buildError(400, "Bad Request Exception", 400, "Invalid username");
            log.error("Utility function :: AuthenticationController.getAuthenticationToken :: Error :: " + JSON.stringify(error));
            return response.status(error.statusCode).send(error);
        }

        // Compare the password with the password in the database
        const valid = await bcrypt.compare(request.body.password, user.password)
        if (!valid) {
            let error: IErrorBuilder = ErrorBuilder.buildError(400, "Bad Request Exception", 400, "Invalid password");
            log.error("Utility function :: AuthenticationController.getAuthenticationToken :: Error :: " + JSON.stringify(error));
            return response.status(error.statusCode).send(error);
        }

        const token = jwt.sign({
            id: user._id,
        }, "jwtPrivateKey", { expiresIn: config.get("tokenConfiguration.accessTokenTtl") as string });
        log.info("Utility function :: AuthenticationController.getAuthenticationToken :: Fetched token response :: " + token);
        return response.status(200).send({ ok: true, token: token });
    };

    /**
     * Generate encrypted password using bcrypt
     * 
     * @static
     * @param {express.Request} request
     * @param {express.Response} response
     * 
     * @memberOf AuthenticationController
     */
    public static async generatePassword(request: express.Request, response: express.Response) {
        log.info("Utility function :: AuthenticationController.generatePassword :: Executed");

        if (!request.body.password) {
            let error: IErrorBuilder = ErrorBuilder.buildError(400, "Bad Request Exception", 400, "Missing property 'password' in request body");
            log.error("Utility function :: AuthenticationController.generatePassword :: Error :: " + JSON.stringify(error));
            return response.status(error.statusCode).send(error);
        }

        const salt: string = await bcrypt.genSalt(config.get("tokenConfiguration.saltWorkFactor") as number);
        let encryptedPassword: string = await bcrypt.hash(request.body.password, salt);
        log.info("Utility function :: AuthenticationController.generatePassword :: Created encrypted password :: " + encryptedPassword);
        return response.status(200).send({ ok: true, originalPassword: request.body.password, encryptedPassword: encryptedPassword });
    }

}

export = AuthenticationController;