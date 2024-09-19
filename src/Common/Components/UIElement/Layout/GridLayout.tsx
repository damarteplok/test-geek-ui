import { FC, ReactNode } from 'react';

interface GridLayoutProps {
	className?: string;
	children: ReactNode;
}

const GridLayout: FC<GridLayoutProps> = ({ className = '', children }) => {
	return (
		<div
			className={`grid grid-cols-1 gap-x-5 md:grid-cols-2 xl:grid-cols-12 ${className}`}
		>
			{children}
		</div>
	);
};

export default GridLayout;
