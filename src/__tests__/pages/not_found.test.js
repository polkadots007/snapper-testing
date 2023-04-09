import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';
import * as ROUTES from '../../constants/routes';
import NotFound from '../../pages/not_found';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../../services/firebase');

const succeedToSignOut = jest.fn(() => Promise.resolve('I am signed out!'));
const firebase = {
  auth: jest.fn(() => ({
    signOut: succeedToSignOut
  }))
};

const userLoggedIn = {
  uid: 1,
  displayName: 'priyansi',
  username: 'priyansi'
};

const noUserLoggedIn = null;

describe('<NotFound />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the not found page for a logged in user', () => {
    const { getByText } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <UserContext.Provider value={{ userLoggedIn }}>
            <NotFound />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    expect(document.title).toBe('Not Found - Instagram');
    expect(getByText('Not Found!')).toBeTruthy();
  });
  it('renders the not found page for any active but not logged in user', () => {
    const { getByText } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <UserContext.Provider value={{ noUserLoggedIn }}>
            <NotFound />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    expect(document.title).toBe('Not Found - Instagram');
    expect(getByText('Not Found!')).toBeTruthy();
  });
});
