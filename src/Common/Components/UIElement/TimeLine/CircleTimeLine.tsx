import TimelineItem from './TimelineItem';
import moment from 'moment';

interface CircleTimelineProps {
	items: {
		title: string;
		description?: string;
		date?: string;
	}[];
}

const CircleTimeline: React.FC<CircleTimelineProps> = ({ items }) => {
	return (
		<div>
			{items.length < 1 && <p>No result!</p>}
			{items.map((item, index) => (
				<TimelineItem
					key={index}
					title={item.title}
					description={item.description}
					date={item.date ? moment(item.date).format('YYYY-MM-DD HH:mm') : ''}
				/>
			))}
		</div>
	);
};

export default CircleTimeline;
