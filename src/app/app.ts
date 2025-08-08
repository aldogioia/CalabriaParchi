import {Component, signal, TemplateRef} from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CalabriaParchi');

  language = GlobalHandler.getInstance().getItem("language") || 'it';

  isMenuOpen = false;
  isExtendedMenuOpen = false;
  template:TemplateRef<any> | null = null;

  constructor(private router: Router) {}

  changeLanguage(): void {
    const lang = this.language === 'it' ? 'en' : 'it';
    GlobalHandler.getInstance().setItem("language", lang);
    this.language = lang;
  }

  openMenu(template: TemplateRef<any>): void {
    this.isMenuOpen = false;
    this.isMenuOpen = true;
    this.template = template;
  }

  redirectTo(url: string): void {
    this.router.navigate([url]).then();
    this.isMenuOpen = false;
    this.isExtendedMenuOpen = false;
  }
}
