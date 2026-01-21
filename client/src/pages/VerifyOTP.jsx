import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../store/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    const result = await dispatch(verifyOtp({ email, otp }));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="auth-card text-center">
        <h3 className="mb-3">Enter Confirmation Code</h3>
        <p className="text-muted-custom mb-4">
          Enter the 6-digit code we sent to <strong>{email}</strong>.
        </p>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Confirmation Code"
              className="custom-input text-center"
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
          </Form.Group>

          <Button 
            type="submit" 
            className="w-100 fw-bold" 
            style={{ backgroundColor: "var(--btn-primary)", border: "none" }}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Confirm"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOTP;