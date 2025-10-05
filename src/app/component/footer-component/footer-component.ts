import { Component } from '@angular/core';
import {NewsletterService} from '../../service/newsletter-service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-footer-component',
  standalone: false,
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css',
  host: {'class': 'footer'}
})
export class FooterComponent {
  newsletterForm: FormGroup = new FormGroup({});

  constructor(
    private newsletterService: NewsletterService,
    private formBuilder: FormBuilder
  ) {
    this.newsletterForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
  }

  subscribeToNewsletter() {
    if (this.newsletterForm.invalid) {
      this.newsletterForm.markAllAsTouched();
      return;
    }

    const email = this.newsletterForm.value.email;
    this.newsletterService.subscribe(email).subscribe({
      next: (response) => {
        alert('Subscription successful:' + response);
      },
      error: (error) => {
        alert('Subscription failed:'+ error);
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.newsletterForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.newsletterForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control)
  }
}
