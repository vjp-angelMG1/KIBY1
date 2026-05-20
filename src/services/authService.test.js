import * as authService from './authService';

describe('authService exports', () => {
  it('exporta funciones esperadas', () => {
    expect(typeof authService.loginWithEmailPassword).toBe('function');
    expect(typeof authService.registerWithEmailPassword).toBe('function');
    expect(typeof authService.loginWithGoogle).toBe('function');
    expect(typeof authService.logoutUser).toBe('function');
    expect(typeof authService.subscribeToAuthChanges).toBe('function');
  });
});
