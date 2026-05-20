import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input component', () => {
  it('renders label and forwards value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Input label="Nombre" value="" onChange={onChange} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    await user.type(input, 'abc');
    expect(onChange).toHaveBeenCalled();
  });
});
