import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from 'slices/auth/authprotected/thunk';
import { createSelector } from '@reduxjs/toolkit';
import { resetStore } from 'slices/thunk';

interface AuthProtectedProps {
	children: React.ReactNode;
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
	const dispatch = useDispatch<any>();
	const navigate = useNavigate();

	const selectAuth = createSelector(
		(state: any) => state.AuthProtected,
		(auth) => ({
			isAuthenticated: auth.isAuthenticated,
			error: auth.error,
			loading: auth.loading,
		})
	);

	const { isAuthenticated, error } = useSelector(selectAuth);

	useEffect(() => {
		if (isAuthenticated === null) {
			dispatch(checkAuthStatus());
		} else if (isAuthenticated === false && error) {
			navigate('/');
			dispatch(resetStore());
		}
	}, [dispatch, isAuthenticated]);

	if (isAuthenticated === false) {
		return <Navigate to={{ pathname: '/login' }} />;
	}

	return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProtected;
