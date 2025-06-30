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
      "UPDATE Header_Footer_Setting SET Navbar_Logo_Url = ?, Footer_Copyright = ?, Nav_Icons = ?, Country_Blocks = ?, Footer_Links = ?, Social_Icons = ?, updated_at = CURRENT_TIMESTAMP WHERE idHeader_Footer_Setting = ?",
      [
        HeaderFooterSettingData.Navbar_Logo_Url,
        HeaderFooterSettingData.Footer_Copyright,
        HeaderFooterSettingData.Nav_Icons,
        HeaderFooterSettingData.Country_Blocks,
        HeaderFooterSettingData.Footer_Links,
        HeaderFooterSettingData.Social_Icons,
        currentHeaderFooterSetting.idHeader_Footer_Setting,
      ]
    );
    // Return updated header footer setting
    const updatedHeaderFooterSetting = await getHeaderFooterSetting();
    return updatedHeaderFooterSetting;
  } else {
    // Create new header footer setting
    const result = await pool.query(
      "INSERT INTO Header_Footer_Setting (Navbar_Logo_Url, Footer_Copyright, Nav_Icons, Country_Blocks, Footer_Links, Social_Icons) VALUES (?,?,?,?,?,?)",
      [
        HeaderFooterSettingData.Navbar_Logo_Url,
        HeaderFooterSettingData.Footer_Copyright,
        HeaderFooterSettingData.Nav_Icons,
        HeaderFooterSettingData.Country_Blocks,
        HeaderFooterSettingData.Footer_Links,
        HeaderFooterSettingData.Social_Icons,
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

// -----------------------------------
// About Us Setting Related Functions
// -----------------------------------

// Fetch about us setting
async function getAboutUsSetting() {
  const [rows] = await pool.query("SELECT * FROM About_Us_Setting LIMIT 1");
  return rows[0] || null;
}

// Update about us setting
async function updateAboutUsSetting(AboutUsSettingData) {
  const currentAboutUsSetting = await getAboutUsSetting();

  if (currentAboutUsSetting) {
    // Update existing about us setting
    await pool.query(
      "UPDATE About_Us_Setting SET Statistics = ?, Vision_Image_Url = ?, Vision_Title = ?, Vision_Description = ?, Mission_Image_Url = ?, Mission_Title = ?, Mission_Description = ?, Values_Image_Url = ?, Values_Title = ?, Values_Description = ?, Features = ?, Why_Choose_Us_Image_Url = ?, Shopping_Experience_Title = ?, Shopping_Experience_Description = ?, Shopping_Experience_Button_Text = ?, updated_at = CURRENT_TIMESTAMP WHERE idAbout_Us_Setting = ?",
      [
        AboutUsSettingData.Statistics,
        AboutUsSettingData.Vision_Image_Url,
        AboutUsSettingData.Vision_Title,
        AboutUsSettingData.Vision_Description,
        AboutUsSettingData.Mission_Image_Url,
        AboutUsSettingData.Mission_Title,
        AboutUsSettingData.Mission_Description,
        AboutUsSettingData.Values_Image_Url,
        AboutUsSettingData.Values_Title,
        AboutUsSettingData.Values_Description,
        AboutUsSettingData.Features,
        AboutUsSettingData.Why_Choose_Us_Image_Url,
        AboutUsSettingData.Shopping_Experience_Title,
        AboutUsSettingData.Shopping_Experience_Description,
        AboutUsSettingData.Shopping_Experience_Button_Text,
        currentAboutUsSetting.idAbout_Us_Setting,
      ]
    );

    // Return updated about us setting
    const updatedAboutUsSetting = await getAboutUsSetting();
    return updatedAboutUsSetting;
  } else {
    // Create new about us setting
    const result = await pool.query(
      "INSERT INTO About_Us_Setting (Statistics, Vision_Image_Url, Vision_Title, Vision_Description, Mission_Image_Url, Mission_Title, Mission_Description, Values_Image_Url, Values_Title, Values_Description, Features, Why_Choose_Us_Image_Url, Shopping_Experience_Title, Shopping_Experience_Description, Shopping_Experience_Button_Text) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        AboutUsSettingData.Statistics,
        AboutUsSettingData.Vision_Image_Url,
        AboutUsSettingData.Vision_Title,
        AboutUsSettingData.Vision_Description,
        AboutUsSettingData.Mission_Image_Url,
        AboutUsSettingData.Mission_Title,
        AboutUsSettingData.Mission_Description,
        AboutUsSettingData.Values_Image_Url,
        AboutUsSettingData.Values_Title,
        AboutUsSettingData.Values_Description,
        AboutUsSettingData.Features,
        AboutUsSettingData.Why_Choose_Us_Image_Url,
        AboutUsSettingData.Shopping_Experience_Title,
        AboutUsSettingData.Shopping_Experience_Description,
        AboutUsSettingData.Shopping_Experience_Button_Text,
      ]
    );

    // Return newly created about us setting
    const [rows] = await pool.query(
      "SELECT * FROM About_Us_Setting WHERE idAbout_Us_Setting = ?",
      result[0].insertId
    );

    return rows[0];
  }
}

module.exports = {
  getHeaderFooterSetting,
  updateHeaderFooterSetting,
  getAboutUsSetting,
  updateAboutUsSetting,
};
