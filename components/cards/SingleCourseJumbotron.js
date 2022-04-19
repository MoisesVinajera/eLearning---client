import React from 'react';
import { Badge, Button } from 'antd';
import classes from '../../public/css/styles.module.css';
import { currencyFormatter } from '../../utils/helpers';
import ReactPlayer from 'react-player';
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';

const SingleCourseJumbotron = ({
  course,
  setShowModal,
  setPreview,
  user,
  loading,
  freeEnrollmentHandler,
  paidEnrollmentHandler,
  enrolled,
  setEnrolled,
}) => {
  const {
    name,
    image,
    description,
    instructor,
    updatedAt,
    lessons,
    price,
    paid,
    category,
  } = course;

  const showModalHandler = () => {
    setPreview(lessons[0].video.Location);
    setShowModal(true);
  };

  return (
    <div className={`${classes.square} ${classes.jumbotron} bg-primary `}>
      <div className="row ">
        <div className="col mt-4 mb-4 ms-4 ">
          <h1 className="text-light font-weight-bold ">{name}</h1>
          <p className="lead">
            {description && description.substring(0, 160)}...
          </p>
          <Badge
            count={category}
            style={{ backgroundColor: '#03a9f4' }}
            className="pb-4 "
          />
          <p>Created by {instructor.name}</p>
          <p>Last Updated {new Date(updatedAt).toDateString()}</p>
          <h4 className="text-light">
            {paid
              ? currencyFormatter({
                  lenguageCode: 'en-US',
                  amount: price,
                  currency: 'usd',
                })
              : 'Free'}
          </h4>
        </div>
        <div className="col-md-4 mt-4 mb-4 me-4">
          {lessons[0].video && lessons[0].video.Location ? (
            <div onClick={showModalHandler}>
              <ReactPlayer
                className="react-player-div "
                url={lessons[0].video.Location}
                light={
                  image && image.Location ? image.Location : '/img/course.jpg'
                }
                width="100%"
                height="225px"
              />
            </div>
          ) : (
            <>
              <img src={image.Location} alt={name} className="img img-fluid" />
            </>
          )}
          {loading ? (
            <div className="d-flex justify-content-center">
              <LoadingOutlined className="h1 text-danger" />
            </div>
          ) : (
            <Button
              className="mb-3 mt-3"
              type="danger"
              block
              shape="round"
              icon={<SafetyOutlined />}
              size="large"
              disabled={loading}
              onClick={paid ? paidEnrollmentHandler : freeEnrollmentHandler}
            >
              {user
                ? enrolled.status
                  ? 'Go to course'
                  : 'Enroll'
                : 'Login to enroll'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
