import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import { toggleTheme } from "../store/slices/themeSlice";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import { BsMoon, BsSun } from "react-icons/bs";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      {/* Theme Toggle Top Right */}
      <div className="position-absolute top-0 end-0 p-3">
        <Button variant="link" onClick={() => dispatch(toggleTheme())} style={{ color: "var(--text-primary)" }}>
          {mode === "light" ? <BsMoon size={20} /> : <BsSun size={20} />}
        </Button>
      </div>

      <div className="auth-card">
        <h1 className="brand-title">Sync</h1>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
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
            {loading ? <Spinner animation="border" size="sm" /> : "Log in"}
          </Button>
        </Form>
        
        <div className="text-center mt-3">
            <span className="text-muted-custom">Don't have an account? </span>
            <Link to="/register" className="link-text">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;