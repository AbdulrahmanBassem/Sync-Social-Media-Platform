import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

const Home = () => <div className="text-center mt-5"><h1>Feed</h1></div>;

function App() {
  const { mode } = useSelector((state) => state.theme);

  return (
    <div className="app-container" data-theme={mode}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Routes>
    </div>
  );
}

export default App;