const HomeBannerText = require("../models/homeBanner.model");

// ================= CREATE =================
exports.createHomeBanner = async (req, res) => {
  try {
    const { typeId, textEditor } = req.body;

    if (!typeId || !textEditor) {
      return res.status(400).json({
        status: false,
        message: "typeId and textEditor fields are required",
      });
    }

   const image = req.file ? `/uploads/${req.file.filename}` : null;
    const data = await HomeBannerText.create({
      typeId,
      image,
      textEditor,
    });

    res.status(201).json({
      status: true,
      message: "Home Banner created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// ================= GET ALL =================
exports.getAllHomeBanners = async (req, res) => {
  try {
    const data = await HomeBannerText.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// ================= GET BY ID =================
exports.getHomeBannerById = async (req, res) => {
  try {
    const data = await HomeBannerText.findByPk(req.params.id, {
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// ================= UPDATE =================
exports.updateHomeBanner = async (req, res) => {
  try {
    const { typeId, textEditor } = req.body;

    const data = await HomeBannerText.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }
let image = data.image;

if (req.file) {
  image = `/uploads/${req.file.filename}`;
}

await data.update({
  typeId: typeId || data.typeId,
  textEditor: textEditor || data.textEditor,
  image,
});
    res.status(200).json({
      status: true,
      message: "Updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// ================= DELETE =================
exports.deleteHomeBanner = async (req, res) => {
  try {
    const data = await HomeBannerText.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }

    await data.destroy();

    res.status(200).json({
      status: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};