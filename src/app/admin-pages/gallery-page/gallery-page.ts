import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ParkDto} from '../../model/dto/ParkDto';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ParkService} from '../../service/park-service';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {GalleryItemDto} from '../../model/dto/GalleryItemDto';
import {GalleryItemService} from '../../service/gallery-item-service';

@Component({
  selector: 'app-gallery-page',
  standalone: false,
  templateUrl: './gallery-page.html',
  styleUrls: ['./gallery-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class GalleryPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  parks: ParkDto[] = [];
  galleryItems: GalleryItemDto[] = [];

  selectedFileUrl: string | null = null;
  selectedFile: File | null = null;

  galleryItemToModify: GalleryItemDto | null = null;

  galleryItemForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private parkService: ParkService,
    private galleryItemService: GalleryItemService,
  ) {
    this.galleryItemForm = this.formBuilder.group({
      parkId: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(80)]],
      englishDescription: ['', [Validators.required, Validators.maxLength(80)]]

    });
  }

  ngOnInit(): void {
    this.parkService.getParks().subscribe(parks => {
      this.parks = parks;
    })

    this.galleryItemForm.get('parkId')?.valueChanges
      .subscribe(parkId => parkId ? this.getGalleryItemsByParkId(parkId) : this.galleryItems = []);
  }

  async onFileSelected(event: Event): Promise<void> {
    const result = await GlobalHandler.getInstance().handleFileInput(event);
    this.selectedFile = result.file;
    this.selectedFileUrl = result.url;
  }

  isInvalid(controlName: string): boolean {
    const control = this.galleryItemForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.galleryItemForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  selectGalleryItem(galleryItemDto: GalleryItemDto) {
    this.galleryItemToModify = galleryItemDto;
    this.galleryItemForm.patchValue(galleryItemDto);
    this.selectedFileUrl = galleryItemDto.imageUrl;
    this.selectedFile = null;
  }

  resetForm() {
    this.galleryItemForm.reset();
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.galleryItemToModify = null;
    this.galleryItemForm.patchValue({
      parkId: ''
    })

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private getGalleryItemsByParkId(parkId: string) {
    this.galleryItemService.getGalleryItemsByParkId(parkId)
      .subscribe(galleryItems => this.galleryItems = galleryItems);
  }

  submit() {
    if (!this.galleryItemToModify ? this.galleryItemForm.invalid  || !this.selectedFile : this.galleryItemForm.invalid) {
      this.galleryItemForm.markAllAsTouched();
      return;
    }

    if (this.galleryItemToModify) {
      this.modifyGalleryItem();
    } else {
      this.addGalleryITem();
    }
  }

  private addGalleryITem() {
    const formData = new FormData();
    formData.append('image', this.selectedFile!);
    formData.append('description', this.galleryItemForm.get('description')?.value);
    formData.append('englishDescription', this.galleryItemForm.get('englishDescription')?.value);
    formData.append('parkId', this.galleryItemForm.get('parkId')?.value);

    this.galleryItemService.createGalleryItem(formData).subscribe({
      next: (createdGalleryItem) => {
        this.galleryItems.push(createdGalleryItem);
        this.resetForm();
        alert("Gallery item created successfully!");
      },
      error: (err) => {
        console.error('Error creating gallery item:', err);
        alert('Failed to create gallery item. Please try again.');
      }
    });
  }

  private modifyGalleryItem() {
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    formData.append('description', this.galleryItemForm.get('description')?.value);
    formData.append('englishDescription', this.galleryItemForm.get('englishDescription')?.value);
    formData.append('parkId', this.galleryItemForm.get('parkId')?.value);
    formData.append('id', String(this.galleryItemToModify!.id));

    this.galleryItemService.modifyGalleryItem(formData).subscribe({
      next: (updatedGalleryItem) => {
        const index = this.galleryItems.findIndex(item => item.id === updatedGalleryItem.id);
        if (index !== -1) {
          this.galleryItems[index] = updatedGalleryItem;
        }
        this.resetForm();
        alert("Gallery item updated successfully!");
      },
      error: (err) => {
        console.error('Error updating gallery item:', err);
        alert('Failed to update gallery item. Please try again.');
      }
    });
  }

  deletePark() {
    if (!this.galleryItemToModify) return;

    const confirmDelete = confirm('Are you sure you want to delete this gallery item?');
    if (!confirmDelete) return;

    this.galleryItemService.deleteGalleryItem(this.galleryItemToModify.id, this.galleryItemToModify.parkId)
      .subscribe({
        next: () => {
          this.galleryItems = this.galleryItems.filter(item => item.id !== this.galleryItemToModify!.id);
          this.resetForm();
          alert('Gallery item deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting gallery item:', err);
          alert('Failed to delete gallery item. Please try again.');
        }
      });
  }
}
