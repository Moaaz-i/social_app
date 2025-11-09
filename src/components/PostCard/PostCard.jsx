import { useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import PostHeader from "./components/PostHeader";
import PostStats from "./components/PostStats";
import Comment from "./components/Comment";
import CommentForm from "./components/CommentForm";
import { toast } from "react-hot-toast";

const PostCard = memo(
  ({
    post,
    onPostDeleted = () => {},
    onToggleLike = () => {},
    onAddComment = async () => {
      throw new Error("onAddComment callback not provided");
    },
    onDeleteComment = () => {},
  }) => {
    const { user: authUser } = useAuth();
    const [showAllComments, setShowAllComments] = useState(false);
    const [newComment, setNewComment] = useState("");

    const {
      _id: postId,
      body = "",
      user = {},
      image,
      createdAt = new Date().toISOString(),
      likes = [],
      comments: postComments = [],
      commentsCount = postComments.length,
    } = post || {};

    // Check if current user liked the post
    const isLiked = useCallback(
      () =>
        (authUser?._id && likes?.some((like) => like?.user === authUser._id)) ||
        false,
      [likes, authUser]
    );

    const handleDeletePost = useCallback(() => {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      if (authUser?._id !== user?._id) {
        toast.error("You can only delete your own posts");
        return;
      }
      onPostDeleted(postId);
    }, [postId, authUser?._id, user?._id, onPostDeleted]);

    const handleLike = useCallback(() => {
      if (!authUser) {
        toast.error("Please log in to like posts");
        return;
      }
      onToggleLike(postId);
    }, [postId, onToggleLike, authUser]);

    const handleAddComment = useCallback(
      async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
          await onAddComment(postId, newComment);
          setNewComment("");
          toast.success("Comment added successfully");
        } catch (error) {
          console.error("Failed to add comment:", error);
          toast.error(error.message || "Failed to add comment");
        }
      },
      [newComment, postId, onAddComment]
    );

    const handleDeleteComment = useCallback(
      async (commentId, commentAuthorId) => {
        if (user._id === commentAuthorId) {
          if (!window.confirm("Are you sure you want to delete this comment?"))
            return;
          try {
            await onDeleteComment(postId, commentId);
            toast.success("Comment deleted successfully");
          } catch (error) {
            console.error("Failed to delete comment:", error);
            toast.error(error.message || "Failed to delete comment");
          }
        } else {
          toast.error("You can only delete your own comments");
        }
      },
      [postId, onDeleteComment, user._id]
    );

    // Optimize comment display
    const displayedComments = showAllComments
      ? [...(postComments || [])]
      : [...(postComments || [])].slice(0, 2);
    const hasMoreComments = (postComments?.length || 0) > 2;

    if (!post || !body) return null;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-6">
        <div className="p-6">
          <PostHeader
            user={user || {}}
            createdAt={createdAt}
            onDelete={handleDeletePost}
            showDeleteButton={
              !!(authUser?._id && user?._id && authUser._id === user._id)
            }
          />

          {image && (
            <div className="my-4">
              <img
                src={image}
                alt="Post content"
                className="w-full h-auto max-h-96 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          )}

          <div className="mt-4">
            <p className="text-gray-800 whitespace-pre-line">{body}</p>

            <PostStats
              likes={likes}
              isLiked={isLiked()}
              commentsCount={commentsCount}
              onLike={handleLike}
              onCommentClick={() =>
                document.getElementById(`comment-${postId}`)?.focus()
              }
            />

            {/* Comments Section */}
            <div className="mt-4 border-t border-gray-100 pt-3">
              <CommentForm
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onSubmit={handleAddComment}
                inputId={`comment-${postId}`}
              />

              {postComments.length > 0 && (
                <div className="mt-4 space-y-3">
                  {displayedComments.map((comment) => {
                    const commentUser = comment?.commentCreator || {};
                    const commentId = comment?._id;
                    const commentAuthorId = commentUser?._id;
                    const manageComment = authUser?._id === commentAuthorId;

                    console.log(commentUser?._id, authUser?._id);

                    if (!commentId) return null;

                    return (
                      <Comment
                        key={commentId}
                        comment={comment}
                        currentUserId={comment?.commentCreator?._id}
                        onDeleteComment={() =>
                          handleDeleteComment(commentId, commentAuthorId)
                        }
                        canDelete={manageComment}
                      />
                    );
                  })}

                  {hasMoreComments && !showAllComments && (
                    <button
                      onClick={() => setShowAllComments(true)}
                      className="text-sm text-blue-500 hover:text-blue-600 mt-2"
                    >
                      View {commentsCount - 2} more comments
                    </button>
                  )}

                  {showAllComments && commentsCount > 5 && (
                    <button
                      onClick={() => setShowAllComments(false)}
                      className="text-sm text-blue-500 hover:text-blue-600 mt-2"
                    >
                      Show fewer comments
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        user: PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          avatar: PropTypes.string,
        }).isRequired,
        createdAt: PropTypes.string.isRequired,
      })
    ),
    commentsCount: PropTypes.number,
    likes: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired,
      })
    ),
    image: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onPostDeleted: PropTypes.func,
  onToggleLike: PropTypes.func,
  onAddComment: PropTypes.func,
  onDeleteComment: PropTypes.func,
};

PostCard.displayName = "PostCard";

export default PostCard;
