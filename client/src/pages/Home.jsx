import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../store/slices/postSlice";
import PostCard from "../components/PostCard/PostCard";
import { Spinner } from "react-bootstrap";
import "../styles/Home.css"; // Styles next

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    // Fetch posts on mount
    dispatch(fetchAllPosts());
  }, [dispatch]);

  return (
    <div className="home-container">
      {/* Loading */}
      {loading && posts.length === 0 && (
        <div className="feed-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="text-center mt-5 text-muted-custom">
          <h4>No posts yet</h4>
          <p>Follow some users or create a post!</p>
        </div>
      )}

      <div className="feed-list">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;