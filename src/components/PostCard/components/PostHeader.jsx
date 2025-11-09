import { formatDistanceToNow } from 'date-fns';

const PostHeader = ({ user, createdAt, onDelete, showDeleteButton }) => (
  <div className="flex justify-between items-start mb-4">
    <div>
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <img
          src={user?.photo}
          alt={user?.name}
          className="w-8 h-8 rounded-full mr-2"
        />
        <span>By {user?.name || "Unknown"}</span>
        <span className="mx-2">•</span>
        <span>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
    {showDeleteButton && (
      <button
        className="text-gray-500 hover:text-gray-700 cursor-pointer"
        onClick={onDelete}
        aria-label="Delete post"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )}
  </div>
);

export default PostHeader;
