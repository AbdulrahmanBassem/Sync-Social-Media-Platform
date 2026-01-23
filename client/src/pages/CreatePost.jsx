import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, resetCreateSuccess } from "../store/slices/postSlice";
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import { AiOutlinePicture, AiOutlineClose } from "react-icons/ai";
import "../styles/CreatePost.css"; 

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, createSuccess } = useSelector((state) => state.posts);

  useEffect(() => {
    if (createSuccess) {
      navigate("/"); 
      dispatch(resetCreateSuccess());
    }
  }, [createSuccess, navigate, dispatch]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (selectedFiles.length + files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove Image
  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("tags", tags);
    
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    dispatch(createPost(formData));
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h3 className="page-title">Create new post</h3>
        
        <Form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
             <textarea 
                className="caption-input" 
                placeholder="Write a caption..." 
                rows="4"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
             ></textarea>
          </div>

          {previews.length > 0 && (
            <div className="image-preview-grid">
              {previews.map((src, index) => (
                <div key={index} className="preview-item">
                  <img src={src} alt="preview" />
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeImage(index)}
                  >
                    <AiOutlineClose size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="actions-row">
             <div className="media-buttons">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: "none" }} 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button 
                  type="button"
                  variant="link" 
                  className="icon-btn" 
                  onClick={() => fileInputRef.current.click()}
                  title="Add Photos"
                >
                   <AiOutlinePicture size={24} />
                   <span className="ms-2">Photo/Video</span>
                </Button>
             </div>
          </div>

          <Form.Group className="mb-4">
             <Form.Control 
               type="text" 
               placeholder="Add tags (separated by comma)" 
               className="custom-input"
               value={tags}
               onChange={(e) => setTags(e.target.value)}
             />
          </Form.Group>

          <Button 
            type="submit" 
            className="w-100 post-btn"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Share"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;