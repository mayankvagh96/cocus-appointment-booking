import express = require('express');
import AuthenticateUtil = require('../utilities/AuthenticateUtil');
import AuthenticationController = require('../controllers/AuthenticationController');

/**
 * Router for authentication related requests
 * 
 * @class AuthenticationRouter
 */
class AuthenticationRouter {

   /**
    * Returns an express compatible router
    * 
    * @static
    * @returns {express.Router}
    * 
    * @memberOf AuthenticationRouter
    */
   public static getRouter(): express.Router {
      var authenticationRouter = express.Router();

      authenticationRouter.post('/authenticate', AuthenticationController.getAuthenticationToken);
      authenticationRouter.post('/generatePassword', AuthenticateUtil.ensureAuthenticated, AuthenticationController.generatePassword);

      return authenticationRouter;
   }

}

export = AuthenticationRouter;