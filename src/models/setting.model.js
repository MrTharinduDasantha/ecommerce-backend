const pool = require("../config/database");

// -----------------------------------------
// Header Footers Setting Related Functions
// -----------------------------------------

// Fetch header footer setting
async function getHeaderFooterSetting() {
  const [rows] = await pool.query(
    "SELECT * FROM Header_Footer_Setting LIMIT 1"
  );
  return rows[0] || null;
}

// Update header footer setting
async function updateHeaderFooterSetting(HeaderFooterSettingData) {
  const currentHeaderFooterSetting = await getHeaderFooterSetting();
  if (currentHeaderFooterSetting) {
    // Update existing header footer setting
    await pool.query(
      "UPDATE Header_Footer_Setting SET Navbar_Logo_Url = ?, Footer_Copyright = ?, updated_at = CURRENT_TIMESTAMP WHERE idHeader_Footer_Setting = ?",
      [
        HeaderFooterSettingData.Navbar_Logo_Url,
        HeaderFooterSettingData.Footer_Copyright,
        currentHeaderFooterSetting.idHeader_Footer_Setting,
      ]
    );
    // Return updated header footer setting
    const updatedHeaderFooterSetting = await getHeaderFooterSetting();
    return updatedHeaderFooterSetting;
  } else {
    // Create new header footer setting
    const result = await pool.query(
      "INSERT INTO Header_Footer_Setting (Navbar_Logo_Url, Footer_Copyright) VALUES (?,?)",
      [
        HeaderFooterSettingData.Navbar_Logo_Url,
        HeaderFooterSettingData.Footer_Copyright,
      ]
    );
    // Return newly created header footer setting
    const [rows] = await pool.query(
      "SELECT * FROM Header_Footer_Setting WHERE idHeader_Footer_Setting = ?",
      result[0].insertId
    );
    return rows[0];
  }
}

module.exports = {
  getHeaderFooterSetting,
  updateHeaderFooterSetting,
};
