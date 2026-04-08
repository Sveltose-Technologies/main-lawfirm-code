import React, { useEffect, useState } from 'react';

const DisclaimerPopup = () => {
  const [show, setShow] = useState(false);

useEffect(() => {
    const isAccepted = localStorage.getItem('disclaimerAccepted');
    
    // --- TESTING KE LIYE: Ye 'if' condition hata dein ya comment kar dein ---
    // if (!isAccepted) {
      setShow(true); // Ab ye hamesha dikhega refresh karne par
      document.body.style.overflow = 'hidden';
    // }
  }, []);
  const handleAgree = () => {
    // User ke agree karne par LocalStorage me save karein
    localStorage.setItem('disclaimerAccepted', 'true');
    setShow(false);
    // Scroll wapas chalu karein
    document.body.style.overflow = 'auto';
  };

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, color: '#b68c5a' }}>Disclaimer</h2>
        </div>
        
        <div style={styles.content}>
          {/* === YAHAN APNA DISCLAIMER TEXT DALEIN === */}
          <p>
            The rules of the Bar Council of India prohibit law firms from soliciting work or advertising in any manner. 
            By clicking on <strong>Agree and Enter</strong>, the user acknowledges that:
          </p>
          <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
            <li>There has been no advertisement, personal communication, solicitation, invitation or inducement of any sort whatsoever from us or any of our members to solicit any work through this website.</li>
            <li>The user wishes to gain more information about us for his/her own information and use.</li>
            <li>The information about us is provided to the user only on his/her specific request.</li>
          </ul>
          <p>
            The information provided under this website is solely available at your request for informational purposes only, should not be interpreted as soliciting or advertisement.
          </p>
        </div>

        <div style={styles.footer}>
          <button onClick={handleAgree} style={styles.button}>
            Agree and Enter
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Simple CSS Styles (Inline) ---
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Dark background
    zIndex: 99999, // Sabse upar dikhne ke liye
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    backgroundColor: '#fff',
    maxWidth: '600px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  content: {
    padding: '25px',
    maxHeight: '60vh', // Mobile par scroll ke liye
    overflowY: 'auto',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#333',
    textAlign: 'justify',
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #eee',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#b68c5a', // Aapki theme ka color
    color: '#fff',
    border: 'none',
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: '0.3s',
  }
};

export default DisclaimerPopup;