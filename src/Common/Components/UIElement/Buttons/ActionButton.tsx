import { Eye, Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface ActionButtonProps {
	onEdit: () => void;
	onDelete: () => void;
	overviewLink?: string;
	editLink?: string;
	deletedLink?: string;
	canAccess?: string[];
	classNameView?: string;
	classNameEdit?: string;
	classNameDelete?: string;
	enableTooltip?: boolean;
	overviewTooltip?: string;
	editTooltip?: string;
	deletedTooltip?: string;
}

const ActionButton: FC<ActionButtonProps> = ({
	onEdit,
	onDelete,
	classNameView = '',
	classNameEdit = '',
	classNameDelete = '',
	canAccess = ['view', 'edit', 'delete'],
	overviewLink = '#',
	editLink = '#',
	deletedLink = '#',
	enableTooltip = true,
	overviewTooltip = 'detail',
	editTooltip = 'edit',
	deletedTooltip = 'deleted',
}) => {
	return (
		<div className='flex gap-3'>
			{canAccess.includes('view') && (
				<>
					<Link
						className={`${classNameView} flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md text-custom-500 bg-custom-100 hover:text-white hover:bg-custom-500 dark:bg-custom-500/20 dark:hover:bg-custom-500`}
						to={overviewLink}
						data-tooltip-id={enableTooltip ? 'overview-tooltip' : undefined}
					>
						<Eye className='inline-block size-3' />{' '}
					</Link>
					{enableTooltip && (
						<Tooltip
							id='overview-tooltip'
							place='top'
							content={overviewTooltip}
						/>
					)}
				</>
			)}
			{canAccess.includes('edit') && (
				<>
					<Link
						to={editLink}
						data-modal-target='addEmployeeModal'
						className={`${classNameEdit} flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md edit-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500`}
						onClick={onEdit}
						data-tooltip-id={enableTooltip ? 'edit-tooltip' : undefined}
					>
						<Pencil className='size-4' />
					</Link>
					{enableTooltip && (
						<Tooltip id='edit-tooltip' place='top' content={editTooltip} />
					)}
				</>
			)}
			{canAccess.includes('delete') && (
				<>
					<Link
						to={deletedLink}
						className={`${classNameDelete} flex items-center justify-center size-8 text-red-500 transition-all duration-200 ease-linear bg-red-100 rounded-md hover:text-white hover:bg-red-500 dark:bg-red-500/20 dark:hover:bg-red-500`}
						onClick={onDelete}
						data-tooltip-id={enableTooltip ? 'deleted-tooltip' : undefined}
					>
						<Trash2 className='size-4' />
					</Link>
					{enableTooltip && (
						<Tooltip
							id='deleted-tooltip'
							place='top'
							content={deletedTooltip}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default ActionButton;
