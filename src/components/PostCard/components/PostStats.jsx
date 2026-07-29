import React from "react";

const PostStats = ({
  likes = [],
  isLiked = false,
  commentsCount = 0,
  onLike,
  onCommentClick,
}) => {
  const likesCount = likes?.length || 0;

  return (
    <div className="flex flex-col border-t border-gray-100 mt-4 pt-3">
      {/* Stats Summary Row */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3 px-1">
        <span className="flex items-center gap-1">
          <span className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full text-white">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </span>
          {likesCount === 0 ? "Be the first to like" : `${likesCount} likes`}
        </span>
        <span>{commentsCount} comments</span>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center border-t border-gray-100 pt-2 gap-2">
        <button
          onClick={onLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
            isLiked
              ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 active:scale-125 ${
              isLiked ? "fill-current text-blue-600" : "stroke-current text-gray-500 fill-none"
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            {isLiked ? (
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
              />
            )}
          </svg>
          {isLiked ? "Liked" : "Like"}
        </button>

        <button
          onClick={onCommentClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 stroke-current text-gray-500 fill-none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Comment
        </button>
      </div>
    </div>
  );
};

export default PostStats;

