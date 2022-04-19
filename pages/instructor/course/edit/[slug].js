import React, { useEffect, useState } from 'react';
import classes from '../../../../public/css/styles.module.css';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/router';
import Item from 'antd/lib/list/Item';
import { Avatar, List, Modal, Switch } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    loading: false,
    category: '',
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

  // State for lessons update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState('Upload video');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(`/api/course/${slug}`);
      if (data) setValues(data);
      if (data.image) {
        setImage(data.image);
        setImagePreview(data.image.Location);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast('Course updated!!');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  // Drag and drop lessons
  const dragOnHandler = (event) => {
    event.preventDefault();
  };

  const onDragStartHandler = (event, index) => {
    event.dataTransfer.setData('itemIndex', index);
  };

  const onDropHandler = async (event, index) => {
    const movingItemIndex = event.dataTransfer.getData('itemIndex');
    const targetItemIndex = index;

    let allLessons = values.lessons;
    let movingItem = allLessons[movingItemIndex]; //clicked/dragged item to re-order

    allLessons.splice(movingItemIndex, 1); //remove 1 item from the given index
    allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index

    setValues((prevState) => {
      return { ...prevState, lessons: [...allLessons] };
    });

    // save the new lessons order in db
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast('Lessons order updated!!');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const deleteLessonsHandler = async (index) => {
    if (window.confirm(`Are you sure you want to delete this lesson?`)) {
      let allLessons = values.lessons;
      const removed = allLessons.splice(index, 1);

      setValues((prevState) => {
        return { ...prevState, lessons: [...allLessons] };
      });

      // send request to backend
      try {
        const { data } = await axios.put(
          `/api/course/${slug}/${removed[0]._id}`
        );
        console.log('Lesson deleted => ', data);
        toast('Lesson deleted from course');
      } catch (err) {
        toast.error(err.response.data);
      }
    }
  };

  const showModal = (item) => {
    setVisible(true);
    setCurrent(item);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const onChangePreview = async (item, value) => {
    try {
      const { res } = axios.put(
        `/api/course/lesson/video-preview/${slug}/${values.instructor._id}`,
        { id: item._id, free_preview: value }
      );
      const state = 'deactived';
      if (value) {
        state = 'active';
      }
      toast.success(`Lesson preview ${state}`);
    } catch (err) {
      toast.err(err.response.data);
    }
  };

  const renderLessons = (item, index) => {
    console.log(
      current._id,
      item._id,
      current && current._id == item._id,
      current.free_preview
    );
    return (
      <Item
        draggable
        onDragStart={(e) => onDragStartHandler(e, index)}
        onDrop={(e) => onDropHandler(e, index)}
      >
        <Item.Meta
          onClick={() => showModal(item)}
          avatar={<Avatar>{index + 1}</Avatar>}
          title={item.title}
        ></Item.Meta>

        <div className="d-flex justify-content-between pt-2 pe-4">
          <span className="me-4">Preview</span>
          <Switch
            className="float-end "
            defaultChecked={
              current && current._id == item._id
                ? current.free_preview
                : item.free_preview
            }
            name="free_preview"
            onChange={(value) => onChangePreview(item, value)}
          />
        </div>

        <DeleteOutlined
          onClick={() => deleteLessonsHandler(index)}
          className="text-danger float-end pr-2"
        />
      </Item>
    );
  };

  // LESSON UPDATE FUNCTIONS

  const sendVideoToBackendHandler = async (event) => {
    // remove previous video
    if (current.video && current.video.Location) {
      try {
        const res = await axios.post(
          `/api/course/video-remove/${values.instructor._id}`,
          current.video
        );
        console.log(res);
      } catch (err) {
        toast(err.response.data);
      }
    }

    try {
      // upload new video
      const file = event.target.files[0];
      setUploadVideoButtonText(file.name);
      setUploading(true);

      // send video as form data
      const videoData = new FormData();
      videoData.append('video', file);
      videoData.append('courseId', values._id);

      // save progress bar  and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${values.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) =>
            setProgress(Math.round((100 * event.loaded) / event.total)),
        }
      );
      console.log(data);
      setCurrent((prev) => {
        return { ...prev, video: data };
      });
      setUploading(false);
    } catch (err) {
      setUploading(false);
      toast(err.response.data);
    }
  };

  const updateLessonHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/course/lesson/${slug}/${current._id}`,
        current
      );

      setUploadVideoButtonText('Upload Video');
      setVisible(false);

      // update ui
      if (data.ok) {
        let arr = values.lessons;
        const index = arr.findIndex((element) => element._id === current._id);
        arr[index] = current;
        setValues((prevState) => {
          return { ...prevState, lessons: arr };
        });
        setCurrent(arr[index]);
        toast.success('Lessons updated');
      }
    } catch (err) {
      toast(err.response.data);
    }
  };

  return (
    <InstructorRoute>
      <h1
        className={`p-5 mb-4 text-center bg-primary ${classes.square} ${classes.jumbotron}`}
      >
        Edit Course
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
          editPage={true}
          image={image}
        />
      </div>
      <hr />
      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={dragOnHandler}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={renderLessons}
          ></List>
        </div>
      </div>

      <Modal
        title="Update lesson"
        centered
        visible={visible}
        onCancel={hideModal}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          sendVideoToBackendHandler={sendVideoToBackendHandler}
          updateLessonHandler={updateLessonHandler}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
          uploading={uploading}
        />
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
