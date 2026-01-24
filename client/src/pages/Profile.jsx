import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { toggleTheme } from "../store/slices/themeSlice";
import { getUserProfile, getUserPosts, updateUserProfile, updateProfilePicture } from "../store/slices/profileSlice";
import { Spinner, Button, Modal, Form } from "react-bootstrap";
import { AiFillCamera, AiOutlineLogout, AiOutlineBgColors } from "react-icons/ai";
import { Link } from "react-router-dom";
import "../styles/Profile.css"; 

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user: authUser } = useSelector((state) => state.auth);
  const { profile, posts, loading } = useSelector((state) => state.profile);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", bio: "" });
  
  const fileInputRef = useRef(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const isOwnProfile = authUser?._id === id;

  useEffect(() => {
    if (id) {
      dispatch(getUserProfile(id));
      dispatch(getUserPosts(id));
    }
  }, [id, dispatch]);

  const getImageUrl = (path) => {
    if (!path) return "/default-profile-picture.jpg";
    
    if (path.includes("default-profile-picture.jpg")) {
      return "/default-profile-picture.jpg";
    }

    return path.startsWith("http") ? path : `${serverUrl}${path}`;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateUserProfile(editData));
    setShowEditModal(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      await dispatch(updateProfilePicture(formData));
    }
  };

  const handleMessage = () => {
    navigate("/messages", { state: { chatWith: profile } });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  if (loading && !profile) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      {profile && (
        <>
          <header className="profile-header">
            <div className="profile-pic-wrapper">
              <img 
                src={getImageUrl(profile.profilePic)} 
                alt={profile.username} 
                className="profile-pic-lg" 
              />
              {isOwnProfile && (
                <div className="camera-icon" onClick={() => fileInputRef.current.click()}>
                  <AiFillCamera size={20} />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <section className="profile-info">
              <div className="profile-title-row">
                <h2 className="profile-username">{profile.username}</h2>
                {isOwnProfile ? (
                  <div className="d-flex gap-2 align-items-center">
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="edit-profile-btn"
                      onClick={() => {
                        setEditData({ name: profile.name, bio: profile.bio || "" });
                        setShowEditModal(true);
                      }}
                    >
                      Edit Profile
                    </Button>

                    {/* Mobile Only: Theme Toggle */}
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      className="mobile-action-btn"
                      onClick={handleThemeToggle}
                      title="Switch Theme"
                    >
                      <AiOutlineBgColors />
                    </Button>

                    {/* Mobile Only: Logout */}
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="mobile-action-btn"
                      onClick={handleLogout}
                      title="Logout"
                    >
                      <AiOutlineLogout />
                    </Button>
                  </div>
                  
                ) : (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="ms-3 fw-bold"
                    onClick={handleMessage}
                  >
                    Message
                  </Button>
                )}
              </div>

              <ul className="profile-stats">
                <li><strong>{posts.length}</strong> posts</li>
                <li><strong>0</strong> followers</li>
                <li><strong>0</strong> following</li>
              </ul>

              <div className="profile-bio">
                <span className="profile-realname">{profile.name}</span>
                <p>{profile.bio}</p>
              </div>
            </section>
          </header>

          <div className="profile-divider">
            <span>POSTS</span>
          </div>

          {posts.length > 0 ? (
            <div className="profile-grid">
              {posts.map((post) => (
                <Link to={`/post/${post._id}`} key={post._id}>
                  <div key={post._id} className="grid-item">
                    {post.images && post.images.length > 0 ? (
                      <img src={getImageUrl(post.images[0])} alt="post" />
                    ) : (
                      <div className="text-post-placeholder">{post.caption}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
             <div className="text-center mt-5 text-muted">No posts yet.</div>
          )}

          <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEditSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={editData.name} 
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={editData.bio} 
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Save Changes
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Profile;