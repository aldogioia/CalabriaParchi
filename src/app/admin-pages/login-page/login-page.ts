import { Component } from '@angular/core';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth-service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  loginForm: FormGroup = new FormGroup({});
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d?!_\-@#]{8,}$/)]],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  onSubmit() {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.authService.signIn(this.loginForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl(
            this.route.snapshot.queryParams['returnUrl'] || '/admin'
          ).then();
        },
        error: () => {
          alert('Credenziali non valide o errore di rete');
          this.loading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
