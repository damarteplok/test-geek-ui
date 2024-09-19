import axios from 'axios';
import NProgress from 'nprogress';
import { store } from '../index';
import { resetStore } from 'slices/thunk';

axios.defaults.baseURL = '';
axios.defaults.headers.post['Content-Type'] = 'application/json';

/**
 * contoh untuk set header di api helper
 *
 * const authUser: any = localStorage.getItem('authUser');
 * const token = JSON.parse(authUser) ? JSON.parse(authUser).token : null;
 * if (token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
 */

/**
 *
 * contoh untuk set cookies
 *
 */
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
	NProgress.configure({ showSpinner: false });
	NProgress.start();
	return config;
});

axios.interceptors.response.use(
	function (response) {
		NProgress.done();
		return response.data ? response.data : response;
	},
	function (error) {
		let message;
		if (error.response) {
			const status = error.response.status;

			switch (status) {
				case 500:
					message = 'Internal Server Error';
					break;
				case 401:
					message = 'Invalid credentials';
					store.dispatch(resetStore());
					window.location.href = '/login';
					break;
				case 403:
					message = 'Forbidden Access';
					break;
				case 404:
					message = 'Sorry! the data you are looking for could not be found';
					break;
				default:
					message = error.response.data?.message || 'An error occurred';
			}
		} else if (error.request) {
			message = 'No response received from the server';
		} else {
			message = error.message || 'Request configuration error';
		}
		NProgress.done();
		return Promise.reject(message);
	}
);

/**
 *
 * contoh untuk set auth
 * const setAuthorization = (token: any) => {
 *	axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
 * };
 */

class APIClient {
	get = (url: any, params: any) => {
		let response;

		if (params) {
			const queryParams = Object.keys(params)
				.filter((key) => params[key] !== undefined && params[key] !== null)
				.map(
					(key) =>
						`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
				)
				.join('&');

			const queryString = queryParams ? `?${queryParams}` : '';
			response = axios.get(`${url}${queryString}`);
		} else {
			response = axios.get(`${url}`);
		}

		return response;
	};

	create = (url: any, data: any) => {
		return axios.post(url, data);
	};

	update = (url: any, data: any) => {
		return axios.patch(url, data);
	};

	put = (url: any, data: any) => {
		return axios.put(url, data);
	};

	patch = (url: any, data: any) => {
		return axios.patch(url, data);
	};

	delete = (url: any, config: any) => {
		return axios.delete(url, { ...config });
	};
}

export { APIClient };
