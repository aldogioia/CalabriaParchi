import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HomePage } from './userPages/home-page/home-page';
import { NgOptimizedImage } from '@angular/common';
import { ParkPage } from './userPages/park-page/park-page';
import { FooterComponent } from './component/footer-component/footer-component';
import { CardComponent } from './component/card-component/card-component';
import { ArticleComponent } from './component/article-component/article-component';
import { GalleryComponent } from './component/gallery-component/gallery-component';
import { ItineraryPage } from './userPages/itinerary-page/itinerary-page';
import { ParkItemComponent } from './component/park-item-component/park-item-component';
import { ShareExperiencePage } from './userPages/share-experience-page/share-experience-page';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ExperienceCardComponent } from './component/experience-card-component/experience-card-component';
import { CommunityPage } from './userPages/community-page/community-page';
import { MyItineraryPage } from './userPages/my-itinerary-page/my-itinerary-page';
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { UserLayout } from './userPages/user-layout/user-layout';
import { AdminLayout } from './adminPages/admin-layout/admin-layout';
import { ParksPage } from './adminPages/parks-page/parks-page';

export function HttpLoaderFactory():TranslateHttpLoader {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    App,
    HomePage,
    ParkPage,
    FooterComponent,
    CardComponent,
    ArticleComponent,
    GalleryComponent,
    ItineraryPage,
    ParkItemComponent,
    ShareExperiencePage,
    ExperienceCardComponent,
    CommunityPage,
    MyItineraryPage,
    UserLayout,
    AdminLayout,
    ParksPage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: '/i18n/',
        suffix: '.json'
      }
    },
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [App]
})
export class AppModule { }
