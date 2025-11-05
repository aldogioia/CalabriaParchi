import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth-service';
import {PasswordService} from '../../service/password-service';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-update-password-page',
  standalone: false,
  templateUrl: './update-password-page.html',
  styleUrl: './update-password-page.css',
  host: {'class': 'page margin'}
})
export class UpdatePasswordPage {
  passwordForm: FormGroup = new FormGroup({});

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private passwordService: PasswordService,
    private authService: AuthService
  ) {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d?!_\-@#]{8,}$/)]],
      confirm: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  isInvalid(controlName: string): boolean {
    const control = this.passwordForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.passwordForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  resetPasswordForm() {
    this.passwordForm.reset();
  }

  submitPasswordForm() {
    if (this.passwordForm.invalid || this.loading) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (this.passwordForm.get("confirm")?.value != this.passwordForm.get("newPassword")?.value) {
      alert('New password and confirmation do not match.');
      return;
    }

    const userId = this.authService.getUserIdFromToken()

    if (userId == null) {
      alert('Parsing error, please try again.');
      return;
    }

    this.loading = true;

    const {oldPassword, newPassword} = this.passwordForm.value;
    this.passwordService.updatePassword({
        userId: userId,
        oldPassword: oldPassword,
        newPassword: newPassword
    }).subscribe({
      next: () => {
        alert('Password updated successfully.');
        this.loading = false;
        this.resetPasswordForm();
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    })
  }
}
