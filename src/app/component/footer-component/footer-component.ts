import {Component, Input} from '@angular/core';
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
  @Input()
  title: string = 'Calabriaparchi.it';
  @Input()
  info: string[] = [];

  newsletterForm: FormGroup = new FormGroup({});

  loading: boolean = false;

  constructor(
    private newsletterService: NewsletterService,
    private formBuilder: FormBuilder
  ) {
    this.newsletterForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
  }

  subscribeToNewsletter() {
    if (this.newsletterForm.invalid || this.loading) {
      this.newsletterForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const email = this.newsletterForm.value.email;
    this.newsletterService.subscribe(email).subscribe({
      next: () => {
        alert('Subscription successful!');
        this.newsletterForm.reset();
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
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
