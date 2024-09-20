/* eslint-disable import/first */

jest.mock('./components/UserProfile/UserProfile', () => ({
  __esModule: true,
  default: function MockUserProfile(props: { userId: string }) {
    return <div data-testid='user-profile'>Mocked User ID: {props.userId}</div>;
  },
}));

import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the App component with UserProfile', () => {
    render(<App />);

    const userProfile = screen.getByTestId('user-profile');
    expect(userProfile).toBeInTheDocument();
    expect(userProfile).toHaveTextContent('Mocked User ID: 123');
  });
});
