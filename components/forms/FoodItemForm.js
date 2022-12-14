import React, { useEffect, useState } from 'react';
import {
  Button, FloatingLabel, Form, FormGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { getFoodCategories } from '../../api/categoryData';
import { createFoodItem, updateFoodItem } from '../../api/foodItemData';
import { useAuth } from '../../utils/context/authContext';

const initialState = {
  location: '',
  name: '',
  categoryFirebaseKey: '',
  photoURL: '',
  description: '',
  dateAddedToLocation: '',
  isPublic: true,
};

function FoodItemForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  const [categories, setFoodCategories] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getFoodCategories().then(setFoodCategories);
    if (obj.foodItemFirebaseKey) setFormInput(obj);
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const date = () => {
    const rawDate = new Date();
    const dateString = rawDate.toLocaleString();
    return dateString;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.foodItemFirebaseKey) {
      updateFoodItem(formInput)
        .then(() => { router.push('/food/myFood'); });
    } else {
      const payload = {
        ...formInput, uid: user.uid, dateAddedToDB: date(), status: 'open',
      };
      createFoodItem(payload).then(() => {
        router.push('/food/myFood');
      });
    }
  };
  return (
    <Form onSubmit={handleSubmit} className="food-item-form">
      <h1 className="food-item-form-h1">{obj.foodItemFirebaseKey ? 'Edit' : 'Create New'} Food Item</h1>
      <FormGroup controlId="floatingSelect" className="food-item-form-input">
        <FloatingLabel label="Location">
          <Form.Select aria-label="Location Select" name="location" onChange={handleChange} required>
            <option value={formInput.location || ''}>{obj.foodItemFirebaseKey ? formInput.location : 'Select a Location'}</option>
            <option value="fridge">Fridge</option>
            <option value="freezer">Freezer</option>
            <option value="pantry">Pantry</option>
          </Form.Select>
        </FloatingLabel>
      </FormGroup>
      <FormGroup controlId="form.Input1" className="food-item-form-input">
        <FloatingLabel label="Food Item Name" className="mb-3">
          <Form.Control type="text" placeholder="Enter Name" name="name" value={formInput.name.toLocaleLowerCase()} onChange={handleChange} required />
        </FloatingLabel>
      </FormGroup>
      <FormGroup>
        <FloatingLabel controlId="floatingInput2" label="Food Item Description" className="mb-3 food-item-form-input">
          <Form.Control type="text" placeholder="Enter Description" name="description" value={formInput.description} onChange={handleChange} />
        </FloatingLabel>
      </FormGroup>
      <FormGroup controlId="floatingSelect" className="food-item-form-input">
        <FloatingLabel label="category" required>
          <Form.Select aria-label="category select" name="categoryFirebaseKey" onChange={handleChange}>
            <option value="">Select a Category</option>
            {categories?.map((category) => (
              <option key={category.categoryFirebaseKey} value={category.categoryFirebaseKey} selected={obj.categoryFirebaseKey === category.categoryFirebaseKey}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>
      </FormGroup>
      <FormGroup className="food-item-form-input">
        <FloatingLabel label="Date You Got This Item">
          <Form.Control type="date" name="dateAddedToLocation" onChange={handleChange} value={formInput.dateAddedToLocation} />
        </FloatingLabel>
      </FormGroup>
      <FormGroup className="food-item-form-input">
        <FloatingLabel label="Photo of Your Food">
          <Form.Control type="text" name="photoURL" onChange={handleChange} value={formInput.photoURL} />
        </FloatingLabel>
      </FormGroup>
      <div>
        <Button type="submit">{obj.foodItemFirebaseKey ? 'Update' : 'Add New'} Food Item</Button>
      </div>
    </Form>
  );
}

FoodItemForm.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    photoURL: PropTypes.string,
    foodItemFirebaseKey: PropTypes.string,
    categoryFirebaseKey: PropTypes.string,
    location: PropTypes.string,
    dateAddedToLocation: PropTypes.string,
    dateAddedToDB: PropTypes.string,
  }),
};

FoodItemForm.defaultProps = {
  obj: initialState,
};

export default FoodItemForm;
