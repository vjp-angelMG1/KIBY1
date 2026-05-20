import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('./pages/Login', () => () => <div>LoginPage</div>);
jest.mock('./pages/Catalog', () => () => <div>CatalogPage</div>);
jest.mock('./pages/CouponManager', () => () => <div>CouponManagerPage</div>);
jest.mock('./pages/AdminPanel', () => () => <div>AdminPanelPage</div>);
jest.mock('./pages/Profile', () => () => <div>ProfilePage</div>);
jest.mock('./pages/Checkout', () => () => <div>CheckoutPage</div>);
jest.mock('./pages/ModuleDetail', () => () => <div>ModuleDetailPage</div>);
jest.mock('react-hot-toast', () => ({ Toaster: () => <div /> }));

const { useAuth } = require('./context/AuthContext');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el mensaje de carga mientras la app se inicializa', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    render(<App />);
    expect(screen.getByText('Cargando aplicación...')).toBeInTheDocument();
  });

  it('muestra la página de login cuando no hay usuario', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    render(<App />);
    expect(screen.getByText('LoginPage')).toBeInTheDocument();
  });

  it('muestra el catálogo para un usuario normal', () => {
    useAuth.mockReturnValue({ user: { role: 'user', purchases: [] }, loading: false });
    render(<App />);
    expect(screen.getByText('CatalogPage')).toBeInTheDocument();
    expect(screen.queryByText('AdminPanelPage')).not.toBeInTheDocument();
  });

  it('muestra el panel admin para un usuario admin', () => {
    useAuth.mockReturnValue({ user: { role: 'admin', purchases: [] }, loading: false });
    render(<App />);
    expect(screen.getByText('AdminPanelPage')).toBeInTheDocument();
  });
});
