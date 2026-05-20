import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CouponManager from './CouponManager';

// 1. MOCKEAMOS las dependencias del componente
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../services/data', () => ({
  CouponService: {
    getAll: jest.fn(),
    create: jest.fn(),
    toggleStatus: jest.fn(),
    delete: jest.fn()
  }
}));

import { useAuth } from '../context/AuthContext';
import { CouponService } from '../services/data';

describe('CouponManager - Tests de Integración', () => {

  beforeEach(() => {
    // Por defecto, simulamos que no hay cupones en la BD
    CouponService.getAll.mockResolvedValue([]);
  });

  it('1. Debería mostrar "No hay cupones" si la BD está vacía (como usuario normal)', async () => {
    // ARRANGE: Simulamos un usuario normal
    useAuth.mockReturnValue({ user: { role: 'user' } });
    
    // ACT: Renderizamos el componente pasando isAdmin=false
    render(<CouponManager isAdmin={false} />);

    // ASSERT: Buscamos el texto de lista vacía
    const emptyMessage = await screen.findByText('No hay cupones disponibles actualmente.');
    expect(emptyMessage).toBeInTheDocument();
    // El botón de crear NO debe existir
    expect(screen.queryByText('+ Crear Cupón')).not.toBeInTheDocument();
  });

  it('2. Como Admin, debería abrir el modal al hacer clic en "Crear Cupón"', async () => {
    // ARRANGE: Simulamos un admin
    useAuth.mockReturnValue({ user: { role: 'admin' } });
    const user = userEvent.setup(); // Inicializamos el simulador de eventos

    render(<CouponManager isAdmin={true} />);

    // ACT: Buscamos el botón y hacemos clic
    const createButton = await screen.findByText('+ Crear Cupón');
    await user.click(createButton);

    // ASSERT: El título del modal debe aparecer
    const modalTitle = await screen.findByText('Crear Nuevo Cupón');
    expect(modalTitle).toBeInTheDocument();
  });

  it('3. Debería mostrar los cupones activos devueltos por el servicio', async () => {
    // ARRANGE: Simulamos que el servicio devuelve un cupón
    CouponService.getAll.mockResolvedValueOnce([
      { id: '1', code: 'PROMO50', discount: 50, active: true }
    ]);
    useAuth.mockReturnValue({ user: { role: 'user' } });

    // ACT
    render(<CouponManager isAdmin={false} />);

    // ASSERT: El código del cupón debe renderizarse en la tarjeta
    const couponCode = await screen.findByText('PROMO50');
    expect(couponCode).toBeInTheDocument();
    // El descuento también
    expect(screen.getByText('-50%')).toBeInTheDocument();
  });
});