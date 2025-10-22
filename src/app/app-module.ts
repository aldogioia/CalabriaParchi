import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HomePage } from './user-pages/home-page/home-page';
import { NgOptimizedImage } from '@angular/common';
import { ParkPage } from './user-pages/park-page/park-page';
import { FooterComponent } from './component/footer-component/footer-component';
import { CardComponent } from './component/card-component/card-component';
import { ArticleComponent } from './component/article-component/article-component';
import { GalleryComponent } from './component/gallery-component/gallery-component';
import { ItineraryPage } from './user-pages/itinerary-page/itinerary-page';
import { ParkItemComponent } from './component/park-item-component/park-item-component';
import { ShareExperiencePage } from './user-pages/share-experience-page/share-experience-page';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ExperienceCardComponent } from './component/experience-card-component/experience-card-component';
import { CommunityPage } from './user-pages/community-page/community-page';
import { MyItineraryPage } from './user-pages/my-itinerary-page/my-itinerary-page';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import { UserLayout } from './user-pages/user-layout/user-layout';
import { AdminLayout } from './admin-pages/admin-layout/admin-layout';
import { ParksPage } from './admin-pages/parks-page/parks-page';
import { LoginPage } from './admin-pages/login-page/login-page';
import {tokenInterceptor} from './security/token-interceptor';
import { GalleryPage } from './admin-pages/gallery-page/gallery-page';
import { TagsPage } from './admin-pages/tags-page/tags-page';
import { CategoryPage } from './admin-pages/category-page/category-page';
import { ArticlesPage } from './admin-pages/articles-page/articles-page';
import { InterestsPage } from './admin-pages/interests-page/interests-page';
import { TagComponent } from './component/tag-component/tag-component';
import { CategoryComponent } from './component/category-component/category-component';
import { ExperiencePostReviewPage } from './admin-pages/experience-post-review-page/experience-post-review-page';
import { NewsletterPage } from './admin-pages/newsletter-page/newsletter-page';
import { GuidePage } from './admin-pages/guide-page/guide-page';
import { UnsubscribePage } from './user-pages/unsubscribe-page/unsubscribe-page';
import { GuideComponent } from './component/guide-component/guide-component';

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
    LoginPage,
    GalleryPage,
    TagsPage,
    CategoryPage,
    ArticlesPage,
    InterestsPage,
    TagComponent,
    CategoryComponent,
    ExperiencePostReviewPage,
    NewsletterPage,
    GuidePage,
    UnsubscribePage,
    GuideComponent,
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
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
    )
  ],
  bootstrap: [App]
})
export class AppModule { }
