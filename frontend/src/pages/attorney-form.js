

'use client';

import { useState } from 'react';

// --- PLACEHOLDER DASHBOARDS ---
const ClientDashboard = () => (
  <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="text-center p-5 shadow bg-white rounded">
      <h1 className="text-primary">🏛️ Client Dashboard</h1>
      <p className="lead">Welcome! You are logged in as a Client.</p>
    </div>
  </div>
);

const AttorneyDashboard = () => (
  <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="text-center p-5 shadow bg-white rounded">
      <h1 className="text-warning text-dark">⚖️ Attorney Dashboard</h1>
      <p className="lead">Welcome! You are logged in as an Attorney.</p>
    </div>
  </div>
);

// --- MAIN COMPONENT START ---
export default function UnifiedAuthPage() {

  // --- COUNTRY CODES LIST (For Step 2) ---
  const countryCodes = [
    { name: "India", code: "+91" },
    { name: "USA/Canada", code: "+1" },
    { name: "UK", code: "+44" },
    { name: "Australia", code: "+61" },
    { name: "UAE", code: "+971" },
    // ... (List continues as before)
  ];

  // --- STATES ---
  const [userRole, setUserRole] = useState('Client'); 
  const [view, setView] = useState('login'); // 'login' or 'signup'
  const [step, setStep] = useState(1); // 1 = Basic Info, 2 = Profile
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Messages
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- FORM DATA STATE ---
  const [formData, setFormData] = useState({
    // Step 1 Fields
    firstName: '', lastName: '', email: '', password: '', repeatPassword: '', captcha: '',
    // Step 2 Fields (Hidden initially)
    street: '', apt: '', city: '', state: '', country: '', zip: '',
    countryCode: '+91', phone: '', dob: '',
    terms: false
  });

  // Handle Inputs
  const handleInput = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // --- ACTIONS ---

  // 1. LOGIN
  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.email === 'error@lawfirm.com') {
      setError('Invalid Email ID or Password');
      return;
    }
    if(formData.email.includes('attorney')) {
        setUserRole('Attorney');
    } else {
        setUserRole('Client');
    }
    setIsAuthenticated(true);
  };

  // 2. SIGN UP STEP 1 (VALIDATION ONLY HERE)
  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');

    // --- VALIDATIONS ---
    // 1. Mandatory Check (HTML required attribute handles basic check, logic here for safety)
    if(!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError("All fields are mandatory.");
        return;
    }

    // 2. Email Validation
    if (formData.email === 'exist@lawfirm.com') {
      setError('Error: This Email ID is already registered.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setError('Invalid Email Format');
        return;
    }

    // 3. Password Match & Strength
    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    // 4. Captcha Validation
    if (formData.captcha.toUpperCase() !== 'X7K9B') {
      setError('Invalid Captcha!');
      return;
    }

    // If All Valid -> Go to Step 2
    setStep(2);
    window.scrollTo(0, 0);
  };

  // 3. FINAL SUBMIT
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('Please check your email to activate your account.');

    setTimeout(() => {
      alert(`Account Created for ${userRole}!\nGenerated ID: MEM-${Math.floor(1000 + Math.random() * 9000)}`);
      setSuccessMsg('');
      setView('login');
      setStep(1);
    }, 2000);
  };

  // RENDER DASHBOARD
  if (isAuthenticated) {
    if (userRole === 'Client') return <ClientDashboard />;
    if (userRole === 'Attorney') return <AttorneyDashboard />;
  }

  return (
    <>
      <div className="main-wrapper">
        <div className={`auth-card ${step === 2 && view === 'signup' ? 'wide' : ''}`}>

          <div className="form-body">

            {/* LOGIN FORM */}
            {view === 'login' && (
              <div className="fade-in">
                <h2 className="portal-title">Welcome Back</h2>
                <p className="portal-subtitle">Please Sign In to continue</p>

                {error && <div className="alert-msg error">{error}</div>}

                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="lbl">Email ID <span className="req">*</span></label>
                    <input type="email" name="email" className="inp" placeholder="email@lawfirm.com" onChange={handleInput} required />
                  </div>
                  <div className="form-group">
                    <label className="lbl">Password <span className="req">*</span></label>
                    <input type="password" name="password" className="inp" onChange={handleInput} required />
                  </div>
                  
                  <div className="forgot-link">
                    <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                  </div>
                  
                  <button type="submit" className="action-btn">Log In</button>

                  <div className="toggle-text">
                    New User? <span onClick={() => { setView('signup'); setError(''); }}>Create Account</span>
                  </div>
                </form>
              </div>
            )}

            {/* SIGN UP STEP 1 (ONLY BASIC FIELDS) */}
            {view === 'signup' && step === 1 && (
              <div className="fade-in">
                <h2 className="portal-title">Create Account</h2>
                
                {/* Role Selector (Client/Attorney Toggle) */}
                <div className="role-selector">
                    <div className="role-btns">
                        <button 
                            type="button"
                            className={`role-btn ${userRole === 'Client' ? 'active' : ''}`}
                            onClick={() => setUserRole('Client')}
                        >
                            Client
                        </button>
                        <button 
                            type="button"
                            className={`role-btn ${userRole === 'Attorney' ? 'active' : ''}`}
                            onClick={() => setUserRole('Attorney')}
                        >
                            Attorney
                        </button>
                    </div>
                </div>

                {error && <div className="alert-msg error">{error}</div>}

                <form onSubmit={handleStep1}>
                  {/* Field 1 & 2: Names */}
                  <div className="row-split">
                    <div className="col">
                      <label className="lbl">First Name <span className="req">*</span></label>
                      <input type="text" name="firstName" className="inp" onChange={handleInput} required />
                    </div>
                    <div className="col">
                      <label className="lbl">Last Name <span className="req">*</span></label>
                      <input type="text" name="lastName" className="inp" onChange={handleInput} required />
                    </div>
                  </div>

                  {/* Field 3: Email */}
                  <div className="form-group">
                    <label className="lbl">Email ID <span className="req">*</span></label>
                    <input type="email" name="email" className="inp" onChange={handleInput} required />
                  </div>

                  {/* Field 4: Password */}
                  <div className="form-group">
                    <label className="lbl">Password <span className="req">*</span></label>
                    <input type="password" name="password" className="inp" onChange={handleInput} required />
                  </div>

                  {/* Field 5: Repeat Password */}
                  <div className="form-group">
                    <label className="lbl">Repeat Password <span className="req">*</span></label>
                    <input type="password" name="repeatPassword" className="inp" onChange={handleInput} required />
                  </div>

                  {/* Field 6: Captcha */}
                  <div className="form-group">
                    <label className="lbl">Captcha <span className="req">*</span></label>
                    <div className="captcha-box">X 7 K 9 B</div>
                    <input type="text" name="captcha" className="inp" placeholder="Enter Code" onChange={handleInput} required />
                  </div>

                  <button type="submit" className="action-btn">Next Step →</button>
                  
                  <div className="toggle-text">
                    Already Have An Account? <span onClick={() => setView('login')}>Sign In</span>
                  </div>
                </form>
              </div>
            )}

            {/* SIGN UP STEP 2 (Details hidden until Step 1 validates) */}
            {view === 'signup' && step === 2 && (
              <div className="fade-in">
                <h2 className="portal-title">Complete Profile</h2>
                <p className="portal-subtitle">Step 2: {userRole} KYC Details</p>

                {successMsg && <div className="alert-msg success">{successMsg}</div>}

                <form onSubmit={handleFinalSubmit}>
                  {/* Address */}
                  <h4 className="section-head">Address Details</h4>
                  <div className="row-split">
                    <div className="col" style={{flex: 2}}>
                      <label className="lbl">Street Name <span className="req">*</span></label>
                      <input type="text" name="street" className="inp" onChange={handleInput} required />
                    </div>
                    <div className="col">
                      <label className="lbl">Apt/Unit <span className="req">*</span></label>
                      <input type="text" name="apt" className="inp" onChange={handleInput} required />
                    </div>
                  </div>
                  <div className="row-split">
                    <div className="col"><label className="lbl">City <span className="req">*</span></label><input type="text" name="city" className="inp" onChange={handleInput} required /></div>
                    <div className="col"><label className="lbl">State <span className="req">*</span></label><input type="text" name="state" className="inp" onChange={handleInput} required /></div>
                  </div>
                  <div className="row-split">
                    <div className="col"><label className="lbl">Country <span className="req">*</span></label><input type="text" name="country" className="inp" onChange={handleInput} required /></div>
                    <div className="col"><label className="lbl">Zip Code <span className="req">*</span></label><input type="number" name="zip" className="inp" onChange={handleInput} required /></div>
                  </div>

                  {/* Personal */}
                  <h4 className="section-head">Personal Details</h4>
                  <div className="row-split">
                    
                    {/* Country Code Dropdown */}
                    <div className="col" style={{flex: 0.6}}>
                      <label className="lbl">Code <span className="req">*</span></label>
                      <select name="countryCode" className="inp" onChange={handleInput} required>
                        {countryCodes.map((c, i) => (
                           <option key={i} value={c.code}>{c.code} ({c.name})</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col" style={{flex: 1.4}}>
                      <label className="lbl">Phone Number <span className="req">*</span></label>
                      <input type="number" name="phone" className="inp" onChange={handleInput} required />
                    </div>
                    <div className="col" style={{flex: 1.5}}>
                      <label className="lbl">Date Of Birth <span className="req">*</span></label>
                      <input type="date" name="dob" className="inp" onChange={handleInput} required />
                    </div>
                  </div>

                  <div className="file-box mt-3">
                    <label className="lbl">Profile Image (Selfie)</label>
                    <input type="file" className="inp-file" accept="image/*" />
                  </div>

                  {/* KYC SECTION */}
                  <h4 className="section-head">
                    {userRole === 'Attorney' ? 'Bar Council & ID Proof' : 'Identity Proof'}
                  </h4>
                  <div className="form-group">
                    <label className="lbl">Proof of Identity <span className="req">*</span></label>
                    <small className="small-text">
                        {userRole === 'Attorney' ? 'Bar Council ID / Licence' : 'PAN Card, Aadhaar, or Passport'}
                    </small>
                    <input type="file" className="inp-file" required />
                  </div>
                  <div className="form-group">
                    <label className="lbl">Proof of Address <span className="req">*</span></label>
                    <input type="file" className="inp-file" required />
                  </div>

                  <div className="terms-box">
                    <input type="checkbox" name="terms" id="terms" required onChange={handleInput} />
                    <label htmlFor="terms">I accept the Terms and Conditions.</label>
                  </div>

                  <button type="submit" className="action-btn">Complete Registration</button>
                  
                  <div className="toggle-text" style={{marginTop:'10px'}}>
                    <span onClick={() => setStep(1)} style={{color:'#666', fontSize:'13px'}}>← Back to Step 1</span>
                  </div>

                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@400;600&display=swap');
        
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background-color: #f4f7f6; }

        .main-wrapper {
          display: flex; justify-content: center; align-items: center;
          min-height: 100vh; padding: 20px;
        }

        .auth-card {
          background: white; width: 100%; max-width: 450px;
          border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          overflow: hidden; transition: max-width 0.4s ease;
          border-top: 5px solid #002b5c; 
        }
        .auth-card.wide { max-width: 750px; }

        .form-body { padding: 40px 30px; }
        .portal-title { text-align: center; color: #002b5c; margin: 0 0 5px 0; font-size: 28px; font-family: 'Merriweather', serif; }
        .portal-subtitle { text-align: center; color: #888; margin: 0 0 25px 0; font-size: 14px; }
        .section-head { color: #002b5c; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; font-size: 16px; font-weight: bold; }

        .role-selector { text-align: center; margin-bottom: 20px; }
        .role-btns { display: flex; justify-content: center; gap: 10px; }
        .role-btn {
            padding: 8px 20px; border: 1px solid #ddd; background: #fff;
            border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: 600; color: #555;
            transition: all 0.3s;
        }
        .role-btn.active {
            background: #002b5c; color: #fff; border-color: #002b5c; box-shadow: 0 2px 5px rgba(0,43,92,0.3);
        }

        .form-group { margin-bottom: 15px; }
        .row-split { display: flex; gap: 15px; margin-bottom: 15px; }
        .col { flex: 1; }

        .lbl { display: block; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 5px; }
        .req { color: red; }
        .small-text { display: block; font-size: 11px; color: #888; margin-bottom: 5px; }
        
        .inp, select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; color: #333; outline: none; }
        .inp:focus { border-color: #002b5c; }
        
        .file-box { background: #fafafa; border: 1px dashed #ccc; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
        .inp-file { font-size: 13px; width: 100%; }

        .action-btn { width: 100%; padding: 12px; background: #002b5c; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px; }
        .action-btn:hover { background: #001f42; }

        .forgot-link { text-align: right; margin-bottom: 20px; }
        .forgot-link a { color: #002b5c; font-size: 13px; text-decoration: none; }
        
        .toggle-text { text-align: center; margin-top: 25px; font-size: 14px; color: #666; }
        .toggle-text span { color: #cfa144; font-weight: bold; cursor: pointer; }
        
        .captcha-box { background: #eee; padding: 8px; text-align: center; letter-spacing: 4px; font-weight: bold; border: 1px solid #ddd; margin-bottom: 5px; color: #333; }
        
        .terms-box { display: flex; align-items: center; gap: 8px; font-size: 13px; margin: 20px 0; }
        
        .alert-msg { padding: 10px; font-size: 13px; text-align: center; border-radius: 4px; margin-bottom: 15px; }
        .alert-msg.error { background: #ffe6e6; color: #d63031; border: 1px solid #ff7675; }
        .alert-msg.success { background: #e6fffa; color: #00b894; border: 1px solid #55efc4; }

        /* Animation: Bottom to Top */
        .fade-in { animation: slideUp 0.6s ease-out; }
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(100px); } 
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}