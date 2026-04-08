const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/email");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.signUpuser = async (req, res) => {
   
    try {
        const {fullName, email, password, confirmPassword, phoneNo, roleId, countryId, cityId } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }   

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,  
            password: hashedPassword,
            phoneNo,
            roleId,
            countryId,
            cityId
        });
        res.status(201).json({ message: "User created successfully",   
             fullName: user.fullName,
             email: user.email,
             phoneNo: user.phoneNo,
            roleId: user.roleId,
            countryId: user.countryId,
            cityId: user.cityId,
            token: generateToken(user.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
   try {
      
         const { email, password } = req.body;

         const user = await User.findOne({
      where: { email },
      include: {
        model: Role,
        include: Permission,
      },
    });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   

        const  isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
        }
         
        res.status(200).json({ message: "Login successfull", 
             fullName: user.fullName,
             email: user.email,
             phoneNo: user.phoneNo,
            roleId: user.roleId,
            countryId: user.countryId,
            cityId: user.cityId,
            token: generateToken(user.id)
        });
       
   } catch (error) {
      req.status(500).json({ message: error.message });
   }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();     
        res.status(200).json({ count: users.length, users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);            
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }               
        res.status(200).json({ user, count: user.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
  const {
      fullName,
      email,
      password,
      phoneNo,
      countryId,
      cityId,
      roleId,
    } = req.body;

    let updatedData = {
      fullName,
      email,
      phoneNo,
      countryId,
      cityId,
      roleId,
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updatedData);

    res.json({ message: "User updated", data: user });

    }   
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
}
};



exports.forgotPassword = async (req, res) => {
   try {
        const { email } = req.body;
       if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
      
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = await bcrypt.hash(otp, 10);
        user.resetOtpExpire = Date.now() + 10 * 60 * 1000; 
         user.resetOtpVerified = false;

         await user.save();

        await sendEmail(
      `${user.fullName} `,
      email,
      otp
    );
        
        res.status(200).json({ message: "OTP sent to email" });
   } catch (error) {
    res.status(500).json({ message: error.message });
   }
    
}


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare OTP (string safe)
    if (user.resetOtp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check expiry
    if (new Date(user.resetOtpExpire).getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.resetOtpVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
   try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Email, new password & confirm password required"
      });
    }    

        
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    const user = await User.findOne({ where: { email } });
        if (!user) {

            return res.status(404).json({ message: "User not found" });
        }

    if(!user.resetOtpVerified) {
      return res.status(400).json({
        message: "OTP verification required"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    user.resetOtp = null;
    user.resetOtpExpire = null;
    user.resetOtpVerified = false;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful"
    });
   
   } catch (error) {
        res.status(500).json({ message: error.message });
   }        
};