import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
const JobCard = ({ job }) => {
  const {
    title,
    deadline,
    category,
    min_price,
    max_price,
    description,
    _id,
    bid_count
  } = job || {};
  // console.log(category);
  return (
    <Link
      to={`/job/${_id}`}
      className='w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all'
    >
      <div className='flex items-center justify-between'>
        <span className='text-xs font-light text-gray-800 '>
          Deadline: {format(new Date(deadline), 'P')}
        </span>
        {/* text-blue-800 bg-blue-200 */}
        <span
          className={`px-3 py-1 font-bold text-[8px] uppercase rounded-full ${
            category === 'Web Development'
              ? 'text-purple-800 bg-purple-200'
              : category === 'Graphics Design'
              ? 'text-blue-800 bg-blue-200'
              : category === 'Digital Marketing'
              ? 'text-green-800 bg-green-200'
              : ''
          }`}
        >
          {category}
        </span>
      </div>

      <div>
        <h1 className='mt-2 text-lg font-semibold text-gray-800 '>{title}</h1>

        <p className='mt-2 text-sm text-gray-600 '>
          {description.substring(0, 70)}...
        </p>
        <p className='mt-2 text-sm font-bold text-gray-600 '>
          Range: ${min_price} - ${max_price}
        </p>
        <p className='mt-2 text-sm font-bold text-gray-600 '>Total Bids: {bid_count}</p>
      </div>
    </Link>
  );
};

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
};

export default JobCard;
