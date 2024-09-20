import { render, screen } from '@testing-library/react';
import UserProfile from '../UserProfile/UserProfile';
import fetchMock from 'jest-fetch-mock';

describe('UserProfile Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('displays loading state initially', () => {
    render(<UserProfile userId='123' />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays user data after successful fetch', async () => {
    const mockUserData = { name: 'Pim Piyajiranan', email: 'pim@gmail.com' };
    fetchMock.mockResponseOnce(JSON.stringify(mockUserData));

    render(<UserProfile userId='123' />);

    expect(await screen.findByText('Pim Piyajiranan')).toBeInTheDocument();
    expect(screen.getByText('Email: pim@gmail.com')).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    fetchMock.mockResponseOnce('', { status: 404 });

    render(<UserProfile userId='123' />);

    expect(
      await screen.findByText('Error: Failed to fetch user data')
    ).toBeInTheDocument();
  });

  test('displays error message on network error', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    render(<UserProfile userId='123' />);

    expect(await screen.findByText('Error: Network error')).toBeInTheDocument();
  });
});
