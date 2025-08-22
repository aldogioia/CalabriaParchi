import { Component } from '@angular/core';
import {NewsletterService} from '../../../service/newsletter-service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-footer-component',
  standalone: false,
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css',
  host: {'class': 'footer margin'}
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
      console.error('Invalid form submission');
      return;
    }

    //TODO fare una gestione delle risposte più solida
    const email = this.newsletterForm.value.email;
    this.newsletterService.subscribe(email).subscribe({
      next: (response) => {
        console.log('Subscription successful:', response);
      },
      error: (error) => {
        console.error('Subscription failed:', error);
      }
    });
  }
}
