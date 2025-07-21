const pool = require("../config/database");
const { getOrgMail } = require('../utils/organization');

// -----------------------------------------
// Header Footers Setting Related Functions
// -----------------------------------------

// Get header footer setting
async function getHeaderFooterSetting() {
  const orgMail = getOrgMail();
  const [rows] = await pool.query(
    "SELECT * FROM Header_Footer_Setting WHERE orgmail = ? LIMIT 1",
    [orgMail]
  );
  return rows[0];
}

// Update header footer setting
async function updateHeaderFooterSetting(HeaderFooterSettingData) {
  const orgMail = getOrgMail();
  const existingSetting = await getHeaderFooterSetting();
  
  if (existingSetting) {
    // Update existing header footer setting
    await pool.query(
      "UPDATE Header_Footer_Setting SET Navbar_Logo_Url = ?, Footer_Copyright = ?, Nav_Icons = ?, Country_Blocks = ?, Footer_Links = ?, Social_Icons = ?, updated_at = CURRENT_TIMESTAMP WHERE idHeader_Footer_Setting = ? AND orgmail = ?",
      [
        HeaderFooterSettingData.Navbar_Logo_Url,
        HeaderFooterSettingData.Footer_Copyright,
        HeaderFooterSettingData.Nav_Icons,
        HeaderFooterSettingData.Country_Blocks,
        HeaderFooterSettingData.Footer_Links,
        HeaderFooterSettingData.Social_Icons,
        existingSetting.idHeader_Footer_Setting,
        orgMail
      ]
    );

    // Return updated header footer setting
    const updatedHeaderFooterSetting = await getHeaderFooterSetting();
    return updatedHeaderFooterSetting;
  } else {
    // Create new header footer setting
    const result = await pool.query(
      "INSERT INTO Header_Footer_Setting (Navbar_Logo_Url, Footer_Copyright, Nav_Icons, Country_Blocks, Footer_Links, Social_Icons, orgmail) VALUES (?,?,?,?,?,?,?)",
      [
        HeaderFooterSettingData.Navbar_Logo_Url,
        HeaderFooterSettingData.Footer_Copyright,
        HeaderFooterSettingData.Nav_Icons,
        HeaderFooterSettingData.Country_Blocks,
        HeaderFooterSettingData.Footer_Links,
        HeaderFooterSettingData.Social_Icons,
        orgMail
      ]
    );

    // Return newly created header footer setting
    const [rows] = await pool.query(
      "SELECT * FROM Header_Footer_Setting WHERE idHeader_Footer_Setting = ? AND orgmail = ?",
      [result[0].insertId, orgMail]
    );
    return rows[0];
  }
}

// -----------------------------------
// About Us Setting Related Functions
// -----------------------------------

// Get about us setting
async function getAboutUsSetting() {
  const orgMail = getOrgMail();
  const [rows] = await pool.query("SELECT * FROM About_Us_Setting WHERE orgmail = ? LIMIT 1", [orgMail]);
  return rows[0];
}

// Update about us setting
async function updateAboutUsSetting(AboutUsSettingData) {
  const orgMail = getOrgMail();
  const existingSetting = await getAboutUsSetting();
  
  if (existingSetting) {
    // Update existing about us setting
    await pool.query(
      "UPDATE About_Us_Setting SET Statistics = ?, Vision_Image_Url = ?, Vision_Title = ?, Vision_Description = ?, Mission_Image_Url = ?, Mission_Title = ?, Mission_Description = ?, Values_Image_Url = ?, Values_Title = ?, Values_Description = ?, Team_Image_Url = ?, Team_Title = ?, Team_Description = ?, Customer_Service_Image_Url = ?, Customer_Service_Title = ?, Customer_Service_Description = ?, Shopping_Experience_Image_Url = ?, Shopping_Experience_Title = ?, Shopping_Experience_Description = ?, Shopping_Experience_Button_Text = ?, updated_at = CURRENT_TIMESTAMP WHERE idAbout_Us_Setting = ? AND orgmail = ?",
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
        AboutUsSettingData.Team_Image_Url,
        AboutUsSettingData.Team_Title,
        AboutUsSettingData.Team_Description,
        AboutUsSettingData.Customer_Service_Image_Url,
        AboutUsSettingData.Customer_Service_Title,
        AboutUsSettingData.Customer_Service_Description,
        AboutUsSettingData.Shopping_Experience_Image_Url,
        AboutUsSettingData.Shopping_Experience_Title,
        AboutUsSettingData.Shopping_Experience_Description,
        AboutUsSettingData.Shopping_Experience_Button_Text,
        existingSetting.idAbout_Us_Setting,
        orgMail
      ]
    );

    // Return updated about us setting
    const updatedAboutUsSetting = await getAboutUsSetting();
    return updatedAboutUsSetting;
  } else {
    // Create new about us setting
    const result = await pool.query(
      "INSERT INTO About_Us_Setting (Statistics, Vision_Image_Url, Vision_Title, Vision_Description, Mission_Image_Url, Mission_Title, Mission_Description, Values_Image_Url, Values_Title, Values_Description, Team_Image_Url, Team_Title, Team_Description, Customer_Service_Image_Url, Customer_Service_Title, Customer_Service_Description, Shopping_Experience_Image_Url, Shopping_Experience_Title, Shopping_Experience_Description, Shopping_Experience_Button_Text, orgmail) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
        AboutUsSettingData.Team_Image_Url,
        AboutUsSettingData.Team_Title,
        AboutUsSettingData.Team_Description,
        AboutUsSettingData.Customer_Service_Image_Url,
        AboutUsSettingData.Customer_Service_Title,
        AboutUsSettingData.Customer_Service_Description,
        AboutUsSettingData.Shopping_Experience_Image_Url,
        AboutUsSettingData.Shopping_Experience_Title,
        AboutUsSettingData.Shopping_Experience_Description,
        AboutUsSettingData.Shopping_Experience_Button_Text,
        orgMail
      ]
    );

    // Return newly created about us setting
    const [rows] = await pool.query(
      "SELECT * FROM About_Us_Setting WHERE idAbout_Us_Setting = ? AND orgmail = ?",
      [result[0].insertId, orgMail]
    );
    return rows[0];
  }
}

// -----------------------------------------
// Policy Details Setting Related Functions
// -----------------------------------------

// Fetch policy details setting
async function getPolicyDetailsSetting() {
  const orgMail = getOrgMail();
  const [rows] = await pool.query(
    "SELECT * FROM Policy_Details_Setting WHERE orgmail = ? LIMIT 1",
    [orgMail]
  );
  return rows[0] || null;
}

// Update policy details setting
async function updatePolicyDetailsSetting(PolicyDetailsSettingData) {
  const orgMail = getOrgMail();
  const currentPolicyDetailsSetting = await getPolicyDetailsSetting();

  if (currentPolicyDetailsSetting) {
    // Update existing policy details setting
    await pool.query(
      "UPDATE Policy_Details_Setting SET Legal_Policy_Content = ?,  Privacy_Policy_Content = ?, Security_Policy_Content = ?, Terms_Of_Service_Content = ?, updated_at = CURRENT_TIMESTAMP WHERE idPolicy_Details_Setting = ? AND orgmail = ?",
      [
        PolicyDetailsSettingData.Legal_Policy_Content,
        PolicyDetailsSettingData.Privacy_Policy_Content,
        PolicyDetailsSettingData.Security_Policy_Content,
        PolicyDetailsSettingData.Terms_Of_Service_Content,
        currentPolicyDetailsSetting.idPolicy_Details_Setting,
        orgMail
      ]
    );

    // Return updated policy details setting
    const updatedPolicyDetailsSetting = await getPolicyDetailsSetting();
    return updatedPolicyDetailsSetting;
  } else {
    // Create new policy details setting
    const result = await pool.query(
      "INSERT INTO Policy_Details_Setting (Legal_Policy_Content, Privacy_Policy_Content, Security_Policy_Content, Terms_Of_Service_Content, orgmail) VALUES (?,?,?,?,?)",
      [
        PolicyDetailsSettingData.Legal_Policy_Content,
        PolicyDetailsSettingData.Privacy_Policy_Content,
        PolicyDetailsSettingData.Security_Policy_Content,
        PolicyDetailsSettingData.Terms_Of_Service_Content,
        orgMail
      ]
    );

    // Return newly created policy details setting
    const [rows] = await pool.query(
      "SELECT * FROM Policy_Details_Setting WHERE idPolicy_Details_Setting = ? AND orgmail = ?",
      [result[0].insertId, orgMail]
    );

    return rows[0];
  }
}

// -----------------------------------
// Home Page Setting Related Functions
// -----------------------------------
// Fetch home page setting
async function getHomePageSetting() {
  const orgMail = getOrgMail();
  const [rows] = await pool.query("SELECT * FROM Home_Page_Setting WHERE orgmail = ? LIMIT 1", [orgMail]);
  return rows[0] || null;
}

// Update home page setting
async function updateHomePageSetting(HomePageSettingData) {
  const orgMail = getOrgMail();
  const currentHomePageSetting = await getHomePageSetting();
  if (currentHomePageSetting) {
    // Update existing home page setting
    await pool.query(
      "UPDATE Home_Page_Setting SET Hero_Images = ?, Working_Section_Title = ?, Working_Section_Description = ?, Working_Items = ?, updated_at = CURRENT_TIMESTAMP WHERE idHome_Page_Setting = ? AND orgmail = ?",
      [
        HomePageSettingData.Hero_Images,
        HomePageSettingData.Working_Section_Title,
        HomePageSettingData.Working_Section_Description,
        HomePageSettingData.Working_Items,
        currentHomePageSetting.idHome_Page_Setting,
        orgMail
      ]
    );
    // Return updated home page setting
    const updatedHomePageSetting = await getHomePageSetting();
    return updatedHomePageSetting;
  } else {
    // Create new home page setting
    const result = await pool.query(
      "INSERT INTO Home_Page_Setting (Hero_Images, Working_Section_Title, Working_Section_Description, Working_Items, orgmail) VALUES (?,?,?,?,?)",
      [
        HomePageSettingData.Hero_Images,
        HomePageSettingData.Working_Section_Title,
        HomePageSettingData.Working_Section_Description,
        HomePageSettingData.Working_Items,
        orgMail
      ]
    );
    // Return newly created home page setting
    const [rows] = await pool.query(
      "SELECT * FROM Home_Page_Setting WHERE idHome_Page_Setting = ? AND orgmail = ?",
      [result[0].insertId, orgMail]
    );
    return rows[0];
  }
}

module.exports = {
  getHeaderFooterSetting,
  updateHeaderFooterSetting,
  getAboutUsSetting,
  updateAboutUsSetting,
  getPolicyDetailsSetting,
  updatePolicyDetailsSetting,
  getHomePageSetting,
  updateHomePageSetting,
};
