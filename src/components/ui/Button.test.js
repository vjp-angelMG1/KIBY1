import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button component', () => {
  it('renders children and handles click', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
    await user.click(screen.getByText('Click Me'));
    expect(onClick).toHaveBeenCalled();
  });
});
