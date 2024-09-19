import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'slices/thunk';
import { Navigate } from 'react-router-dom';
import { RootState } from 'slices';
import { createSelector } from 'reselect';

interface SelectLogoutState {
	isUserLogout: boolean;
}

const Logout: React.FC = () => {
	const dispatch = useDispatch<any>();

	const selectLogout = createSelector(
		(state: RootState) => state.Login as SelectLogoutState,
		(login) => ({
			isUserLogout: login.isUserLogout,
		})
	);

	const { isUserLogout } = useSelector(selectLogout);

	React.useEffect(() => {
		dispatch(logoutUser());
	}, [dispatch]);

	return isUserLogout ? <Navigate to='/login' /> : null;
};

export default Logout;
