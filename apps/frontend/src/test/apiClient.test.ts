import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../services/apiClient';
import { API_BASE_URL } from '../config/api';

describe('API Client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should make a GET request to the correct URL', async () => {
    const mockResponse = { data: 'test' };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await api.get('/test-endpoint');

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/test-endpoint`, expect.objectContaining({
      method: 'GET',
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should make a POST request with body', async () => {
    const mockResponse = { success: true };
    const body = { name: 'Aura' };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await api.post('/test-post', body);

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/test-post`, expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(body),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should throw error on non-ok response', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(api.get('/not-found')).rejects.toThrow('API 404: Not Found');
  });
});
