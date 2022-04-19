import React, { useState } from 'react';
import classes from '../../../public/css/styles.module.css';
import InstructorRoute from '../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/router';

const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    loading: false,
    category: '',
  });
  const [image, setImage] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

  // router
  const router = useRouter();

  const changeHandler = (event) => {
    setValues((prevValues) => {
      return { ...prevValues, [event.target.name]: event.target.value };
    });
  };
  const selectHandler = (value) => {
    setValues((prevValues) => {
      return { ...prevValues, paid: value };
    });
  };
  const selectPriceHandler = (value) => {
    setValues((prevValues) => {
      return { ...prevValues, price: value };
    });
  };
  const imageHandler = (event) => {
    let file = event.target.files[0];
    setImagePreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues((prevValues) => {
      return { ...prevValues, loading: true };
    });

    // Resize
    Resizer.imageFileResizer(
      file, // Is the file of the image which will resized.
      720, // Is the maxWidth of the resized new image.
      500, // Is the maxHeight of the resized new image.
      'JPEG', // Is the compressFormat of the resized new image.
      100, // Is the quality of the resized new image.
      0, // Is the degree of clockwise rotation to apply to uploaded image.
      uploadImageToBackend
    );
  };

  const imageRemoveHandler = async () => {
    console.log('Remove image');

    try {
      setValues((prevValues) => {
        return { ...prevValues, loading: true };
      });
      const res = await axios.post('/api/course/remove-image', { image });
      setImage({});
      setImagePreview('');
      setUploadButtonText('Upload Image');
      setValues((prevValues) => {
        return { ...prevValues, loading: false };
      });
    } catch (err) {
      console.log(err);
      setValues((prevValues) => {
        return { ...prevValues, loading: false };
      });
      toast.error('Image upload failed. Try again');
    }
  };

  const uploadImageToBackend = async (uri) => {
    try {
      let { data } = await axios.post('/api/course/upload-image', {
        image: uri,
      });
      console.log('IMAGE UPLOADED', data);
      // set image in the state
      setImage(data);
      setValues((prevValues) => {
        return { ...prevValues, loading: false };
      });
    } catch (err) {
      console.log(err);
      setValues((prevValues) => {
        return { ...prevValues, loading: false };
      });
      toast.error('Image upload failed. Try again');
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('/api/course', {
        ...values,
        image,
      });
      toast('Great! Now you can start adding lessons');
      router.push('/instructor');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <InstructorRoute>
      <h1
        className={`p-5 mb-4 text-center bg-primary ${classes.square} ${classes.jumbotron}`}
      >
        Course Create
      </h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          onSubmit={submitHandler}
          onChange={changeHandler}
          onSelectChange={selectHandler}
          onSelectPriceChange={selectPriceHandler}
          imageHandler={imageHandler}
          values={values}
          imagePreview={imagePreview}
          uploadButtonText={uploadButtonText}
          imageRemoveHandler={imageRemoveHandler}
        />
      </div>
      <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre>
    </InstructorRoute>
  );
};

export default CourseCreate;
