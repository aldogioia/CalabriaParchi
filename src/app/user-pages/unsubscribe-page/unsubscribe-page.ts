import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NewsletterService} from '../../service/newsletter-service';

@Component({
  selector: 'app-unsubscribe-page',
  standalone: false,
  templateUrl: './unsubscribe-page.html',
  styleUrl: './unsubscribe-page.css',
  host: {'class': 'page margin'},
})
export class UnsubscribePage implements OnInit {
  success: boolean | null = null;

  constructor(
    private route: ActivatedRoute,
    private newsletterService: NewsletterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const subscriberId = this.route.snapshot.queryParamMap.get('subscriber');

    if (subscriberId) {
      this.newsletterService.unsubscribe(subscriberId).subscribe({
        next: () => {
          this.success = true;
        },
        error: () => {
          this.success = false;
        },
      });
    } else {
      this.success = false;
    }
  }

  goToHome() {
    this.router.navigate(['/']).then();
  }
}
