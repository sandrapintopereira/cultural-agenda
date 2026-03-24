import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EventDetail } from './pages/event-detail/event-detail';
import { EventNew } from './pages/event-new/event-new';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { About } from './pages/about/about';

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'events/new', component: EventNew},
    { path: 'events/:id', component: EventDetail},
    { path: 'login', component: Login},
    { path: 'register', component: Register},
    { path: 'profile', component: Profile},
    { path: 'about', component: About},
    { path: '**', redirectTo: ''}
];
