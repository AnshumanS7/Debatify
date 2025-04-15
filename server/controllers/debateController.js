const Debate = require('../models/Debate');
const News = require('../models/News');

exports.registerForDebate = async (req, res) => {
  const { userId, team } = req.body;
  const { newsId } = req.params;

  if (!['for', 'against'].includes(team)) {
    return res.status(400).json({ message: 'Invalid team' });
  }

  try {
    let debate = await Debate.findOne({ newsId });

    if (!debate) {
      debate = new Debate({ newsId });
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    if (debate.createdAt < oneHourAgo) {
      debate.teamFor = [];
      debate.teamAgainst = [];
      debate.createdAt = now;
    }

    const maxUsers = 100;
    const currentTeam = team === 'for' ? debate.teamFor : debate.teamAgainst;

    if (currentTeam.includes(userId)) {
      return res.status(400).json({ message: 'User already registered in this team' });
    }

    if (currentTeam.length >= maxUsers) {
      return res.status(400).json({ message: 'Registration full for this team' });
    }

    currentTeam.push(userId);

    await debate.save();
    res.status(200).json(debate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to register for debate', error });
  }
};

exports.getDebateByNewsId = async (req, res) => {
  try {
    const debate = await Debate.findOne({ newsId: req.params.newsId })
      .populate('teamFor', 'username')
      .populate('teamAgainst', 'username');

    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    res.status(200).json(debate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch debate', error });
  }
};
