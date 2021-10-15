import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import flickrAPI from './utils/flickr-api.js'
import App from './App';
 
// tell Jest to use the mocked version
jest.mock('./utils/flickr-api.js');

test('render header', () => {
  render(<App />);
  const header = screen.getByText(/Flickr Phohto Stream/i);
  expect(header).toBeInTheDocument();
});

test('render search box', () => {
  render(<App />);
  const searcbox = screen.getByRole('search');
  expect(searcbox).toBeInTheDocument();
});

test('input search box', () => {
  render(<App />);
  const searcbox = screen.getByRole('search');
  userEvent.type(searcbox, '{selectall}christmas{enter}');
  expect(searcbox).toHaveValue('christmas');
});

test('render safe search', () => {
  render(<App />);
  const safesearch = screen.getByRole('list');
  expect(safesearch).toBeInTheDocument();
});

test('select safe search', () => {
  render(<App />);
  const safesearch = screen.getByRole('list');
  const moderate = screen.getByRole('option', {name: 'SafeSearch moderate'});
  userEvent.selectOptions(safesearch, '2');
  expect(moderate.selected).toBe(true);
});

test("api return error", async () => {
  render(<App />);

  const res = flickrAPI.mockResolvedValueOnce({
    stat: "fail",
    code: 3,
    message: "Parameterless searches have been disabled. Please use flickr.photos.getRecent instead."
  });

  await waitFor(() => {
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();  
    const loading = screen.queryByText('Loading...');
    expect(loading).toBeNull();     
  });
});