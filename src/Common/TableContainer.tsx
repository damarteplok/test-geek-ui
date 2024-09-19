import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import {
	Column,
	Table as ReactTable,
	ColumnFiltersState,
	FilterFn,
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	flexRender,
} from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';

// Column Filter
const Filter = ({
	column,
}: {
	column: Column<any, unknown>;
	table: ReactTable<any>;
}) => {
	const columnFilterValue = column.getFilterValue();

	return (
		<>
			<DebouncedInput
				type='text'
				value={(columnFilterValue ?? '') as string}
				onChange={(value) => column.setFilterValue(value)}
				placeholder='Search...'
				className='w-36 border shadow rounded'
				list={column.id + 'list'}
			/>
			<div className='h-1' />
		</>
	);
};

// Global Filter
export const DebouncedInput = ({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number | undefined;
	onChange: (value: any) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [debounce, onChange, value]);

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
};
interface TableContainerProps {
	columns?: any;
	data?: any;
	tableclassName?: any;
	divclassName?: any;
	thclassName?: any;
	trclassName?: any;
	tableClass?: any;
	tdclassName?: any;
	theadclassName?: any;
	tbodyclassName?: any;
	isTfoot?: boolean;
	isSelect?: boolean;
	isBordered?: boolean;
	customPageSize?: number;
	isGlobalFilter?: boolean;
	isPagination: boolean;
	PaginationClassName?: string;
	SearchPlaceholder?: string;
	externalGlobalFilter?: string;
	setExternalGlobalFilter?: (filter: string) => void;
	externalColumnFilters?: ColumnFiltersState;
	setExternalColumnFilters?: (filters: ColumnFiltersState) => void;
	columnFilterHandlers?: {
		[key: string]: (value: any) => void;
	};
	columnVisibility?: Record<string, boolean>;
	setColumnVisibility?: (visibility: Record<string, boolean>) => void;
}

const TableContainer = ({
	columns,
	data,
	tableclassName,
	theadclassName,
	divclassName,
	trclassName,
	thclassName,
	tdclassName,
	tbodyclassName,
	isTfoot,
	isSelect,
	isPagination,
	customPageSize,
	isGlobalFilter,
	PaginationClassName,
	SearchPlaceholder,
	externalGlobalFilter,
	setExternalGlobalFilter,
	externalColumnFilters,
	setExternalColumnFilters,
	columnFilterHandlers,
	columnVisibility,
	setColumnVisibility,
}: TableContainerProps) => {
	const [internalColumnFilters, setInternalColumnFilters] =
		useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState(externalGlobalFilter || '');
	const [selectedOption, setSelectedOption] = useState('10');

	const columnFilters = externalColumnFilters ?? internalColumnFilters;

	const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
		const itemRank = rankItem(row.getValue(columnId), value);
		addMeta({
			itemRank,
		});
		return itemRank.passed;
	};

	const table = useReactTable({
		columns,
		data,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			columnVisibility: columnVisibility || {},
			columnFilters,
			globalFilter: externalGlobalFilter ?? globalFilter,
		},
		onColumnFiltersChange: (filters) => {
			const resolvedFilters =
				typeof filters === 'function' ? filters(columnFilters) : filters;

			if (setExternalColumnFilters) {
				setExternalColumnFilters(resolvedFilters);
			} else {
				setInternalColumnFilters(resolvedFilters);
			}
		},
		onGlobalFilterChange: (filter) => {
			if (setExternalGlobalFilter) {
				setExternalGlobalFilter(filter);
			} else {
				setGlobalFilter(filter);
			}
		},
		globalFilterFn: fuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const {
		getHeaderGroups,
		getFooterGroups,
		getRowModel,
		getPageOptions,
		setPageIndex,
		setPageSize,
		getState,
		getCanPreviousPage,
		getCanNextPage,
		nextPage,
		previousPage,
	} = table;

	const currentPage = getState().pagination.pageIndex;
	const pageCount = getPageOptions().length;

	const startPage = Math.max(currentPage - 2, 0);
	const endPage = Math.min(currentPage + 2, pageCount - 1);

	const pagesToShow = [];
	for (let i = startPage; i <= endPage; i++) {
		pagesToShow.push(i);
	}

	const optionsSelect = [
		{ value: '10', label: '10' },
		{ value: '25', label: '25' },
		{ value: '50', label: '50' },
		{ value: '100', label: '100' },
	];

	const handleTypeSelect = (e: any) => {
		setSelectedOption(e.value);
	};

	useEffect(() => {
		Number(customPageSize) && setPageSize(Number(customPageSize));
	}, [customPageSize, setPageSize]);

	useEffect(() => {
		if (externalGlobalFilter !== undefined) {
			setGlobalFilter(externalGlobalFilter);
		}
	}, [externalGlobalFilter]);

	return (
		<Fragment>
			<div className='grid grid-cols-12 lg:grid-cols-12 gap-3'>
				<div className='self-center col-span-12 lg:place-self-end'>
					{isGlobalFilter && (
						<label>
							Search:{' '}
							<DebouncedInput
								value={externalGlobalFilter ?? globalFilter}
								onChange={(value) => {
									if (setExternalGlobalFilter) {
										setExternalGlobalFilter(String(value));
									} else {
										setGlobalFilter(String(value));
									}
								}}
								className='py-2 pr-4 text-sm text-topbar-item bg-topbar border border-topbar-border rounded pl-2 placeholder:text-slate-400 form-control focus-visible:outline-0 min-w-[200px] focus:border-blue-400 group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:border-topbar-border-dark group-data-[topbar=dark]:placeholder:text-slate-500 group-data-[topbar=dark]:text-topbar-item-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:border-topbar-border-brand group-data-[topbar=brand]:placeholder:text-blue-300 group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:border-zink-500 group-data-[topbar=dark]:dark:text-zink-100'
								placeholder={SearchPlaceholder}
							/>
						</label>
					)}
				</div>
			</div>

			<div className={divclassName}>
				<table className={tableclassName}>
					<thead className={theadclassName}>
						{getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className={trclassName}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
											{...{
												className: `${header.column.getCanSort()} ${thclassName}`,
												onClick: header.column.getToggleSortingHandler(),
											}}
										>
											{header.isPlaceholder ? null : (
												<React.Fragment>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{{
														asc: ' ',
														desc: ' ',
													}[header.column.getIsSorted() as string] ?? null}
													{header.column.getCanFilter() ? (
														<div>
															<Filter column={header.column} table={table} />
														</div>
													) : null}
												</React.Fragment>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>

					<tbody className={tbodyclassName}>
						{getRowModel().rows.map((row) => {
							return (
								<tr key={row.id} className={trclassName}>
									{row.getVisibleCells().map((cell) => {
										return (
											<td key={cell.id} className={tdclassName}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>

					{isTfoot && (
						<tfoot>
							{getFooterGroups()?.map((footer: any, tfKey: number) => (
								<tr key={tfKey}>
									{footer.headers?.map((tf: any, key: number) => (
										<th
											key={key}
											className='p-3 text-left group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500'
										>
											{flexRender(tf.column.columnDef.header, tf.getContext())}
										</th>
									))}
								</tr>
							))}
						</tfoot>
					)}
				</table>
			</div>

			{isPagination && (
				<div className={PaginationClassName}>
					<div className='mb-4 grow md:mb-0'>
						{isSelect && (
							<div className='flex items-center space-x-2 col-span-12 lg:col-span-6'>
								<span>Show</span>
								<Select
									options={optionsSelect}
									className='border-slate-200 focus:outline-none focus:border-custom-500'
									onChange={handleTypeSelect}
									value={optionsSelect.find(
										(option) => option.value === selectedOption
									)}
								/>
								<span>
									{' '}
									of <b> {data.length}</b> Results
								</span>
							</div>
						)}
						{!isSelect && (
							<div className='text-slate-500 dark:text-zink-200'>
								Showing <b> {getState().pagination.pageSize}</b> of{' '}
								<b> {data.length}</b> Results
							</div>
						)}
					</div>
					<ul className='flex flex-wrap items-center gap-2 shrink-0'>
						{getCanPreviousPage() && (
							<li>
								<Link
									to='#!'
									className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto ${
										!getCanPreviousPage() && 'disabled'
									}`}
									onClick={() => setPageIndex(0)}
								>
									<ChevronsLeft className='size-4 mr-1 rtl:rotate-180'></ChevronsLeft>
								</Link>
							</li>
						)}

						{getCanPreviousPage() && (
							<li>
								<Link
									to='#!'
									className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto ${
										!getCanPreviousPage() && 'disabled'
									}`}
									onClick={previousPage}
								>
									<ChevronLeft className='size-4 mr-1 rtl:rotate-180'></ChevronLeft>
								</Link>
							</li>
						)}

						{pagesToShow.map((item: any, key: number) => (
							<React.Fragment key={'page' + key}>
								<li>
									<Link
										to='#'
										className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-100 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-white dark:[&.active]:text-white [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.active]:hover:text-custom-700 dark:[&.active]:hover:text-custom-700 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto ${
											getState().pagination.pageIndex === item && 'active'
										}`}
										onClick={() => setPageIndex(item)}
									>
										{item + 1}
									</Link>
								</li>
							</React.Fragment>
						))}

						{getCanNextPage() && (
							<li>
								<Link
									to='#!'
									className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto 
                ${!getCanNextPage() && ''}`}
									onClick={() => getCanNextPage() && nextPage()}
								>
									<ChevronRight className='size-4 ml-1 rtl:rotate-180'></ChevronRight>{' '}
								</Link>
							</li>
						)}
						{getCanNextPage() && (
							<li>
								<Link
									to='#!'
									className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto 
                ${!getCanNextPage() && ''}`}
									onClick={() => setPageIndex(getPageOptions().length - 1)}
								>
									<ChevronsRight className='size-4 ml-1 rtl:rotate-180'></ChevronsRight>{' '}
								</Link>
							</li>
						)}
					</ul>
				</div>
			)}
		</Fragment>
	);
};

export default TableContainer;
