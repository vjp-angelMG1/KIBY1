import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

jest.mock('../services/authService', () => ({
  subscribeToAuthChanges: jest.fn(),
  logoutUser: jest.fn(),
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn()
}));

const authService = require('../services/authService');
const firestore = require('firebase/firestore');

const TestComponent = () => {
  const { user, loading, logout } = useAuth();
  return <div>{loading ? 'loading' : user ? user.role : 'nouser'}</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('proporciona usuario null cuando no hay sesión', async () => {
    authService.subscribeToAuthChanges.mockImplementation((cb) => {
      cb(null);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByText('nouser')).toBeInTheDocument();
    expect(firestore.getDoc).not.toHaveBeenCalled();
  });

  it('proporciona usuario admin cuando el documento existe', async () => {
    authService.subscribeToAuthChanges.mockImplementation((cb) => {
      cb({ uid: 'u1', email: 'a@a.com' });
      return () => {};
    });

    firestore.getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ role: 'admin' }) });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByText('admin')).toBeInTheDocument();
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  it('crea usuario con rol user cuando no existe el documento', async () => {
    authService.subscribeToAuthChanges.mockImplementation((cb) => {
      cb({ uid: 'u2', email: 'user@a.com' });
      return () => {};
    });

    firestore.getDoc.mockResolvedValueOnce({ exists: () => false });
    firestore.setDoc.mockResolvedValueOnce();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByText('user')).toBeInTheDocument();
    expect(firestore.setDoc).toHaveBeenCalledTimes(1);
  });
});
