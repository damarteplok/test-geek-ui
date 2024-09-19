import { Search } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface NoResultProps {
	title?: string;
	message?: string;
	children?: ReactNode;
}

const NoResult: FC<NoResultProps> = ({
	title = 'Sorry! No Result Found',
	message = 'We did not find any data for you search.',
	children,
}) => {
	return (
		<div className='noresult'>
			<div className='py-6 text-center'>
				<Search className='size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20' />
				<h5 className='mt-2 mb-1'>{title}</h5>
				<p className='mb-0 text-slate-500 dark:text-zink-200'>{message}</p>
				{children}
			</div>
		</div>
	);
};

export default NoResult;
