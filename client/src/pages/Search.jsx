import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, searchPosts, clearSearch } from "../store/slices/searchSlice";
import { Link } from "react-router-dom";
import { Form, InputGroup, Spinner, Nav } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import PostCard from "../components/PostCard/PostCard"; 
import "../styles/Search.css"; 

const Search = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("accounts"); 
  const dispatch = useDispatch();
  
  const { userResults, postResults, loading } = useSelector((state) => state.search);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (activeTab === "accounts") {
      dispatch(searchUsers(query));
    } else {
      dispatch(searchPosts(query));
    }
  };

  useEffect(() => {
    if (query.trim()) {
      if (activeTab === "accounts") {
        dispatch(searchUsers(query));
      } else {
        dispatch(searchPosts(query));
      }
    } else {
        dispatch(clearSearch());
    }
  }, [activeTab, dispatch]); // eslint-disable-line

  const getImageUrl = (path) => {
    if (!path) return "/default-profile-picture.jpg";
    return path.startsWith("http") ? path : `${serverUrl}${path}`;
  };

  return (
    <div className="search-container">
      {/* Search Bar */}
      <div className="search-header">
        <h2 className="mb-4">Search</h2>
        <Form onSubmit={handleSearch}>
          <InputGroup className="mb-3 search-input-group">
            <InputGroup.Text className="search-icon">
              <AiOutlineSearch size={20} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </InputGroup>
        </Form>
      </div>

      <Nav variant="tabs" className="mb-4 custom-tabs" activeKey={activeTab}>
        <Nav.Item>
          <Nav.Link 
            eventKey="accounts" 
            onClick={() => setActiveTab("accounts")}
            className={activeTab === "accounts" ? "active-tab" : ""}
          >
            Accounts
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link 
                eventKey="posts" 
                onClick={() => setActiveTab("posts")}
                className={activeTab === "posts" ? "active-tab" : ""}
            >
                Posts
            </Nav.Link>
        </Nav.Item>
      </Nav>

      {loading && (
        <div className="d-flex justify-content-center mt-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      <div className="search-results">
        
        {activeTab === "accounts" && (
          <div className="user-list">
            {userResults.map((user) => (
              <Link to={`/profile/${user._id}`} key={user._id} className="user-search-item">
                <img 
                    src={getImageUrl(user.profilePic)} 
                    alt={user.username} 
                    className="search-avatar"
                />
                <div className="user-info">
                  <span className="search-username">{user.username}</span>
                  <span className="search-fullname">{user.name}</span>
                </div>
              </Link>
            ))}
            {!loading && query && userResults.length === 0 && (
                <p className="text-muted text-center">No accounts found.</p>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="post-list-search">
             {postResults.map((post) => (
                 <PostCard key={post._id} post={post} />
             ))}
             {!loading && query && postResults.length === 0 && (
                <p className="text-muted text-center">No posts found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;