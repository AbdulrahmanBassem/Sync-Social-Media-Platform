import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAllNotificationsRead } from "../store/slices/notificationSlice";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import "../styles/Notifications.css";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    dispatch(fetchNotifications()).then(() => {
      dispatch(markAllNotificationsRead());
    });
  }, [dispatch]);

  const getImageUrl = (path) => {
    if (!path) return "/default-profile-picture.jpg";
    
    if (path.includes("default-profile-picture.jpg")) {
      return "/default-profile-picture.jpg";
    }

    return path.startsWith("http") ? path : `${serverUrl}${path}`;
  };

  const getNotificationText = (type) => {
    switch (type) {
      case "like": return "liked your post.";
      case "comment": return "commented on your post.";
      case "message": return "sent you a message.";
      default: return "interacted with you.";
    }
  };

  return (
    <div className="notifications-container">
      <h3 className="page-title">Notifications</h3>
      
      {loading ? (
        <div className="d-flex justify-content-center mt-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="notification-list">
          {notifications.length === 0 ? (
            <p className="text-center text-muted mt-4">No notifications yet.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif._id} className="notification-item">
                <Link to={`/profile/${notif.sender._id}`} className="notif-avatar-link">
                   <img 
                      src={getImageUrl(notif.sender.profilePic)} 
                      alt="avatar" 
                      className="notif-avatar"
                   />
                </Link>
                <div className="notif-content">
                   <span className="notif-username">{notif.sender.username}</span>
                   <span className="notif-text"> {getNotificationText(notif.type)}</span>
                   <span className="notif-time">{moment(notif.createdAt).fromNow()}</span>
                </div>
                {notif.postId && (
                  <Link to={`/post/${notif.postId._id || notif.postId}`} className="notif-post-preview">
                    {notif.postId.images?.[0] ? (
                         <img src={getImageUrl(notif.postId.images[0])} alt="post" />
                    ) : (
                         <div className="text-preview">Post</div>
                    )}
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;