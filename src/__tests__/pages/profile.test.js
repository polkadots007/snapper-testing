import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Profile from '../../pages/profile';
import UserContext from '../../context/user';
import FirebaseContext from '../../context/firebase';
import * as ROUTES from '../../constants/routes';
import useUser from '../../hooks/use_user';
import userFixture from '../../fixtures/logged_in_user_details';
import userDetailFixture from '../../fixtures/user_details';
import notFollowedUserFixture from '../../fixtures/not_followed_user';
import photosFixture from '../../fixtures/timeline_photos';
import {
  getUserByUsername,
  getUserPhotosByUserId,
  toggleFollow,
  isUserFollowingProfile
} from '../../services/firebase';

const mockNavigate = jest.fn();

const succeedToSignOut = jest.fn(() => Promise.resolve('I am signed out!'));
const firebase = {
  auth: jest.fn(() => ({
    signOut: succeedToSignOut
  }))
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    username: 'raphael'
  }),
  useNavigate: () => mockNavigate
}));

jest.mock('../../services/firebase');
jest.mock('../../hooks/use_user');

describe('<Profile />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the profile page of a user to a logged in user', async () => {
    // await act(async () => {
    getUserByUsername.mockImplementation(() => [userFixture]);
    getUserPhotosByUserId.mockImplementation(() => photosFixture);
    useUser.mockImplementation(() => ({ user: userFixture }));
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
          <UserContext.Provider value={{ user: userDetailFixture }}>
            <Profile />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.NOT_FOUND);
      expect(getUserByUsername).toHaveBeenCalled();
      expect(getUserByUsername).toHaveBeenCalledWith('raphael');
      expect(getByTitle('Sign Out')).toBeTruthy();
      expect(getAllByAltText('karl profile')).toBeTruthy();
      expect(getByText('karl')).toBeTruthy();
      expect(getByText('Karl Hadwen')).toBeTruthy();
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === '5 Photos';
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));
        return nodeHasText && childrenDontHaveText;
      });
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === '3 Followers';
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));
        return nodeHasText && childrenDontHaveText;
      });
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === '1 Following';
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));
        return nodeHasText && childrenDontHaveText;
      });
      fireEvent.click(getByTitle('Sign Out'));
      fireEvent.keyDown(getByTitle('Sign Out'), {
        key: 'Enter'
      });
    });
    // });
  });
  it('renders the profile page of a user to the logged out user', async () => {
    getUserByUsername.mockImplementation(() => [userFixture]);
    getUserPhotosByUserId.mockImplementation(() => photosFixture);
    useUser.mockImplementation(() => ({ user: userFixture }));
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
            <Profile />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.NOT_FOUND);
      expect(getUserByUsername).toHaveBeenCalled();
      expect(getUserByUsername).toHaveBeenCalledWith('raphael');
      expect(getByTitle('Log In')).toBeTruthy();
      expect(getByTitle('Sign Up')).toBeTruthy();
      expect(getAllByAltText('karl profile')).toBeTruthy();
      expect(getByText('karl')).toBeTruthy();
      expect(getByText('Karl Hadwen')).toBeTruthy();
    });
  });
  it('renders the profile page of a user to the logged in user and follows/unfollows user', async () => {
    getUserByUsername.mockImplementation(() => [notFollowedUserFixture]);
    getUserPhotosByUserId.mockImplementation(() => photosFixture);
    useUser.mockImplementation(() => ({ user: userFixture }));
    toggleFollow.mockImplementation(() => 'Toggle Follow');
    isUserFollowingProfile.mockImplementation(() => false);
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
          <UserContext.Provider value={{ user: userDetailFixture }}>
            <Profile />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.NOT_FOUND);
      expect(getUserByUsername).toHaveBeenCalled();
      expect(getUserByUsername).toHaveBeenCalledWith('raphael');
      expect(getByTitle('Sign Out')).toBeTruthy();
      expect(getAllByAltText('raphael profile')).toBeTruthy();
      expect(getByText('raphael')).toBeTruthy();
      expect(getByText('Raffaello Sanzio da Urbino')).toBeTruthy();
      expect(getByText('Follow')).toBeTruthy();
      fireEvent.click(getByTestId('follow-status-btn'));
      expect(toggleFollow).toHaveBeenCalled();
      expect(getByText('Unfollow')).toBeTruthy();
      fireEvent.keyDown(getByTestId('follow-status-btn'), {
        key: 'Enter'
      });
      expect(toggleFollow).toHaveBeenCalled();
    });
  });
  it('renders the profile page of an invalid user triggering redirect', async () => {
    getUserByUsername.mockImplementation(() => []);
    getUserPhotosByUserId.mockImplementation(() => photosFixture);
    useUser.mockImplementation(() => ({ user: userFixture }));
    const { getByText } = render(
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
          <UserContext.Provider value={{ user: userDetailFixture }}>
            <Profile />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );
    await waitFor(async () => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NOT_FOUND);
    });
  });
});
