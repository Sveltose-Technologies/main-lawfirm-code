const JobCategory = require("../models/jobCategoryModel");

/* ================= CREATE ================= */
exports.createJobCategory = async (req, res) => {
  try {
    const { jobCategory } = req.body;

    if (!jobCategory) {
      return res.status(400).json({ message: "Job category is required" });
    }

    const data = await JobCategory.create({ jobCategory });

    res.status(201).json({
      message: "Job Category created successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= GET ALL ================= */
exports.getAllJobCategories = async (req, res) => {
  try {
    const data = await JobCategory.findAll({
      order: [["id", "DESC"]],
    });

    res.status(200).json({ data });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= GET BY ID ================= */
exports.getJobCategoryById = async (req, res) => {
  try {
    const data = await JobCategory.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Job Category not found" });
    }

    res.status(200).json({ data });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= UPDATE ================= */
exports.updateJobCategory = async (req, res) => {
  try {
    const data = await JobCategory.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Job Category not found" });
    }

    const { jobCategory } = req.body;

    await data.update({
      jobCategory: jobCategory || data.jobCategory,
    });

    res.status(200).json({
      message: "Updated successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= DELETE ================= */
exports.deleteJobCategory = async (req, res) => {
  try {
    const data = await JobCategory.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Job Category not found" });
    }

    await data.destroy();

    res.status(200).json({
      message: "Deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};