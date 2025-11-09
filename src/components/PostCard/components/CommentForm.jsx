const CommentForm = ({ value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="mt-3 flex items-center">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Write a comment..."
      className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
    />
    <button
      type="submit"
      disabled={!value.trim()}
      className={`ml-2 text-sm font-medium ${
        value.trim()
          ? "text-blue-600 hover:text-blue-800"
          : "text-gray-400 cursor-not-allowed"
      }`}
    >
      Post
    </button>
  </form>
);

export default CommentForm;
