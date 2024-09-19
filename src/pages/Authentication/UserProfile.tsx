import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import userProfile from 'assets/images/users/user-profile.png';
import { createSelector } from 'reselect';
import BreadCrumb from 'Common/BreadCrumb';
import withRouter from 'Common/withRouter';
import {
	updateNotificationSettingsUserProfile,
	fetchIsMe,
	updateAvatarUser,
	updateUserProfile,
} from 'slices/thunk';
import { API_URL } from 'Common/constants/urls';
import { USERS_AVATAR } from 'helpers/url_helper';
import { ImagePlus, X } from 'lucide-react';
import LanguageDropdown from 'Common/LanguageDropdown';
import { ToastContainer } from 'react-toastify';
import { showErrorToast } from 'Common/Components/Alert/toastHelper';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { validateImageTypes } from 'helpers/imageValidateHelper';

const UserProfile = () => {
	document.title = 'Profile';
	const dispatch = useDispatch<any>();
	const selectProperties = createSelector(
		(state: any) => state.Profile,
		(profile) => ({
			user: profile.user,
			error: profile.error,
			success: profile.success,
			loading: profile.loading,
		})
	);
	const defaultSettings = {
		webBrowser: false,
		email: false,
		telegram: false,
		language: 'id',
	};

	const { user } = useSelector(selectProperties);
	const [eventData, setEventData] = useState<any>();
	const [settings, setSettings] = useState<any>(defaultSettings);
	const [selectedImage, setSelectedImage] = useState<any>();

	const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setSettings((prevSettings: any) => ({
			...prevSettings,
			[name]: checked,
		}));
		dispatch(
			updateNotificationSettingsUserProfile({
				id: `${user.id}`,
				settings: {
					...settings,
					[name]: checked,
				},
			})
		);
	};

	const handleImageChange = (event: any) => {
		const fileInput = event.target;
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];

			if (!validateImageTypes(file.type)) {
				showErrorToast(
					'Please upload a valid image file (JPEG, PNG, GIF, WEBP)'
				);
				return;
			}

			const reader = new FileReader();
			reader.onload = (e: any) => {
				setSelectedImage(e.target.result);
			};
			reader.readAsDataURL(file);
			dispatch(updateAvatarUser({ id: `${user.id}`, img: file }));
		}
	};

	const validation: any = useFormik({
		enableReinitialize: true,

		initialValues: {
			name: eventData?.name || '',
			contact: eventData?.contact || '',
			address: eventData?.address || '',
			email: eventData?.email || '',
			password: eventData?.password || '',
		},
		validationSchema: Yup.object({
			name: Yup.string().required('Please Enter Name'),
			contact: Yup.string().required('Please Enter Contact'),
			address: Yup.string().required('Please Enter Location'),
			email: Yup.string().required('Please Enter Email'),
			password: Yup.string().nullable(),
		}),
		onSubmit: (values) => {
			const password = values.password || null;

			const updateUserForm: any = {
				name: values.name,
				address: values.address,
				contact: values.contact,
				password: password,
			};

			dispatch(
				updateUserProfile({ id: `${user.id}`, userData: updateUserForm })
			);
		},
	});

	useEffect(() => {
		dispatch(fetchIsMe());
	}, [dispatch]);

	useEffect(() => {
		if (user) {
			const { name = '', contact = '', address = '', email = '' } = user;

			setEventData({
				name,
				contact,
				address,
				email,
			});
		}

		if (user && user.settings) {
			setSettings(settings);
		}
	}, [user]);

	return (
		<div className='container-fluid group-data-[content=boxed]:max-w-boxed mx-auto'>
			<BreadCrumb title='User Profile' pageTitle='Profile' />
			<ToastContainer closeButton={false} limit={1} />
			<div className='row'>
				<div className='grid grid-cols-1 gap-x-5 xl:grid-cols-1'>
					<div className='card'>
						<div className='card-body'>
							{user ? (
								<div className='flex gap-3'>
									<div className='relative'>
										<img
											src={
												selectedImage || user
													? `${API_URL}${USERS_AVATAR}/${
															user.id
													  }?timestamp=${new Date().getTime()}`
													: userProfile
											}
											alt=''
											className='avatar-md img-thumbnail rounded-md h-28'
										/>
										<div className='absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit'>
											<input
												aria-label='image'
												id='profile-img-file-input'
												name='profile-img-file-input'
												type='file'
												accept='image/*'
												className='hidden profile-img-file-input'
												onChange={handleImageChange}
											/>
											<label
												htmlFor='profile-img-file-input'
												className='flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600 profile-photo-edit'
											>
												<ImagePlus className='size-4 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500' />
											</label>
										</div>
									</div>
									<div className='text-slate-500 dark:text-zink-200'>
										<h5 className='text-slate-500'>{user?.name || '-'}</h5>
										<p className='mb-1'>{user?.email || '-'}</p>
										<LanguageDropdown />
									</div>
								</div>
							) : (
								<div>
									<Skeleton className='dark:bg-slate-500/20' />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<h5 className='mb-4'>Notification Setting</h5>

			<div className='card'>
				<div className='card-body'>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						<div className='grid grid-cols-3 items-center'>
							{user ? (
								<>
									<label
										htmlFor='webBrowserSwitch'
										className='text-left mr-4 col-span-1 inline-block mb-2 text-base font-medium'
									>
										Web Browser
									</label>

									<div className='relative inline-block w-10 align-middle transition duration-200 ease-in ltr:mr-2 rtl:ml-2'>
										<input
											type='checkbox'
											name='webBrowser'
											id='webBrowserSwitch'
											className='absolute block size-5 transition duration-300 ease-linear border-2 rounded-full appearance-none cursor-pointer border-slate-200 dark:border-zink-500 bg-white/80 dark:bg-zink-400 peer/published checked:bg-white dark:checked:bg-white ltr:checked:right-0 rtl:checked:left-0 checked:bg-none checked:border-green-500 dark:checked:border-green-500 arrow-none'
											checked={settings.webBrowser || user.settings?.webBrowser}
											onChange={handleSwitchChange}
										/>
										<label
											htmlFor='webBrowserSwitch'
											className='block h-5 overflow-hidden duration-300 ease-linear border rounded-full cursor-pointer cursor-pointertransition border-slate-200 dark:border-zink-500 bg-slate-200 dark:bg-zink-600 peer-checked/published:bg-green-500 peer-checked/published:border-green-500'
										></label>
									</div>
								</>
							) : (
								<Skeleton className='dark:bg-slate-500/20' />
							)}
						</div>

						<div className='grid grid-cols-3 items-center'>
							{user ? (
								<>
									<label
										htmlFor='emailSwitch'
										className='text-left mr-4 col-span-1 inline-block mb-2 text-base font-medium'
									>
										Email
									</label>

									<div className='relative inline-block w-10 align-middle transition duration-200 ease-in ltr:mr-2 rtl:ml-2'>
										<input
											type='checkbox'
											name='email'
											id='emailSwitch'
											className='absolute block size-5 transition duration-300 ease-linear border-2 rounded-full appearance-none cursor-pointer border-slate-200 dark:border-zink-500 bg-white/80 dark:bg-zink-400 peer/published checked:bg-white dark:checked:bg-white ltr:checked:right-0 rtl:checked:left-0 checked:bg-none checked:border-green-500 dark:checked:border-green-500 arrow-none'
											checked={settings.email || user.settings?.email}
											onChange={handleSwitchChange}
										/>
										<label
											htmlFor='emailSwitch'
											className='block h-5 overflow-hidden duration-300 ease-linear border rounded-full cursor-pointer cursor-pointertransition border-slate-200 dark:border-zink-500 bg-slate-200 dark:bg-zink-600 peer-checked/published:bg-green-500 peer-checked/published:border-green-500'
										></label>
									</div>
								</>
							) : (
								<Skeleton className='dark:bg-slate-500/20' />
							)}
						</div>

						<div className='grid grid-cols-3 items-center'>
							{user ? (
								<>
									<label
										htmlFor='telegramSwitch'
										className='text-left mr-4 col-span-1 inline-block mb-2 text-base font-medium'
									>
										Telegram
									</label>

									<div className='relative inline-block w-10 align-middle transition duration-200 ease-in ltr:mr-2 rtl:ml-2'>
										<input
											type='checkbox'
											name='telegram'
											id='telegramSwitch'
											className='absolute block size-5 transition duration-300 ease-linear border-2 rounded-full appearance-none cursor-pointer border-slate-200 dark:border-zink-500 bg-white/80 dark:bg-zink-400 peer/published checked:bg-white dark:checked:bg-white ltr:checked:right-0 rtl:checked:left-0 checked:bg-none checked:border-green-500 dark:checked:border-green-500 arrow-none'
											checked={settings.telegram || user.settings?.telegram}
											onChange={handleSwitchChange}
										/>
										<label
											htmlFor='telegramSwitch'
											className='block h-5 overflow-hidden duration-300 ease-linear border rounded-full cursor-pointer cursor-pointertransition border-slate-200 dark:border-zink-500 bg-slate-200 dark:bg-zink-600 peer-checked/published:bg-green-500 peer-checked/published:border-green-500'
										></label>
									</div>
								</>
							) : (
								<Skeleton className='dark:bg-slate-500/20' />
							)}
						</div>
					</div>
				</div>
			</div>

			<h5 className='mb-4'>Edit User</h5>

			<div className='card'>
				<div className='card-body'>
					<form
						action='#!'
						id='updateUser'
						onSubmit={(event: any) => {
							event.preventDefault();
							validation.handleSubmit();
							return false;
						}}
					>
						<div className='grid grid-cols-1 gap-x-5 md:grid-cols-2 xl:grid-cols-3'>
							<div className='mb-6'>
								{user ? (
									<>
										<label
											htmlFor='name'
											className='inline-block mb-2 text-base font-medium'
										>
											Name <span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											name='name'
											className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
											placeholder='Enter name'
											onChange={validation.handleChange}
											value={validation.values.name || ''}
										/>
										{validation.touched.name && validation.errors.name ? (
											<p className='text-red-400'>{validation.errors.name}</p>
										) : null}
									</>
								) : (
									<Skeleton className='dark:bg-slate-500/20' />
								)}
							</div>
							<div className='mb-6'>
								{user ? (
									<>
										<label
											htmlFor='emailInput'
											className='inline-block mb-2 text-base font-medium'
										>
											Email Address <span className='text-red-500'>*</span>
										</label>
										<input
											type='email'
											id='emailInput'
											className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
											placeholder='Enter email'
											name='email'
											onChange={validation.handleChange}
											value={validation.values.email || ''}
										/>
										{validation.touched.email && validation.errors.email ? (
											<p className='text-red-400'>{validation.errors.email}</p>
										) : null}
									</>
								) : (
									<Skeleton className='dark:bg-slate-500/20' />
								)}
							</div>
							<div className='mb-6'>
								{user ? (
									<>
										<label
											htmlFor='passwordInput'
											className='inline-block mb-2 text-base font-medium'
										>
											Password
										</label>
										<input
											type='password'
											id='passwordInput'
											className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
											placeholder='Enter password'
											name='password'
											onChange={validation.handleChange}
											value={validation.values.password || ''}
										/>
										{validation.touched.password &&
										validation.errors.password ? (
											<p className='text-red-400'>
												{validation.errors.password}
											</p>
										) : null}
									</>
								) : (
									<Skeleton className='dark:bg-slate-500/20' />
								)}
							</div>
							<div className='mb-6'>
								{user ? (
									<>
										<label
											htmlFor='phoneNumberInput'
											className='inline-block mb-2 text-base font-medium'
										>
											Contact <span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											id='phoneNumberInput'
											className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
											placeholder='08121231231'
											name='contact'
											onChange={validation.handleChange}
											value={validation.values.contact || ''}
										/>
										{validation.touched.contact && validation.errors.contact ? (
											<p className='text-red-400'>
												{validation.errors.contact}
											</p>
										) : null}
									</>
								) : (
									<Skeleton className='dark:bg-slate-500/20' />
								)}
							</div>

							<div className='mb-6'>
								{user ? (
									<>
										<label
											htmlFor='addressInput'
											className='inline-block mb-2 text-base font-medium'
										>
											Address <span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											id='addressInput'
											className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
											placeholder='Enter Address'
											name='address'
											onChange={validation.handleChange}
											value={validation.values.address || ''}
										/>
										{validation.touched.address && validation.errors.address ? (
											<p className='text-red-400'>
												{validation.errors.address}
											</p>
										) : null}
									</>
								) : (
									<Skeleton className='dark:bg-slate-500/20' />
								)}
							</div>
						</div>
						<div className='flex justify-end gap-2'>
							{user ? (
								<>
									<button
										type='button'
										className='text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10'
									>
										<X className='inline-block size-4' />{' '}
										<span className='align-middle'>Cancel</span>
									</button>
									<button
										type='submit'
										className='text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20'
									>
										Update
									</button>
								</>
							) : (
								<Skeleton className='dark:bg-slate-500/20' />
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default withRouter(UserProfile);
