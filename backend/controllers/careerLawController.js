const careerLaw = require("../models/careerLawModel");

exports.createCareerLaw = async (req, res) => {
   try {
      
    const { content, categoryid, countryId } = req.body;
  
    const image = req.file ? `/uploads/${req.file.filename}`: null;

    const data = await careerLaw.create({
      image,
      content,
      categoryid,
      countryId
    });

    res.status(201).json({
      status: true,
      message: "Career Law created successfully",
      data
    });


   } catch (error) {
      res.status(500).json({ error: error.message });
   } 

}

exports.getAllCareerLaws = async (req, res) => {
   try {
      const careerLaws = await careerLaw.findAll({
         order: [["createdAt", "DESC"]],
       });          
         res.status(200).json({
            status: true,
            count : careerLaws.length,
            data: careerLaws,
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getByCategoryId = async (req, res) => {
   try {
      const { id } = req.params;
      const careerLaws = await careerLaw.findByPk(id);    
            res.status(200).json({
                status: true,   
                data: careerLaws,
            });
   }    catch (error) {
        res.status(500).json({ error: error.message });
    }

}   

exports.updateCareerLaw = async (req, res) => {
   try {
      const { id } = req.params;
      const careerLawToUpdate = await careerLaw.findByPk(id);           
        if (!careerLawToUpdate) {   
            return res.status(404).json({ message: "Career Law not found" });
        }   

    const { content, categoryid, countryId } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null; 

    await careerLawToUpdate.update({    
        image,
        content,
        categoryid,
        countryId
    });

    res.status(200).json({
        status: true,
        message: "Career Law updated successfully",
        data: careerLawToUpdate,
    });
} catch (error) {
    res.status(500).json({ error: error.message });
}
}

exports.deleteCareerLaw = async (req, res) => {
try {
     const {id} = req.params;

     const careerLawToDelete = await careerLaw.findByPk(id);
        if (!careerLawToDelete) {
            return res.status(404).json({ message: "Career Law not found" });
        }   
    await careerLawToDelete.destroy();

    res.status(200).json({
        status: true,
        message: "Career Law deleted successfully",
    });
} catch (error) {
    res.status(500).json({error:error.message})
}

}
