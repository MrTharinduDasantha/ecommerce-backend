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

module.exports = {
  getHeaderFooterSetting,
  updateHeaderFooterSetting,
};
