import {Component, OnInit, signal} from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ParkService} from '../service/park-service';
import {ParkDto} from '../model/dto/ParkDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('CalabriaParchi');
  language: string = "";
  isMenuOpen = false;
  parks: ParkDto[] = [];

  constructor(
    private router: Router,
    private parkService: ParkService,
    private translate: TranslateService
  ) {
    this.language = GlobalHandler.getInstance().getLanguage("language");
    this.translate.addLangs(['it', 'en']);
    this.translate.use(this.language);
  }

  ngOnInit(): void {
    this.parkService.getParks().subscribe(parks => {
      this.parks = parks;
    })
  }

  changeLanguage(): void {
    const lang = this.language === 'it' ? 'en' : 'it';
    GlobalHandler.getInstance().setLanguage("language", lang);
    this.language = lang;
    this.translate.use(lang);
  }

  redirectTo(url: string, park: ParkDto | null = null): void {
    park === null
      ? this.router.navigate([url]).then()
      : this.router.navigate([url, park.id], {state: {park}}).then();
    this.isMenuOpen = false;
  }
}
