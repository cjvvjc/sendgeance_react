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
  title: {type: String, required: true},
  author: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true }
});

const Workout = mongoose.model('Workout', workoutSchema);

//get all workouts
app.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.send(workouts);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching workouts' });
  }
});

//get one workout
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

//create new workout
app.post('/workouts', async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    const savedWorkout = await newWorkout.save();
    res.send(savedWorkout);
  } catch (error) {
    res.status(500).send({ error: 'Error creating a new workout' });
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

//delete.get
app.delete(`/workouts/:id`, async (req, res) => {
  try {
    await Workout.findByIdAndRemove(req.params.id)
    res.status(200).send('Workout deleted')
    res.redirect('/')
  } catch (error) {
    res.status(500).send({ error: 'Error deleting the workout' });
  }
});

app.listen(5000, () => console.log('Server started on port 5000'))