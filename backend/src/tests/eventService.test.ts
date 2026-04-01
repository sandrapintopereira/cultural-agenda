import { describe, it, expect, vi, beforeEach } from 'vitest';
import eventService from '../services/eventService.js';
import { supabase } from '../config/supabase.js';

vi.mock('../config/supabase.js', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const mockChain = (overrides: Record<string, unknown> = {}) => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    ...overrides,
  };
  vi.mocked(supabase.from).mockReturnValue(chain as any);
  return chain;
};

//getEvents
describe('eventService - getEvents', () => {
  beforeEach(() => { vi.clearAllMocks() });

  it('deve retornar lista de eventos aprovados', async () => {
    const mockEvents = [
      { id: '1', title: 'Concerto de Jazz', status: 'approved' },
    ];
    mockChain({
      order: vi.fn().mockResolvedValue({ data: mockEvents, error: null }),
    });

    const result = await eventService.getEvents();

    expect(supabase.from).toHaveBeenCalledWith('events');
    expect(result).toEqual(mockEvents);
  });

  it('deve retornar Error quando o Supabase falha', async () => {
    mockChain({
      order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    });

    const result = await eventService.getEvents();

    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('DB error');
  });
});

//getEventById
describe('eventService - getEventById', () => {
  beforeEach(() => { vi.clearAllMocks() });

  it('deve retornar um evento pelo id', async () => {
    const mockEvent = { id: '42', title: 'Exposição de Fotografia' };
    mockChain({
      single: vi.fn().mockResolvedValue({ data: mockEvent, error: null }),
    });

    const result = await eventService.getEventById('42');

    expect(supabase.from).toHaveBeenCalledWith('events');
    expect(result).toEqual(mockEvent);
  });

  it('deve retornar Error quando o evento não existe', async () => {
    mockChain({
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    });

    const result = await eventService.getEventById('999');

    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('Not found');
  });
});

//createEvent
describe('eventService - createEvent', () => {
  beforeEach(() => { vi.clearAllMocks() });

  const validPayload = {
    title: 'Leitura Pública',
    type: 'reading',
    date: '2099-12-01',
    time: '18:00',
    location: 'Lisboa',
    description: 'Uma leitura aberta ao público.',
    is_free: true,
    user_id: 'user-123',
  };

  it('deve criar um evento com sucesso', async () => {
    const mockEvent = { id: '1', ...validPayload };
    mockChain({
      single: vi.fn().mockResolvedValue({ data: mockEvent, error: null }),
    });

    const result = await eventService.createEvent(validPayload);

    expect(supabase.from).toHaveBeenCalledWith('events');
    expect(result).toEqual(mockEvent);
  });

  it('deve lançar erro para tipo de evento inválido', async () => {
    await expect(
      eventService.createEvent({ ...validPayload, type: 'festival' })
    ).rejects.toThrow('Invalid event type');

    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('deve lançar erro para data no passado', async () => {
    await expect(
      eventService.createEvent({ ...validPayload, date: '2000-01-01' })
    ).rejects.toThrow('Event date must be in the future');

    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('deve retornar Error quando o Supabase falha na inserção', async () => {
    mockChain({
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
    });

    const result = await eventService.createEvent(validPayload);

    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('Insert failed');
  });
});