import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from './profiles';

export const adminGuard: CanActivateFn = async () => {
    const profileService = inject(ProfileService);
    const router = inject(Router);

    try {
        const profile = await profileService.getMyProfile();
        if(profile.role === 'admin') return true;
        router.navigate(['']);
        return false;
    } catch {
        router.navigate(['']);
        return false;
    }
}