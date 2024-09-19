import React from 'react';

interface SliderHeaderPageProps {
	children: React.ReactNode;
}

export const SliderHeaderPage: React.FC<SliderHeaderPageProps> = ({
	children,
}) => {
	return (
		<div className='flex justify-between items-center p-4 border-b border-slate-200 dark:border-zink-500'>
			<div className='text-lg font-semibold dark:text-zink-50'>{children}</div>
		</div>
	);
};
