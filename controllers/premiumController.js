const userModel = require("../models/userModel");
const getLeaderBoardData = async (req, res, next) => {
  try {
    const result = await userModel.findAll({ order: [['totalExpenses','DESC']] });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Error");
  }
};

module.exports = {
  getLeaderBoardData,
};
