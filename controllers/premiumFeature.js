const User = require("../models/users");
const DailyExpense = require("../models/expense");

const getUserLeaderBoard = async (req, res) => {
  try {
    const leaderBoardDetails = await User.find({}).sort("-total_cost");
    res.status(200).json(leaderBoardDetails);
  } catch (err) {
    console.log({ "BE premiumfeature controller": err });
    res.status(500).json(err);
  }
};

const groupExpenses = (data, period) => {
  const currentDate = new Date();
  const msPerPeriod = {
    day: 1000 * 60 * 60 * 24,
    month: 1000 * 60 * 60 * 24 * 30,
    year: 1000 * 60 * 60 * 24 * 365,
  };

  return data.reduce((acc, expense) => {
    const date = new Date(expense.time);
    const diffTime = Math.abs(currentDate - date);
    const diffPeriods = Math.ceil(diffTime / msPerPeriod[period]);
    if (!acc[diffPeriods]) {
      acc[diffPeriods] = [];
    }
    acc[diffPeriods].push(expense);
    return acc;
  }, {});
};

const periodicExpenses = async (req, res) => {
  const data = await DailyExpense.find();

  const dailyExpenses = groupExpenses(data, "day");
  const monthlyExpenses = groupExpenses(data, "month");
  const yearlyExpenses = groupExpenses(data, "year");

  res.json({ dailyExpenses, monthlyExpenses, yearlyExpenses });
};

module.exports = {
  getUserLeaderBoard,
  periodicExpenses,
};
