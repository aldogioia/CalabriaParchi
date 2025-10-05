import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ExperiencePostService} from '../../service/experience-post-service';
import {ParkDto} from '../../model/dto/ParkDto';
import {ParkService} from '../../service/park-service';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-share-experience-page',
  templateUrl: './share-experience-page.html',
  styleUrl: './share-experience-page.css',
  standalone: false,
  host: {'class': 'page margin'}
})
export class ShareExperiencePage implements OnInit{
  parks: ParkDto[] = [];

  selectedFileUrl: string | null = null;
  selectedFile: File | null = null;

  experienceForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private parkService: ParkService,
    private shareExperienceService: ExperiencePostService,
  ) {
    this.experienceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      park: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]]
    });
  }

  ngOnInit(): void {
    this.parkService.getParks().subscribe(parks => {
      this.parks = parks;
    })
  }

  async onFileSelected(event: Event): Promise<void> {
    const result = await GlobalHandler.getInstance().handleFileInput(event);
    this.selectedFile = result.file;
    this.selectedFileUrl = result.url;
  }

  share(): void {
    if (this.experienceForm.invalid || !this.selectedFile) {
      this.experienceForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('name', this.experienceForm.value.name);
    formData.append('surname', this.experienceForm.value.surname);
    formData.append('email', this.experienceForm.value.email);
    formData.append('parkId', this.experienceForm.value.park);
    formData.append('description', this.experienceForm.value.description);
    formData.append('image', this.selectedFile);

    this.shareExperienceService.createExperiencePost(formData).subscribe({
      next: () => {
        alert('Esperienza condivisa con successo!');
        this.experienceForm.reset({ park: '' });
        this.selectedFile = null;
        this.selectedFileUrl = null;
      },
      error: (error: any) => {
        alert('Errore durante la condivisione: ' + error.message);
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.experienceForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.experienceForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  findParkNameById(id: string): string {
    const park = this.parks.find(p => p.id === id);
    return park ? park.name : 'Parco non trovato';
  }
}
