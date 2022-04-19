import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import axios from 'axios';
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Avatar, Tooltip, Button, Modal, List } from 'antd';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import { toast } from 'react-toastify';
import Item from 'antd/lib/list/Item';

const CourseView = () => {
  // state
  const [course, setCourse] = useState({});

  // for lessons
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [progress, setProgress] = useState(0);

  // student count
  const [students, setStudents] = useState(0);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    const studentCount = async () => {
      try {
        const { data } = await axios.get(
          `/api/instructor/student-count/${course._id}`
        );
        setStudents(data.length);
      } catch (err) {
        console.log(err);
      }
    };

    course && studentCount();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  const openModalHandler = () => {
    setVisible(true);
  };
  const closeModalHandler = () => {
    setVisible(false);
  };

  const renderLessons = (item, index) => {
    return (
      <Item>
        <Item.Meta
          avatar={<Avatar>{index + 1}</Avatar>}
          title={item.title}
        ></Item.Meta>
      </Item>
    );
  };

  const editHandler = () => {
    router.push(`/instructor/course/edit/${slug}`);
  };

  // FUNCTIONS FOR COMPONENT ADD LESSON FORM
  const addLessonHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      setValues((prevState) => {
        return { ...prevState, title: '', content: '', video: {} };
      });
      setVisible(false);
      setUploadButtonText('Upload video');
      setCourse(data);
      toast.success('Lesson added');
      setProgress(0);
    } catch (err) {
      console.log(err);
      toast.error('Lesson add failed');
    }
  };

  const sendVideoToBackendHandler = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append('video', file);

      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: onUploadProgress,
        }
      );
      // once response is received
      setValues((prevState) => {
        return { ...prevState, video: data };
      });
      setUploading(false);
      toast.success('Video uploaded');
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error('Video upload failed');
    }
  };

  const removeVideoHandler = async () => {
    try {
      setUploading(true);
      const { data } = axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video
      );
      setValues((prevState) => {
        return { ...prevState, video: {} };
      });
      setUploading(false);
      setUploadButtonText('Upload another video');
      toast.success('Video removed');
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error('Video remove failed');
    }
  };
  const onUploadProgress = (event) => {
    setProgress(Math.round((100 * event.loaded) / event.total));
  };

  const onChanceTitleHandler = (event) => {
    setValues((prevState) => {
      return { ...prevState, title: event.target.value };
    });
  };
  const onChanceContentHandler = (event) => {
    setValues((prevState) => {
      return { ...prevState, content: event.target.value };
    });
  };

  const publishHandler = async (event) => {
    try {
      if (
        window.confirm(
          'Once you publish your course, it will be live in the marketplace for users to enroll'
        )
      ) {
        const { data } = await axios.put(`/api/course/publish/${course._id}`);
        setCourse(data);
        toast.success('Congrats! your course is now live');
      }
    } catch (err) {
      toast.error('Course publish  failed');
    }
  };
  const unpublishHandler = async (event) => {
    try {
      if (
        window.confirm(
          'Once you unpublish your course, it will not be available for users to enroll'
        )
      ) {
        const { data } = await axios.put(`/api/course/unpublish/${course._id}`);
        setCourse(data);
        toast.success('Your course is unpublished');
      }
    } catch (err) {
      toast.error('Course unpublish failed');
    }
  };

  return (
    <InstructorRoute>
      <div className="container-fluid pt-3">
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2 row">
              <Avatar
                className="col-1"
                size={80}
                src={course.image ? course.image.Location : '/img/course.jpg'}
              />
              <div className="media-body pl-2 col">
                <div className="row">
                  <div className="col-10">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: '-10px' }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p style={{ marginTop: '-15px', fontSize: '10px' }}>
                      {course.category}
                    </p>
                  </div>

                  <div className="d-flex pt-4 col">
                    <Tooltip title={`${students} Enrolled`}>
                      <UserSwitchOutlined className="h5 pointer text-info me-4 mt-1" />
                    </Tooltip>
                    <Tooltip title="Edit">
                      <EditOutlined
                        onClick={editHandler}
                        className="h5 pointer text-warning me-4 mt-1"
                      />
                    </Tooltip>
                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title="Min 5 lessons required to publish">
                        <QuestionOutlined className="h5 pointer text-danger pe-4 mt-1" />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip title="Unpublished">
                        <CloseOutlined
                          onClick={unpublishHandler}
                          className="h5 pointer text-danger mt-1"
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Publish">
                        <CheckOutlined
                          onClick={publishHandler}
                          className="h5 pointer text-danger mt-1"
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <ReactMarkdown children={course.description} />
              </div>
            </div>
            <div className="row">
              <Button
                onClick={openModalHandler}
                className="col-md-6 offset-md-3 text-center"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="large"
              >
                Add lesson
              </Button>
            </div>
            <br />
            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={closeModalHandler}
              footer={null}
            >
              <AddLessonForm
                values={values}
                onChanceTitleHandler={onChanceTitleHandler}
                onChanceContentHandler={onChanceContentHandler}
                addLessonHandler={addLessonHandler}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                sendVideoToBackendHandler={sendVideoToBackendHandler}
                progress={progress}
                removeVideoHandler={removeVideoHandler}
              />
            </Modal>

            <div className="row pb-5">
              <div className="col lesson-list">
                <h4>
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={renderLessons}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
