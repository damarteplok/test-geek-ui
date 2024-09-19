import React from 'react';

interface SliderBodyPageProps {
	children: React.ReactNode;
	haveFooter?: boolean;
}

export const SliderBodyPage: React.FC<SliderBodyPageProps> = ({
	children,
	haveFooter = false,
}) => {
	return (
		<div
			className={`${
				haveFooter ? 'h-[calc(100vh_-_200px)]' : ''
			} p-4 overflow-y-auto flex-grow`}
		>
			{children}
		</div>
	);
};
