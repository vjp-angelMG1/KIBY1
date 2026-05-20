import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';

jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../services/authService', () => ({
  loginWithEmailPassword: jest.fn(),
  loginWithGoogle: jest.fn(),
  registerWithEmailPassword: jest.fn()
}));

describe('Login - render básico', () => {
  it('muestra el título y botón de Google', () => {
    const { useAuth } = require('../context/AuthContext');
    useAuth.mockReturnValue({ user: null });
    render(<Login />);
    expect(screen.getByText('Kiby')).toBeInTheDocument();
    expect(screen.getByText(/Continuar con Google|Registrarse con Google/)).toBeInTheDocument();
  });
});
