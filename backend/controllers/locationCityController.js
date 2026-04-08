const LocationCity = require("../models/locationCityMode");

/* ================= CREATE ================= */
exports.createCity = async (req, res) => {
  try {
    const {
      adminId,
      countryId,
      cityName,
      address,
      phoneNo,
      faxNo,
      content
    } = req.body;

    if (!adminId || !countryId || !cityName || !address || !phoneNo) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // const image = req.file ? req.file.filename : null;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

    const city = await LocationCity.create({
      adminId,
      countryId,
      cityName,
      address,
      phoneNo,
      faxNo,
      image,
      content
    });

    res.status(201).json({
      success: true,
      message: "City created successfully",
      data: city,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllCities = async (req, res) => {
  try {
    const cities = await LocationCity.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET BY COUNTRY ================= */
// exports.getCitiesByCountry = async (req, res) => {
//   try {
//     const { countryId } = req.params;

//     const cities = await LocationCity.findAll({
//       where: { countryId },
//     });

//     res.status(200).json({ success: true, data: cities });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

/* ================= GET BY ID ================= */
exports.getCityById = async (req, res) => {
  try {
    const city = await LocationCity.findByPk(req.params.id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateCity = async (req, res) => {
  try {
    const city = await LocationCity.findByPk(req.params.id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    await city.update({
      cityName: req.body.cityName,
      address: req.body.address,
      phoneNo: req.body.phoneNo,
      faxNo: req.body.faxNo,
      image : req.file ? `/uploads/${req.file.filename}` : null,
      content: req.body.content
    });

    res.status(200).json({
      success: true,
      message: "City updated successfully",
      data: city,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ================= */
exports.deleteCity = async (req, res) => {
  try {
    const city = await LocationCity.findByPk(req.params.id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    await city.destroy();

    res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
