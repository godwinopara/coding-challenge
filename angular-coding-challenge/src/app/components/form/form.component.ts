import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { RecordsService } from '../../services/records.service';
import { IRecords } from '../../models/record.model';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {

  // Service for managing records data across the application
  private recordService = inject(RecordsService);

  // Angular Material service for showing snackbar notifications
  private _snackBar = inject(MatSnackBar);

  
  profilePreview: string | ArrayBuffer | null = null;
  private previousObjectUrl: string | null = null;

  // Configuration for snackbar notification positioning
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  // Form Validations
  // Main reactive form group containing all form controls with validation
  protected recordForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z ]+$/),
    ]),
    amount: new FormControl('', [Validators.required, Validators.min(0.01)]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^0[789][01]\d{8}$/),
    ]),
    profilePicture: new FormControl(null, Validators.required),
  });

  // Handles file input changes, validates file type, updates form control, and manages preview.
  onFileChange(event: any) {
     // Extract the first file from the file input
    const file = event.target.files[0];

    // Validate file exists and is an accepted image type
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {

      // Update form control with the valid file
      this.recordForm.patchValue({ profilePicture: file });

      // Object URLs consume memory until explicitly revoked
      if (this.previousObjectUrl) {
        URL.revokeObjectURL(this.previousObjectUrl);
      }
      // create a temporary URL that can be used in img src
      this.previousObjectUrl = URL.createObjectURL(file);
      this.profilePreview = this.previousObjectUrl;
    } else {
      alert('Only .jpg, .jpeg, .png files allowed!');
    }
  }


  // Displays a success notification using Angular Material Snackbar
  openSnackBar() {
    this._snackBar.open('New Record Add Successfully', 'Dismiss', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
  }

  
  submitForm() {
    // Continue Form Submition if all form validations is valid
    if (this.recordForm.valid) {
      // Extract raw form values (these may be null/undefined)
      const formValue = this.recordForm.value;


      const record: IRecords = {
        fullName: formValue.fullName ?? '',
        amount: Number(formValue.amount ?? 0), 
        phoneNumber: formValue.phoneNumber ?? '',

        // If file exists, create object URL; otherwise use empty string
        profilePicture: formValue.profilePicture ? URL.createObjectURL(formValue.profilePicture): '',
        // Generate current timestamp in ISO format for consistent date handling
        dateSubmitted: new Date().toISOString(),
      };

      // Add the new record to the global records collection via service
      this.recordService.addRecords(record);
      
      // Reset form to initial state (clears all inputs and validation states)
      this.recordForm.reset();

      // Show success notification to provide user feedback
      this.openSnackBar();

      
      // Revoke the object URL to free memory since we're done with the 
      // previewing of uploaded profile picture
      if (this.previousObjectUrl) {
        URL.revokeObjectURL(this.previousObjectUrl);
        this.previousObjectUrl = null;
      }

      // Clear the preview image display
      this.profilePreview = null;

    }
  }
}
