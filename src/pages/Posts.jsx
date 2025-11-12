import PostCard from '../components/PostCard/PostCard'
import useAuth from '../hooks/useAuth'
import {
  GetAllPosts,
  CreateComment,
  DeletePost,
  LikePost,
  DeleteComment,
  GetUserPosts,
  UpdatePost
} from '../services/postService'
import {useNavigate} from 'react-router-dom'
import {FiPlusCircle, FiTrendingUp, FiFilter} from 'react-icons/fi'

const Posts = () => {
  const navigate = useNavigate()
  const {userData} = useAuth()

  const getPosts = GetAllPosts()
  const createComment = CreateComment()
  const deletePost = DeletePost()
  const updatePost = UpdatePost()
  const likePost = LikePost()
  const deleteComment = DeleteComment()
  const getUserPosts = GetUserPosts(userData?.user?._id)

  // Use data directly from React Query
  const posts = getPosts?.data?.posts || []
  const userPosts = getUserPosts?.data?.posts || []
  const allPosts = [...posts, ...userPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  const handleAddComment = async (postId, content) => {
    return new Promise((resolve, reject) => {
      createComment.mutate(
        {post: postId, content},
        {
          onSuccess: () => {
            getPosts.refetch()
            resolve()
          },
          onError: (error) => {
            reject(error)
          }
        }
      )
    })
  }

  const handleDeletePost = async (postId) => {
    return new Promise((resolve, reject) => {
      deletePost.mutate(
        {id: postId},
        {
          onSuccess: () => {
            getPosts.refetch()
            getUserPosts.refetch()
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
      updatePost.mutate(
        formData,
        {
          onSuccess: () => {
            getPosts.refetch()
            getUserPosts.refetch()
            resolve()
          },
          onError: (error) => {
            reject(error)
          }
        }
      )
    })
  }

  const handleToggleLike = async (postId) => {
    return new Promise((resolve, reject) => {
      likePost.mutate(
        {id: postId},
        {
          onSuccess: () => {
            getPosts.refetch()
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
      deleteComment.mutate(
        {id: commentId},
        {
          onSuccess: () => {
            getPosts.refetch()
            resolve()
          },
          onError: (error) => {
            reject(error)
          }
        }
      )
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header Section */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 animate-fadeIn">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-10"></div>
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                    Discover Posts
                  </h1>
                </div>
                <p className="text-gray-600 ml-1">Explore what's happening in the community</p>
              </div>
              
              <button
                onClick={() => navigate('/posts/create')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                <FiPlusCircle className="w-5 h-5" />
                Create Post
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                <p className="text-blue-600 text-sm font-semibold mb-1">Total Posts</p>
                <p className="text-2xl font-black text-blue-700">{allPosts.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                <p className="text-purple-600 text-sm font-semibold mb-1">Your Posts</p>
                <p className="text-2xl font-black text-purple-700">{userPosts.length}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200 col-span-2 md:col-span-1">
                <p className="text-pink-600 text-sm font-semibold mb-1">Community</p>
                <p className="text-2xl font-black text-pink-700">{posts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {getPosts.isLoading && getUserPosts.isLoading ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              </div>
              <p className="text-gray-600 font-semibold">Loading amazing posts...</p>
            </div>
          ) : allPosts.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mb-6">
                <FiTrendingUp className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Be the first to share something amazing with the community!
              </p>
              <button
                onClick={() => navigate('/posts/create')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <FiPlusCircle className="w-5 h-5" />
                Create First Post
              </button>
            </div>
          ) : (
            <>
              {/* Filter/Sort Bar */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiFilter className="w-5 h-5" />
                  <span className="font-semibold">Sorted by: Latest</span>
                </div>
                <span className="text-sm text-gray-500">{allPosts.length} posts</span>
              </div>
              
              {/* Posts List */}
              {allPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onAddComment={handleAddComment}
                  onPostDeleted={handleDeletePost}
                  onPostUpdated={handleUpdatePost}
                  onToggleLike={handleToggleLike}
                  onDeleteComment={handleDeleteComment}
                  onPostClick={(postId) => navigate(`/posts/${postId}`)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Posts
