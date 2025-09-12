import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

axios.defaults.withCredentials = true;
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AuthForm = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLogin && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const url = isLogin
                ? `${API_BASE}/api/auth/login`
                : `${API_BASE}/api/auth/signup`;

            const payload = { email, password };

            const res = await axios.post(url, payload, { withCredentials: true });

            alert(res.data.message);
            console.log("User:", res.data.user);

            if (isLogin) {
                navigate("/home"); 
            }

            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } 
        catch (err) {
            console.log(err)
        }
    };

    const handleGoogleSignin = async (credentialResponse) => {
        try {
            console.log("Google sign in successful!");
            const response = await axios.post(
                `${API_BASE}/api/auth/google-login`,
                { idToken: credentialResponse.credential },
            );

            console.log("Google login successful!");
            navigate("/home");
        } 
        catch (error) {
            console.log(error);
        }
    };


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ width: "400px" }}>
            <h3 className="text-center mb-4">
            {isLogin ? "Login" : "Sign Up"}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input 
                        type='email' 
                        placeholder='enter your username' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                        type='password' 
                        placeholder='enter your password' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control" 
                        required
                    />
                </div>

                {!isLogin && (
                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    
                )}

                <button type="submit" className="btn btn-success w-100 mt-2"> {isLogin ? 'Login' : 'Sign Up'} </button>

                <p className="text-center mt-3">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <span 
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsLogin(!isLogin)}
                        >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>

                </p>

                <div className="d-flex justify-content-center mt-3">
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                        <GoogleLogin
                            onSuccess={handleGoogleSignin}
                        />
                    </GoogleOAuthProvider>
                </div>

            </form>
        </div>
    </div>
    
  )
}
export default AuthForm
