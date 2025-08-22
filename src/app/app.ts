import {Component, signal} from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CalabriaParchi');
  language: string = "";
  isMenuOpen = false;

  constructor(private translate: TranslateService, private router: Router) {
    this.language = GlobalHandler.getInstance().getItem("language") || 'it';
    this.translate.addLangs(['it', 'en']);
    this.translate.use(this.language);
  }

  changeLanguage(): void {
    const lang = this.language === 'it' ? 'en' : 'it';
    GlobalHandler.getInstance().setItem("language", lang);
    this.language = lang;
    this.translate.use(lang);
  }

  redirectTo(url: string): void {
    this.router.navigate([url]).then();
    this.isMenuOpen = false;
  }
}
