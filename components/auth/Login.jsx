import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css';
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [warnMessage, setWarnMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('username', username);
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('isLoggedIn', 'true');

        //toast.success('Login successful!', { position: 'top-center' });
        if (response.data.role === "admin"){
          window.location.href = "/admin_dashboard";
        }else if(response.data.role === "user"){
          window.location.href = "/";
        }else{
          navigate('/');
        }

      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleRegister = async () => {
    setWarnMessage('');

    if (!name || !username || !email || !phone || !dob || !password || !confirmPassword) {
      setWarnMessage('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setWarnMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        name, username, email, phone, dob, password
      });

      if (response.data.success) {
        toast.success('Registration successful!');
        setIsRegistering(false);
        setName('');
        setUsername('');
        setEmail('');
        setPhone('');
        setDob('');
        setPassword('');
        setConfirmPassword('');
        setWarnMessage(''); // Clear warning message on successful registration
      } else {
        setWarnMessage(response.data.message || 'Registration failed.');
      }
    } catch (err) {
      setWarnMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="container-fluid p-5">
  <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast-container"
      />
            <div className="row d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        {/* Left Column - Image */}
        <div className="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0">
          <img
            src="https://static.vecteezy.com/system/resources/previews/023/642/083/original/booking-hotel-tiny-people-search-and-choose-hotel-or-apartment-online-reservation-application-interface-tourist-and-business-trip-modern-flat-cartoon-style-illustration-on-white-background-vector.jpg"
            className="img-fluid"
            alt="Login/Register"
          />
        </div>

        {/* Right Column - Form */}
        <div className="col-12 col-md-6">
          <div className="login-card">
            <h4 className='h4'>{isRegistering ? 'Register' : 'Login'}</h4>

            {/* Display warning message */}
            {warnMessage && <div className="alert alert-warning">{warnMessage}</div>}

            {isRegistering ? (
              <>
                <input type="text" className="form-control mb-3" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" className="form-control mb-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" className="form-control mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" className="form-control mb-3" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input type="date" className="form-control mb-3" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" className="form-control mb-3" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
                <p className="text-center">Already have account? <a href="#" onClick={() => setIsRegistering(false)}>Login</a></p>
              </>
            ) : (
              <>
                <input type="text" className="form-control mb-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Sign in</button>
                <p className="text-center">Don't have account? <a href="#" onClick={() => setIsRegistering(true)}>Register</a></p>
              </>
            )}

            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
