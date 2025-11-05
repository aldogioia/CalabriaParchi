import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {AdminsService} from '../../service/admins-service';
import {AdminDto} from '../../model/dto/AdminDto';
import {ParkDto} from '../../model/dto/ParkDto';
import {ParkService} from '../../service/park-service';

@Component({
  selector: 'app-admins-page',
  standalone: false,
  templateUrl: './admins-page.html',
  styleUrls: ['./admins-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class AdminsPage implements OnInit {
  adminForm: FormGroup = new FormGroup({});

  admins: AdminDto[] = [];

  parks: ParkDto[] = [];

  adminToModify: AdminDto | null = null;

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminsService,
    private parkService: ParkService
  ) {
    this.adminForm = this.formBuilder.group({
      id: [''],
      parkId: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      surname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^(?:\\+39|0039)?\\s?(?:3\\d{8,9}|0\\d{6,10})$')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.adminService.getAdmins()
      .subscribe(admins => this.admins = admins);

    this.parkService.getParks()
      .subscribe(parks => this.parks = parks);
  }

  isInvalid(controlName: string): boolean {
    const control = this.adminForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.adminForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  selectAdmin(admin: AdminDto) {
    this.adminToModify = admin;
    this.adminForm.patchValue(admin);
  }

  resetAdminForm() {
    this.adminToModify = null;
    this.adminForm.reset();
    this.adminForm.get('parkId')?.setValue('');
  }

  submitAdminForm() {
    if (this.adminForm.invalid || this.loading) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.adminToModify ? this.modifyAdmin(): this.addAdmin();
  }

  private addAdmin() {
    const admin = this.adminForm.value;

    this.adminService.addAdmin(admin).subscribe({
      next: (newAdmin) => {
        this.admins.push(newAdmin);
        this.resetAdminForm();
        alert("Admin added successfully!");
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    });
  }

  private modifyAdmin() {
    const updatedAdmin = this.adminForm.value;
    this.adminService.updateAdmin(updatedAdmin).subscribe({
      next: (admin) => {
        const index = this.admins.findIndex(a => a.id === this.adminToModify!.id);
        if (index !== -1) {
          this.admins[index] = admin;
        }
        this.resetAdminForm();
        alert("Admin updated successfully!");
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    });
  }

  deleteArticle() {
    if (this.adminToModify && !this.loading) {
      if (!confirm(`Are you sure you want to delete the admin "${this.adminToModify.name}"? This action cannot be undone.`)) {
        return;
      }

      this.loading = true;

      this.adminService.deleteAdmin(this.adminToModify.id).subscribe({
        next: () => {
          this.admins = this.admins.filter(a => a.id !== this.adminToModify!.id);
          this.resetAdminForm();
          alert("Admin deleted successfully!");
          this.loading = false;
        },
        error: (error) => {
          alert(error);
          this.loading = false;
        }
      });
    }
  }
}
