const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyPowerSchema = new Schema({
      date: {
            type: Date,
            required: true,
            default: Date.now,
      },
      powerUsed: {
            type: Number,
            default: 0,
      }
});

const userElectricitySchema = new Schema({
      user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
      },
      currentVoltage: {
            type: Number,
            default: 0,
      },
      rmsCurrent: {
            type: Number,
            default: 0,
      },
      powerUsed: {
            type: Number,
            default: 0,
      },
      dailyUsage: [dailyPowerSchema], // Array to store daily power usage data
});

module.exports = mongoose.model('userElectricity', userElectricitySchema);