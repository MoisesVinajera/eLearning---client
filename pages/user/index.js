import React, { useContext, useEffect, useState } from 'react';
import classes from '../../public/css/styles.module.css';
import { Context } from '../../context/index';
import UserRoute from '../../components/routes/UserRoute';
import axios from 'axios';
import { Avatar } from 'antd';
import NextLink from 'next/link';
import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons';

const UserIndex = () => {
  // state
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  // Global context
  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user-courses');
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      {loading && (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-danger p-5"
        />
      )}
      <h1
        className={`p-5 mb-4 text-center bg-primary ${classes.square} ${classes.jumbotron}`}
      >
        User Dashboard
      </h1>

      {courses &&
        courses.map((course) => (
          <div key={course._id} className="media pt-2 pb-1 row">
            <Avatar
              size={80}
              shape="square"
              src={
                course.image && course.image.Location
                  ? course.image.Location
                  : '/img/course.jpg'
              }
            />
            <div className="media-body ps-2 col">
              <div className="row">
                <div className="col">
                  <NextLink
                    href={`/user/course/${course.slug}`}
                    className="pointer"
                  >
                    <a className="mt-2 text-primary">
                      <h5>{course.name}</h5>
                    </a>
                  </NextLink>
                  <p style={{ marginTop: '-10px' }}>
                    {course.lessons.length} Lessons
                  </p>
                  <p
                    className="text-muted"
                    style={{ marginTop: '-15px', fontSize: '12px' }}
                  >
                    By {course.instructor.name}
                  </p>
                </div>
                <div className="col-md-3 mt-3 text-center">
                  <NextLink
                    href={`/user/course/${course.slug}`}
                    className="pointer"
                  >
                    <a className="mt-2 text-primary">
                      <PlayCircleOutlined className="h2 pointer text-primary" />
                    </a>
                  </NextLink>
                </div>
              </div>
            </div>
          </div>
        ))}
    </UserRoute>
  );
};

export default UserIndex;
