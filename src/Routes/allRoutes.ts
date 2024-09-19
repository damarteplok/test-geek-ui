import Ecommerce from 'pages/Dashboards/Ecommerce';

import UserProfile from 'pages/Authentication/UserProfile';
import Login from 'pages/Authentication/Login';
import Logout from 'pages/Authentication/LogOut';
import Register from 'pages/Authentication/Register';
import Users from 'pages/Users/index';
import UserDetail from 'pages/Users/UserDetail';

interface RouteObject {
	path: string;
	component: React.ComponentType<any>;
	exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
	{ path: '/', component: Ecommerce },
	{ path: '/dashboard', component: Ecommerce },
	{ path: '/users', component: Users, exact: true },
	{ path: '/users/:id', component: UserDetail },
	{ path: '/user-profile', component: UserProfile },
];

const publicRoutes = [
	{ path: '/login', component: Login },
	{ path: '/logout', component: Logout },
	{ path: '/register', component: Register },
];

export { authProtectedRoutes, publicRoutes };
