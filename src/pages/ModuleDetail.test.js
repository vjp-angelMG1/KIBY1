import React from 'react';
import { render, screen } from '@testing-library/react';
import ModuleDetail from './ModuleDetail';

jest.mock('../services/data', () => ({ ModuleService: { getAll: jest.fn() } }));
jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('react-router-dom', () => ({ useParams: () => ({ moduloId: 'mod1' }), useNavigate: () => jest.fn() }));

import { ModuleService } from '../services/data';
import { useAuth } from '../context/AuthContext';

describe('ModuleDetail', () => {
  beforeEach(() => {
    ModuleService.getAll.mockResolvedValue([{ id: 'mod1', title: 'Module One', desc: 'Desc', price: 10, img: '', category: 'Cat' }]);
    useAuth.mockReturnValue({ user: { purchases: [], role: 'student' } });
  });

  it('muestra título y descripción del módulo', async () => {
    render(<ModuleDetail />);
    expect(await screen.findByText('Module One')).toBeInTheDocument();
    expect(screen.getByText('Descripción del Módulo')).toBeInTheDocument();
  });
});
