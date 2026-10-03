import { render, screen, fireEvent, within, act } from '@testing-library/react';
import App from './App';

// Die Snippet-Suche ist in den Oberflächentests nicht das Thema.
jest.mock('./helperFunctions/fetchPreview', () => ({
  __esModule: true,
  default: () => Promise.resolve(null)
}));

// Startet eine Richtung und lässt die (gemockte) Snippet-Suche auslaufen,
// damit React keine Zustandsänderung außerhalb von act() meldet.
async function startGenre(name) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(name, 'i') }));
  await act(async () => {});
}

test('the start screen offers both music styles', () => {
  render(<App />);

  expect(screen.getByText(/Wähle deine Musikrichtung/i)).toBeInTheDocument();
  expect(screen.getByText('Techno & Elektro')).toBeInTheDocument();
  expect(screen.getByText('Oldschool HipHop')).toBeInTheDocument();
});

test('the artist step comes first, the year step unlocks after it', async () => {
  render(<App />);
  await startGenre('Techno & Elektro');

  expect(screen.getByText(/Welche Gruppe\?/i)).toBeInTheDocument();
  expect(screen.getByText(/Erst die Gruppe tippen\./i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Erst tippen/i })).toBeDisabled();
});

test('each style brings its own timeline', async () => {
  const { unmount } = render(<App />);
  await startGenre('Techno & Elektro');
  const technoYears = screen.getAllByText(/^'\d\d$/).map(el => el.textContent);
  expect(technoYears[0]).toBe("'90");
  expect(technoYears).toHaveLength(10);
  unmount();

  render(<App />);
  await startGenre('Oldschool HipHop');
  const hiphopYears = screen.getAllByText(/^'\d\d$/).map(el => el.textContent);
  expect(hiphopYears[0]).toBe("'79");
  expect(hiphopYears[hiphopYears.length - 1]).toBe("'96");
});

test('the chosen style themes the page', async () => {
  render(<App />);
  expect(document.body.dataset.theme).toBe('neutral');

  await startGenre('Oldschool HipHop');
  expect(document.body.dataset.theme).toBe('hiphop');
});

test('a round can be played through to the reveal', async () => {
  render(<App />);
  await startGenre('Techno & Elektro');

  const artistStep = screen.getByText(/Welche Gruppe\?/i).closest('section');
  fireEvent.click(within(artistStep).getAllByRole('button')[0]);
  fireEvent.click(screen.getAllByText(/^'\d\d$/)[3]);
  fireEvent.click(screen.getByRole('button', { name: /^Auflösen$/ }));

  expect(screen.getByText(/von 5 Punkten/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Nächster Track|Endstand ansehen/ })).toBeInTheDocument();
});
