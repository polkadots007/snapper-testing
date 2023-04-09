import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../../pages/login';
import FirebaseContext from '../../context/firebase';
import * as ROUTES from '../../constants/routes';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('<Login />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the login page with a form submission and logs the user in', async () => {
    const succeedToLogin = jest.fn(() => Promise.resolve('I am signed in!'));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: succeedToLogin
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      expect(document.title).toEqual('Login - Instagram');

      fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'priyansiparida07@gmail.com' }
      });

      fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: 'chanyeolo614P@' }
      });

      fireEvent.submit(getByTestId('login'));

      expect(succeedToLogin).toHaveBeenCalled();
      expect(succeedToLogin).toHaveBeenCalledWith('priyansiparida07@gmail.com', 'chanyeolo614P@');

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe('priyansiparida07@gmail.com');
        expect(getByPlaceholderText('Password').value).toBe('chanyeolo614P@');
        expect(queryByTestId('error')).toBeFalsy();
      });
    });
  });
  it('renders the login page with a form submission and fails to log the user in', async () => {
    const failToLogin = jest.fn(() => Promise.reject(new Error('Not Signed in!')));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: failToLogin
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );

    expect(document.title).toEqual('Login - Instagram');

    fireEvent.change(getByPlaceholderText('Email address'), {
      target: { value: 'priyansiparida07@gmail.com' }
    });

    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'test-password' }
    });

    fireEvent.submit(getByTestId('login'));

    expect(failToLogin).toHaveBeenCalled();
    expect(failToLogin).toHaveBeenCalledWith('priyansiparida07@gmail.com', 'test-password');

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
      expect(getByPlaceholderText('Email address').value).toBe('');
      expect(getByPlaceholderText('Password').value).toBe('');
      expect(queryByTestId('error')).toBeTruthy();
    });
  });
});
