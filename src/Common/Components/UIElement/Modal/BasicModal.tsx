import Modal from 'Common/Components/Modal';
import React from 'react';

interface BasicModalProps {
	show: boolean;
	onHide: () => void;
	id: string;
	title: React.ReactNode;
	children: React.ReactNode;
	footer?: React.ReactNode;
}

const BasicModal: React.FC<BasicModalProps> = ({
	show,
	onHide,
	id,
	title,
	children,
	footer,
}) => {
	return (
		<Modal
			show={show}
			onHide={onHide}
			id={id}
			modal-center='true'
			className='fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4'
			dialogClassName='w-screen lg:w-[55rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full'
		>
			<Modal.Header
				className='flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500'
				closeButtonClass='transition-all duration-200 ease-linear text-slate-500 hover:text-red-500 dark:text-zink-200 dark:hover:text-red-500'
			>
				<Modal.Title className='text-16'>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
				{children}
			</Modal.Body>
			{footer && (
				<Modal.Footer className='flex items-center justify-end p-4 mt-auto border-t border-slate-200 dark:border-zink-500'>
					{footer}
				</Modal.Footer>
			)}
		</Modal>
	);
};

export default BasicModal;
