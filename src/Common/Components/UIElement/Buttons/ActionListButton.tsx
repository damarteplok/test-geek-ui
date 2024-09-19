import { Dropdown } from 'Common/Components/Dropdown';
import { Eye, FileEdit, MoreHorizontal, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

interface ActionListButtonProps {
	onEdit: () => void;
	onDelete: () => void;
	overviewLink?: string;
	editLink?: string;
	deletedLink?: string;
	canAccess?: string[];
	classNameView?: string;
	classNameEdit?: string;
	classNameDelete?: string;
}

const ActionListButton: FC<ActionListButtonProps> = ({
	onEdit,
	onDelete,
	classNameView = '',
	classNameEdit = '',
	classNameDelete = '',
	overviewLink = '#',
	editLink = '#',
	deletedLink = '#',
	canAccess = ['view', 'edit', 'delete'],
}) => {
	return (
		<Dropdown className='relative'>
			<Dropdown.Trigger
				className='flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20'
				id='actionDropdownTrigger'
			>
				<MoreHorizontal className='size-3' />
			</Dropdown.Trigger>
			<Dropdown.Content
				placement='right-end'
				className='absolute z-50 py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md min-w-[10rem] dark:bg-zink-600'
				aria-labelledby='actionDropdownTrigger'
			>
				{canAccess.includes('view') && (
					<li>
						<Link
							className={`${classNameView} block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200`}
							to={overviewLink}
						>
							<Eye className='inline-block size-3 ltr:mr-1 rtl:ml-1' />
							<span className='align-middle'>Overview</span>
						</Link>
					</li>
				)}
				{canAccess.includes('edit') && (
					<li>
						<Link
							to={editLink}
							className={`${classNameEdit} block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200`}
							onClick={onEdit}
						>
							<FileEdit className='inline-block size-3 ltr:mr-1 rtl:ml-1' />
							<span className='align-middle'>Edit</span>
						</Link>
					</li>
				)}
				{canAccess.includes('delete') && (
					<li>
						<Link
							to={deletedLink}
							className={`${classNameDelete} block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200`}
							onClick={onDelete}
						>
							<Trash2 className='inline-block size-3 ltr:mr-1 rtl:ml-1' />
							<span className='align-middle'>Delete</span>
						</Link>
					</li>
				)}
			</Dropdown.Content>
		</Dropdown>
	);
};

export default ActionListButton;
