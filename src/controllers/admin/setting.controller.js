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
    // Get current header and footer setting
    const currentHeaderFooterSetting = await Setting.getHeaderFooterSetting();

    // Get new header and footer setting
    const footerCopyright = req.body.footerCopyright;
    let navbarLogoUrl = currentHeaderFooterSetting
      ? currentHeaderFooterSetting.Navbar_Logo_Url
      : null;

    // If new navbar logo is provided, update it and remove old one
    if (req.file) {
      if (
        currentHeaderFooterSetting &&
        currentHeaderFooterSetting.Navbar_Logo_Url
      ) {
        // Convert URL to file path
        const oldPath = currentHeaderFooterSetting.Navbar_Logo_Url.replace(
          `${req.protocol}://${req.get("host")}/`,
          ""
        );
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error removing old logo:", err);
        });
      }
      navbarLogoUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }

    // Build new header and footer setting object
    const newHeaderFooterSetting = {
      Navbar_Logo_Url: navbarLogoUrl,
      Footer_Copyright: footerCopyright,
    };

    // Update or create header and footer setting in database
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
