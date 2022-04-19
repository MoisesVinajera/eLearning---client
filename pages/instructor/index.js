import React, { Fragment, useEffect, useState } from 'react';
import classes from '../../public/css/styles.module.css';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios';
import { Avatar, Tooltip } from 'antd';
import NextLink from 'next/link';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const InstructorIndex = () => {
  //state
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get('/api/instructor-courses');
    setCourses(data);
  };

  const myStyle = {
    marginTop: '-15px',
    fontSize: '15px',
  };
  return (
    <InstructorRoute>
      <h1
        className={`p-5 mb-4 text-center bg-primary ${classes.square} ${classes.jumbotron}`}
      >
        Instructor Dashboard
      </h1>
      {courses &&
        courses.map((course) => (
          <Fragment key={course.slug}>
            <div className="media pt-2 row">
              <Avatar
                className="col-1"
                size={80}
                src={course.image ? course.image.Location : '/img/course.jpg'}
              />
              <div className="media-body pl-2 col-10">
                <div className="row">
                  <div className="col">
                    <NextLink
                      href={`/instructor/course/view/${course.slug}`}
                      className="pointer"
                    >
                      <a className="h5 mt-2 text-primary">
                        <h5 className="pt-2">{course.name}</h5>
                      </a>
                    </NextLink>
                    <p style={{ marginTop: '-5px', fontSize: '15px' }}>
                      {course.lessons.length} Lessons
                    </p>
                    {course.lessons.length < 5 ? (
                      <p style={myStyle} className="text-warning">
                        At least 5 lessons are required to publish a course
                      </p>
                    ) : course.published ? (
                      <p style={myStyle} className="text-success">
                        Your course is live in the marketplace
                      </p>
                    ) : (
                      <p style={myStyle} className="text-success">
                        Your course is ready to be published
                      </p>
                    )}
                  </div>

                  <div className="col-md-1 mt-3 text-center">
                    {course.published ? (
                      <Tooltip title="Published">
                        <CheckCircleOutlined className="h5 pointer text-success" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Unpublished">
                        <CloseCircleOutlined className="h5 pointer text-warning" />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
    </InstructorRoute>
  );
};

export default InstructorIndex;
