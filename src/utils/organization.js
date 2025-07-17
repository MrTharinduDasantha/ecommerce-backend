const getOrgMail = () => {
  return process.env.ORGMAIL || process.env.ORG_MAIL || '';
};

module.exports = { getOrgMail }; 