import React from 'react';
import { render, screen } from '@testing-library/react';
import Checkout from './Checkout';

jest.mock('../services/data', () => ({
  CouponService: { getAll: jest.fn() }
}));

// Default mock for react-router-dom; some tests will re-import the module in isolation
let mockLocation = { state: undefined };
jest.mock('react-router-dom', () => ({
  useLocation: () => mockLocation,
  useNavigate: () => jest.fn()
}));

import { CouponService } from '../services/data';

describe('Checkout - comportamiento básico', () => {
  it('muestra mensaje cuando no hay módulo seleccionado', () => {
    render(<Checkout onPurchase={() => {}} goBack={() => {}} />);
    expect(screen.getByText('No hay módulo seleccionado')).toBeInTheDocument();
    expect(screen.getByText('🛒 Ir a la Tienda')).toBeInTheDocument();
  });

  it('muestra detalles del módulo cuando se pasa por location.state', () => {
    // Reconfigure the mocked location to include module data and render
    mockLocation = { state: { module: { title: 'Modulo X', price: 25, img: '' , category: 'Cat'} } };
    const CheckoutWithModule = require('./Checkout').default;
    render(<CheckoutWithModule onPurchase={() => {}} goBack={() => {}} />);
    expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
    expect(screen.getByText('Modulo X')).toBeInTheDocument();
    expect(screen.getByText('25€')).toBeInTheDocument();
  });
});
