import { Button, Progress, Switch } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import ReactPlayer from 'react-player';

import React from 'react';
import classes from '../../public/css/styles.module.css';

const UpdateLessonForm = ({
  current,
  setCurrent,
  sendVideoToBackendHandler,
  updateLessonHandler,
  uploadVideoButtonText,
  progress,
  uploading,
}) => {
  const onChanceTitleHandler = (event) => {
    setCurrent((prevState) => {
      return { ...prevState, title: event.target.value };
    });
  };
  const onChanceContentHandler = (event) => {
    setCurrent((prevState) => {
      return { ...prevState, content: event.target.value };
    });
  };

  return (
    <div className="container pt-3">
      <form onSubmit={updateLessonHandler}>
        <input
          type="text"
          className={`form-control ${classes.square}`}
          onChange={onChanceTitleHandler}
          value={current.title}
          autoFocus
          required
        ></input>
      </form>
      <textarea
        className="form-control mt-3"
        cols="7"
        rows="7"
        onChange={onChanceContentHandler}
        value={current.content}
      ></textarea>

      <div>
        {!uploading && current.video && current.video.Location && (
          <div className="pt-2 d-flex justify-content-center">
            <ReactPlayer
              url={current.video.Location}
              width="410px"
              height="240px"
              controls
            />
          </div>
        )}
        <label className="btn btn-dark btn-block text-start mt-3 w-100">
          {uploadVideoButtonText}
          <input
            onChange={sendVideoToBackendHandler}
            type="file"
            accept="video/*"
            hidden
          ></input>
        </label>
      </div>

      {progress > 0 && (
        <Progress
          className="d-flex justify-content-center pt-2"
          percent={progress}
          steps={10}
        />
      )}

      <Button
        onClick={updateLessonHandler}
        className="col mt-3 w-100"
        size="large"
        type="primary"
        loading={uploading}
        shape="round"
      >
        Save
      </Button>
    </div>
  );
};

export default UpdateLessonForm;
