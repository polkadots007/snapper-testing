import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import SignUp from '../../pages/sign_up';
import FirebaseContext from '../../context/firebase';
import * as ROUTES from '../../constants/routes';
import { doesUsernameExist } from '../../services/firebase';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../../services/firebase');

describe('<SignUp />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the signup page with a form submission and signs a new user up', async () => {
    const firebase = {
      firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
          add: jest.fn(() => Promise.resolve('User Created!'))
        }))
      })),
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() => ({
          user: { updateProfile: jest.fn(() => Promise.resolve('I am signed up!')) }
        }))
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve(false));

      expect(document.title).toEqual('Sign Up - Instagram');

      await fireEvent.change(getByPlaceholderText('Username'), {
        target: { value: 'priyansi' }
      });

      await fireEvent.change(getByPlaceholderText('Full Name'), {
        target: { value: 'Priyansi Parida' }
      });

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'priyansiparida@gmail.com' }
      });

      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: 'password' }
      });

      fireEvent.submit(getByTestId('signup'));

      await expect(doesUsernameExist).toHaveBeenCalled();
      await expect(doesUsernameExist).toHaveBeenCalledWith('priyansi');

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Username').value).toBe('priyansi');
        expect(getByPlaceholderText('Full Name').value).toBe('Priyansi Parida');
        expect(getByPlaceholderText('Email address').value).toBe('priyansiparida@gmail.com');
        expect(getByPlaceholderText('Password').value).toBe('password');
        expect(queryByTestId('error')).toBeFalsy();
      });
    });
  });
  it('renders the signup page with a form submission and throws an error for an existing username', async () => {
    const firebase = {
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() => ({
          user: { updateProfile: jest.fn(() => Promise.resolve({})) }
        }))
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    doesUsernameExist.mockImplementation(() => Promise.resolve(true));

    expect(document.title).toEqual('Sign Up - Instagram');

    fireEvent.change(getByPlaceholderText('Username'), {
      target: { value: 'priyansi07' }
    });

    fireEvent.change(getByPlaceholderText('Full Name'), {
      target: { value: 'Priyansi Parida' }
    });

    fireEvent.change(getByPlaceholderText('Email address'), {
      target: { value: 'priyansiparida@gmail.com' }
    });

    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'password' }
    });

    fireEvent.submit(getByTestId('signup'));

    expect(doesUsernameExist).toHaveBeenCalled();
    expect(doesUsernameExist).toHaveBeenCalledWith('priyansi07');

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
      expect(getByPlaceholderText('Username').value).toBe('');
      expect(getByPlaceholderText('Full Name').value).toBe('');
      expect(getByPlaceholderText('Email address').value).toBe('');
      expect(getByPlaceholderText('Password').value).toBe('');
      expect(queryByTestId('error')).toBeTruthy();
    });
  });
  it('renders the signup page with a form submission and firebase throws an error', async () => {
    const firebase = {
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() => ({
          user: { updateProfile: jest.fn(() => Promise.reject(new Error('Username exists'))) }
        }))
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    doesUsernameExist.mockImplementation(() => Promise.resolve(false));

    expect(document.title).toEqual('Sign Up - Instagram');

    fireEvent.change(getByPlaceholderText('Username'), {
      target: { value: 'priyansi07' }
    });

    fireEvent.change(getByPlaceholderText('Full Name'), {
      target: { value: 'Priyansi Parida' }
    });

    fireEvent.change(getByPlaceholderText('Email address'), {
      target: { value: 'priyansiparida@gmail.com' }
    });

    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'password' }
    });

    fireEvent.submit(getByTestId('signup'));

    expect(doesUsernameExist).toHaveBeenCalled();
    expect(doesUsernameExist).toHaveBeenCalledWith('priyansi07');

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
      expect(getByPlaceholderText('Username').value).toBe('');
      expect(getByPlaceholderText('Full Name').value).toBe('');
      expect(getByPlaceholderText('Email address').value).toBe('');
      expect(getByPlaceholderText('Password').value).toBe('');
      expect(queryByTestId('error')).toBeTruthy();
    });
  });
});
