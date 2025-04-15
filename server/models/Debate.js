const mongoose = require('mongoose');

const debateSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true,
  },
  teamFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  teamAgainst: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Debate', debateSchema);