import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    participants: {
        type: String,
        required: true
    },
    appointmentPlace: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true,
        index: {
            unique: true
        }
    }
});

const appointment = mongoose.model("Appointment", appointmentSchema);
appointment.createIndexes();

module.exports = appointment;