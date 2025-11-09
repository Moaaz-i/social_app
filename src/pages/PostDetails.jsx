import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import PostCard from '../components/PostCard/PostCard';
import usePosts from '../hooks/usePostQueries';
import { toast } from 'react-hot-toast';

const PostDetails = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  
  // Use the posts hook
  const {
    usePost,
    toggleLike,
    addComment,
    deleteComment,
    deletePost
  } = usePosts();
  
  // Get the single post
  const {
    data: post,
    isLoading,
    error,
    refetch: refetchPost
  } = usePost(postId);

  const handlePostDeleted = () => {
    navigate('/');
    toast.success('Post deleted successfully');
  };

  // Handle post deletion
  const _handleDeletePost = (postIdToDelete) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postIdToDelete, {
        onSuccess: handlePostDeleted,
        onError: (error) => {
          toast.error(error.message || 'Failed to delete post');
        }
      });
    }
  };

  const handleToggleLike = (postId) => {
    toggleLike(postId, {
      onError: (error) => {
        toast.error(error.message || 'Failed to update like status');
      }
    });
  };

  const handleAddComment = async (postId, content) => {
    return addComment(
      { postId, content },
      {
        onError: (error) => {
          toast.error(error.message || 'Failed to add comment');
          throw error;
        }
      }
    );
  };

  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(
        { postId, commentId },
        {
          onError: (error) => {
            toast.error(error.message || 'Failed to delete comment');
          }
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md w-full">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md w-full">
          <div className="text-red-500 text-lg mb-4">
            {error.message || 'Failed to load post'}
          </div>
          <button
            onClick={refetchPost}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Post not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <PostCard
            post={post}
            onPostDeleted={handlePostDeleted}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
