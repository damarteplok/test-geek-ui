import React from 'react';

interface SlidingPageProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const SlidingPage: React.FC<SlidingPageProps> = ({
	isOpen,
	onClose,
	children,
}) => {
	return (
		<>
			<div
				className={`fixed top-4 right-4 z-[1060] transition-opacity duration-300 ${
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
			>
				<button
					aria-label='button close'
					onClick={onClose}
					className='text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-2 transition-transform duration-200 hover:scale-110 bg-white shadow-lg dark:bg-custom-500/20 dark:text-zink-200 dark:focus:bg-custom-500/10 dark:focus:ring-custom-400/20'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>
			</div>

			{/* Sliding Modal */}
			<div
				className={`card fixed top-0 right-0 h-full w-full md:w-1/2 shadow-lg z-[1050] transform transition-transform duration-300 flex flex-col ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className='overflow-y-auto p-6'>{children}</div>
			</div>

			{/* Overlay */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black opacity-50 z-[1040]'
					onClick={onClose}
				></div>
			)}
		</>
	);
};

export default SlidingPage;
