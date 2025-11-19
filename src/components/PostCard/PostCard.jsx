import {useState, useCallback, memo, useRef} from 'react'
import PropTypes from 'prop-types'
import useAuth from '../../hooks/useAuth'
import PostHeader from './components/PostHeader'
import PostStats from './components/PostStats'
import Comment from './components/Comment'
import CommentForm from './components/CommentForm'
import {toast} from 'react-hot-toast'
import {FiX, FiImage} from 'react-icons/fi'

const PostCard = memo(
  ({
    post,
    onPostDeleted = () => {},
    onPostUpdated = () => {},
    onToggleLike = () => {},
    onAddComment = async () => {
      throw new Error('onAddComment callback not provided')
    },
    onDeleteComment = () => {},
    onPostClick = null,
    showFullDetails = false
  }) => {
    const {userData} = useAuth()

    const {
      _id: postId,
      body = '',
      user = {},
      image,
      createdAt = new Date().toISOString(),
      likes = [],
      comments: postComments = [],
      commentsCount = postComments.length
    } = post || {}

    const [showAllComments, setShowAllComments] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editBody, setEditBody] = useState(body)
    const [editImage, setEditImage] = useState(null)
    const [editImagePreview, setEditImagePreview] = useState(image)
    const fileInputRef = useRef(null)

    const isLiked = useCallback(
      () =>
        (userData?.user?._id &&
          likes?.some((like) => like?.user === userData?.user?._id)) ||
        false,
      [likes, userData]
    )

    const handleDeletePost = useCallback(() => {
      if (!window.confirm('Are you sure you want to delete this post?')) return
      if (userData?.user?._id !== user?._id) {
        toast.error('You can only delete your own posts')
        return
      }
      onPostDeleted(postId)
    }, [postId, userData?.user?._id, user?._id, onPostDeleted])

    const handleEditPost = useCallback(() => {
      setIsEditing(true)
      setEditBody(body)
      setEditImagePreview(image)
    }, [body, image])

    const handleCancelEdit = useCallback(() => {
      setIsEditing(false)
      setEditBody(body)
      setEditImage(null)
      setEditImagePreview(image)
    }, [body, image])

    const handleImageChange = useCallback((e) => {
      const file = e.target.files[0]
      if (file) {
        setEditImage(file)
        setEditImagePreview(URL.createObjectURL(file))
      }
    }, [])

    const handleRemoveImage = useCallback(() => {
      setEditImage(null)
      setEditImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, [])

    const handleUpdatePost = useCallback(async () => {
      if (!editBody.trim() && !editImagePreview) {
        toast.error('Post must have content or an image')
        return
      }

      try {
        const formData = new FormData()
        formData.append('id', postId)
        formData.append('body', editBody)
        if (editImage) {
          formData.append('image', editImage, editImage.name)
        }

        await onPostUpdated(postId, formData)
        setIsEditing(false)
      } catch (error) {
        console.error('Failed to update post:', error)
        toast.error(error.message || 'Failed to update post')
      }
    }, [editBody, editImage, editImagePreview, postId, onPostUpdated])

    const handleLike = useCallback(() => {
      if (!userData?.user?._id) {
        toast.error('Please log in to like posts')
        return
      }
      onToggleLike(postId)
    }, [postId, onToggleLike, userData?.user?._id])

    const handleAddComment = useCallback(
      async (data) => {
        if (!data.comment.trim()) return

        try {
          await onAddComment(postId, data.comment)
          toast.success('Comment added successfully')
        } catch (error) {
          console.error('Failed to add comment:', error)
          toast.error(error || 'Failed to add comment')
        }
      },
      [postId, onAddComment]
    )

    const handleDeleteComment = useCallback(
      async (commentId, userData, commentUser) => {
        if (commentUser._id === userData?.user?._id) {
          if (!window.confirm('Are you sure you want to delete this comment?'))
            return
          try {
            await onDeleteComment(postId, commentId)
            toast.success('Comment deleted successfully')
          } catch (error) {
            console.error('Failed to delete comment:', error)
            toast.error(error.message || 'Failed to delete comment')
          }
        } else {
          toast.error('You can only delete your own comments')
        }
      },
      [postId, onDeleteComment]
    )

    const displayedComments = showAllComments
      ? [
          ...(postComments.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ) || [])
        ]
      : [
          ...(postComments.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ) || [])
        ].slice(0, 2)
    const hasMoreComments = (postComments?.length || 0) > 2

    if (!post || !body) return null

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-6">
        <div className="p-6">
          <PostHeader
            user={user || {}}
            createdAt={createdAt}
            onDelete={handleDeletePost}
            onEdit={handleEditPost}
            showDeleteButton={
              !!(
                userData?.user?._id &&
                user?._id &&
                userData?.user?._id === user._id
              )
            }
            showEditButton={
              !!(
                userData?.user?._id &&
                user?._id &&
                userData?.user?._id === user._id
              )
            }
          />

          {image && (
            <div
              className="my-4"
              onClick={onPostClick ? () => onPostClick(postId) : undefined}
              style={onPostClick ? {cursor: 'pointer'} : {}}
            >
              <img
                src={image}
                alt="Post content"
                className="w-full h-auto max-h-96 object-cover rounded-lg"
                loading="eager"
              />
            </div>
          )}

          <div
            className="mt-4"
            onClick={onPostClick ? () => onPostClick(postId) : undefined}
            style={onPostClick ? {cursor: 'pointer'} : {}}
          >
            <p className="text-gray-800 whitespace-pre-line">{body}</p>
          </div>

          <div className="mt-4">
            <PostStats
              likes={likes}
              isLiked={isLiked()}
              commentsCount={commentsCount}
              onLike={handleLike}
              onCommentClick={() =>
                document.getElementById(`comment-${postId}`)?.focus()
              }
            />

            {/* Edit Modal */}
            {isEditing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Edit Post
                      </h2>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows="4"
                          placeholder="What's on your mind?"
                        />
                      </div>

                      {editImagePreview && (
                        <div className="relative group rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={editImagePreview}
                            alt="Preview"
                            className="w-full max-h-96 object-cover"
                            loading="eager"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-3 right-3 p-2 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX size={18} />
                          </button>
                        </div>
                      )}

                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id={`edit-image-${postId}`}
                        />
                        <label
                          htmlFor={`edit-image-${postId}`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <FiImage className="mr-2" />
                          {editImagePreview ? 'Change Image' : 'Add Image'}
                        </label>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleUpdatePost}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Update Post
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-4 border-t border-gray-100 pt-3">
              <CommentForm onSubmit={handleAddComment} />

              {postComments.length > 0 && (
                <div className="mt-4 space-y-3">
                  {displayedComments.map((comment) => {
                    const commentId = comment?._id
                    const commentUser = comment?.commentCreator || {}
                    const postUser = user || {}

                    return (
                      <Comment
                        key={commentId}
                        comment={comment}
                        currentUser={userData}
                        postUser={postUser}
                        onDeleteComment={() =>
                          handleDeleteComment(commentId, userData, postUser)
                        }
                      />
                    )
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
    )
  }
)

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string
    }).isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        user: PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          avatar: PropTypes.string
        }).isRequired,
        createdAt: PropTypes.string.isRequired
      })
    ),
    commentsCount: PropTypes.number,
    likes: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired
      })
    ),
    image: PropTypes.string,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  onPostDeleted: PropTypes.func,
  onToggleLike: PropTypes.func,
  onAddComment: PropTypes.func,
  onDeleteComment: PropTypes.func
}

PostCard.displayName = 'PostCard'

export default PostCard
