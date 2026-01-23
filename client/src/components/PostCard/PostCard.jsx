import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost } from "../../store/slices/postSlice";
import { 
  AiOutlineHeart, 
  AiFillHeart, 
  AiOutlineMessage, 
  AiOutlineLeft,  
  AiOutlineRight  
} from "react-icons/ai";
import moment from "moment";
import { Link } from "react-router-dom";
import "./PostCard.css"; 

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef(null); 

  const isLiked = post.likes.includes(user?._id);
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"; 

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${serverUrl}${path}`;
  };

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setCurrentImageIndex(index);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      
      scrollRef.current.scrollBy({ 
        left: scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  return (
    <article className="post-card">
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
        <div className="carousel-wrapper">
          <div 
            className="post-images-scroll" 
            ref={scrollRef} 
            onScroll={handleScroll}
          >
            {post.images.map((img, index) => (
              <img 
                key={index}
                src={getImageUrl(img)} 
                alt={`Post content ${index}`} 
                className="post-image-item"
              />
            ))}
          </div>

          {post.images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button 
                  className="carousel-btn left-btn" 
                  onClick={() => scroll("left")}
                >
                  <AiOutlineLeft />
                </button>
              )}

              {currentImageIndex < post.images.length - 1 && (
                <button 
                  className="carousel-btn right-btn" 
                  onClick={() => scroll("right")}
                >
                  <AiOutlineRight />
                </button>
              )}

              <div className="carousel-dots">
                {post.images.map((_, index) => (
                  <div 
                    key={index} 
                    className={`dot ${index === currentImageIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

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