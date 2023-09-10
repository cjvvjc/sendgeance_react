import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';

const WorkoutPage = () => {
  const [workout, setWorkout] = useState({
    title: "", //! need to change to stuff for tracking workouts
    author: "",
    image: "",
    content: ""
  });

  const {id} = useParams() // 

  // hook to perform an operation once and then perform it again if certain conditions are met
  useEffect(() => {
    const fetchWorkout = async () => {
      const res = await axios.get(`http://localhost:5500/posts/${id}`);
      setWorkout(res.data);
    };
    fetchWorkout();
  },[id]);
};