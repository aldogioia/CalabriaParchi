import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordService} from '../../service/password-service';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-reset-password-page',
  standalone: false,
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.css',
  host: {'class': 'page margin'}
})
export class ResetPasswordPage implements OnInit {
  passwordForm: FormGroup = new FormGroup({});

  private verificationToken: string | null = null;

  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private passwordService: PasswordService
  ) {
    this.passwordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d?!_\-@#]{8,}$/)]],
      confirm: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  ngOnInit(): void {
    this.verificationToken = this.route.snapshot.queryParamMap.get('verification-token');
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

    if (this.verificationToken == null) {
      alert('Verification Token error, please try again.');
      this.router.navigate(['/request-reset']).then();
      return;
    }

    this.loading = true;

    const {email, newPassword} = this.passwordForm.value;
    this.passwordService.resetPassword({
      email: email,
      newPassword: newPassword,
      verificationToken: this.verificationToken
    }).subscribe({
      next: () => {
        alert('Password updated successfully.');
        this.loading = false;
        this.resetPasswordForm();
        this.router.navigate(['/login']).then();
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    })

  }
}
