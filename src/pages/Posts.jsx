import PostCard from "../components/PostCard/PostCard";

const Posts = () => {
  const posts = [];

  return (
    <div className="container mx-auto xl:w-[40%] lg:w-[60%] md:w-[80%] w-full py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Latest Posts</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
          Create Post
        </button>
      </div>

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts yet. Be the first to post!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Posts;
