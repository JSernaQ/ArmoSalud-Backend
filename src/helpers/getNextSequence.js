const { Counter } = require('../models/counter.model');

const getNextSequence = async (sequenceName, session) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { returnDocument: 'after', upsert: true }
  ).session(session);
  
  return counter.sequence_value;
};

module.exports = { getNextSequence };
