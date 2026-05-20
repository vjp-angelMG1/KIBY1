import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CouponManager from '../../pages/CouponManager';

// 1. MOCKEAMOS LOS HOOKS Y SERVICIOS de los que depende este componente
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('.', () => ({
  CouponService: {
    getAll: jest.fn(),
    create: jest.fn(),
    toggleStatus: jest.fn(),
    delete: jest.fn()
  }
}));

// Importamos los mocks para poder cambiar sus valores en cada test
import { useAuth } from '../../context/AuthContext';
import { CouponService } from '.';

describe('CouponManager (Test de Integración)', () => {
  
  // Configuración base antes de cada test
  beforeEach(() => {
    // Simulamos que el usuario es Admin por defecto para estos tests
    useAuth.mockReturnValue({ user: { role: 'admin' } });
    // Simulamos que la BD devuelve una lista vacía de cupones al cargar
    CouponService.getAll.mockResolvedValue([]); 
  });

  it('debería mostrar el texto de "Gestión de Cupones" si es admin', async () => {
    // ARRANGE & ACT: Renderizamos el componente
    render(<CouponManager isAdmin={true} />);

    // ASSERT: Buscamos un texto en la pantalla virtual
    const titleElement = await screen.findByText('Gestión de Cupones');
    expect(titleElement).toBeInTheDocument();
  });

  it('debería abrir el modal de crear cupón al hacer clic en el botón el admin', async () => {
    // ARRANGE: El usuario simula interacciones reales
    const user = userEvent.setup();
    render(<CouponManager isAdmin={true} />);

    // ACT: Buscamos el botón y simulamos el clic
    const createButton = await screen.findByText('+ Crear Cupón');
    await user.click(createButton);

    // ASSERT: Si el modal se abrió, el título del modal debería ser visible ahora
    const modalTitle = await screen.findByText('Crear Nuevo Cupón');
    expect(modalTitle).toBeInTheDocument();
  });

  it('debería mostrar cupones si la BD devuelve datos', async () => {
    // ARRANGE: Simulamos que ahora SÍ hay cupones en la BD
    CouponService.getAll.mockResolvedValueOnce([
      { id: '1', code: 'TEST30', discount: 30, active: true }
    ]);

    // ACT: Renderizamos
    render(<CouponManager isAdmin={false} />); // Probamos como usuario normal

    // ASSERT: Debería verse el código del cupón en pantalla
    const couponCode = await screen.findByText('TEST30');
    expect(couponCode).toBeInTheDocument();
  });
});