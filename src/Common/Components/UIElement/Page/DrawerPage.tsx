import Drawer from 'Common/Components/Drawer';
import { X } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface DrawerProps {
	show: boolean;
	onHide: () => void;
	id: string;
	className?: string;
	header?: ReactNode;
	body?: ReactNode;
	footer?: ReactNode;
}

const DrawerPage: FC<DrawerProps> = ({
	show,
	onHide,
	id,
	className = '',
	header,
	body,
	footer,
}) => {
	return (
		<Drawer
			show={show}
			onHide={onHide}
			id={id}
			drawer-end='true'
			className='fixed inset-y-0 flex flex-col w-full transition-transform duration-300 ease-in-out transform bg-white shadow dark:bg-zink-600 ltr:right-0 rtl:left-0 md:w-96 z-drawer'
		>
			<div className='flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500'>
				<div className='grow'>
					<h5 className='mb-0 text-16'>{header}</h5>
				</div>
				<div className='shrink-0'>
					<Drawer.Header
						data-drawer-close={id}
						className='transition-all duration-150 ease-linear text-slate-500 hover:text-slate-800'
					>
						<X className='size-4'></X>
					</Drawer.Header>
				</div>
			</div>
			<div>
				<div className='h-[calc(100vh_-_130px)] p-4 overflow-y-auto product-list'>
					<div className='flex flex-col gap-4'>{body}</div>
				</div>
				<div className='p-4 border-t border-slate-200 dark:border-zink-500'>
					<div className='flex items-center justify-between gap-3'>
						{footer}
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default DrawerPage;
