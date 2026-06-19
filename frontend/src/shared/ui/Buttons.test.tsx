import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PinkButton, WhiteButton, SquareButton, InfoButton } from './Buttons';

describe('Buttons', () => {
  describe('PinkButton', () => {
    it('renders with text', () => {
      render(<PinkButton text="Нажми меня" />);
      expect(screen.getByRole('button', { name: /нажми меня/i })).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<PinkButton text="Click" onClick={onClick} />);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
      render(<PinkButton text="Disabled" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<PinkButton text="Disabled" disabled />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('opacity-50');
      expect(button.className).toContain('cursor-not-allowed');
    });

    it('applies custom className', () => {
      render(<PinkButton text="Custom" className="my-custom-class" />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('my-custom-class');
    });
  });

  describe('WhiteButton', () => {
    it('renders with text', () => {
      render(<WhiteButton text="Белый" />);
      expect(screen.getByRole('button', { name: /белый/i })).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<WhiteButton text="Click" onClick={onClick} />);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('SquareButton', () => {
    it('renders with text', () => {
      render(<SquareButton text="Квадрат" />);
      expect(screen.getByRole('button', { name: /квадрат/i })).toBeInTheDocument();
    });

    it('does not have rounded class', () => {
      render(<SquareButton text="Square" />);
      const button = screen.getByRole('button');
      expect(button.className).not.toContain('rounded-4xl');
    });
  });

  describe('InfoButton', () => {
    it('renders with text and arrow image', () => {
      render(<InfoButton text="Подробнее" />);
      expect(screen.getByRole('button', { name: /подробнее/i })).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<InfoButton text="Info" onClick={onClick} />);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});