import mongoose from "mongoose";
export interface IAppointment extends mongoose.Document {
    subject: string,
    description: string,
    participants: string,
    appointmentDate: string
}