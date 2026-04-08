const Services = require("../models/servicesModel");

exports.createServices = async (req,res) => {
     try {
        const {content} = req.body;
         if(!content) {
            return  res.status(404).json({message : "content is requried"})
         }

         const data = await Services.create({
            content
         })

         res.status(201).json({ message : "created successfully", data})

     } catch (error) {
        res.status(500).json({ message : error.message})
     }
}

exports.getAllContent = async(req,res) => {
    try {
        
        const data = await Services.findAll({ 
            order: [[ "createdAt", "DESC"]]
        })

        if(!data) {
            return res.status(404).json({message : "content not found"})
        }
        
        res.status(200).json({ message : "All content fetched", data})

    } catch (error) {
         res.statusA(500).json({ message : error.message})
    }
}

exports.getContentByid = async ( req,res ) => {
    try {
     
        const data = await Services.findByPk(req.params.id)

    if (!data) {
      return res.status(404).json({
        message: "content not found"
      });
    }
    
    res.status(200).json({ message : "content fetched", data})

    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

exports.updateContent = async ( req, res) => {
    try {
        
    const {content } = req.body

    const data = await Services.findByPk(req.params.id)

    if (!data) {
      return res.status(404).json({
        message: "Content not found"
      });
    }
      
    await data.update({
         content
    })

    res.status(200).json({ message : "content update successfully", data});

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

exports.deleteContent = async (req , res) => {
    
   try {
        const data = await Services.findByPk(req.params.id)

    if(!data) {
        return res.status(404).json({ message :" content not found" })
    }
    
    await data.destroy();
    
    res.status(200).json({ message : "data delete succesfully"})
    
   } catch (error) {
      res.status(500).json({
        message : error.message
      })
   }
}