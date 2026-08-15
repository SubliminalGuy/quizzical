import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('start screen offers the game', () => {
  render(<App />);
  expect(screen.getByText(/Ratespiel für 90er Techno/i)).toBeInTheDocument();
});

test('the artist step comes first, the year step unlocks after it', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Auflegen/i }));

  expect(screen.getByText(/Welche Gruppe\?/i)).toBeInTheDocument();
  expect(screen.getByText(/Erst die Gruppe tippen\./i)).toBeInTheDocument();

  const resolveButton = screen.getByRole('button', { name: /Erst tippen/i });
  expect(resolveButton).toBeDisabled();
});
