import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';


const Login = () => {
    const [step, setStep] = useState(1);
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(emailOrPhone);

            if (response.data.success) {
                setUserId(response.data.userId);
                setGeneratedOTP(response.data.otp);
                setStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.verifyOTP(userId, otp);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-brand">
                    <h2>Productr</h2>
                </div>
                <div className="login-image">
                    <div className="phone-mockup">
                        <img
                            src="/login-hero.png"
                            alt="Uplist your product to market"
                            className="login-hero-img"
                        />
                    </div>
                </div>

            </div>

            <div className="login-right">
                <div className="login-form-container">
                    {step === 1 ? (
                        <>
                            <h1>Login to your Productr Account</h1>
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label>Email or Phone number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter email or phone number"
                                        value={emailOrPhone}
                                        onChange={(e) => setEmailOrPhone(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <div className="error-message">{error}</div>}

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Login'}
                                </button>
                            </form>

                            <div className="signup-link">
                                <p>Don't have a Productr Account</p>
                                <a href="#signup">SignUp Here</a>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1>Login to your Productr Account</h1>
                            <form onSubmit={handleVerifyOTP}>
                                <div className="form-group">
                                    <label>Enter OTP</label>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                        required
                                    />
                                    {generatedOTP && (
                                        <small className="otp-hint">
                                            Development: Your OTP is {generatedOTP}
                                        </small>
                                    )}
                                </div>

                                {error && <div className="error-message">{error}</div>}

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </form>

                            <button
                                className="btn-secondary"
                                onClick={() => setStep(1)}
                            >
                                Back to Login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;