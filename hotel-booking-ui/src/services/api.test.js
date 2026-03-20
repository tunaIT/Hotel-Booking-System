import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api from './api';
import { setToken, getToken, removeToken } from '../utils/token';
import MockAdapter from 'axios-mock-adapter';

const originalLocation = window.location;

describe('API Interceptors - Authentication Flow', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(api);
    removeToken();
    
    // Mock window.location for redirect test
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    mock.restore();
    window.location = originalLocation;
  });

  it('Requirement 1: Automatically attach Token to requests', async () => {
    const testToken = 'fake-jwt-token-123';
    setToken(testToken);

    mock.onGet('/test-auth').reply(200, { message: 'success' });

    const response = await api.get('/test-auth');
    
    // Assert token is in the Authorization header
    expect(response.config.headers.Authorization).toBe(`Bearer ${testToken}`);
  });

  it('Requirement 2: Auto logout when token expires (401 response)', async () => {
    const testToken = 'expired-token';
    setToken(testToken);

    mock.onGet('/protected-endpoint').reply(401, { message: 'Unauthorized' });

    try {
      await api.get('/protected-endpoint');
    } catch (error) {
      expect(error.response.status).toBe(401);
    }

    // Assert that the token is removed (Auto logout)
    expect(getToken()).toBeUndefined();
    // Assert that redirect to login is triggered
    expect(window.location.href).toBe('/login');
  });
});
