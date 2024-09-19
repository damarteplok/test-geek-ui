import { FC, ReactNode } from 'react';

interface ListCardLayoutProps {
	className?: string;
	header?: ReactNode;
	headerClassName?: string;
	optionList?: ReactNode;
	optionListClassName?: string;
	bodyClassName?: string;
	footerClassName?: string;
	footer?: ReactNode;
	children: ReactNode;
}

const ListCardLayout: FC<ListCardLayoutProps> = ({
	className = '',
	header,
	headerClassName = '',
	optionList,
	optionListClassName = '',
	bodyClassName = '',
	footerClassName = '',
	footer,
	children,
}) => {
	return (
		<div className={`card ${className}`}>
			{header && <div className={`card-body ${headerClassName}`}>{header}</div>}
			{optionList && (
				<div className={`card-body ${optionListClassName}`}>{optionList}</div>
			)}
			<div className={`card-body ${bodyClassName}`}>{children}</div>
			{footer && <div className={`card-body ${footerClassName}`}>{footer}</div>}
		</div>
	);
};

export default ListCardLayout;
