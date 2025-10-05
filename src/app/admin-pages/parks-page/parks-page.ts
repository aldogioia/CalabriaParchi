import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ParkService} from '../../service/park-service';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {ParkDto} from '../../model/dto/ParkDto';

@Component({
  selector: 'app-parks-page',
  standalone: false,
  templateUrl: './parks-page.html',
  styleUrls: ['./parks-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class ParksPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  parks: ParkDto[] = [];

  selectedFileUrl: string | null = null;
  selectedFile: File | null = null;
  selectedOption: boolean = false;

  parkToModify: ParkDto | null = null;

  parkForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private parkService: ParkService
  ) {
    this.parkForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      englishName: ['', [Validators.required, Validators.maxLength(100)]],
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

  isInvalid(controlName: string): boolean {
    const control = this.parkForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.parkForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  async selectPark(park: ParkDto) {
    this.parkToModify = park;
    this.parkForm.patchValue(park);
    this.selectedOption = park.isMarine;
    this.selectedFileUrl = park.imageUrl;
    this.selectedFile = null;
  }

  submit() {
    if (!this.parkToModify ? this.parkForm.invalid  || !this.selectedFile : this.parkForm.invalid) {
      this.parkForm.markAllAsTouched();
      return;
    }

    if (this.parkToModify) {
      this.modifyPark();
    } else {
      this.addPark();
    }
  }

  private addPark() {
    const formData = new FormData();
    formData.append('image', this.selectedFile!);
    formData.append('name', this.parkForm.get('name')?.value);
    formData.append('englishName', this.parkForm.get('englishName')?.value);
    formData.append('isMarine', String(this.selectedOption));

    this.parkService.createPark(formData).subscribe({
      next: (createdPark) => {
        this.parks.push(createdPark);
        this.resetForm();
        alert("Park created successfully!");
      },
      error: (err) => {
        console.error('Error creating park:', err);
        alert('Failed to create park. Please try again.');
      }
    });
  }

  private modifyPark() {
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    formData.append('name', this.parkForm.get('name')?.value);
    formData.append('englishName', this.parkForm.get('englishName')?.value);
    formData.append('isMarine', String(this.selectedOption));
    formData.append('id', String(this.parkToModify!.id));


    this.parkService.updatePark(formData).subscribe({
      next: (updatedPark) => {
        const index = this.parks.findIndex(p => p.id === updatedPark.id);
        if (index > -1) {
          this.parks[index] = updatedPark;
        }
        this.resetForm();
        alert("Park updated successfully!");
      },
      error: (err) => {
        console.error('Error updating park:', err);
        alert('Failed to update park. Please try again.');
      }
    });
  }

  resetForm() {
    this.parkForm.reset();
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.parkToModify = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  deletePark() {
    if (this.parkToModify) {
      if (!confirm(`Are you sure you want to delete the park "${this.parkToModify.name}"? This action cannot be undone.`)) {
        return;
      }

      this.parkService.deletePark(this.parkToModify.id).subscribe({
        next: () => {
          this.parks = this.parks.filter(p => p.id !== this.parkToModify!.id);
          this.resetForm();
          alert("Park deleted successfully!");
        },
        error: (err) => {
          console.error('Error deleting park:', err);
          alert('Failed to delete park. Please try again.');
        }
      });
    }
  }
}
