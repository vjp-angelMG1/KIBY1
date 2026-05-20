import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedAdminRoute from './ProtectedAdminRoute';

jest.mock('../../context/AuthContext', () => ({ useAuth: jest.fn() }));
import { useAuth } from '../../context/AuthContext';

describe('ProtectedAdminRoute', () => {
  it('muestra loading cuando loading es true', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    render(<ProtectedAdminRoute><div>Admin</div></ProtectedAdminRoute>);
    expect(screen.getByText('Cargando permisos...')).toBeInTheDocument();
  });

  it('redirige cuando no es admin', () => {
    useAuth.mockReturnValue({ user: { role: 'user' }, loading: false });
    render(<ProtectedAdminRoute><div>Admin</div></ProtectedAdminRoute>);
    expect(screen.getByText(/navigate-to:/)).toBeInTheDocument();
  });

  it('renderiza hijos cuando es admin', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' }, loading: false });
    render(<ProtectedAdminRoute><div>AdminArea</div></ProtectedAdminRoute>);
    expect(screen.getByText('AdminArea')).toBeInTheDocument();
  });
});
