const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to DB'))
  .catch(error => console.log(error.message))

const workoutSchema = new mongoose.Schema({
  exerciseGroup: {
    type: String,
    required: false
  },
  exercise: {
    type: String,
    required: false
  },
  attempts: {
    type: String,
    required: false
  },
  grade: {
    type: String,
    required: false
  },
  angle: {
    type: String,
    required: false
  },
  send: {
    type: Boolean,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const sessionSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rateOfPerceivedExertion: {
    type: Number
  },
  totalProblems: {
    type: Number,
    required: false
  },
  vSum: {
    type: Number,
    required: false
  },
  vAvg: {
    type: Number,
    required: false
  },
  sessionDensity: {
    type: Number,
    required: false
  },
  patheticCount: {
    type: Number,
    required: false,
    default: 0,
  },
  mediumCount: {
    type: Number,
    required: false,
    default: 0,
  },
  hardCount: {
    type: Number,
    required: false,
    default: 0,
  }
})

const Workout = mongoose.model('Workout', workoutSchema);
const Session = mongoose.model('Session', sessionSchema);

//get all workouts
app.get('/workouts/all', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.send(workouts);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching workouts' });
  }
});

//get today's workout
app.get('/workout/current', async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const workouts = await Workout.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      }
    });

    if (workouts.length === 0) {
      return res.send({ workouts, sessionTimes: { startTime: null, endTime: null } });
    }

    // Calculate session start and end times
    const startTimes = workouts.map(workout => new Date(workout.createdAt));
    const endTimes = workouts.map(workout => new Date(workout.createdAt));

    const startTime = new Date(Math.min(...startTimes));
    const endTime = new Date(Math.max(...endTimes));

    res.send(workouts);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching workouts' });
  }
});

//get last workout
app.get('/workouts/last', async (req, res) => {
  try {
    const lastWorkout = await Workout.findOne().sort({ createdAt: -1 });

    if (!lastWorkout) {
      return res.status(404).send({ error: 'No workouts found' });
    }

    res.send(lastWorkout);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching last workout' });
  }
});

//get workout
app.get('/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).send({ error: 'Workout not found' });
    }
    res.send(workout);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching the workout' });
  }
  
});

// create new workout
app.post('/workouts', async (req, res) => {
  try {
    const newWorkout = new Workout({
      ...req.body,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
    });

    // Check for duplicate _id
    const existingWorkout = await Workout.findOne({ _id: newWorkout._id });
    if (existingWorkout) {
      newWorkout._id = new mongoose.Types.ObjectId(); // Generate a new _id
    }

    const savedWorkout = await newWorkout.save();

    // Update or create a session entry for the day
    const startDate = new Date(savedWorkout.createdAt).setHours(0, 0, 0, 0);
    const endDate = new Date(savedWorkout.createdAt).setHours(23, 59, 59, 999);

    const session = await Session.findOneAndUpdate(
      { startDate, endDate },
      { startDate, endDate, createdAt: new Date() },
      { upsert: true, new: true }
    );

    res.send(savedWorkout);
  } catch (error) {
    console.error("Error creating a new workout:", error);
    res.status(500).send({ error: 'Error creating a new workout' });
  }
});

// Update or create session entry
app.post('/session/update', async (req, res) => {
  try {
    const { startDate, endDate, rateOfPerceivedExertion, totalProblems, vSum, vAvg, sessionDensity } = req.body;

    const existingSession = await Session.findOneAndUpdate(
      { startDate, endDate },
      { startDate, endDate, rateOfPerceivedExertion, totalProblems, vSum, vAvg, sessionDensity },
      { upsert: true, new: true }
    );

    res.send(existingSession);
  } catch (error) {
    console.error('Error updating or creating session entry:', error);
    res.status(500).send({ error: 'Error updating or creating session entry' });
  }
});

// New route to update difficulty counts
app.post('/session/difficulty/update', async (req, res) => {
  try {
    const { startDate, endDate, difficulty, count } = req.body;

    const existingSession = await Session.findOneAndUpdate(
      { startDate, endDate },
      { [`${difficulty}Count`]: count },
      { upsert: true, new: true }
    );

    res.send(existingSession);
  } catch (error) {
    console.error('Error updating difficulty counts:', error);
    res.status(500).send({ error: 'Error updating difficulty counts' });
  }
});

//edit a workout
app.put(`/workouts/:id`, async (req, res) => {
  try {
    const editWorkout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.send(editWorkout)
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).send({ error: 'Error editing the workout' })
  }
});

//delete a workout
app.delete(`/workouts/:id`, async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id)
    const updatedWorkouts = await Workout.find();
    res.send(updatedWorkouts);
    // res.redirect('/')
  } catch (error) {
    res.status(500).send({ error: 'Error deleting the workout' });
  }
});

app.listen(5000, () => console.log('Server started on port 5000'))

module.exports = Workout;