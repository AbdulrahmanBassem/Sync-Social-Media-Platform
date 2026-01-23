import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetRegisterSuccess } from "../store/slices/authSlice";
import { toggleTheme } from "../store/slices/themeSlice";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import { BsMoon, BsSun } from "react-icons/bs";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  
  const { loading, registerSuccess } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (registerSuccess) {
      navigate("/verify-otp", { state: { email: formData.email } });
      dispatch(resetRegisterSuccess());
    }
  }, [registerSuccess, navigate, dispatch, formData.email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="position-absolute top-0 end-0 p-3">
        <Button variant="link" onClick={() => dispatch(toggleTheme())} style={{ color: "var(--text-primary)" }}>
          {mode === "light" ? <BsMoon size={20} /> : <BsSun size={20} />}
        </Button>
      </div>

      <div className="auth-card">
        <h1 className="brand-title">Sync</h1>
        <p className="text-center text-muted-custom fw-bold mb-4">Sign up to see photos and videos from your friends.</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="email"
              placeholder="Email"
              className="custom-input"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Full Name"
              className="custom-input"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              className="custom-input"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              className="custom-input"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button 
            type="submit" 
            className="w-100 mb-3 fw-bold" 
            style={{ backgroundColor: "var(--btn-primary)", border: "none" }}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
          </Button>
        </Form>
        
        <div className="text-center mt-3">
            <span className="text-muted-custom">Have an account? </span>
            <Link to="/login" className="link-text">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;