require('dotenv').config();
const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose")
const cors = require('cors');
const MongoStore = require('connect-mongo');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
// app.use(express.static(path.join(__dirname, 'path_to_your_react_build_folder')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to DB'))
  .catch(error => console.log(error.message))

  const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    } 
  })

  const WorkoutSessionSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date,
      required: false,
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
    }
  })

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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

UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', UserSchema);
const Workout = mongoose.model('Workout', WorkoutSchema);
const WorkoutSession = mongoose.model('WorkoutSession', WorkoutSessionSchema);

app.use(session({
  secret: "this is Sendgeance",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
    sameSite: "lax"
  }
}));

console.log("Environment:", process.env.NODE_ENV);

app.use(passport.initialize());
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('User not authenticated');
}

//get all workouts
app.get('/workouts/all', isAuthenticated, async (req, res) => {
  try {
    const workouts = await Workout.find({ user:req.user._id });
    res.send(workouts);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching workouts' });
  }
});

//get today's workout
app.get('/workout/current', isAuthenticated, async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const workouts = await Workout.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
      user: req.user._id
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
app.get('/workouts/last', isAuthenticated, async (req, res) => {
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
app.get('/workouts/:id', isAuthenticated, async (req, res) => {
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
app.post('/workouts', isAuthenticated, async (req, res) => {
  try {
    const newWorkout = new Workout({
      ...req.body,
      user: req.user._id,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
    });

    // Check for duplicate _id
    const existingWorkout = await Workout.findOne({ _id: newWorkout._id });
    if (existingWorkout) {
      newWorkout._id = new mongoose.Types.ObjectId(); // Generate a new _id
    }

    const savedWorkout = await newWorkout.save();

    // // Update or create a session entry for the day
    // const startDate = new Date(savedWorkout.createdAt).setHours(0, 0, 0, 0);
    // const endDate = new Date(savedWorkout.createdAt).setHours(23, 59, 59, 999);

    // const session = await WorkoutSession.findOneAndUpdate(
    //   { startDate, endDate },
    //   { startDate, endDate, createdAt: new Date() },
    //   { upsert: true, new: true }
    // );

    res.send(savedWorkout);
  } catch (error) {
    console.error("Error creating a new workout:", error);
    res.status(500).send({ error: 'Error creating a new workout' });
  }
});

// Update or create session entry
app.post('/session/update', isAuthenticated, async (req, res) => {
  try {
    let { startDate, rateOfPerceivedExertion, totalProblems, vSum, vAvg, sessionDensity, boulderingSessionDensity, hardCount, mediumCount, patheticCount, goodCount } = req.body;

    // Normalize startDate to the beginning of the day
    sessionDate = new Date(startDate);
    sessionDate.setHours(0, 0, 0, 0);

    const updateData = {
      endDate: req.body.endDate,
      rateOfPerceivedExertion,
      totalProblems,
      vSum,
      vAvg,
      sessionDensity,
      boulderingSessionDensity,
      hardCount,
      mediumCount,
      patheticCount,
      goodCount
    };

    // Use $set to update only the provided fields
    let session = await WorkoutSession.findOneAndUpdate(
      { user: req.user._id, startDate: sessionDate },
      { $set: updateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.send(session);
  } catch (error) {
    console.error('Error updating or creating session entry:', error);
    res.status(500).send({ error: 'Error updating or creating session entry' });
  }
});

app.get('/session/latest', isAuthenticated, async (req, res) => {
  try {
    const latestSession = await WorkoutSession.findOne({ user: req.user._id })
                                            .sort({ endDate: -1, createdAt: -1 }) // Sort by endDate and createdAt in descending order
                                            .limit(1); // Get only the most recent one

    if (!latestSession) {
      return res.status(404).send({ error: 'No session data found' });
    }

    res.json({
      startDate: latestSession.startDate,
      endDate: latestSession.endDate,
      rateOfPerceivedExertion: latestSession.rateOfPerceivedExertion,
      totalProblems: latestSession.totalProblems,
      vSum: latestSession.vSum,
      vAvg: latestSession.vAvg,
      sessionDensity: latestSession.sessionDensity,
      boulderingSessionDensity: latestSession.boulderingSessionDensity,
      hardCount: latestSession.hardCount,
      mediumCount: latestSession.mediumCount,
      patheticCount: latestSession.hardCount,
      goodCount: latestSession.hardCount
      // include other session data fields if necessary
    });
  } catch (error) {
    console.error('Error fetching latest session data:', error);
    res.status(500).send({ error: 'Error fetching latest session data' });
  }
});

app.post('/session/end', isAuthenticated, async (req, res) => {
  try {
    const { startDate, endDate, rateOfPerceivedExertion, totalProblems, vSum, vAvg, sessionDensity, patheticCount, mediumCount, hardCount } = req.body;

    let sessionDate = new Date(startDate);
    sessionDate.setHours(0, 0, 0, 0);

    // Find or create a session
    let session = await WorkoutSession.findOneAndUpdate(
      { user: req.user._id, startDate: sessionDate },
      {
        endDate,
        rateOfPerceivedExertion,
        totalProblems,
        vSum,
        vAvg,
        sessionDensity
      },
      { upsert: true, new: true }
    );

    res.send(session);
  } catch (error) {
    console.error('Error handling session end:', error);
    res.status(500).send({ error: 'Error handling session end' });
  }
});

// Get the latest session counts
// app.get('/session/latest', isAuthenticated, async (req, res) => {
//   try {
//     const latestSession = await WorkoutSession.findOne({ user: req.user._id }).sort({ createdAt: -1 });
//     if (!latestSession) {
//       return res.status(404).send({ error: 'No session data found' });
//     }
//     res.json({
//       patheticCount: latestSession.patheticCount,
//       mediumCount: latestSession.mediumCount,
//       hardCount: latestSession.hardCount
//     });
//   } catch (error) {
//     console.error('Error fetching latest session data:', error);
//     res.status(500).send({ error: 'Error fetching latest session data' });
//   }
// });

//edit a workout
app.put(`/workouts/:id`, isAuthenticated, async (req, res) => {
  try {
    const editWorkout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.send(editWorkout)
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).send({ error: 'Error editing the workout' })
  }
});

//delete a workout
app.delete(`/workouts/:id`, isAuthenticated, async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) {
      return res.status(404).send({ error: 'Workout not found or not owned by user' });
    }
    await Workout.findByIdAndDelete(req.params.id)
  } catch (error) {
    res.status(500).send({ error: 'Error deleting the workout' });
  }
});

app.get('/auth/check', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
});

// Login route
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.json({ success: false }); }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.json({ success: true, username: user.username });
    });
  })(req, res, next);
});

// Registration route
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user in the database
    const newUser = new User({ username, email });

    await User.register(newUser, password);

    passport.authenticate("local")(req, res, function() {
      res.json({ success: true, message: "Registration successful" });
    });

  } catch (error) {
    console.error('Error creating a new user:', error);
    res.status(500).send({ error: 'Error creating a new user' });
    // res.redirect("/register");
  }
});

const logoutUser = (req, res) => {
  req.logout(function(err) {
    if (err) {return next(err)}
    res.json({ success: true, message: "Logged out successfully" });
  })
}

app.post('/logout', logoutUser);

app.listen(5000, () => console.log('Server started on port 5000'))

module.exports = {
  // loginUser,
  // registerUser,
  logoutUser,
  Workout
}