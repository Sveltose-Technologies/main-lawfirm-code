const CarrerBanner = require("../models/carrerBannerModel");

exports.createCareerBanner = async (req, res) => {
  
    try {
        const {content} = req.body;

        const bannerImage = req.file ?`/uploads/${req.file.filename}` : null;

        const data = await CarrerBanner.create({
            content,
            bannerImage,
        }); 
         
        res.status(201).json({
            message: "Career Banner created successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating Career Banner",
            error: error.message,
        });
    }

};

exports.getAllCareerBanner = async (req, res) => {
    try {
        const data = await CarrerBanner.findAll({
            order: [["createdAt", "DESC"]],
        });             
        res.status(200).json({
            message: "Career Banner fetched successfully",
            count: data.length,
            data,
        });
    }           
    catch (error) { 
        res.status(500).json({      
            message: "Error fetching Career Banner",    
            error: error.message,   
        });    }
};  

exports.getCareerBannerById = async (req, res) => {
     try {
        
         const { id } = req.params;
         const data = await CarrerBanner.findByPk(id);  
            if (!data) {
                return res.status(404).json({
                    message: "Career Banner not found",
                });
            }   
        res.status(200).json({
            message: "Career Banner fetched successfully",
            data,
        });

     } catch (error) {
          res.status(500).json({ error: error.message });
     }
};


exports.updateCareerBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CarrerBanner.findByPk(id);           
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Career Banner not found",
      });
    }
    const { content } = req.body;   
    await data.update({
      content: content || data.content,
      bannerImage: req.file ? `/uploads/${req.file.filename}` : null,   
    });     
    res.status(200).json({
      status: true,
      message: "Career Banner updated successfully",
      data,
    });
  } catch (error) { 
    res.status(500).json({  
        status: false,  
        message: "Error updating Career Banner",    
        error: error.message,
    });
  }
};


exports.deleteCareerBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CarrerBanner.findByPk(id);       

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Career Banner not found",
      });
    }           
    await data.destroy();

    res.status(200).json({
      status: true,
      message: "Career Banner deleted successfully",    
    });
  } catch (error) {             
    res.status(500).json({  
        status: false,
        message: "Error deleting Career Banner",
        error: error.message,
    });
  } 
};
