import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css', '../../../../public/styles/header.css']
})
export class AdminLayout {
  isMenuOpen = false;

  signOut() {
    //TODO implement sign out
  }
}
