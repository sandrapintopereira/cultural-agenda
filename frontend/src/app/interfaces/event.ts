export interface Event {
    id: string;
    title: string;
    type: 'concert' | 'exhibition' | 'reading' | 'theatre' | 'other';
    date: string;
    time: string;
    location: string;
    description: string;
    is_free: boolean;
    user_id: string;
    created_at: string;
    status: 'pending' | 'approved' | 'rejected';
    attendances?: { count: number}[];
    price?: number | null;
}

//omit para esconder o id e o created_at
export type CreateEventDTO = Omit<Event, 'id' | 'created_at' | 'status'>;