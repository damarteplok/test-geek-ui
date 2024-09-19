import React from 'react';
import AuthIcon from 'pages/AuthenticationInner/AuthIcon';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetRegisterFlag } from 'slices/thunk';
import { createSelector } from 'reselect';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik as useFormic } from 'formik';
import { RootState } from 'slices';
import Alert from 'Common/Components/Alert';
import { OUTLINE_RED } from 'Common/constants/alerts';

const Register = () => {
	document.title = 'Register | Qalisys';

	const dispatch = useDispatch<any>();
	const navigation = useNavigate();

	const selectRegister = createSelector(
		(state: RootState) => state.Register,
		(register) => ({
			success: register.success,
			error: register.error,
		})
	);

	const { success, error } = useSelector(selectRegister);

	const validation: any = useFormic({
		enableReinitialize: true,

		initialValues: {
			email: 'damar123@damar123123.com',
			password: 'j4v4nL@bs',
		},
		validationSchema: Yup.object({
			email: Yup.string().email().required('Please Enter Your Email'),
			password: Yup.string().required('Please Enter Your Password'),
		}),
		onSubmit: async (values: any, { setSubmitting }) => {
			setSubmitting(true);
			await dispatch(registerUser(values));
			setSubmitting(false);
		},
	});

	React.useEffect(() => {
		if (success) {
			navigation('/login');
		}

		setTimeout(() => {
			dispatch(resetRegisterFlag());
		}, 3000);
	}, [dispatch, success, navigation]);

	React.useEffect(() => {
		const bodyElement = document.body;

		bodyElement.classList.add(
			'flex',
			'items-center',
			'justify-center',
			'min-h-screen',
			'py-16',
			'lg:py-10',
			'bg-slate-50',
			'dark:bg-zink-800',
			'dark:text-zink-100',
			'font-public'
		);

		return () => {
			bodyElement.classList.remove(
				'flex',
				'items-center',
				'justify-center',
				'min-h-screen',
				'py-16',
				'lg:py-10',
				'bg-slate-50',
				'dark:bg-zink-800',
				'dark:text-zink-100',
				'font-public'
			);
		};
	}, []);

	return (
		<div className='relative'>
			<AuthIcon />

			<div className='mb-0 w-screen lg:w-[500px] card shadow-lg border-none shadow-slate-100 relative'>
				<div className='!px-10 !py-12 card-body'>
					<div className='mt-8 text-center'>
						<h4 className='mb-1 text-custom-500 dark:text-custom-500'>
							Register your account
						</h4>
					</div>
					{error && <Alert className={OUTLINE_RED}>{error}</Alert>}

					<form
						action='/'
						className='mt-10'
						id='registerForm'
						onSubmit={(event: any) => {
							event.preventDefault();
							validation.handleSubmit();
							return false;
						}}
					>
						<div className='mb-3'>
							<label
								htmlFor='email-field'
								className='inline-block mb-2 text-base font-medium'
							>
								Email
							</label>
							<input
								type='text'
								id='email-field'
								name='email'
								className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
								placeholder='Enter email'
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.email || ''}
								disabled={validation.isSubmitting}
							/>
							{validation.touched.email && validation.errors.email ? (
								<div id='email-error' className='mt-1 text-sm text-red-500'>
									{validation.errors.email}
								</div>
							) : null}
						</div>
						<div className='mb-3'>
							<label
								htmlFor='password'
								className='inline-block mb-2 text-base font-medium'
							>
								Password
							</label>
							<input
								type='password'
								id='password'
								name='password'
								className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
								placeholder='Enter password'
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.password || ''}
								disabled={validation.isSubmitting}
							/>
							{validation.touched.password && validation.errors.password ? (
								<div id='password-error' className='mt-1 text-sm text-red-500'>
									{validation.errors.password}
								</div>
							) : null}
						</div>

						<div className='mt-10'>
							<button
								type='submit'
								className='w-full text-white transition-all duration-200 ease-linear btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20'
								disabled={validation.isSubmitting}
							>
								Sign In
							</button>
						</div>

						<div className='mt-10 text-center'>
							<p className='mb-0 text-slate-500 dark:text-zink-200'>
								Already have an account ?{' '}
								<Link
									to='/login'
									className='font-semibold underline transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500'
								>
									Login
								</Link>{' '}
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
