import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const EditWorkoutPage = () => {
  // makes call to router to route to pages
  const navigate = useNavigate();
  const {id} = useParams();

  //initialize state variable. create elements to store all info typed into form
  const [workout, editWorkout] = useState({
    title: "", //! need to change to stuff for tracking workouts
    author: "",
    image: "",
    content: ""
  });

  const { title, author, content, image } = workout;

  const [tempWorkout, setTempWorkout] = useState({
    title: title, 
    author: author,
    image: image,
    content: content
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
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" name="title" value={tempWorkout.title} onChange={handleChange}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Author</Form.Label>
          <Form.Control type="text" name="author" value={tempWorkout.author} onChange={handleChange}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Image URL</Form.Label>
          <Form.Control type="text" name="image" value={tempWorkout.image} onChange={handleChange}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Content</Form.Label>
          <Form.Control as="textarea" rows={3} name="content" value={tempWorkout.content} onChange={handleChange}/>
        </Form.Group>
      
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