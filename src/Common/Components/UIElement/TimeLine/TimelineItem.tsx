import React from 'react';

interface TimelineItemProps {
	title: string;
	description?: string;
	date?: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
	title,
	description,
	date,
}) => {
	return (
		<div className='relative ltr:pl-6 rtl:pr-6 before:absolute ltr:before:border-l ltr:before:left-[.22rem] rtl:before:border-r before:border-slate-200 rtl:before:right-[.22rem] before:top-1.5 before:-bottom-1.5 after:absolute after:size-2 after:bg-custom-500 after:rounded-full ltr:after:left-0 rtl:after:right-0 after:top-1.5 pb-4 dark:before:border-zink-500'>
			<h6 className='mb-4 text-15'>{title}</h6>
			{description && (
				<p className='mb-2 text-slate-400 dark:text-zink-200'>{description}</p>
			)}
			{date && (
				<p className='text-sm text-slate-400 dark:text-zink-200'>{date}</p>
			)}
		</div>
	);
};

export default TimelineItem;
