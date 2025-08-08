import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HomePage } from './pages/home-page/home-page';
import {NgOptimizedImage} from '@angular/common';
import { ParkPage } from './pages/park-page/park-page';
import { FooterComponent } from './component/footer-component/footer-component';
import { CardComponent } from './component/card-component/card-component';
import { ArticleComponent } from './component/article-component/article-component';
import { GalleryComponent } from './component/gallery-component/gallery-component';
import { ItineraryPage } from './pages/itinerary-page/itinerary-page';
import { ParkItemComponent } from './component/park-item-component/park-item-component';
import {ShareExperiencePage} from './pages/share-experience-page/share-experience-page';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ExperienceCardComponent } from './component/experience-card-component/experience-card-component';
import { CommunityPage } from './pages/community-page/community-page';
import { MyItineraryPage } from './pages/my-itinerary-page/my-itinerary-page';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
