const mongoose = require('mongoose');
const { Schema } = mongoose;

const smartmeterSchema = new Schema({
      user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
      },
}, { timestamps: true });

const Smartmeter = mongoose.model('smartmeter', smartmeterSchema);
module.exports = Smartmeter