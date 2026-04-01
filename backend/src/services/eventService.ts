import { supabase } from '../config/supabase.js';

const eventService = {

  async getEvents() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('events')
      .select('*, attendances(count)')
      .eq('status', 'approved')
      .gte('date', today)
      .order('date', { ascending: true });

    if (error) return new Error(error.message);
    return data;
  },

  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*, attendances(count)')
      .eq('id', id)
      .single();

    if (error) return new Error(error.message);
    return data;
  },

  async createEvent(payload: {
    title: string;
    type: string;
    date: string;
    time: string;
    location: string;
    description: string;
    is_free: boolean;
    user_id: string;
  }) {
    const validTypes = ['concert', 'exhibition', 'reading', 'theatre', 'other'];
    if (!validTypes.includes(payload.type)) {
      throw new Error('Invalid event type');
    }

    const eventDate = new Date(payload.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
      throw new Error('Event date must be in the future');
    }

    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()
      .single();

    if (error) return new Error(error.message);
    return data;
  },
};

export default eventService;