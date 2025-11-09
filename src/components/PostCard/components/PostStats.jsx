const PostStats = ({ likesCount, commentsCount }) => (
  <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4 pb-2">
    <div className="flex items-center space-x-4">
      <span className="flex items-center">
        <svg
          className="w-4 h-4 mr-1 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
        {likesCount}
      </span>
      <span className="flex items-center">
        <svg
          className="w-4 h-4 mr-1 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {commentsCount}
      </span>
    </div>
  </div>
);

export default PostStats;
