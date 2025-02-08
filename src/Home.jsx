import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import axios from "axios";

const Home = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [status, setStatus] = useState("");
  const [bgClass, setBgClass] = useState("default-bg");

  const checkSubscriptionStatus = (emailToCheck) => {
    // Updated to use Render's backend URL
    axios.post('https://backend-for-sql-nodemailer-newsletter-app.onrender.com/check-status', { email: emailToCheck })
      .then(response => {
        setIsSubscribed(response.data.isSubscribed);
      })
      .catch(error => {
        console.error('Error checking subscription status:', error);
      });
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && newEmail.includes('@')) {
      checkSubscriptionStatus(newEmail);
    } else {
      setIsSubscribed(false);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!isSubscribed) {
      // Updated to use Render's backend URL
      axios.post('https://backend-for-sql-nodemailer-newsletter-app.onrender.com/subscribe', { email })
        .then(response => {
          setIsSubscribed(true);
          setStatus(response.data.message);
          setBgClass("subscribed-bg");
        })
        .catch(error => {
          setStatus(error.response?.data?.message || "Subscription failed!");
          setBgClass("default-bg");
        });
    } else {
      // Updated to use Render's backend URL
      axios.delete('https://backend-for-sql-nodemailer-newsletter-app.onrender.com/unsubscribe', {
        data: { email }
      })
        .then(response => {
          setIsSubscribed(false);
          setStatus(response.data.message);
          setBgClass("default-bg");
          setEmail("");
        })
        .catch(error => {
          setStatus(error.response?.data?.message || "Unsubscription failed!");
        });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="neon-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      <div className={`container ${bgClass}`}>
        <h1>Subscribe to our Newsletter</h1>
        <form className="form" onSubmit={handleSubscribe}>
          <div className="input-container">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={handleEmailChange}
              required
            />
            <label>Email</label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="success"
              disabled={isSubscribed}
              style={{ flex: 1 }}
            >
              <Mail className="icon" />
              <span>Subscribe</span>
            </button>
            <button
              type="button"
              className="destructive"
              disabled={!isSubscribed}
              onClick={(e) => {
                e.preventDefault();
                if (isSubscribed) handleSubscribe(e);
              }}
              style={{ flex: 1 }}
            >
              <X className="icon" />
              <span>Unsubscribe</span>
            </button>
          </div>
        </form>
        {status && (
          <div className={`status ${isSubscribed ? "status-success" : "status-danger"}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
