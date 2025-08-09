import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-share-experience-page',
  templateUrl: './share-experience-page.html',
  styleUrl: './share-experience-page.css',
  standalone: false,
  host: {'class': 'page margin'}
})
export class ShareExperiencePage {
  parks: string[] = [
    'Sila', 'Aspromonte', 'Pollino', 'Baia di Soverato', 'Costa degli Dei',
    'Costa dei Gelsomini', 'Riviera dei Cedri', 'Scogli di Isca', 'Secca di Amendolara'
  ];

  selectedFileUrl: string | null = null;

  experienceForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {
    this.experienceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      park: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === FileReader.DONE) {
          this.selectedFileUrl = reader.result as string;
        }
      };

      reader.readAsDataURL(file);
    } else {
      this.selectedFileUrl = null;
    }
  }

  onSubmit(): void {
    if (this.experienceForm.valid && this.selectedFileUrl) {
      const formData = new FormData();

      formData.append('name', this.experienceForm.value.name);
      formData.append('surname', this.experienceForm.value.surname);
      formData.append('email', this.experienceForm.value.email);
      formData.append('park', this.experienceForm.value.park);
      formData.append('description', this.experienceForm.value.description);
      formData.append('file', this.selectedFileUrl);

      console.log('FormData pronto per l’invio', formData);
    } else {
      console.warn('Form non valido o file mancante');
    }
  }
}
