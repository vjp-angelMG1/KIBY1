import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfile from './Profile';

jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../services/data', () => ({ ModuleService: { getMyModules: jest.fn() } }));

import { useAuth } from '../context/AuthContext';
import { ModuleService } from '../services/data';

describe('Profile', () => {
  it('muestra vista admin cuando el usuario es admin', () => {
    useAuth.mockReturnValue({ user: { role: 'admin', fullName: 'Admin' }, logout: jest.fn() });
    ModuleService.getMyModules.mockResolvedValue([]);
    render(<UserProfile />);
    expect(screen.getByText('Mi Cuenta')).toBeInTheDocument();
    expect(screen.getByText('🎛️ Panel de Control')).toBeInTheDocument();
  });

  it('muestra vista de usuario sin módulos', () => {
    useAuth.mockReturnValue({ user: { role: 'student', fullName: 'User' }, logout: jest.fn() });
    ModuleService.getMyModules.mockResolvedValue([]);
    render(<UserProfile />);
    expect(screen.getByText('Mi Cuenta')).toBeInTheDocument();
    expect(screen.getByText('Tu viaje comienza aquí')).toBeInTheDocument();
  });
});
