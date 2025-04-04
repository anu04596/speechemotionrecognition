import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h2>Have questions or need support? Reach out to us!</h2>
        <form className="contact-form">
          <input type="text" className="contact-input" placeholder="Your Name" required />
          <input type="email" className="contact-input" placeholder="Your Email" required />
          <textarea className="contact-input contact-textarea" placeholder="Your Message" required></textarea>
          <button type="submit" className="contact-button">Send Message</button>
        </form>
        <p className="contact-info">Email: support@mentra.com | Phone: +123 456 7890</p>
      </div>
    </div>
  );
};

export default Contact;
