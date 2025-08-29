import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ParkService} from '../../../service/park-service';
import {GlobalHandler} from '../../../utils/GlobalHandler';
import {ParkDto} from '../../../model/dto/ParkDto';

@Component({
  selector: 'app-parks-page',
  standalone: false,
  templateUrl: './parks-page.html',
  styleUrls: ['./parks-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class ParksPage implements OnInit {
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
    });
  }

  ngOnInit(): void {
    this.parkService.getParks().subscribe(parks => {
      this.parks = parks;
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === FileReader.DONE) {
          this.selectedFileUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.selectedFileUrl = null;
    }
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
    this.parkForm.patchValue({
      name: park.name
    });
    this.selectedOption = park.isMarine;
    this.selectedFileUrl = park.imageUrl;

    this.selectedFile = await GlobalHandler.getInstance()
      .urlToFile(park.imageUrl, park.name.trim() + ".jpg");
  }

  submit() {
    if (this.parkForm.invalid || !this.selectedFile) {
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
    this.parkService.createPark(
      this.selectedFile!,
      this.parkForm.get('name')?.value,
      this.selectedOption
    ).subscribe({
      next: (createdPark) => {
        this.parks.push(createdPark);
        this.parkForm.reset();
        this.selectedFile = null;
        this.selectedFileUrl = null;
        alert("Park created successfully!");
      },
      error: (err) => {
        console.error('Error creating park:', err);
        alert('Failed to create park. Please try again.');
      }
    });
  }

  private modifyPark() {
    this.parkService.updatePark(
      this.parkToModify!.id,
      this.selectedFile!,
      this.parkForm.get('name')?.value,
      this.selectedOption
    ).subscribe({
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
  }
}
