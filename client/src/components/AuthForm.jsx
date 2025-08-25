import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

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
                ? "http://localhost:5000/api/auth/login"
                : "http://localhost:5000/api/auth/signup";

            const payload = { email, password };

            const res = await axios.post(url, payload, { withCredentials: true });

            alert(res.data.message);
            console.log("User:", res.data.user);

            // Redirect after login/signup success
            if (isLogin) {
                navigate("/home"); // 👈 navigate to home page
            }

            // Reset fields after success
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } 
        catch (err) {
            console.log(err)
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

        </form>
    </div>
  )
}

export default AuthForm