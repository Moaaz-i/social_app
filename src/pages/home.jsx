import PostCard from '../components/PostCard/PostCard'
import useAuth from '../hooks/useAuth'
import {
  GetUserPosts,
  CreateComment,
  DeletePost,
  LikePost,
  DeleteComment,
  UpdatePost
} from '../services/postService'
import {useUploadPhoto} from '../services/profileService'
import {useNavigate, Link} from 'react-router-dom'
import {useState, useRef, useEffect} from 'react'
import {toast} from 'react-hot-toast'
import {FiCamera, FiLogOut, FiMail, FiCalendar, FiCheckCircle, FiUser, FiFileText, FiPlusCircle} from 'react-icons/fi'

const Home = () => {
  const {userData, logout} = useAuth()
  const user = userData?.user
  const getUserPosts = GetUserPosts(user?._id)
  const createComment = CreateComment()
  const deletePost = DeletePost()
  const updatePost = UpdatePost()
  const likePost = LikePost()
  const deleteComment = DeleteComment()
  const uploadPhoto = useUploadPhoto()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [imageKey, setImageKey] = useState(Date.now())

  // Update image key when user photo changes
  useEffect(() => {
    if (user?.photo && !photoPreview) {
      setImageKey(Date.now())
    }
  }, [user?.photo, photoPreview])

  // Use data directly from React Query
  const userPosts = getUserPosts?.data?.posts || []

  const handleAddComment = async (postId, content) => {
    return new Promise((resolve, reject) => {
      createComment.mutate(
        {post: postId, content},
        {
          onSuccess: () => {
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

  const handleDeletePost = async (postId) => {
    return new Promise((resolve, reject) => {
      deletePost.mutate(
        {id: postId},
        {
          onSuccess: () => {
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
      updatePost.mutate(formData, {
        onSuccess: () => {
          getUserPosts.refetch()
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

  const handleDeleteComment = async (postId, commentId) => {
    return new Promise((resolve, reject) => {
      deleteComment.mutate(
        {id: commentId},
        {
          onSuccess: () => {
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

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file)
    setPhotoPreview(previewUrl)

    setIsUploadingPhoto(true)

    try {
      const formData = new FormData()
      formData.append('photo', file)

      await uploadPhoto.mutateAsync(formData)
      toast.success('Photo updated successfully!')
      // Clear preview after successful upload
      setPhotoPreview(null)
      // Force image refresh
      setTimeout(() => {
        setImageKey(Date.now())
      }, 500)
    } catch (error) {
      console.error('Failed to upload photo:', error)
      toast.error(error?.message || 'Failed to upload photo')
      // Revert preview on error
      setPhotoPreview(null)
    } finally {
      setIsUploadingPhoto(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 animate-fadeIn">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400 to-blue-600 rounded-full blur-3xl opacity-10"></div>
          
          <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl group">
              {photoPreview || user?.photo ? (
                <img
                  key={imageKey}
                  src={photoPreview || `${user?.photo}?v=${imageKey}`}
                  alt={user?.name}
                  className="w-full h-full object-cover rounded-3xl"
                  loading="eager"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}

              {/* Camera Icon Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed backdrop-blur-sm"
              >
                {isUploadingPhoto ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : (
                  <FiCamera className="text-white text-2xl" />
                )}
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
                {user?.name}
              </h1>
              <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mb-4">
                <FiMail className="w-4 h-4" />
                {user?.email}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg">
                  <FiUser className="w-4 h-4" />
                  {user?.role === 'admin' ? 'Admin' : 'User'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg">
                  <FiCheckCircle className="w-4 h-4" />
                  {user?.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Email Card */}
          <div className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiMail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Email Address</h3>
            </div>
            <p className="text-gray-700 font-medium text-lg">{user?.email}</p>
          </div>

          {/* Gender Card */}
          <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Gender</h3>
            </div>
            <p className="text-gray-700 font-medium text-lg capitalize">
              {user?.gender || 'Not specified'}
            </p>
          </div>

          {/* Account Status Card */}
          <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300 md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiCheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Account Status
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 bg-green-500 rounded-full animate-pulse shadow-lg"></span>
              <span className="text-green-600 font-bold text-lg">Active & Verified</span>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FiFileText className="w-6 h-6" />
              </div>
              Your Posts
            </h2>
            <p className="text-white/90 mt-2">Share your thoughts with the world</p>
          </div>
          
          <div className="p-6">

            {userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
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
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mb-6">
                  <FiFileText className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start sharing your thoughts and ideas with the community!
                </p>
                <Link
                  to="/posts/create"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <FiPlusCircle className="w-5 h-5" />
                  Create Your First Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
