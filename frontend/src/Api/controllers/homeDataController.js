const HomeData = require("../models/homeData.model");


// CREATE
exports.createHomeData = async (req, res) => {
  try {
    const {
      firstTextEditor,
      middleText,
      secondTextEditor,
      thirdTextEditor,
      fourthTextEditor,
    } = req.body;

    const data = await HomeData.create({
      firstImage: req.files?.firstImage?.[0]
        ? `/uploads/${req.files.firstImage[0].filename}`
        : null,

      firstTextEditor,
      middleText,

      secondImage: req.files?.secondImage?.[0]
        ? `/uploads/${req.files.secondImage[0].filename}`
        : null,

      secondTextEditor,

      thirdImage: req.files?.thirdImage?.[0]
        ? `/uploads/${req.files.thirdImage[0].filename}`
        : null,

      thirdTextEditor,

      fourthImage: req.files?.fourthImage?.[0]
        ? `/uploads/${req.files.fourthImage[0].filename}`
        : null,

      fourthTextEditor,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL
exports.getAllHomeData = async (req, res) => {
  try {
    const data = await HomeData.findAll();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID
exports.getHomeDataById = async (req, res) => {
  try {
    const data = await HomeData.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateHomeData = async (req, res) => {
  try {
    const data = await HomeData.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not Found" });
    }

    await data.update({
      firstImage: req.files?.firstImage?.[0]
        ? `/uploads/${req.files.firstImage[0].filename}`
        : data.firstImage,

      firstTextEditor: req.body.firstTextEditor || data.firstTextEditor,

      middleText: req.body.middleText || data.middleText,

      secondImage: req.files?.secondImage?.[0]
        ? `/uploads/${req.files.secondImage[0].filename}`
        : data.secondImage,

      secondTextEditor: req.body.secondTextEditor || data.secondTextEditor,

      thirdImage: req.files?.thirdImage?.[0]
        ? `/uploads/${req.files.thirdImage[0].filename}`
        : data.thirdImage,

      thirdTextEditor: req.body.thirdTextEditor || data.thirdTextEditor,

      fourthImage: req.files?.fourthImage?.[0]
        ? `/uploads/${req.files.fourthImage[0].filename}`
        : data.fourthImage,

      fourthTextEditor: req.body.fourthTextEditor || data.fourthTextEditor,
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteHomeData = async (req, res) => {
  try {
    const data = await HomeData.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Not Found" });
    }

    await data.destroy();
    res.json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};