import { createSelector } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
	const { id } = useParams();
	document.title = 'User';
	const dispatch = useDispatch<any>();
	const selectProperties = createSelector(
		(state: any) => state.User,
		(user) => ({
			user: user.user,
			error: user.error,
			loading: user.loading,
			historyUser: user.historyUser,
		})
	);
	return <></>;
};

export default UserDetail;
