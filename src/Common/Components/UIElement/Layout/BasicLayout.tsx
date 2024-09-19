import { FC, ReactNode } from 'react';

interface BasicLayoutProps {
	type?: 'fluid' | 'container';
	className?: string;
	children: ReactNode;
}

const BasicLayout: FC<BasicLayoutProps> = ({
	type = 'fluid',
	className = '',
	children,
}) => {
	return (
		<>
			{type === 'container' ? (
				<div
					className={`container-fluid group-data-[content=boxed]:max-w-boxed mx-auto ${className}`}
				>
					{children}
				</div>
			) : (
				<div
					className={`grid grid-cols-1 gap-x-5 xl:grid-cols-12 ${className}`}
				>
					<div className='xl:col-span-12'>{children}</div>
				</div>
			)}
		</>
	);
};

export default BasicLayout;
