import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordService} from '../../service/password-service';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-request-reset-page',
  standalone: false,
  templateUrl: './request-reset-page.html',
  styleUrl: './request-reset-page.css',
  host: {'class': 'page margin'}
})
export class RequestResetPage {
  requestForm: FormGroup = new FormGroup({});

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private passwordService: PasswordService,
  ) {
    this.requestForm = this.formBuilder.group({
      email: ['', Validators.email],
    })
  }

  isInvalid(controlName: string): boolean {
    const control = this.requestForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.requestForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  submitPasswordForm() {
    if (this.requestForm.invalid || this.loading) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.passwordService.requestPasswordReset(this.requestForm.value).subscribe({
      next: () => {
        alert('Password reset link sent to your email.');
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    })
  }
}
