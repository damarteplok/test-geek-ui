import { SlidersHorizontal } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface FilterButtonProps {
	onClick?: () => void;
	children?: ReactNode;
}

const FilterButton: FC<FilterButtonProps> = ({ onClick, children }) => {
	return (
		<button
			aria-label='button-filter'
			type={'button'}
			className={`flex items-center justify-center size-[37.5px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20`}
			onClick={onClick}
		>
			<SlidersHorizontal className='size-4' />
			{children}
		</button>
	);
};

export default FilterButton;
