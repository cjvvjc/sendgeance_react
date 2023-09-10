const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to DB'))
  .catch(error => console.log(error.message))

const workoutSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: String,
  content: String
})

const Workout = mongoose.model('Workout', workoutSchema);

//get all workouts
app.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find()
    res.send(workouts)
  } catch (error) {
    res.status(500).send({ error: 'Error fetching posts' });
  }
  
})

//get one workout
app.get('/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }
    res.send(workout)
  } catch (error) {
    res.status(500).send({ error: 'Error fetching the post' });
  }
  
})

//create new post
app.post('/workouts', async (req, res) => {
  try {
    const newWorkout = new Workout(req.body)
    const savedWorkout = await newWorkout.save()
    res.send(savedWorkout)
  } catch (error) {
    res.status(500).send({ error: 'Error creating a new post' });
  }
  
})

//delete.get
app.delete('/workouts/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id)
    res.status(200).send('Workout deleted')
  } catch (error) {
    res.status(500).send({ error: 'Error deleting the post' });
  }
  
})

app.listen(5500, () => console.log('Server started on port 5500'))