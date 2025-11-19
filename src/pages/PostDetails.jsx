import {useParams, useNavigate} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import PostCard from '../components/PostCard/PostCard'
import useAuth from '../hooks/useAuth'
import {
  GetPost,
  CreateComment,
  DeletePost,
  LikePost,
  DeleteComment,
  UpdatePost
} from '../services/postService'
import {toast} from 'react-hot-toast'

const PostDetails = () => {
  const {id: postId} = useParams()
  const navigate = useNavigate()
  const {userData} = useAuth()

  const getPost = GetPost(postId)
  const createComment = CreateComment()
  const deletePostMutation = DeletePost()
  const updatePost = UpdatePost()
  const likePost = LikePost()
  const deleteCommentMutation = DeleteComment()

  const post = getPost?.data?.post
  const isLoading = getPost.isLoading
  const error = getPost.error

  const handleDeletePost = async (postIdToDelete) => {
    return new Promise((resolve, reject) => {
      deletePostMutation.mutate(
        {id: postIdToDelete},
        {
          onSuccess: () => {
            navigate('/posts')
            resolve()
          },
          onError: (error) => {
            reject(error)
          }
        }
      )
    })
  }

  const handleUpdatePost = async (postId, formData) => {
    return new Promise((resolve, reject) => {
      updatePost.mutate(formData, {
        onSuccess: () => {
          getPost.refetch()
          resolve()
        },
        onError: (error) => {
          reject(error)
        }
      })
    })
  }

  const handleToggleLike = async (postId) => {
    return new Promise((resolve, reject) => {
      likePost.mutate(
        {id: postId},
        {
          onSuccess: () => {
            getPost.refetch()
            resolve()
          },
          onError: (error) => {
            reject(error)
          }
        }
      )
    })
  }

  const handleAddComment = async (postId, content) => {
    return new Promise((resolve, reject) => {
      createComment.mutate(
        {post: postId, content},
        {
          onSuccess: () => {
            getPost.refetch()
            resolve()
          },
          onError: (error) => {
            reject(error)
          }
        }
      )
    })
  }

  const handleDeleteComment = async (postId, commentId) => {
    return new Promise((resolve, reject) => {
      deleteCommentMutation.mutate(
        {id: commentId},
        {
          onSuccess: () => {
            getPost.refetch()
            resolve()
          },
          onError: (error) => {
            reject(error)
          }
        }
      )
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md w-full">
          <div className="text-red-500 text-lg mb-4">
            {error?.message || 'Failed to load post'}
          </div>
          <button
            onClick={() => getPost.refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Post not found
          </h2>
          <button
            onClick={() => navigate('/posts')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Posts
          </button>
        </div>
      </div>
    )
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

        <PostCard
          post={post}
          onPostDeleted={handleDeletePost}
          onPostUpdated={handleUpdatePost}
          onToggleLike={handleToggleLike}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  )
}

export default PostDetails
