import { formatDistanceToNow } from 'date-fns';

const PostHeader = ({ user, createdAt, onDelete, onEdit, showDeleteButton, showEditButton }) => (
  <div className="flex justify-between items-start mb-4">
    <div>
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <img
          src={user?.photo}
          alt={user?.name}
          className="w-8 h-8 rounded-full mr-2"
          loading="eager"
        />
        <span>By {user?.name || "Unknown"}</span>
        <span className="mx-2">•</span>
        <span>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
    {(showEditButton || showDeleteButton) && (
      <div className="flex gap-2">
        {showEditButton && (
          <button
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={onEdit}
            aria-label="Edit post"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
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
    )}
  </div>
);

export default PostHeader;
