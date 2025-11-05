import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ParkDto} from '../../model/dto/ParkDto';
import {ParkService} from '../../service/park-service';
import {GuideService} from '../../service/guide-service';
import {GuideDto} from '../../model/dto/GuideDto';

enum FileType {
  IMAGE,
  PDF
}

@Component({
  selector: 'app-guide-page',
  standalone: false,
  templateUrl: './guide-page.html',
  styleUrls: ['./guide-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class GuidePage implements OnInit {
  @ViewChild('fileInputImage') fileInputImage!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputPdf') fileInputPdf!: ElementRef<HTMLInputElement>;

  protected readonly FileType = FileType;

  guideForm: FormGroup = new FormGroup({});
  parkForm: FormGroup = new FormGroup({});

  guides: GuideDto[] = [];
  parks: ParkDto[] = [];

  selectedFileImageUrl: string | null = null;
  selectedFileImage: File | null = null;
  selectedFilePdf: File | null = null;

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private parkService: ParkService,
    private guideService: GuideService,
  ) {
    this.parkForm = this.formBuilder.group({
      parkId: ['', [Validators.required]],
    })

    this.guideForm = this.formBuilder.group({
      parkId: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.parkService.getParks(true)
      .subscribe(parks => this.parks = parks );

    this.guideForm.get('parkId')?.valueChanges.subscribe(parkId => {
      if (parkId) {
        this.guideService.getAllGuideByParkId(parkId)
          .subscribe(guides => this.guides = guides);
      } else {
        this.guides = [];
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.guideForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    return GlobalHandler.getInstance().getErrorMessage(this.guideForm.get(controlName));
  }

  async onFileSelected(event: Event, fileType: FileType): Promise<void> {
    const result = await GlobalHandler.getInstance().handleFileInput(event);
    if (fileType === FileType.IMAGE) {
      this.selectedFileImage = result.file;
      this.selectedFileImageUrl = result.url;
    } else {
      this.selectedFilePdf = result.file;
    }
  }

  resetForm() {
    this.guideForm.reset();
    this.selectedFileImage = null;
    this.selectedFileImageUrl = null;
    this.selectedFilePdf = null;

    this.guideForm.patchValue({
      parkId: ''
    })

    if (this.fileInputImage) {
      this.fileInputImage.nativeElement.value = '';
    }
    if (this.fileInputPdf) {
      this.fileInputPdf.nativeElement.value = '';
    }
  }

  get guidePreview() {
    return {
      id: '',
      name: this.guideForm.get('name')?.value || 'Inserisci un nome',
      englishName: '',
      imagePreviewUrl: this.selectedFileImageUrl || '',
      pdfUrl: '',
    };
  }

  private isEqualsParkSelection() {
    const parkForm = this.parkForm.get('parkId')?.value;
    const objectForm = this.guideForm.get('parkId')?.value;
    return parkForm == objectForm;
  }

  submit() {
    if (this.selectedFileImage === null || this.selectedFilePdf === null || this.guideForm.invalid || this.loading) {
      this.guideForm.markAsTouched();
      return;
    }

    const { parkId, name, englishName } = this.guideForm.value;
    const formData = new FormData();
    formData.append('parkId', parkId);
    formData.append('name', name);
    formData.append('englishName', englishName);
    formData.append('imagePreview', this.selectedFileImage);
    formData.append('pdf', this.selectedFilePdf);


    this.guideService.createGuide(formData).subscribe({
      next: (createdGuide) => {
        if (this.isEqualsParkSelection())
          this.guides.push(createdGuide);
        this.resetForm();
        alert("Guide created successfully!");
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    });
  }

  deleteGuide(guide: GuideDto) {
    if (this.loading) return;

    const parkId = this.parkForm.get('parkId')?.value

    if(!parkId) {
      alert('Please select a park first.');
      return;
    }

    if (!confirm(`Are you sure you want to delete the guide "${guide.name}"?`)) {
      return;
    }

    this.loading = true;

    this.guideService.deleteGuide(guide.id, parkId).subscribe({
      next: () => {
        this.guides = this.guides.filter(g => g.id !== guide.id);
        alert("Guide deleted successfully!");
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    });
  }
}
