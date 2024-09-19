import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showErrorToast(error: any): void {
	let errorMessage: string;

	if (Array.isArray(error)) {
		errorMessage = error.join(', ');
	} else if (typeof error === 'string') {
		errorMessage = error;
	} else {
		errorMessage = 'failed due to an unknown error.';
	}

	toast.error(errorMessage, {
		autoClose: 2000,
		position: toast.POSITION.BOTTOM_LEFT,
		className: 'z-[1080]',
	});
}

export function showSuccessToast(message: any): void {
	let successMessage: string;

	if (Array.isArray(message)) {
		successMessage = message.join(', ');
	} else if (typeof message === 'string') {
		successMessage = message;
	} else {
		successMessage = 'Success!';
	}

	toast.success(successMessage, {
		autoClose: 2000,
		position: toast.POSITION.BOTTOM_LEFT,
		className: 'z-[1080]',
	});
}
