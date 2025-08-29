import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePage} from './userPages/home-page/home-page';
import {ParkPage} from './userPages/park-page/park-page';
import {ItineraryPage} from './userPages/itinerary-page/itinerary-page';
import {ShareExperiencePage} from './userPages/share-experience-page/share-experience-page';
import {CommunityPage} from './userPages/community-page/community-page';
import {MyItineraryPage} from './userPages/my-itinerary-page/my-itinerary-page';
import {UserLayout} from './userPages/user-layout/user-layout';
import {AdminLayout} from './adminPages/admin-layout/admin-layout';
import {ParksPage} from './adminPages/parks-page/parks-page';

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
    children: [
      { path: '', redirectTo: 'parks', pathMatch: 'full' },
      { path: 'parks', component: ParksPage },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
