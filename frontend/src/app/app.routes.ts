import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EventDetail } from './pages/event-detail/event-detail';
import { EventNew } from './pages/event-new/event-new';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { About } from './pages/about/about';
import { authGuard } from './services/auth.guard';
import { EventEdit } from './pages/event-edit/event-edit';
import { adminGuard } from './services/admin.guard';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'events/new', component: EventNew, canActivate: [authGuard]},
    { path: 'events/:id', component: EventDetail},
    { path: 'events/:id/edit', component: EventEdit, canActivate: [authGuard] },
    { path: 'login', component: Login},
    { path: 'register', component: Register},
    { path: 'profile', component: Profile, canActivate: [authGuard]},
    { path: 'profile/:id', component: Profile},
    { path: 'about', component: About},
    { path: 'admin', component: Admin, canActivate: [authGuard, adminGuard]},
    { path: '**', redirectTo: ''},
];
