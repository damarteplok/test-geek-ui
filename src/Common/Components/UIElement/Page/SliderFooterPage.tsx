import React from 'react';

interface SliderFooterPageProps {
	children: React.ReactNode;
}

export const SliderFooterPage: React.FC<SliderFooterPageProps> = ({
	children,
}) => {
	return (
		<div className='px-4 py-6 border-t border-slate-200 dark:border-zink-500'>
			{children}
		</div>
	);
};
