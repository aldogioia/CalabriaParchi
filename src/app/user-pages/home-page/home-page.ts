import {Component, OnInit} from '@angular/core';
import {ParkDto} from '../../model/dto/ParkDto';
import {ParkService} from '../../service/park-service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsletterService} from '../../service/newsletter-service';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  host: {'class': 'page' }
})
export class HomePage implements OnInit {
  parks: ParkDto[] = [];

  newsletterForm: FormGroup = new FormGroup({});
  loading: boolean = false;

  showPopup: boolean = true;

  constructor(
    private router: Router,
    private parkService: ParkService,
    private newsletterService: NewsletterService,
    private formBuilder: FormBuilder
  ) {
    this.newsletterForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.parkService.getParks().subscribe(parks => {
        this.parks = parks
    })
  }

  navigateToPark(park: ParkDto) {
    this.router.navigate(['/park', park.id], {state: {park}}).then();
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
        this.showPopup = false;
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

  protected readonly GlobalHandler = GlobalHandler;
}
