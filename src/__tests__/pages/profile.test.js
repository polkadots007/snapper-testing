import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../../pages/profile';
import FirebaseContext from '../../context/firebase';
import * as ROUTES from '../../constants/routes';
import { getUserByUsername, getUserPhotosByUserId } from '../../services/firebase';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockParams
}));

jest.mock('../../services/firebase');
jest.mock('../../hooks/use_user');

describe('<Profile />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the profile page of a loggedin user to the user themselves', () => {});
});
