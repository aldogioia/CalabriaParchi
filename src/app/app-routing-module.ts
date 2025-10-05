import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePage} from './user-pages/home-page/home-page';
import {ParkPage} from './user-pages/park-page/park-page';
import {ItineraryPage} from './user-pages/itinerary-page/itinerary-page';
import {ShareExperiencePage} from './user-pages/share-experience-page/share-experience-page';
import {CommunityPage} from './user-pages/community-page/community-page';
import {MyItineraryPage} from './user-pages/my-itinerary-page/my-itinerary-page';
import {UserLayout} from './user-pages/user-layout/user-layout';
import {AdminLayout} from './admin-pages/admin-layout/admin-layout';
import {ParksPage} from './admin-pages/parks-page/parks-page';
import {LoginPage} from './admin-pages/login-page/login-page';
import {authGuard} from './security/auth-guard';
import {GalleryPage} from './admin-pages/gallery-page/gallery-page';
import {CategoryPage} from './admin-pages/category-page/category-page';
import {TagsPage} from './admin-pages/tags-page/tags-page';
import {ArticlesPage} from './admin-pages/articles-page/articles-page';
import {InterestsPage} from './admin-pages/interests-page/interests-page';
import {ExperiencePostReviewPage} from './admin-pages/experience-post-review-page/experience-post-review-page';

const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePage },
      { path: 'park/:id', component: ParkPage },
      { path: 'itineraries', component: ItineraryPage },
      { path: 'my-itinerary', component: MyItineraryPage },
      { path: 'share-experience', component: ShareExperiencePage },
      { path: 'community', component: CommunityPage },
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'parks', pathMatch: 'full' },
      { path: 'parks', component: ParksPage },
      { path: 'details', component: ArticlesPage },
      { path: 'interests', component: InterestsPage },
      { path: 'gallery', component: GalleryPage },
      { path: 'categories', component: CategoryPage },
      { path: 'tags', component: TagsPage },
      { path: 'community', component: ExperiencePostReviewPage },
    ]
  },
  {
    path: 'login',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
