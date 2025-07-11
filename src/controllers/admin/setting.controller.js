const Setting = require("../../models/setting.model");
const fs = require("fs");

// -----------------------------------------
// Header Footers Setting Related Functions
// -----------------------------------------

// Fetch header footer setting
async function getHeaderFooterSetting(req, res) {
  try {
    const headerFooterSetting = await Setting.getHeaderFooterSetting();
    res.status(200).json({
      message: "Header and Footer settings fetched successfully",
      headerFooterSetting,
    });
  } catch (error) {
    console.error("Error fetching header and footer settings:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch header and footer settings" });
  }
}

// Update header footer setting
async function updateHeaderFooterSetting(req, res) {
  try {
    const currentHeaderFooterSetting = await Setting.getHeaderFooterSetting();
    const footerCopyright = req.body.footerCopyright;
    let navbarLogoUrl = currentHeaderFooterSetting
      ? currentHeaderFooterSetting.Navbar_Logo_Url
      : null;

    // Find navbar logo file
    const navbarLogoFile = req.files.find(
      (file) => file.fieldname === "navbarLogo"
    );
    if (navbarLogoFile) {
      if (
        currentHeaderFooterSetting &&
        currentHeaderFooterSetting.Navbar_Logo_Url
      ) {
        const oldPath = currentHeaderFooterSetting.Navbar_Logo_Url.replace(
          `${req.protocol}://${req.get("host")}/`,
          ""
        );
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error removing old logo:", err);
        });
      }
      navbarLogoUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        navbarLogoFile.filename
      }`;
    }

    // Parse navigation icons
    const navIcons = req.body.navIcons ? JSON.parse(req.body.navIcons) : [];

    // Filter nav icon images
    const navIconImages = req.files.filter((file) =>
      file.fieldname.startsWith("navIconImage_")
    );

    // Associate images with nav icons based on index
    navIconImages.forEach((file) => {
      const index = parseInt(file.fieldname.replace("navIconImage_", ""), 10);
      if (!isNaN(index) && index < navIcons.length) {
        const iconImageUrl = `${req.protocol}://${req.get(
          "host"
        )}/src/uploads/${file.filename}`;
        navIcons[index].iconImageUrl = iconImageUrl;
      }
    });

    // Process other fields
    const countryBlocks = req.body.countryBlocks
      ? JSON.parse(req.body.countryBlocks)
      : [];
    const footerLinks = req.body.footerLinks
      ? JSON.parse(req.body.footerLinks)
      : [];
    const socialIcons = req.body.socialIcons
      ? JSON.parse(req.body.socialIcons)
      : [];

    const newHeaderFooterSetting = {
      Navbar_Logo_Url: navbarLogoUrl,
      Footer_Copyright: footerCopyright,
      Nav_Icons: JSON.stringify(navIcons),
      Country_Blocks: JSON.stringify(countryBlocks),
      Footer_Links: JSON.stringify(footerLinks),
      Social_Icons: JSON.stringify(socialIcons),
    };

    const updatedHeaderFooterSetting = await Setting.updateHeaderFooterSetting(
      newHeaderFooterSetting
    );
    res.status(200).json({
      message: "Header and Footer settings updated successfully",
      updatedHeaderFooterSetting,
    });
  } catch (error) {
    console.error("Error updating header and footer settings:", error);
    res
      .status(500)
      .json({ message: "Failed to update header and footer settings" });
  }
}

// -----------------------------------
// About Us Setting Related Functions
// -----------------------------------

// Fetch about us setting
async function getAboutUsSetting(req, res) {
  try {
    const aboutUsSetting = await Setting.getAboutUsSetting();
    res.status(200).json({
      message: "About Us settings fetched successfully",
      aboutUsSetting,
    });
  } catch (error) {
    console.error("Error fetching about us settings:", error);
    res.status(500).json({ message: "Failed to fetch about us settings" });
  }
}

// Update about us setting
async function updateAboutUsSetting(req, res) {
  try {
    const currentAboutUsSetting = await Setting.getAboutUsSetting();

    // Handle image uploads
    let visionImageUrl = currentAboutUsSetting
      ? currentAboutUsSetting.Vision_Image_Url
      : null;
    let missionImageUrl = currentAboutUsSetting
      ? currentAboutUsSetting.Mission_Image_Url
      : null;
    let valuesImageUrl = currentAboutUsSetting
      ? currentAboutUsSetting.Values_Image_Url
      : null;
    let whyChooseUsImageUrl = currentAboutUsSetting
      ? currentAboutUsSetting.Why_Choose_Us_Image_Url
      : null;

    // Find image files
    const visionImageFile = req.files.find(
      (file) => file.fieldname === "visionImage"
    );
    const missionImageFile = req.files.find(
      (file) => file.fieldname === "missionImage"
    );
    const valuesImageFile = req.files.find(
      (file) => file.fieldname === "valuesImage"
    );
    const whyChooseUsImageFile = req.files.find(
      (file) => file.fieldname === "whyChooseUsImage"
    );

    // Update vision image
    if (visionImageFile) {
      if (currentAboutUsSetting && currentAboutUsSetting.Vision_Image_Url) {
        const oldPath = currentAboutUsSetting.Vision_Image_Url.replace(
          `${req.protocol}://${req.get("host")}/`,
          ""
        );
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error removing old vision image:", err);
        });
      }
      visionImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        visionImageFile.filename
      }`;
    }

    // Update mission image
    if (missionImageFile) {
      if (currentAboutUsSetting && currentAboutUsSetting.Mission_Image_Url) {
        const oldPath = currentAboutUsSetting.Mission_Image_Url.replace(
          `${req.protocol}://${req.get("host")}/`,
          ""
        );
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error removing old mission image:", err);
        });
      }
      missionImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        missionImageFile.filename
      }`;
    }

    // Update values image
    if (valuesImageFile) {
      if (currentAboutUsSetting && currentAboutUsSetting.Values_Image_Url) {
        const oldPath = currentAboutUsSetting.Values_Image_Url.replace(
          `${req.protocol}://${req.get("host")}/`,
          ""
        );
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error removing old values image:", err);
        });
      }
      valuesImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        valuesImageFile.filename
      }`;
    }

    // Update why choose us image
    if (whyChooseUsImageFile) {
      if (
        currentAboutUsSetting &&
        currentAboutUsSetting.Why_Choose_Us_Image_Url
      ) {
        const oldPath = currentAboutUsSetting.Why_Choose_Us_Image_Url.replace(
          `${req.protocol}://${req.get("host")}/`,
          ""
        );
        fs.unlink(oldPath, (err) => {
          if (err)
            console.error("Error removing old why choose us image:", err);
        });
      }
      whyChooseUsImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        whyChooseUsImageFile.filename
      }`;
    }

    // Parse JSON fields
    const statistics = req.body.statistics
      ? JSON.parse(req.body.statistics)
      : [];
    const features = req.body.features ? JSON.parse(req.body.features) : [];

    const newAboutUsSetting = {
      Statistics: JSON.stringify(statistics),
      Vision_Image_Url: visionImageUrl,
      Vision_Title: req.body.visionTitle,
      Vision_Description: req.body.visionDescription,
      Mission_Image_Url: missionImageUrl,
      Mission_Title: req.body.missionTitle,
      Mission_Description: req.body.missionDescription,
      Values_Image_Url: valuesImageUrl,
      Values_Title: req.body.valuesTitle,
      Values_Description: req.body.valuesDescription,
      Features: JSON.stringify(features),
      Why_Choose_Us_Image_Url: whyChooseUsImageUrl,
      Shopping_Experience_Title: req.body.shoppingExperienceTitle,
      Shopping_Experience_Description: req.body.shoppingExperienceDescription,
      Shopping_Experience_Button_Text: req.body.shoppingExperienceButtonText,
    };

    const updatedAboutUsSetting = await Setting.updateAboutUsSetting(
      newAboutUsSetting
    );

    res.status(200).json({
      message: "About Us settings updated successfully",
      updatedAboutUsSetting,
    });
  } catch (error) {
    console.error("Error updating about us settings:", error);
    res.status(500).json({ message: "Failed to update about us settings" });
  }
}

// ----------------------------------------
// Policy Details Setting Related Functions
// ----------------------------------------

// Fetch policy details setting
async function getPolicyDetailsSetting(req, res) {
  try {
    const policyDetailsSetting = await Setting.getPolicyDetailsSetting();

    res.status(200).json({
      message: "Policy details settings fetched successfully",
      policyDetailsSetting,
    });
  } catch (error) {
    console.error("Error fetching policy details settings:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch policy details settings" });
  }
}

// Update policy details setting
async function updatePolicyDetailsSetting(req, res) {
  try {
    const newPolicyDetailsSetting = {
      Legal_Policy_Content: req.body.legalPolicyContent || "",
      Privacy_Policy_Content: req.body.privacyPolicyContent || "",
      Security_Policy_Content: req.body.securityPolicyContent || "",
      Terms_Of_Service_Content: req.body.termsOfServiceContent || "",
    };

    const updatedPolicyDetailsSetting =
      await Setting.updatePolicyDetailsSetting(newPolicyDetailsSetting);

    res.status(200).json({
      message: "Policy details settings updated successfully",
      updatedPolicyDetailsSetting,
    });
  } catch (error) {
    console.error("Error updating policy details settings:", error);
    res
      .status(500)
      .json({ message: "Failed to update policy details settings" });
  }
}

module.exports = {
  getHeaderFooterSetting,
  updateHeaderFooterSetting,
  getAboutUsSetting,
  updateAboutUsSetting,
  getPolicyDetailsSetting,
  updatePolicyDetailsSetting,
};
