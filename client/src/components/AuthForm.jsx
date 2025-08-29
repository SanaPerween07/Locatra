import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

axios.defaults.withCredentials = true;

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
                ? `${apiBase}/api/auth/login`
                : `${apiBase}/api/auth/signup`;

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
            console.log("Google sign in success:", credentialResponse);
            const response = await axios.post(
                `${apiBase}/api/auth/google-login`,
                { idToken: credentialResponse.credential },
                { withCredentials: true }
            );

            console.log("Google login successful:", response.data);
            navigate("/home");
        } 
        catch (error) {
            console.log(error);
        }
    };


  return (
    <div>
        <h2> {isLogin ? 'Login': 'Sign-Up'} </h2>
        <form onSubmit={handleSubmit}>
            <input 
                type='email' 
                placeholder='enter your username' 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
            />
            <input 
                type='password' 
                placeholder='enter your password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
            />

            {!isLogin && (
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            )}

            <button type="submit"> {isLogin ? 'Login' : 'Sign Up'} </button>

            <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <span 
                    style={{ color: 'blue', cursor: 'pointer' }} 
                    onClick={() => setIsLogin(!isLogin)}
                    >
                    {isLogin ? 'Sign Up' : 'Login'}
                </span>

            </p>

            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={handleGoogleSignin}
                />
            </GoogleOAuthProvider>

        </form>
    </div>
  )
}
export default AuthForm
