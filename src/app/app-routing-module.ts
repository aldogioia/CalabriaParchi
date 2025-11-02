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
import {NewsletterPage} from './admin-pages/newsletter-page/newsletter-page';
import {UnsubscribePage} from './user-pages/unsubscribe-page/unsubscribe-page';
import {GuidePage} from './admin-pages/guide-page/guide-page';
import {AdminsPage} from './admin-pages/admins-page/admins-page';
import {ResetPasswordPage} from './admin-pages/reset-password-page/reset-password-page';
import {RequestResetPage} from './admin-pages/request-reset-page/request-reset-page';
import {UpdatePasswordPage} from './admin-pages/update-password-page/update-password-page';
import {roleGuard} from './security/role-guard';

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
      { path: 'unsubscribe', component: UnsubscribePage },
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    children: [
      { path: '', redirectTo: 'parks', pathMatch: 'full' },
      { path: 'parks', component: ParksPage, data: { roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] } },
      { path: 'details', component: ArticlesPage, data: { roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] } },
      { path: 'interests', component: InterestsPage, data: { roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] } },
      { path: 'gallery', component: GalleryPage, data: { roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] } },
      { path: 'categories', component: CategoryPage, data: { roles: ['ROLE_SUPER_ADMIN'] } },
      { path: 'tags', component: TagsPage, data: { roles: ['ROLE_SUPER_ADMIN'] } },
      { path: 'community', component: ExperiencePostReviewPage, data: { roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] } },
      { path: 'guide', component: GuidePage, data: { roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] } },
      { path: 'newsletter', component: NewsletterPage, data: { roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] } },
      { path: 'admins', component: AdminsPage, data: { roles: ['ROLE_SUPER_ADMIN'] } },
      { path: 'update-password', component: UpdatePasswordPage, data: { roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] } },
    ]
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'request-reset',
    component: RequestResetPage
  },
  {
    path: 'reset-password',
    component: ResetPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
