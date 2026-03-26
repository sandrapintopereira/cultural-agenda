export interface UserProfile {
    name: string;
    type: 'individual' | 'collective' | 'artist' | 'venue';
    bio?: string | null;
    website?: string | null;
}

export interface ProfileResponse extends UserProfile {
  id: string;
  created_at?: string;
}