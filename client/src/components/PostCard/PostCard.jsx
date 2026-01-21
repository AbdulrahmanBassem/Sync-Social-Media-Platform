import { useDispatch, useSelector } from "react-redux";
import { likePost } from "../../store/slices/postSlice";
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from "react-icons/ai";
import moment from "moment";
import { Link } from "react-router-dom";
import "./PostCard.css"; 

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const isLiked = post.likes.includes(user?._id);
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"; 

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${serverUrl}${path}`;
  };

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <Link to={`/profile/${post.userId?._id}`} className="post-user-link">
          <img 
            src={getImageUrl(post.userId?.profilePic) || "/default-avatar.png"} 
            alt={post.userId?.username} 
            className="post-avatar"
          />
          <span className="post-username">{post.userId?.username}</span>
        </Link>
        <span className="post-time">{moment(post.createdAt).fromNow(true)}</span>
      </div>

      {post.images && post.images.length > 0 && (
        <div className="post-image-container">
          <img 
            src={getImageUrl(post.images[0])} 
            alt="Post content" 
            className="post-image"
          />
        </div>
      )}

      {/* Actions */}
      <div className="post-actions">
        <button onClick={handleLike} className="action-btn">
          {isLiked ? (
            <AiFillHeart size={26} color="#ed4956" />
          ) : (
            <AiOutlineHeart size={26} />
          )}
        </button>
        
        <Link to={`/post/${post._id}`} className="action-btn">
           <AiOutlineMessage size={26} />
        </Link>
      </div>

      <div className="post-footer">
        <div className="likes-count">
          {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
        </div>
        
        <div className="post-caption">
          <span className="caption-username">{post.userId?.username}</span>
          {post.caption}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, i) => (
              <span key={i} className="hashtag">#{tag} </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;