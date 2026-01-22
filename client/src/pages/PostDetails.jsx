import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, createComment, deleteComment } from "../store/slices/commentSlice";
import API from "../apis/api"; 
import PostCard from "../components/PostCard/PostCard";
import { Spinner, Form, Button } from "react-bootstrap";
import moment from "moment";
import { AiOutlineDelete } from "react-icons/ai";
import "../styles/PostDetails.css"; 

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [commentText, setCommentText] = useState("");

  const { comments, loading: loadingComments } = useSelector((state) => state.comments);
  const { user: currentUser } = useSelector((state) => state.auth);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data);
      } catch (error) {
        console.error("Failed to load post", error);
      } finally {
        setLoadingPost(false);
      }
    };
    loadData();
    dispatch(fetchComments(id));
  }, [id, dispatch]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await dispatch(createComment({ postId: id, text: commentText }));
    setCommentText("");
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      dispatch(deleteComment(commentId));
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/default-profile-picture.jpg";
    return path.startsWith("http") ? path : `${serverUrl}${path}`;
  };

  if (loadingPost) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!post) return <div className="text-center mt-5">Post not found</div>;

  return (
    <div className="post-details-container">
      <div className="post-wrapper">
         <PostCard post={post} />
      </div>

      <div className="comments-section">
        <h5 className="mb-3">Comments</h5>
        
        <Form onSubmit={handlePostComment} className="comment-form">
           <Form.Control 
             as="textarea" 
             rows={2} 
             placeholder="Add a comment..." 
             value={commentText}
             onChange={(e) => setCommentText(e.target.value)}
             className="comment-input"
           />
           <Button type="submit" variant="link" className="post-comment-btn" disabled={!commentText.trim()}>
             Post
           </Button>
        </Form>

        <div className="comments-list">
           {loadingComments ? (
             <Spinner animation="border" size="sm" />
           ) : comments.length === 0 ? (
             <p className="text-muted">No comments yet.</p>
           ) : (
             comments.map((comment) => (
               <div key={comment._id} className="comment-item">
                 <Link to={`/profile/${comment.userId._id}`} className="comment-avatar-link">
                    <img 
                      src={getImageUrl(comment.userId.profilePic)} 
                      alt="avatar" 
                      className="comment-avatar"
                    />
                 </Link>
                 <div className="comment-body">
                    <div className="comment-bubble">
                       <Link to={`/profile/${comment.userId._id}`} className="comment-username">
                          {comment.userId.username}
                       </Link>
                       <span className="comment-text">{comment.text}</span>
                    </div>
                    <span className="comment-time">{moment(comment.createdAt).fromNow()}</span>
                 </div>
                 
                 {(currentUser._id === comment.userId._id || currentUser.role === "admin") && (
                    <button className="delete-comment-btn" onClick={() => handleDeleteComment(comment._id)}>
                       <AiOutlineDelete />
                    </button>
                 )}
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;