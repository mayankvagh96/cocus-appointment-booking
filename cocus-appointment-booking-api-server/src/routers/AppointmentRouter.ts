import express = require('express');
import AuthenticateUtil = require('../utilities/AuthenticateUtil');
import AppointmentController = require('../controllers/AppointmentController');

/**
 * Router for appointment related requests
 * 
 * @class AppointmentRouter
 */
class AppointmentRouter {

   /**
    * Returns an express compatible router
    * 
    * @static
    * @returns {express.Router}
    * 
    * @memberOf AppointmentRouter
    */
   public static getRouter(): express.Router {
      var appointmentRouter = express.Router();

      appointmentRouter.get('/', AuthenticateUtil.ensureAuthenticated, AppointmentController.getAppointments);
      appointmentRouter.get('/:id', AuthenticateUtil.ensureAuthenticated, AppointmentController.getAppointment);
      appointmentRouter.post('/', AuthenticateUtil.ensureAuthenticated, AppointmentController.createAppointment);
      appointmentRouter.patch('/:id', AuthenticateUtil.ensureAuthenticated, AppointmentController.updateAppointment);
      appointmentRouter.delete('/:id', AuthenticateUtil.ensureAuthenticated, AppointmentController.deleteAppointment);

      return appointmentRouter;
   }

}

export = AppointmentRouter;