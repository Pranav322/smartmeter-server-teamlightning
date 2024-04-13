const mongoose = require('mongoose');
const { Schema } = mongoose;

const batterySchema = new Schema({
      user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
      },
}, { timestamps: true });

const Battery = mongoose.model('battery', batterySchema);
module.exports = Battery