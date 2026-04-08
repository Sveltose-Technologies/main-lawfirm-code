const Enquiry = require("../models/contactUsModel");
const nodemailer = require("nodemailer");


/* ================= CREATE ================= */
exports.createEnquiry = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      inquiryType,
      message,
      address
    } = req.body;

    const enquiry = await Enquiry.create({
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      inquiryType,
      message,
      address
    });

    
    // ================= SEND MAIL TO USER =================
   try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      // Mail to Admin
      await transporter.sendMail({
        from: `<${process.env.EMAIL}>`,
        to: process.env.EMAIL,
        replyTo: email,
        subject: `New Enquiry`,
        html: `
          <h3>New Contact Message</h3>
          <p><b>Name:</b> ${firstName} ${lastName}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Contact No:</b> ${countryCode || ""} ${phoneNumber || ""}</p>
          <p><b>Inquiry Type:</b> ${inquiryType || "N/A"}</p>
          <p><b>Message:</b> ${message}</p>
        `,
      });

      // // Confirmation Mail to User
      // await transporter.sendMail({
      //   from: `"Sapience Desk" <${process.env.EMAIL_USER}>`,
      //   to: email,
      //   subject: "Thank you for contacting us",
      //   html: `
      //     <h3>Hello ${firstName},</h3>
      //     <p>Thank you for contacting Sapience Desk.</p>
      //     <p>We have received your enquiry and our team will contact you soon.</p>
      //     <br/>
      //     <p><b>Your Message:</b></p>
      //     <p>${message}</p>
      //   `,
      // });

    } catch (mailError) {
      console.log("Mail Error:", mailError.message);
    }


    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
exports.getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByPk(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByPk(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await enquiry.destroy();

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      inquiryType,
      message,
      address
    } = req.body;

    const enquiry = await Enquiry.findByPk(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await enquiry.update({
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      inquiryType,
      message,
      address
    });

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
