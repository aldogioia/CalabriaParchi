import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePage} from './pages/home-page/home-page';
import {ParkPage} from './pages/park-page/park-page';
import {ItineraryPage} from './pages/itinerary-page/itinerary-page';
import {ShareExperiencePage} from './pages/share-experience-page/share-experience-page';
import {CommunityPage} from './pages/community-page/community-page';
import {MyItineraryPage} from './pages/my-itinerary-page/my-itinerary-page';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'park/:id', component: ParkPage },
  { path: 'itineraries', component: ItineraryPage },
  { path: 'my-itinerary', component: MyItineraryPage },
  { path: 'share-experience', component: ShareExperiencePage },
  { path: 'community', component: CommunityPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
