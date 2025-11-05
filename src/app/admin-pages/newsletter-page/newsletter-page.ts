import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {NewsletterService} from '../../service/newsletter-service';

@Component({
  selector: 'app-newsletter-page',
  standalone: false,
  templateUrl: './newsletter-page.html',
  styleUrls: ['./newsletter-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class NewsletterPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  newsletterForm: FormGroup = new FormGroup({});

  subscribers: String[] = [];

  selectedFileUrl: string | null = null;
  selectedFile: File | null = null;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private newsletterService: NewsletterService,
  ) {
    this.newsletterForm = this.formBuilder.group({
      subject: ['', [Validators.required, Validators.maxLength(50)]],
      text: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.newsletterService.getAllSubscribers()
      .subscribe(subscribers => this.subscribers = subscribers);
  }

  isInvalid(controlName: string): boolean {
    const control = this.newsletterForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.newsletterForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  async onFileSelected(event: Event): Promise<void> {
    const result = await GlobalHandler.getInstance().handleFileInput(event);
    this.selectedFile = result.file;
    this.selectedFileUrl = result.url;
  }

  resetForm() {
    this.newsletterForm.reset();

    this.selectedFile = null;
    this.selectedFileUrl = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  submit() {
    if (this.newsletterForm.invalid || this.loading) {
      this.newsletterForm.markAllAsTouched();
    }

    const {subject, text} = this.newsletterForm.value;

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('text', text);

    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }

    this.loading = true;

    this.newsletterService.sendNewsletter(formData).subscribe({
      next: () => {
        this.resetForm();
        alert('Newsletter sent successfully.');
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    });
  }
}
