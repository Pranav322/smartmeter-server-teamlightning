// data.js
const express = require('express');
const router = express.Router();
const UserElectricity = require('../Models/UserElectricity');
const fetchUser = require('../Middleware/fetchUser');

//ROUTE : 1 :- POST THE DATA - No AUthentication required
router.post('/update', async (req, res) => {
      const { _id } = req.query; // Access _id from the request query
      const { currentVoltage, rmsCurrent, powerUsed } = req.body;

      try {
            // Find or create electricity usage data for the user
            let userElectricity = await UserElectricity.findOne({ user: _id });

            if (!userElectricity) {
                  // Create if the user is not found
                  userElectricity = new UserElectricity();
            }

            // Update the live data
            userElectricity.user = _id;
            userElectricity.currentVoltage = currentVoltage;
            userElectricity.rmsCurrent = rmsCurrent;
            userElectricity.powerUsed = powerUsed;

            // Check if the date has changed
            const today = new Date().toLocaleDateString();
            const lastEntry = userElectricity.dailyUsage[userElectricity.dailyUsage.length - 1];

            //Need to fix the logic here
            if (!lastEntry || new Date(lastEntry.date).toLocaleDateString() !== today) {
                  // Create a new entry for the day
                  userElectricity.dailyUsage.push({ date: new Date(), powerUsed });
            } else {
                  // Update the existing entry for today
                  lastEntry.powerUsed += powerUsed;
            }

            // Save the updated user electricity data
            await userElectricity.save();

            res.status(200).json({ message: 'Electricity usage data updated successfully.' });
      } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
      }
});

//ROUTE 2 :- GET the live data. Authentication Required
router.get('/fetchdata', fetchUser, async (req, res) => {
      try {
            const data = await UserElectricity.find({ user: req.user.id });
            res.json(data);
      }
      catch (error) {
            console.error(error.message);
            res.status(500).send("Something Went Wrong")
      }
})

module.exports = router;
