const mongoose = require('mongoose');
const { Schema } = mongoose;

const solarPanelSchema = new Schema({
      user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
      },
}, { timestamps: true });

const SolarPanel = mongoose.model('solarpanel', solarPanelSchema);
module.exports = SolarPanel;