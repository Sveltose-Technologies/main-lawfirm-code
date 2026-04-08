const CarrerAttorney = require("../models/careerAttorneyModel");

exports.createCareerAttorney = async (req, res) => {
    try {
        const { categoryId, countryId, content } = req.body;

        const image = req.file ?`/uploads/${req.file.filename}` : null;     


        const careerAttorney = await CarrerAttorney.create({
            image,
            categoryId,
            countryId,
            content
        });
        res.status(201).json(careerAttorney);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCareerAttorneys = async (req, res) => {

  try {

    const carreerAttorneys = await CarrerAttorney.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ message: "Career Attorneys fetched successfully",
        count : carreerAttorneys.length,
        data: carreerAttorneys });
    
  } catch (error) {
     res.status(500).json({ message: error.message });
  }

};

exports.getCareerAttorneyById = async (req, res) => {
  try {
    const { id } = req.params;
    const careerAttorney = await CarrerAttorney.findByPk(id);   
    if (!careerAttorney) {
      return res.status(404).json({ message: "Career Attorney not found" });
    }   
    res.status(200).json(careerAttorney);
  }     
    catch (error) {
        res.status(500).json({ message: error.message });   
    }
};

exports.updateCareerAttorney = async (req, res) => {
   try {
      const { id } = req.params;        
        const careerAttorneyToUpdate = await CarrerAttorney.findByPk(id);

        if (!careerAttorneyToUpdate) {
            return res.status(404).json({ message: "Career Attorney not found" });
        }
        const { categoryId, countryId, content } = req.body;

        const image = req.file ? `/uploads/${req.file.filename}` : null;    
        await careerAttorneyToUpdate.update({
            image,
            categoryId, 
            countryId,
            content
        });
        res.status(200).json(careerAttorneyToUpdate);
    }   
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.deleteCareerAttorney = async (req, res) => {
   try {
      const { id } = req.params;
        const careerAttorneyToDelete = await CarrerAttorney.findByPk(id);
        if (!careerAttorneyToDelete) {
            return res.status(404).json({ message: "Career Attorney not found" });
        }
        await careerAttorneyToDelete.destroy();
        res.status(200).json({ message: "Career Attorney deleted successfully" });
    }       
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
};
    
