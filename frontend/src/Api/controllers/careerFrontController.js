const CareerFront = require("../models/careerFrontModel");

// CREATE
exports.createCareerFront = async (req, res) => {
  try {
    const {categoryId, bannerText, firstText, secondText, thirdText,countryId } = req.body;

    const data = await CareerFront.create({
      bannerText,
      firstText,
      secondText,
      thirdText,
      countryId,
      categoryId,

      bannerImage: req.files?.bannerImage
        ? `/uploads/${req.files.bannerImage[0].filename}`
        : null,

      firstImage: req.files?.firstImage
        ? `/uploads/${req.files.firstImage[0].filename}`
        : null,

      secondImage: req.files?.secondImage
        ? `/uploads/${req.files.secondImage[0].filename}`
        : null,

        thirdImage: req.files?.thirdImage
        ? `/uploads/${req.files.thirdImage[0].filename}`
        : null,

    });

    res.status(201).json({
      status: true,
      message: "Created successfully",
      data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false });
  }
};

exports.updateCareerFront = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await CareerFront.findByPk(id);
    if (!data) {
      return res.status(404).json({ status: false, message: "Not found" });
    }

    await data.update({
      bannerText: req.body.bannerText || data.bannerText,
      firstText: req.body.firstText || data.firstText,
      secondText: req.body.secondText || data.secondText,
      thirdText: req.body.thirdText || data.thirdText,
      countryId: req.body.countryId || data.countryId,
      categoryId : req.body.categoryId || data.categoryId,

      bannerImage: req.files?.bannerImage
        ? `/uploads/${req.files.bannerImage[0].filename}`
        : data.bannerImage,

      firstImage: req.files?.firstImage
        ? `/uploads/${req.files.firstImage[0].filename}`
        : data.firstImage,

      secondImage: req.files?.secondImage
        ? `/uploads/${req.files.secondImage[0].filename}`
        : data.secondImage,

          thirdImage: req.files?.thirdImage
        ? `/uploads/${req.files.thirdImage[0].filename}`
        : data.thirdImage,
    });

    res.json({
      status: true,
      message: "Updated successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({ status: false });
  }
};


// ✅ GET ALL
exports.getAllCareerFront = async (req, res) => {
  try {
    const data = await CareerFront.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      status: true,
      total: data.length,
      data,
    });

  } catch (error) {
    res.status(500).json({ status: false });
  }
};


// ✅ GET BY ID
exports.getCareerFrontById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await CareerFront.findByPk(id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Not found",
      });
    }

    res.json({
      status: true,
      data,
    });

  } catch (error) {
    res.status(500).json({ status: false });
  }
};


// ✅ DELETE
exports.deleteCareerFront = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await CareerFront.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Not found",
      });
    }

    res.json({
      status: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ status: false });
  }
};