import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminPanel from './AdminPanel';

jest.mock('../services/data', () => ({
  ModuleService: { getAll: jest.fn() },
  CouponService: { create: jest.fn() }
}));

import { ModuleService } from '../services/data';

describe('AdminPanel - Básicos', () => {
  beforeEach(() => {
    ModuleService.getAll.mockResolvedValue([]);
  });

  it('muestra encabezado y botones principales', async () => {
    render(<AdminPanel />);

    const heading = await screen.findByText('Panel de Administración');
    expect(heading).toBeInTheDocument();

    expect(screen.getByText('Módulos Creados')).toBeInTheDocument();
    expect(screen.getByText('+ Nuevo Módulo')).toBeInTheDocument();
    expect(screen.getByText('🎫 Crear Cupón')).toBeInTheDocument();
  });
});
