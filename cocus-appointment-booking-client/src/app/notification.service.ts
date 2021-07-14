import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

/**
 * To display toast notifications
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  /**
   * To display success toast notification
   * @param message 
   * @param title 
   */
  showSuccess(message: string, title: string) {
    this.toastr.success(message, title)
  }

  /**
   * To display error toast notification
   * @param message 
   * @param title 
   */
  showError(message: string, title: string) {
    this.toastr.error(message, title)
  }

  /**
   * To display informative toast notification
   * @param message 
   * @param title 
   */
  showInfo(message: string, title: string) {
    this.toastr.info(message, title)
  }

  /**
   * To display warning toast notification
   * @param message 
   * @param title 
   */
  showWarning(message: string, title: string) {
    this.toastr.warning(message, title)
  }

}