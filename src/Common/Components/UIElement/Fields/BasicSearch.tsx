import { DebouncedInput } from 'Common/TableContainer';
import { Search } from 'lucide-react';
import React from 'react';

interface BasicSearchProps {
	placeholder?: string;
	value: string | number | undefined;
	onChange: (event: any) => void;
	disabled?: boolean;
	classNameInput?: string;
}

const BasicSearch: React.FC<BasicSearchProps> = ({
	placeholder = 'Search for ...',
	value,
	onChange,
	disabled = false,
	classNameInput = '',
}) => {
	return (
		<div className='relative'>
			<DebouncedInput
				value={value}
				onChange={onChange}
				className={`${classNameInput} ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200`}
				placeholder={placeholder}
				disabled={disabled}
			></DebouncedInput>

			<Search className='inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600' />
		</div>
	);
};

export default BasicSearch;
