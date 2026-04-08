const express = require("express");
require("dotenv").config();
const colors = require("colors");
const sequelize = require("./configer/dbconfig")
const cors = require("cors");
const path = require("path");

const app = express()

const PORT = process.env.PORT || 6000;

/* SAFE body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "images")));


app.use(
  cors({

    origin: "https://blustor.net", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use("/casecategories", require("./routes/casecategorieRoute"))
app.use("/capability-categories", require("./routes/capabilitycategoriesRoutes"))
app.use("/capability-subcategory", require("./routes/capabilitySubcategoryRoutes"))
app.use("/admin", require("./routes/adminRouter"))
app.use("/cms-category", require("./routes/cmscategorisRouter"))
app.use("/cms-subcategory", require("./routes/cmsSubcategoryRoute"))
app.use('/location-cms', require("./routes/locationcmsRoutes"))
app.use("/location-country", require("./routes/locationCountryRouter"))
app.use("/location-city", require("./routes/locationCityRoutes"))
app.use("/ourfirm", require("./routes/ourfirmRoutes"))
app.use("/award", require("./routes/awarsRoute"))
app.use("/promoter", require("./routes/promotersRouter"))
app.use("/contact", require("./routes/contactUsRoute"))
app.use("/terms-condition", require("./routes/termsConditionRoute"))
app.use("/privacy-policy", require("./routes/privacyPolicyRoute"))
app.use("/client", require("./routes/clientRoutes"))
app.use("/attorney", require("./routes/attorneyRoute"))
app.use("/career", require("./routes/careerRoutes"))
app.use("/news", require("./routes/newsRoute"))
app.use("/event", require("./routes/eventRoute"))
app.use("/blogcategories", require("./routes/blogcategoriesRoutes"))
app.use("/cases", require("./routes/casesRoutes"))
app.use("/blogs", require("./routes/blogRoute"))
app.use("/capability", require("./routes/capability.routes"))
app.use("/professionals", require("./routes/professionals.routes"));
app.use("/social-media", require("./routes/socialMediaRoutes"));
app.use("/logo-type", require("./routes/logoTypeRoutes"));
app.use("/home-banner",require("./routes/homeBanner.routes"));
app.use("/home-data",require("./routes/homeDataRoutes"));
app.use("/contact-text",require("./routes/contactTextRoutes") );
app.use("/home-count", require("./routes/homeCountRoute"));
app.use("/home-ranking", require("./routes/homeRankingRoute"));
app.use("/location", require("./routes/locationPageRoute"));
app.use("/languages", require("./routes/languageRoute"));
app.use("/event-banner", require("./routes/eventBannerRoutes"));
app.use("/client-conversation", require("./routes/ClientConversationRoute"));
app.use("/attorney-conversation", require("./routes/attorneyConversationRoute"));
app.use("/attorney-client-conversation", require("./routes/attorneyClientConversationRoutes"));
app.use("/careerfront", require("./routes/careerFrontRoute"));
app.use("/law-career-category", require("./routes/lawCareerCategoryRoute"));
app.use("/career-detail", require("./routes/careerDetailRoute"));
app.use("/job-category", require("./routes/jobCategoryRoute"));
app.use("/services", require("./routes/servicesRoute"));
app.use("/role", require("./routes/roleRoutes"));
app.use("/user", require("./routes/userRoute"));
app.use("/career-banner", require("./routes/carrerBannerRoute"));
app.use("/career-law", require("./routes/carrerLawRoute"));
app.use("/career-attorney", require("./routes/careerAttorneyRoute"));
app.use("/career-professional", require("./routes/careerProfessionalRoute"));
app.use("/permission", require("./routes/permissionRoute"));
app.use("/role-permission", require("./routes/rolePermissionRoute"));

app.listen(PORT, () => {
  console.log(`Server is running at PORT: http://localhost:${PORT}`.bgBlue.black);
});