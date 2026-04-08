const langs = require("langs");

exports.getAllLanguages = (req, res) => {
  try {

    const languages = langs.all().map(lang => ({
      name: lang.name,
      local: lang.local,
      code: lang["1"]
    }));

    res.status(200).json({
      success: true,
      total: languages.length,
      data: languages
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};