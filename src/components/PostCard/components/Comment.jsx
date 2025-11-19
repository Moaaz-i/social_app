import {formatDistanceToNow} from 'date-fns'

const Comment = ({
  comment = {},
  currentUserId = '',
  postOwnerId = '',
  onDeleteComment
}) => {
  const user = comment?.commentCreator || {}
  const isAuthorized =
    currentUserId === user?._id || currentUserId === postOwnerId

  return (
    <div className="flex items-start group">
      <img
        src={
          user?.photo?.endsWith('undefined')
            ? 'https://linked-posts.routemisr.com/uploads/default-profile.png'
            : user.photo
        }
        alt={user.name || 'User'}
        className="w-8 h-8 rounded-full mr-2 mt-1"
        loading="eager"
      />
      <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-medium text-sm text-gray-900">
              {user.name || 'Unknown User'}
            </span>
            <p className="text-sm text-gray-700">{comment.content || ''}</p>
          </div>
          {isAuthorized && (
            <button
              onClick={() => onDeleteComment(comment._id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
              title="Delete comment"
            >
              <svg
                className="w-4 h-4"
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
        <div className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true
          })}
        </div>
      </div>
    </div>
  )
}

export default Comment
