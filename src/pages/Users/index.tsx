import { createSelector } from '@reduxjs/toolkit';
import BreadCrumb from 'Common/BreadCrumb';
import BasicButton from 'Common/Components/UIElement/Buttons/BasicButton';
import BasicLayout from 'Common/Components/UIElement/Layout/BasicLayout';
import ListCardLayout from 'Common/Components/UIElement/Layout/ListCardLayout';
import NoResult from 'Common/Components/UIElement/Page/NoResult';
import TableContainer from 'Common/TableContainer';
import {
	CheckCircle,
	DownloadCloud,
	ImagePlus,
	Loader,
	Plus,
	UserMinus,
	UserRoundCheck,
	UserSearch,
	X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteUser,
	fetchUsersClientSide,
	fetchPreviewHistoryUsers,
	createUser,
	updateUser,
} from 'slices/users/thunk';
import { API_URL } from 'Common/constants/urls';
import { USERS, USERS_AVATAR } from 'helpers/url_helper';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import DeleteModal from 'Common/DeleteModal';
import ActionButton from 'Common/Components/UIElement/Buttons/ActionButton';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import BasicSearch from 'Common/Components/UIElement/Fields/BasicSearch';
import SlidingPage from 'Common/Components/UIElement/Page/SliderPage';
import { SliderHeaderPage } from 'Common/Components/UIElement/Page/SliderHeaderPage';
import { SliderBodyPage } from 'Common/Components/UIElement/Page/SliderBodyPage';
import { SliderFooterPage } from 'Common/Components/UIElement/Page/SliderFooterPage';
import FilterButton from 'Common/Components/UIElement/Buttons/FilterButton';
import DrawerPage from 'Common/Components/UIElement/Page/DrawerPage';
import { ColumnFiltersState } from '@tanstack/react-table';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import dummyImg from 'assets/images/users/user-dummy-img.jpg';
import CountUp from 'react-countup';
import GridLayout from 'Common/Components/UIElement/Layout/GridLayout';
import BasicModal from 'Common/Components/UIElement/Modal/BasicModal';
import CircleTimeline from 'Common/Components/UIElement/TimeLine/CircleTimeLine';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface OptionType {
	value: string;
	label: string;
}

const options: OptionType[] = [
	{ value: 'active', label: 'Active' },
	{ value: 'waiting', label: 'Waiting' },
	{ value: 'rejected', label: 'Rejected' },
];

const Users = () => {
	const dispatch = useDispatch<any>();
	const selectDataList = createSelector(
		(state: any) => state.User,
		(user) => ({
			users: user.users,
			loading: user.loading,
			errorUser: user.errorUser,
			activeUser: user.activeUser,
			waitingUser: user.waitingUser,
			rejectedUser: user.rejectedUser,
			historyUser: user.historyUser,
		})
	);
	const {
		users,
		loading,
		errorUser,
		activeUser,
		waitingUser,
		rejectedUser,
		historyUser,
	} = useSelector(selectDataList);
	const [eventData, setEventData] = useState<any>();
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [isModalOpen, setModalOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [userId, setUserId] = useState<number | null>(null);
	const [userIdModal, setUserIdModal] = useState<number | null>(null);
	const [showFilter, setShowFilter] = useState<boolean>(false);
	const [overviewModal, setOverviewModal] = useState(false);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
	const [selectedDate, setSelectedDate] = useState<Date | string>('');
	const [selectedImage, setSelectedImage] = useState<any>();
	const [selectedUrlImage, setSelectedUrlImage] = useState<string>('');

	const openModal = () => {
		handleClearData();
		setModalOpen(true);
	};
	const closeModal = () => setModalOpen(false);
	const deleteToggle = () => setDeleteModal(!deleteModal);
	const handleDrawerFilter = () => setShowFilter(!showFilter);
	const toggleModalOverview = (id: any) => {
		setUserIdModal(id);
		setOverviewModal(true);
		dispatch(fetchPreviewHistoryUsers({ id, limit: '20' }));
	};
	const closeModalOverview = () => {
		setOverviewModal(false);
	};

	const resetFilter = () => {
		setColumnFilters([]);
		setSelectedOption(null);
		setSelectedDate('');
	};

	const handleImageChange = (event: any) => {
		const fileInput = event.target;
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			const reader = new FileReader();
			reader.onload = (e: any) => {
				setSelectedImage(e.target.result);
			};
			reader.readAsDataURL(file);

			validation.setFieldValue('img', file);
		}
	};

	const handleUpdateDataClick = (data: any) => {
		if (data.avatar && data.avatar != '-') {
			setSelectedUrlImage(`${API_URL}${USERS_AVATAR}/${data.id}`);
		}
		setEventData({ ...data });
		setIsEdit(true);
		setUserId(data.id);
		setModalOpen(true);
	};

	const onClickDelete = (cell: any) => {
		setDeleteModal(true);
		if (cell.id) {
			setEventData(cell);
		}
	};

	const handleDelete = () => {
		if (eventData) {
			dispatch(deleteUser(eventData.id));
			setDeleteModal(false);
		}
	};

	const handleClearData = () => {
		if (isModalOpen) {
			setModalOpen(false);
		}
		setIsEdit(false);
		setUserId(null);
		setEventData('');
		setSelectedImage('');
		setSelectedUrlImage('');
		validation.resetForm();
	};

	const Status = ({ item }: any) => {
		switch (item) {
			case 'active':
				return (
					<span className='px-2.5 py-0.5 text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent inline-flex items-center status'>
						<CheckCircle className='size-3 mr-1.5' />
						{item}
					</span>
				);
			case 'waiting':
				return (
					<span className='px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-slate-100 border-transparent text-slate-500 dark:bg-slate-500/20 dark:text-zink-200 dark:border-transparent status'>
						<Loader className='size-3 mr-1.5' />
						{item}
					</span>
				);
			case 'rejected':
				return (
					<span className='px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent status'>
						<X className='size-3 mr-1.5' />
						{item}
					</span>
				);
			default:
				return (
					<span className='px-2.5 py-0.5 text-xs font-medium rounded border bg-slate-100 border-transparent text-slate-500 dark:bg-slate-500/20 dark:border-transparent inline-flex items-center status'>
						<CheckCircle className='size-3 mr-1.5' />
						{item}
					</span>
				);
		}
	};

	const columns = useMemo(
		() => [
			{
				header: 'Name',
				accessorKey: 'name',
				enableColumnFilter: false,
				enableSorting: true,
				filterFn: 'includesString',
				cell: (cell: any) => (
					<div className='flex items-center gap-2'>
						<div className='flex items-center justify-center size-10 font-medium rounded-full shrink-0 bg-slate-200 text-slate-800 dark:text-zink-50 dark:bg-zink-600'>
							{cell.row.original.avatar != '-' ? (
								<img
									src={`${API_URL}${USERS_AVATAR}/${cell.row.original.id}`}
									alt=''
									className='h-10 rounded-full'
								/>
							) : (
								cell
									.getValue()
									.split(' ')
									.map((word: any) => word.charAt(0))
									.join('')
							)}
						</div>
						<div className='grow'>
							<h6 className='mb-1'>
								<a
									href='#!'
									className='name'
									onClick={() => toggleModalOverview(cell.row.original.id)}
								>
									{cell.getValue()}
								</a>
							</h6>
							<p className='text-slate-500 dark:text-zink-200'>
								{moment(cell.row.original.createdAt).format('DD MMMM ,YYYY')}
							</p>
						</div>
					</div>
				),
			},
			{
				header: 'Address',
				accessorKey: 'address',
				enableColumnFilter: false,
				enableSorting: true,
				filterFn: 'includesString',
			},
			{
				header: 'Email',
				accessorKey: 'email',
				enableColumnFilter: false,
				enableSorting: true,
				filterFn: 'includesString',
			},
			{
				header: 'Phone Number',
				accessorKey: 'contact',
				enableColumnFilter: false,
				enableSorting: true,
				filterFn: 'includesString',
			},
			{
				header: 'Status',
				accessorKey: 'status',
				enableColumnFilter: false,
				enableSorting: true,
				filterFn: 'includesString',
				cell: (cell: any) => <Status item={cell.getValue()} />,
			},
			{
				header: 'Created At',
				accessorKey: 'createdAt',
				enableColumnFilter: false,
				enableHiding: true,
			},
			{
				header: 'Action',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cell: any) => (
					<ActionButton
						overviewLink={`/users/${cell.row.original.id}`}
						onEdit={() => handleUpdateDataClick(cell.row.original)}
						onDelete={() => onClickDelete(cell.row.original)}
					></ActionButton>
				),
			},
		],
		[]
	);

	const validation: any = useFormik({
		enableReinitialize: true,

		initialValues: {
			img: eventData?.img || null,
			name: eventData?.name || '',
			contact: eventData?.contact || '',
			address: eventData?.address || '',
			email: eventData?.email || '',
			password: eventData?.password || '',
			isEdit: isEdit || false,
		},
		validationSchema: Yup.object({
			img: Yup.mixed()
				.test('is-valid-size', 'File too large', (value) => {
					if (value instanceof File) {
						return value.size <= 1000000;
					}
					return false;
				})
				.nullable(),
			name: Yup.string().required('Please Enter Name'),
			contact: Yup.string().required('Please Enter Contact'),
			address: Yup.string().required('Please Enter Location'),
			email: Yup.string().required('Please Enter Email'),
			isEdit: Yup.boolean().nullable(),
			password: Yup.string()
				.nullable()
				.when('isEdit', (isEdit: any, customSchema) =>
					isEdit === false ? customSchema.required() : customSchema
				),
		}),

		onSubmit: (values) => {
			if (isEdit) {
				const img = selectedImage ? values.img : null;
				const password = values.password || null;

				const updateUserForm: any = {
					img: img,
					name: values.name,
					address: values.address,
					contact: values.contact,
					password: password,
				};
				// update user
				dispatch(updateUser({ id: `${userId}`, userData: updateUserForm }));
			} else {
				// save new user
				dispatch(createUser(values));
			}
		},
	});

	useEffect(() => {
		if (!errorUser && !loading) {
			handleClearData();
		}
	}, [errorUser, loading]);

	useEffect(() => {
		dispatch(fetchUsersClientSide());
	}, [dispatch]);

	return (
		<>
			<BreadCrumb title='User List' pageTitle='Users' />
			<DeleteModal
				show={deleteModal}
				onHide={deleteToggle}
				onDelete={handleDelete}
			/>
			<ToastContainer closeButton={false} limit={1} />
			<BasicLayout>
				<GridLayout>
					<div className='xl:col-span-4'>
						<div className='card'>
							<div className='flex items-center gap-3 card-body'>
								<div className='flex items-center justify-center size-12 text-green-500 bg-green-100 rounded-md text-15 dark:bg-green-500/20 shrink-0'>
									<UserRoundCheck />
								</div>
								<div className='grow'>
									<h5 className='mb-1 text-16'>
										<CountUp end={activeUser} className='counter-value' />
									</h5>
									<p className='text-slate-500 dark:text-zink-200'>
										Active Users
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className='xl:col-span-4'>
						<div className='card'>
							<div className='flex items-center gap-3 card-body'>
								<div className='flex items-center justify-center size-12 text-slate-500 bg-slate-100 rounded-md text-15 dark:bg-slate-500/20 shrink-0'>
									<UserSearch />
								</div>
								<div className='grow'>
									<h5 className='mb-1 text-16'>
										<CountUp end={waitingUser} className='counter-value' />
									</h5>
									<p className='text-slate-500 dark:text-zink-200'>
										Waiting Users
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className='xl:col-span-4'>
						<div className='card'>
							<div className='flex items-center gap-3 card-body'>
								<div className='flex items-center justify-center size-12 text-red-500 bg-red-100 rounded-md text-15 dark:bg-red-500/20 shrink-0'>
									<UserMinus />
								</div>
								<div className='grow'>
									<h5 className='mb-1 text-16'>
										<CountUp end={rejectedUser} className='counter-value' />
									</h5>
									<p className='text-slate-500 dark:text-zink-200'>
										Rejected Users
									</p>
								</div>
							</div>
						</div>
					</div>
				</GridLayout>

				<ListCardLayout
					header={
						<div className='grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-12'>
							<div className='xl:col-span-3'>
								<BasicSearch
									value={globalFilter}
									onChange={(e) => setGlobalFilter(e)}
								></BasicSearch>
							</div>

							<div className='xl:col-span-3 xl:col-start-11'>
								<div className='flex justify-end space-x-2'>
									<BasicButton
										disabled={loading}
										type='href'
										url={`${API_URL}${USERS}/export/xls`}
										download={true}
										variant='base'
										color='green'
									>
										<DownloadCloud className='inline-block size-4' />
									</BasicButton>
									<BasicButton
										disabled={loading}
										type='button'
										variant='base'
										onClick={openModal}
									>
										<Plus className='inline-block size-4' />{' '}
										<span className='align-middle'>Add User</span>
									</BasicButton>
									<FilterButton onClick={handleDrawerFilter}></FilterButton>
								</div>
							</div>
						</div>
					}
					optionListClassName='!py-3.5 border-y border-dashed border-slate-200 dark:border-zink-500'
					bodyClassName=''
				>
					{users && users.length > 0 ? (
						<TableContainer
							isSelect={true}
							isGlobalFilter={false}
							isPagination={true}
							columns={columns || []}
							data={users || []}
							externalGlobalFilter={globalFilter}
							setExternalGlobalFilter={setGlobalFilter}
							customPageSize={10}
							divclassName='my-2 col-span-12 overflow-x-auto lg:col-span-12'
							tableclassName='hover group dataTable w-full text-sm align-middle whitespace-nowrap no-footer'
							theadclassName='border-b border-slate-200 dark:border-zink-500'
							trclassName='group-[.stripe]:even:bg-slate-50 group-[.stripe]:dark:even:bg-zink-600 transition-all duration-150 ease-linear group-[.hover]:hover:bg-slate-50 dark:group-[.hover]:hover:bg-zink-600 [&.selected]:bg-custom-500 dark:[&.selected]:bg-custom-500 [&.selected]:text-custom-50 dark:[&.selected]:text-custom-50'
							thclassName='cursor-pointer p-3 group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500 sorting px-3 py-4 text-slate-900 bg-slate-200/50 font-semibold text-left dark:text-zink-50 dark:bg-zink-600 dark:group-[.bordered]:border-zink-500'
							tdclassName='p-3 group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500'
							PaginationClassName='flex flex-col items-center mt-5 md:flex-row'
							externalColumnFilters={columnFilters}
							setExternalColumnFilters={setColumnFilters}
							columnVisibility={{
								createdAt: false,
							}}
						/>
					) : (
						<NoResult></NoResult>
					)}
				</ListCardLayout>
			</BasicLayout>

			<DrawerPage
				id='filter-page-user'
				show={showFilter}
				onHide={handleDrawerFilter}
				header={
					<div className='text-lg font-semibold dark:text-zink-50'>
						User Filter
					</div>
				}
				body={
					<>
						<div>
							<label
								htmlFor='status'
								className='inline-block mb-2 text-base font-medium'
							>
								Status Users
							</label>
							<Select
								className='border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
								options={options}
								isSearchable={true}
								name='status'
								id='status'
								placeholder='select status'
								value={selectedOption}
								onChange={setSelectedOption}
							/>
						</div>

						<div>
							<label
								htmlFor='createdAt'
								className='inline-block mb-2 text-base font-medium'
							>
								Created At Users
							</label>
							<Flatpickr
								id='createdAt'
								className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
								options={{
									dateFormat: 'd-m-Y',
								}}
								placeholder='Select Created At'
								value={selectedDate}
								onChange={(date) => {
									setSelectedDate(date[0] || '');
								}}
							/>
						</div>
					</>
				}
				footer={
					<>
						<BasicButton color='slate' className='w-full' onClick={resetFilter}>
							Reset
						</BasicButton>
						<BasicButton
							color='red'
							className='w-full'
							onClick={() => {
								setColumnFilters((prev) => [
									...prev.filter((filter) => filter.id !== 'status'),
									{ id: 'status', value: selectedOption?.value || '' },
								]);
								setColumnFilters((prev) => [
									...prev.filter((filter) => filter.id !== 'createdAt'),
									{
										id: 'createdAt',
										value: selectedDate
											? moment(selectedDate).format('YYYY-MM-DD')
											: '',
									},
								]);
								handleDrawerFilter();
							}}
						>
							Filter
						</BasicButton>
					</>
				}
			></DrawerPage>

			<SlidingPage isOpen={isModalOpen} onClose={closeModal}>
				<form
					action='#!'
					onSubmit={(e) => {
						e.preventDefault();
						validation.handleSubmit();
						return false;
					}}
				>
					<SliderHeaderPage>
						{isEdit ? 'Edit User' : 'Add User'}
					</SliderHeaderPage>
					<SliderBodyPage haveFooter={true}>
						<div className='mb-3'>
							<div className='relative size-24 mx-auto mb-4 rounded-full shadow-md bg-slate-100 profile-user dark:bg-zink-500'>
								<img
									src={
										selectedImage ||
										validation.values.img ||
										selectedUrlImage ||
										dummyImg
									}
									alt=''
									className='object-cover w-full h-full rounded-full user-profile-image'
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
							{validation.touched.img && validation.errors.img ? (
								<p className='text-red-400'>{validation.errors.img}</p>
							) : null}
						</div>
						<div className='mb-3'>
							<label
								htmlFor='userNameInput'
								className='inline-block mb-2 text-base font-medium'
							>
								Name
							</label>
							<input
								type='text'
								id='userNameInput'
								className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
								placeholder='Enter name'
								name='name'
								onChange={validation.handleChange}
								value={validation.values.name || ''}
							/>
							{validation.touched.name && validation.errors.name ? (
								<p className='text-red-400'>{validation.errors.name}</p>
							) : null}
						</div>
						<div className='mb-3'>
							<label
								htmlFor='emailInput'
								className='inline-block mb-2 text-base font-medium'
							>
								Email
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
						</div>
						<div className='mb-3'>
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
							{validation.touched.password && validation.errors.password ? (
								<p className='text-red-400'>{validation.errors.password}</p>
							) : null}
						</div>
						<div className='mb-3'>
							<label
								htmlFor='contanctInput'
								className='inline-block mb-2 text-base font-medium'
							>
								Contact
							</label>
							<input
								type='text'
								id='contanctInput'
								className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
								placeholder='12345 67890'
								name='contact'
								onChange={validation.handleChange}
								value={validation.values.contact || ''}
							/>
							{validation.touched.contact && validation.errors.contact ? (
								<p className='text-red-400'>{validation.errors.contact}</p>
							) : null}
						</div>
						<div className='mb-3'>
							<label
								htmlFor='addressInput'
								className='inline-block mb-2 text-base font-medium'
							>
								Address
							</label>
							<input
								type='text'
								id='addressInput'
								className='form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200'
								placeholder='Address'
								name='address'
								onChange={validation.handleChange}
								value={validation.values.address || ''}
							/>
							{validation.touched.address && validation.errors.address ? (
								<p className='text-red-400'>{validation.errors.address}</p>
							) : null}
						</div>
					</SliderBodyPage>
					<SliderFooterPage>
						<div className='flex items-center justify-between gap-3'>
							<BasicButton
								color='red'
								variant='ghost'
								className='w-full'
								onClick={() => {
									closeModal();
								}}
							>
								Cancel
							</BasicButton>
							<BasicButton
								type='submit'
								color='custom'
								className='w-full'
								disabled={loading}
							>
								{isEdit ? 'Edit User' : 'Add User'}
							</BasicButton>
						</div>
					</SliderFooterPage>
				</form>
			</SlidingPage>

			<BasicModal
				id='modalOverview'
				show={overviewModal}
				onHide={closeModalOverview}
				title={<p className='mb-3 text-16'>History User</p>}
				footer={
					<BasicButton
						disabled={loading}
						type='link'
						url={`/users/${userIdModal}`}
						download={true}
						variant='base'
					>
						Show All
					</BasicButton>
				}
			>
				{!loading ? (
					<CircleTimeline items={historyUser} />
				) : (
					<Skeleton count={5} className='dark:bg-slate-500/20' />
				)}
			</BasicModal>
		</>
	);
};

export default Users;
