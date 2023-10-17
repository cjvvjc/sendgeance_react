import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const EditWorkoutPage = () => {
  // makes call to router to route to pages
  const navigate = useNavigate();
  const {id} = useParams();

  //initialize state variable. create elements to store all info typed into form
  const [workout, editWorkout] = useState({
    exercise: "",
    attempts: "",
    grade: "",
    angle: "",
    send: "",
    createdAt: ""
  });

  // const { exercise, attempts, grade, angle, send, createdAt } = workout;

  const [tempWorkout, setTempWorkout] = useState({
    exercise: "",
    attempts: "",
    grade: "",
    angle: "",
    send: "",
    createdAt: ""
  });

  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      const res = await axios.get(`http://localhost:5000/workouts/${id}`);
      editWorkout(res.data);
      setTempWorkout(res.data);
    };
    fetchWorkout();
  }, [id]);

  const handleChange = e => {
    setChanged(true);
    setTempWorkout((currWorkout) => {
      return {
        ...currWorkout, 
        [e.target.name]: e.target.value
      };
    });
   } 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/workouts/${id}`, tempWorkout)
      setChanged(false);
      navigate('/');
    } catch (error) {
      console.log("Error Updating workout", error);
    }
    
  };

  return(
    <Container className='mt-4'>
      <Form>
      <Form.Group>
          <Form.Select name= "exercise" onChange={handleChange} value={tempWorkout.exercise}>
            <option value="">Exercise</option>
              <option value="Contrast Warmup">Contrast Warmup</option>
              <option value="One Touch">One Touch</option>
              <option value="Hovers - Before">Hovers - Before</option>
              <option value="Hovers - After">Hovers - After</option>
              <option value="Rooting Feet">Rooting Feet</option>
              <option value="Rooting Hands">Rooting Hands</option>
              <option value="Rooting Both">Rooting Both</option>
              <option value="Perfect Repeat">Perfect Repeat</option>
              <option value="Match Hand/Foot">Match Hand/Foot</option>
              <option value="One Leg">One Leg</option>
              <option value="Deadpoint Practice">Deadpoint Practice</option>
              <option value="Matching Techniques">Matching Techniques</option>
              <option value="Free Climb">Free Climb</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Select name="attempts" onChange={handleChange} value={tempWorkout.attempts}>
            <option value="">Attempts</option>
            <option value="Flash">Flash</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
            <option value="32">32</option>
            <option value="33">33</option>
            <option value="34">34</option>
            <option value="35">35</option>
            <option value="36">36</option>
            <option value="37">37</option>
            <option value="38">38</option>
            <option value="39">39</option>
            <option value="40">40</option>
            <option value="41">41</option>
            <option value="42">42</option>
            <option value="43">43</option>
            <option value="44">44</option>
            <option value="45">45</option>
            <option value="46">46</option>
            <option value="47">47</option>
            <option value="48">48</option>
            <option value="49">49</option>
            <option value="50">50</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Select name="grade" onChange={handleChange} value={tempWorkout.grade}>
            <option value="">Grade</option>
            <option value="V0">V0</option>
            <option value="V1">V1</option>
            <option value="V2">V2</option>
            <option value="V3">V3</option>
            <option value="V4">V4</option>
            <option value="V5">V5</option>
            <option value="V6">V6</option>
            <option value="V7">V7</option>
            <option value="V8">V8</option>
            <option value="V9">V9</option>
            <option value="V10">V10</option>
            <option value="V11">V11</option>
            <option value="V12">V12</option>
            <option value="V13">V13</option>
            <option value="V14">V14</option>
            <option value="V15">V15</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Select name="angle" onChange={handleChange} value={tempWorkout.angle}>
            <option value="">Angle</option>
            <option value="slab">slab</option>
            <option value="0\U+00B0">{'0\u00b0'}</option>
            <option value="5&#xb0">{'5\u00b0'}</option>
            <option value="10&#xb0">{'10\u00b0'}</option>
            <option value="15&#xb0">{'15\u00b0'}</option>
            <option value="20&#xb0">{'20\u00b0'}</option>
            <option value="25&#xb0">{'25\u00b0'}</option>
            <option value="30&#xb0">{'30\u00b0'}</option>
            <option value="35&#xb0">{'35\u00b0'}</option>
            <option value="40&#xb0">{'40\u00b0'}</option>
            <option value="45&#xb0">{'45\u00b0'}</option>
            <option value="50&#xb0">{'50\u00b0'}</option>
            <option value="55&#xb0">{'55\u00b0'}</option>
            <option value="60&#xb0">{'60\u00b0'}</option>
            <option value="65&#xb0">{'65\u00b0'}</option>
            <option value="70&#xb0">{'70\u00b0'}</option>
            <option value="75&#xb0">{'75\u00b0'}</option>
            <option value="80&#xb0">{'80\u00b0'}</option>
            <option value="85&#xb0">{'85\u00b0'}</option>
            <option value="90&#xb0">{'90\u00b0'}</option>
          </Form.Select>
          <Form.Label>Send</Form.Label>
          <Form.Control  type="text" name="send" placeholder="Send?" onChange={handleChange}/>
        </Form.Group>
        {/* <Form.Group>
          <Form.Label>Exercise</Form.Label>
          <Form.Control type="text" name="exercise" value={tempWorkout.exercise} onChange={handleChange}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Attempts</Form.Label>
          <Form.Control type="text" name="attempts" value={tempWorkout.attempts} onChange={handleChange}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Grade</Form.Label>
          <Form.Control type="text" name="grade" value={tempWorkout.grade} onChange={handleChange}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Send</Form.Label>
          <Form.Control type="text" name="send" value={tempWorkout.send} onChange={handleChange}/>
        </Form.Group> */}
      
        {changed ? (
          <>
            <Button
              onClick={e => {
                setTempWorkout({...workout});
                setChanged(false);
              }}
            >
              Cancel
            </Button>
            <Button
              // variant="primary"
              // type="submit"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </>
            ) : null}
      </Form>
    </Container>
  );
};

export default EditWorkoutPage;