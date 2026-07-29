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
import {useUploadPhoto, useUpdateProfile} from '../services/profileService'
import {useNavigate, Link} from 'react-router-dom'
import {useState, useRef, useEffect} from 'react'
import {toast} from 'react-hot-toast'
import {
  FiCamera,
  FiLogOut,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiUser,
  FiFileText,
  FiPlusCircle,
  FiWifiOff,
  FiRefreshCw
} from 'react-icons/fi'
import useOffline from '../hooks/useOffline'

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
  const [errorPhoto, setErrorPhoto] = useState(null)
  const updateProfile = useUpdateProfile()
  const [showBannerPicker, setShowBannerPicker] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bioText, setBioText] = useState("")

  const {isOnline, forceDetect} = useOffline()

  useEffect(() => {
    if (user?.photo && !photoPreview) {
      setPhotoPreview(user?.photo)
      setImageKey(Date.now())
    }
  }, [user?.photo, photoPreview])

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

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setPhotoPreview(previewUrl)

    setIsUploadingPhoto(true)

    const formData = new FormData()
    formData.append('photo', file)

    try {
      setErrorPhoto(null)
      await uploadPhoto.mutateAsync(formData)
      toast.success('Profile picture updated successfully!')
      setTimeout(() => {
        setImageKey(Date.now())
      }, 500)
    } catch (error) {
      setPhotoPreview(user?.photo)
      const status = error?.response?.status || error?.status
      let message
      if (status === 413) {
        message = 'Image size should be less than 5MB'
      } else if (typeof error === 'string') {
        message = error
      } else if (error?.message) {
        message = error.message
      } else {
        message = 'Failed to upload photo'
      }
      setErrorPhoto(message)
      toast.error(message)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 animate-fadeIn">
          {/* Cover Banner */}
          <div className={`h-40 w-full relative ${user?.banner || 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'} transition-all duration-300`}>
            {/* Edit Banner Button */}
            <button
              onClick={() => setShowBannerPicker(!showBannerPicker)}
              className="absolute top-4 right-4 bg-white/25 backdrop-blur-md hover:bg-white/40 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer border border-white/20"
            >
              🎨 Change Banner
            </button>
          </div>

          {showBannerPicker && (
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-b border-gray-100 dark:border-slate-700 flex flex-wrap gap-2 justify-center items-center animate-fadeIn">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mr-2">Choose Banner:</span>
              {[
                { name: "Aurora", class: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" },
                { name: "Emerald", class: "bg-gradient-to-r from-emerald-500 to-teal-600" },
                { name: "Sunset", class: "bg-gradient-to-r from-orange-400 to-rose-500" },
                { name: "Midnight", class: "bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900" },
                { name: "Indigo", class: "bg-gradient-to-r from-indigo-500 to-purple-600" }
              ].map(gradient => (
                <button
                  key={gradient.name}
                  onClick={async () => {
                    try {
                      await updateProfile.mutateAsync({ banner: gradient.class })
                      setShowBannerPicker(false)
                    } catch (err) {
                      toast.error("Failed to update banner")
                    }
                  }}
                  className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-700 shadow-md cursor-pointer ${gradient.class}`}
                  title={gradient.name}
                />
              ))}
            </div>
          )}

          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400 to-blue-600 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-32 h-32 md:-mt-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl group border-4 border-white dark:border-slate-800">
                {photoPreview ? (
                  <img
                    key={imageKey}
                    src={photoPreview}
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
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mb-2">
                  <FiMail className="w-4 h-4" />
                  {user?.email}
                </p>

                {isEditingBio ? (
                  <div className="mt-2 mb-3 flex gap-2 max-w-md justify-center md:justify-start">
                    <input
                      type="text"
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      placeholder="Write something about yourself..."
                      className="px-3 py-1.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                    />
                    <button
                      onClick={async () => {
                        try {
                          await updateProfile.mutateAsync({ bio: bioText })
                          setIsEditingBio(false)
                        } catch (err) {
                          toast.error("Failed to update bio")
                        }
                      }}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 mb-3 flex items-center justify-center md:justify-start gap-2 group/bio">
                    <p className="text-gray-600 dark:text-gray-300 italic text-sm">
                      {user?.bio || "No bio added yet. Tell us about yourself!"}
                    </p>
                    <button
                      onClick={() => {
                        setBioText(user?.bio || "")
                        setIsEditingBio(true)
                      }}
                      className="text-xs text-blue-600 opacity-0 group-hover/bio:opacity-100 transition-opacity cursor-pointer font-bold"
                    >
                      ✏️ Edit Bio
                    </button>
                  </div>
                )}

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

                {errorPhoto && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-5 bg-gradient-to-r from-red-300 to-pink-300 text-white p-2 rounded-xl">
                    <p className="text-white text-sm">{errorPhoto}</p>
                  </div>
                )}
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
              <span className="text-green-600 font-bold text-lg">
                Active & Verified
              </span>
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
            <p className="text-white/90 mt-2">
              Share your thoughts with the world
            </p>
          </div>

          <div className="p-6">
            {!isOnline ? (
              <div className="bg-white rounded-3xl shadow-lg p-10 md:p-16 text-center border border-red-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-50 via-orange-50 to-rose-100 rounded-2xl mb-6 border border-red-100">
                  <FiWifiOff className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  You are offline
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Please check your internet connection. Once you are back
                  online, your posts will refresh automatically.
                </p>
                <button
                  onClick={forceDetect}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  Retry connection
                </button>
              </div>
            ) : getUserPosts.isLoading ? (
              <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                </div>
                <p className="text-gray-600 font-semibold">
                  Loading your posts...
                </p>
              </div>
            ) : userPosts.length > 0 ? (
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
