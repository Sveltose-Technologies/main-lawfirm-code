const Case = require("../models/casesModel");

// CREATE CASE
exports.createCase = async (req, res) => {
  try {
    const {
      case_name,
      description,
      hearing_datetime,
      priority,
      contact_person,
      contact_person_number,
      people_name,
      status,
    } = req.body;

    if (!case_name)
      return res.status(400).json({ message: "Case name is required" });

    const documents = req.files ? req.files.map(file => file.filename) : [];

    const newCase = await Case.create({
      case_name,
      description,
      hearing_datetime,
      priority,
      contact_person,
      contact_person_number,
      people_name,
      status,
      documents,
    });

    res.status(201).json({ message: "Case created", data: newCase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET ALL CASES
exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.findAll({ order: [["created_at", "DESC"]] });
    res.status(200).json({  message: "All Cases fetched successfully",count: cases.length, cases });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE CASE
exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const caseData = await Case.findByPk(id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const documents = req.files.length
      ? req.files.map(file => file.filename)
      : caseData.documents;

    await caseData.update({
      case_name: req.body.case_name ?? caseData.case_name,
      description: req.body.description ?? caseData.description,
      hearing_datetime: req.body.hearing_datetime ?? caseData.hearing_datetime,
      priority: req.body.priority ?? caseData.priority,
      contact_person: req.body.contact_person ?? caseData.contact_person,
      contact_person_number: req.body.contact_person_number ?? caseData.contact_person_number,
      people_name: req.body.people_name ?? caseData.people_name,
      status: req.body.status ?? caseData.status,
      documents,
    });

    res.status(200).json({ message: "Case updated", data: caseData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE CASE
exports.deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const caseData = await Case.findByPk(id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    await caseData.destroy();
    res.status(200).json({ message: "Case deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
