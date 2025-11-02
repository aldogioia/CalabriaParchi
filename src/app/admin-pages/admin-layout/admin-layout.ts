import { Component } from '@angular/core';
import {AuthService} from '../../service/auth-service';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css', '../../../../public/styles/header.css']
})
export class AdminLayout {
  isMenuOpen = false;

  constructor(
    protected authService: AuthService,
  ) {}

  signOut() {
    this.authService.signOut().subscribe();
  }
}
