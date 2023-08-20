import React from 'react';
import { render, fireEvent, waitFor, screen, getAllByAltText } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../../pages/dashboard';
import UserContext from '../../context/user';
import FirebaseContext from '../../context/firebase';
import userFixture from '../../fixtures/logged_in_user_details';
import userDetailFixture from '../../fixtures/user_details';
import photosFixture from '../../fixtures/timeline_photos';
import suggestedProfiles from '../../fixtures/suggested_profiles';
import { getSuggestedProfiles } from '../../services/firebase';
import useUser from '../../hooks/use_user';
import usePhotos from '../../hooks/use_photos';
import * as ROUTES from '../../constants/routes';

jest.mock('../../services/firebase');
jest.mock('../../hooks/use_user');
jest.mock('../../hooks/use_photos');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: null
  }),
  useNavigate: () => mockNavigate
}));

const succeedToSignOut = jest.fn(() => Promise.resolve('I am signed out!'));
const firebase = {
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        update: jest.fn(() => Promise.resolve('User details updated'))
      }))
    }))
  })),
  auth: jest.fn(() => ({
    signOut: succeedToSignOut
  })),
  FieldValue: {
    arrayUnion: jest.fn(),
    arrayRemove: jest.fn()
  }
};

describe('<Dashboard />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('it renders the dashboard with a user profile for logged in user and follows a user from suggested profile', async () => {
    useUser.mockImplementation(() => ({ user: userFixture }));
    usePhotos.mockImplementation(() => ({ photos: photosFixture }));
    // get suggested profiles
    getSuggestedProfiles.mockImplementation(() => suggestedProfiles);
    const {
      getByText,
      getByTitle,
      getAllByText,
      queryByTestId,
      getByTestId,
      findByTestId,
      getByAltText,
      getAllByAltText
    } = render(
      <Router>
        <FirebaseContext.Provider
          value={{
            firebase: {
              firestore: jest.fn(() => ({
                collection: jest.fn(() => ({
                  doc: jest.fn(() => ({
                    update: jest.fn(() => Promise.resolve('User added'))
                  }))
                }))
              }))
            },
            FieldValue: {
              arrayUnion: jest.fn(),
              arrayRemove: jest.fn()
            }
          }}
        >
          <UserContext.Provider value={{ user: userDetailFixture }}>
            <Dashboard />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(async () => {
      expect(document.title).toEqual('Instagram');
      expect(getByAltText('Instagram')).toBeTruthy();
      expect(getByTitle('Sign Out')).toBeTruthy();
      expect(getAllByText('raphael')).toBeTruthy();
      expect(getAllByAltText('karl profile')).toBeTruthy();
      expect(getAllByText('Saint George and the Dragon')).toBeTruthy();
      expect(getByText('Suggestions for you')).toBeTruthy();
      // follows a user from suggested profile
      fireEvent.click(getByText('Follow'));
      // fireEvent.click(getByTestId('remove-profile-utH4EadD3gBUbQkdG6Da'))
      // likes a pic in timeline and unlikes it
      fireEvent.click(getByTestId('like-photo-494LKmaF03bUcYZ4xhNu'));
      await fireEvent.keyDown(getByTestId('like-photo-494LKmaF03bUcYZ4xhNu'), {
        key: 'Enter'
      });
      // focuses on input
      fireEvent.click(getByTestId('focus-input-494LKmaF03bUcYZ4xhNu'));

      // submit comment with valid string length
      fireEvent.change(getByTestId('add-comment-nJMT1l8msuNZ8tH3zvVI'), {
        target: { value: 'Great photo!' }
      });
      fireEvent.submit(getByTestId('add-comment-submit-nJMT1l8msuNZ8tH3zvVI'));
      // submit comment with invalid string length
      fireEvent.change(getByTestId('add-comment-nJMT1l8msuNZ8tH3zvVI'), {
        target: { value: '' }
      });
      // toggle focus
      fireEvent.keyDown(getByTestId('focus-input-494LKmaF03bUcYZ4xhNu'), {
        key: 'Enter'
      });
      fireEvent.submit(getByTestId('add-comment-submit-nJMT1l8msuNZ8tH3zvVI'));
      // view more comments
    });
  });
  it('it renders the dashboard with a user profile for logged in user and removes a user from suggested profile', async () => {
    useUser.mockImplementation(() => ({ user: userFixture }));
    usePhotos.mockImplementation(() => ({ photos: photosFixture }));
    // get suggested profiles
    getSuggestedProfiles.mockImplementation(() => suggestedProfiles);
    const {
      getByText,
      getByTitle,
      getAllByText,
      queryByTestId,
      getByTestId,
      findByTestId,
      getByAltText,
      getAllByAltText
    } = render(
      <Router>
        <FirebaseContext.Provider
          value={{
            firebase: {
              firestore: jest.fn(() => ({
                collection: jest.fn(() => ({
                  doc: jest.fn(() => ({
                    update: jest.fn(() => Promise.resolve('User added'))
                  }))
                }))
              }))
            },
            FieldValue: {
              arrayUnion: jest.fn(),
              arrayRemove: jest.fn()
            }
          }}
        >
          <UserContext.Provider value={{ user: userDetailFixture }}>
            <Dashboard />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(document.title).toEqual('Instagram');
      expect(getByAltText('Instagram')).toBeTruthy();
      expect(getByTitle('Sign Out')).toBeTruthy();
      expect(getAllByText('raphael')).toBeTruthy();
      expect(getAllByAltText('karl profile')).toBeTruthy();
      expect(getAllByText('Saint George and the Dragon')).toBeTruthy();
      expect(getByText('Suggestions for you')).toBeTruthy();
      fireEvent.click(getByTestId('remove-profile-utH4EadD3gBUbQkdG6Da'));
    });
  });
  it('it renders the dashboard with a user profile for user not logged in and triggers fallbacks', async () => {
    useUser.mockImplementation(() => ({ user: undefined }));
    usePhotos.mockImplementation(() => ({ photos: photosFixture }));
    // get suggested profiles
    getSuggestedProfiles.mockImplementation(() => suggestedProfiles);
    const {
      getByText,
      getByTitle,
      getAllByText,
      queryByTestId,
      getByTestId,
      findByTestId,
      getByAltText,
      getAllByAltText
    } = render(
      <Router>
        <FirebaseContext.Provider
          value={{
            firebase: {
              auth: jest.fn(() => ({
                signOut: succeedToSignOut
              }))
            }
          }}
        >
          <UserContext.Provider value={{ user: undefined }}>
            <Dashboard />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(getByAltText('Instagram')).toBeTruthy();
      expect(getByText('Log In')).toBeTruthy();
      expect(getByText('Sign Up')).toBeTruthy();
    });
  });
  it('it renders the dashboard with a user profile for logged in user and has no suggested profile', async () => {
    useUser.mockImplementation(() => ({ user: userFixture }));
    usePhotos.mockImplementation(() => ({ photos: photosFixture }));
    // get suggested profiles
    getSuggestedProfiles.mockImplementation(() => []);
    const { getByAltText, queryByText, getByTestId } = render(
      <Router>
        <FirebaseContext.Provider
          value={{
            firebase: {
              firestore: jest.fn(() => ({
                collection: jest.fn(() => ({
                  doc: jest.fn(() => ({
                    update: jest.fn(() => Promise.resolve('User added'))
                  }))
                }))
              }))
            },
            FieldValue: {
              arrayUnion: jest.fn(),
              arrayRemove: jest.fn()
            }
          }}
        >
          <UserContext.Provider value={{ user: userDetailFixture }}>
            <Dashboard />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(async () => {
      expect(document.title).toEqual('Instagram');
      expect(getByAltText('Instagram')).toBeTruthy();
      expect(queryByText('Suggestions for you')).toBeFalsy();
      // expect(items).toHaveLength(3);
      expect(getByTestId('view-more-comments-IE02ZQBloLtTeGAgwURO')).toBeTruthy();
      fireEvent.click(getByTestId('view-more-comments-IE02ZQBloLtTeGAgwURO'));
      await expect(getByTestId('Love this place, looks like my animal farm!-preeti')).toBeTruthy();
      fireEvent.keyDown(getByTestId('view-more-comments-IE02ZQBloLtTeGAgwURO'), {
        key: 'Enter'
      });
      await expect(getByTestId('OMFG!-karl')).toBeTruthy();
    });
  });
});
