import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState, createElement } from 'react';
import axios from 'axios';
import StudentRoute from '../../../components/routes/StudentRoute';
import { Button, Menu, Avatar } from 'antd';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import {
  PlayCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
} from '@ant-design/icons';
import classes from '../../../public/css/styles.module.css';

const { Item } = Menu;

const SingleCourse = () => {
  // state
  const [course, setCourse] = useState({ lessons: [] });
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);

  // force state update
  const [updatedState, setUpdateState] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  useEffect(() => {
    const loadCompletedLessons = async () => {
      try {
        const { data } = await axios.post(`/api/list-completed`, {
          courseId: course._id,
        });
        setCompletedLessons(data);
      } catch (err) {
        console.log(err);
      }
    };
    course && loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/course/${slug}`);
      setCourse(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const setClickHandler = (index) => {
    setClicked(index);
  };

  const setCollapseHandler = () => {
    setCollapsed((prev) => {
      return !prev;
    });
  };

  const markCompleted = async () => {
    try {
      const { data } = await axios.post(`/api/mark-completed`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      setCompletedLessons((prev) => {
        return [...prev, course.lessons[clicked]._id];
      });
    } catch (err) {
      console.log(err);
    }
  };
  const markIncompleted = async () => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });

      const all = completedLessons;
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        setUpdateState((prev) => {
          return !prev;
        });
        setCompletedLessons(() => {
          return all;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StudentRoute>
      <div className="row">
        <div
          style={{ maxWidth: '360px' }}
          className={collapsed ? 'col-1' : 'col-3'}
        >
          <Button
            onClick={setCollapseHandler}
            className={`text-primary mt-1 btn-block mb-2  w-100`}
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            {!collapsed && 'Lessons'}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            style={{ height: '80vh', overflow: 'scroll' }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                onClick={() => setClicked(index)}
                key={index}
                icon={<Avatar>{index + 1}</Avatar>}
              >
                {lesson.title.substring(0, 30)}
                {completedLessons && completedLessons.includes(lesson._id) ? (
                  <CheckCircleFilled
                    className="float-end text-primary me-2"
                    style={{ marginTop: '13px' }}
                  />
                ) : (
                  <MinusCircleFilled
                    className="float-end text-danger me-2"
                    style={{ marginTop: '13px' }}
                  />
                )}
              </Item>
            ))}
          </Menu>
        </div>
        <div className="col">
          {clicked !== -1 ? (
            <>
              <div
                className={`col alert alert-primary square ${classes.alert} `}
                role="alert"
              >
                <b>{course.lessons[clicked].title.substring(0, 30)}</b>

                {completedLessons &&
                completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span
                    className={`float-end ${classes.pointer}`}
                    onClick={markIncompleted}
                  >
                    Mark as incompleted
                  </span>
                ) : (
                  <span
                    className={`float-end ${classes.pointer}`}
                    onClick={markCompleted}
                  >
                    Mark as completed
                  </span>
                )}
              </div>
              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <>
                    <div className="wrapper">
                      <ReactPlayer
                        className="player"
                        url={course.lessons[clicked].video.Location}
                        width="100%"
                        height="100%"
                        controls
                        onEnded={markCompleted}
                      />
                    </div>
                  </>
                )}

              <ReactMarkdown
                children={course.lessons[clicked].content}
                className="single-post"
              />
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <p className="lead">Click on the lessons to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
