import { Component, OnInit } from '@angular/core';
import { Appointment } from '../Appointment';
import { AppointmentsService } from '../appointments.service';
import { NotificationService } from "../notification.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * Component is for creating appointments
 */
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  public appointmentDate: string = '';
  public appointmentTime: string = this.setNow('');
  public _id: string | null = '';
  public header: string = '';

  public appointmentForm: any;

  constructor(private appointmentService: AppointmentsService, private notificationService: NotificationService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    this._id = this.route.snapshot.paramMap.get("_id");
    this.header = this._id == null || this._id == '' ? "Create Appointment" : "Reschedule Appointment";

    if (this._id != null && this._id != '') {
      this.appointmentService.getAppointmentById(this._id)
        .subscribe((existingAppointment: Appointment) => {

          this.appointmentForm = this.formBuilder.group({
            appointmentDate: [existingAppointment.appointmentDate, Validators.required],
            subject: [existingAppointment.subject, Validators.required],
            description: [existingAppointment.description, Validators.required],
            participants: [existingAppointment.participants, Validators.required],
            appointmentPlace: [existingAppointment.appointmentPlace, Validators.required],
            appointmentTime: [this.setNow(existingAppointment.appointmentDate), Validators.required],
          });
        }, (error: ErrorEvent) => {
          if (error.error.errorCode === 401) {
            this.notificationService.showError(error.error.errorMessage, error.error.statusDescription);
            this.notificationService.showError("Please sign in again ...", "Sign In");
            this.router.navigate([`./`]);
          } else {
            this.notificationService.showError(error.error.errorMessage, "Get Appointment")
          }
        });
    }

  }

  /**
   * For building form
   */
  createForm() {
    this.appointmentForm = this.formBuilder.group({
      appointmentDate: ['', Validators.required],
      subject: ['', Validators.required],
      description: ['', Validators.required],
      participants: ['', Validators.required],
      appointmentPlace: ['', Validators.required],
      appointmentTime: [this.setNow(''), Validators.required],
    });
  }

  /**
   * To submit appointment
   */
  submitAppointment() {
    if (this._id != null && this._id != '') {
      this.updateAppointment();
    } else {
      this.createAppointment();
    }
  }

  /**
   * To create appointment
   */
  createAppointment() {
    this.setAppointmentTime();
    this.appointmentService.createAppointment(this.appointmentForm.value.subject, this.appointmentForm.value.description, this.appointmentForm.value.participants, this.appointmentDate, this.appointmentForm.value.appointmentPlace)
      .subscribe((createdAppointment: Appointment) => {
        this.appointmentForm.reset();
        const appointmentDate = new Date(createdAppointment.appointmentDate).toDateString();
        this.notificationService.showSuccess(`Appointment Booked Successfully for ${appointmentDate}`, "Book Appointment")
        this.router.navigate([`./appointment-list`]);
      }, (error: ErrorEvent) => {
        if (error.error.errorCode === 401) {
          this.notificationService.showError(error.error.errorMessage, error.error.statusDescription);
          this.notificationService.showError("Please sign in again ...", "Sign In");
          this.router.navigate([`./`]);
        } else {
          this.notificationService.showError(error.error.errorMessage, "Book Appointment");
        }
      });
  }

  /**
   * TO update appointment
   */
  updateAppointment() {
    this.setAppointmentTime();
    this.appointmentService.updateAppointment(this._id, this.appointmentForm.value.subject, this.appointmentForm.value.description, this.appointmentForm.value.participants, this.appointmentDate, this.appointmentForm.value.appointmentPlace)
      .subscribe((createdAppointment: Appointment) => {
        this._id = ''
        this.appointmentForm.reset();
        const appointmentDate = new Date(createdAppointment.appointmentDate).toDateString();
        this.notificationService.showSuccess(`Appointment rescheduled successfully for ${appointmentDate}`, "Reschedule Appointment")
        this.router.navigate([`./create-appointment`]);
      }, (error: ErrorEvent) => {
        if (error.error.errorCode === 401) {
          this.notificationService.showError(error.error.errorMessage, error.error.statusDescription);
          this.notificationService.showError("Please sign in again ...", "Sign In");
          this.router.navigate([`./`]);
        } else {
          this.notificationService.showError(error.error.errorMessage, "Reschedule Appointment");
        }
      });
  }

  /**
   * To set current time
   * @param date 
   * @returns 
   */
  setNow(date: string): string {
    let now: Date;
    if (date) {
      now = new Date(date);
    } else {
      now = new Date();
    }
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    let str = hours + ':' + minutes;
    return str;
  }

  /**
   * To set existing dat & time into specific format
   */
  setAppointmentTime() {
    var date = new Date(this.appointmentForm.value.appointmentDate);
    let hourMin: string[] = this.appointmentForm.value.appointmentTime.split(":");
    date.setHours(+hourMin[0], +hourMin[1], 0);
    this.appointmentDate = date.toString();
  }
}
