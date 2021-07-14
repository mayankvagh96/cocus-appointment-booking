import express = require('express');
import { IErrorBuilder } from "../interface/IErrorBuilder";
import ErrorBuilder = require('../utilities/ErrorBuilder');
import log from "../logger/index";
import EmailUtil = require('../utilities/EmailUtil');

const Appointment = require('../model/Appointment');

/**
 * Controller for user authentication
 * 
 * @class AppointmentController
 */
class AppointmentController {

    /**
     * Get appointments
     * 
     * @static
     * @param {express.Request} request
     * @param {express.Response} response
     * 
     * @memberOf AppointmentController
     */
    public static async getAppointments(request: express.Request, response: express.Response) {
        log.info("Utility function :: AppointmentController.getAppointments :: Executed");
        try {
            let appointments: any = [];
            if (request.query.startDate) {
                let requestStartDate: string = request.query.startDate.toString();
                let startDate: Date = new Date(new Date(requestStartDate).setHours(0, 0, 0));
                let endDate: Date = new Date(new Date(requestStartDate).setHours(23, 59, 59));

                let dateQuery: any = {
                    $gte: new Date(startDate.toISOString()),
                    $lt: new Date(endDate.toISOString())
                }

                appointments = await Appointment.find({ "appointmentDate": dateQuery });
            } else {
                appointments = await Appointment.find();
            }
            log.info("Utility function :: AppointmentController.getAppointments :: Fetched " + appointments.length + " appointments");
            response.status(200).send(appointments);
        } catch (error: any) {
            let errorData: IErrorBuilder = ErrorBuilder.buildError(500, "Internal Server Error", 500, "Error finding appointment. " + error.message);
            log.error("Utility function :: AppointmentController.getAppointments :: Error :: " + JSON.stringify(errorData));
            response.status(errorData.statusCode).send(errorData);
        }
    }

    /**
      * Get appointment
      * 
      * @static
      * @param {express.Request} request
      * @param {express.Response} response
      * 
      * @memberOf AppointmentController
      */
    public static async getAppointment(request: express.Request, response: express.Response) {
        log.info("Utility function :: AppointmentController.getAppointment :: Executed");
        try {
            const appointment = await Appointment.findById(request.params.id);
            log.info("Utility function :: AppointmentController.getAppointment :: Fetched " + appointment.length + " appointments");

            if (appointment.length === 0) {
                let errorData: IErrorBuilder = ErrorBuilder.buildError(404, "Not Found", 404, "No appointment found for id: " + request.params.id);
                log.error("Utility function :: AppointmentController.getAppointment :: Error :: " + JSON.stringify(errorData));
                response.status(errorData.statusCode).send(errorData);
            }

            response.status(200).send(appointment);
        } catch (error) {
            let errorData: IErrorBuilder = ErrorBuilder.buildError(500, "Internal Server Error", 500, "Error finding appointment. " + error.message);
            log.error("Utility function :: AppointmentController.getAppointment :: Error :: " + JSON.stringify(errorData));
            response.status(errorData.statusCode).send(errorData);
        }
    }

    /**
      * Create appointment
      * 
      * @static
      * @param {express.Request} request
      * @param {express.Response} response
      * 
      * @memberOf AppointmentController
      */
    public static async createAppointment(request: express.Request, response: express.Response) {
        log.info("Utility function :: AppointmentController.createAppointment :: Executed");
        try {
            const appointment = new Appointment({
                subject: request.body.subject,
                description: request.body.description,
                participants: request.body.participants,
                appointmentDate: request.body.appointmentDate,
                appointmentPlace: request.body.appointmentPlace,
            });
            const data = await appointment.save();
            EmailUtil.sendEmail(appointment.participants, appointment.subject, appointment.description, appointment.appointmentPlace, appointment.appointmentDate);
            log.info("Utility function :: AppointmentController.createAppointment :: Saved appointment " + JSON.stringify(appointment));
            response.status(200).send(data);
        } catch (error) {
            console.log(error);
            let errorData: IErrorBuilder = ErrorBuilder.buildError(500, "Internal Server Error", 500, "Error creating appointment. " + error.message);
            log.error("Utility function :: AppointmentController.createAppointment :: Error :: " + JSON.stringify(errorData));
            response.status(errorData.statusCode).send(errorData);
        }
    }

    /**
      * Update appointment
      * 
      * @static
      * @param {express.Request} request
      * @param {express.Response} response
      * 
      * @memberOf AppointmentController
      */
    public static async updateAppointment(request: express.Request, response: express.Response) {
        log.info("Utility function :: AppointmentController.updateAppointment :: Executed");
        try {
            const appointment = await Appointment.findById(request.params.id);

            if (appointment.length === 0) {
                let errorData: IErrorBuilder = ErrorBuilder.buildError(404, "Not Found", 404, "No appointment found for id: " + request.params.id);
                log.error("Utility function :: AppointmentController.updateAppointment :: Error :: " + JSON.stringify(errorData));
                response.status(errorData.statusCode).send(errorData);
            }

            for (const key in request.body) {
                appointment[key] = request.body[key];
            }

            // if (request.body.subject)
            //     appointment["subject"] = request.body.subject;
            // if (request.body.description)
            //     appointment["description"] = request.body.description;
            // if (request.body.participants)
            //     appointment["participants"] = request.body.participants;
            // if (request.body.appointmentDate)
            //     appointment["appointmentDate"] = request.body.appointmentDate;
            // if (request.body.appointmentPlace)
            //     appointment["appointmentPlace"] = request.body.appointmentPlace;

            const data = await appointment.save();
            log.info("Utility function :: AppointmentController.updateAppointment :: Updated appointment as " + JSON.stringify(appointment));
            response.status(200).send(data);
        } catch (error) {
            let errorData: IErrorBuilder = ErrorBuilder.buildError(500, "Internal Server Error", 500, "Error updating appointment. " + error.message);
            log.error("Utility function :: AppointmentController.updateAppointment :: Error :: " + JSON.stringify(errorData));
            response.status(errorData.statusCode).send(errorData);
        }
    }

    /**
      * Delete appointment
      * 
      * @static
      * @param {express.Request} request
      * @param {express.Response} response
      * 
      * @memberOf AppointmentController
      */
    public static async deleteAppointment(request: express.Request, response: express.Response) {
        log.info("Utility function :: AppointmentController.deleteAppointment :: Executed");
        try {
            const appointment = await Appointment.findById(request.params.id);

            if (appointment.length === 0) {
                let errorData: IErrorBuilder = ErrorBuilder.buildError(404, "Not Found", 404, "No appointment found for id: " + request.params.id);
                log.error("Utility function :: AppointmentController.deleteAppointment :: Error :: " + JSON.stringify(errorData));
                response.status(errorData.statusCode).send(errorData);
            }

            const data = await appointment.remove();
            log.info("Utility function :: AppointmentController.deleteAppointment :: Deleted appointment  " + JSON.stringify(appointment));
            response.status(200).send(data);
        } catch (error) {
            let errorData: IErrorBuilder = ErrorBuilder.buildError(500, "Internal Server Error", 500, "Error deleting appointment. " + error.message);
            log.error("Utility function :: AppointmentController.deleteAppointment :: Error :: " + JSON.stringify(errorData));
            response.status(errorData.statusCode).send(errorData);
        }
    }

}

export = AppointmentController;