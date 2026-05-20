import React from 'react';
import { render, screen } from '@testing-library/react';
import Catalog from './Catalog';

// Mocks
jest.mock('../services/data', () => ({
  ModuleService: {
    getAll: jest.fn()
  }
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  Link: ({ children }) => <div>{children}</div>
}));

import { ModuleService } from '../services/data';

describe('Catalog - Tests de Integración', () => {

  const mockModules = [
    { id: 'mod1', title: 'React Avanzado', desc: 'Curso de React', category: 'Programación', price: 50, img: 'url.jpg', features: [] },
    { id: 'mod2', title: 'Firebase Basico', desc: 'Curso de Firebase', category: 'Backend', price: 0, img: 'url2.jpg', features: [] }
  ];

  it('1. Debería mostrar los módulos obtenidos del servicio', async () => {
    // ARRANGE
    ModuleService.getAll.mockResolvedValueOnce(mockModules);

    // ACT: Renderizamos pasando un usuario normal sin compras
    render(<Catalog isAdmin={false} userPurchases={[]} />);

    // ASSERT: Los títulos deben estar en pantalla
    expect(await screen.findByText('React Avanzado')).toBeInTheDocument();
    expect(screen.getByText('Firebase Basico')).toBeInTheDocument();
    
    // Como no están comprados, deben mostrar los botones de acción
    expect(screen.getByText('⚡ Ver Detalles')).toBeInTheDocument(); // Módulo de pago
    expect(screen.getByText('🚀 Unirse Gratis')).toBeInTheDocument(); // Módulo gratis
  });

  it('2. Debería mostrar "✅ Ver Módulo" si el usuario ya lo compró', async () => {
    // ARRANGE
    ModuleService.getAll.mockResolvedValueOnce(mockModules);
    // El usuario ya compró el 'mod1'
    const purchases = ['mod1']; 

    // ACT
    render(<Catalog isAdmin={false} userPurchases={purchases} />);

    // ASSERT: El módulo 1 debe tener el botón de adquirido
    expect(await screen.findByText('✅ Ver Módulo')).toBeInTheDocument();
  });
});