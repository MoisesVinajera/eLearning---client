import { Button, Progress, Tooltip } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';

import React from 'react';
import classes from '../../public/css/styles.module.css';

const AddLessonForm = ({
  values,
  onChanceTitleHandler,
  onChanceContentHandler,
  addLessonHandler,
  uploading,
  uploadButtonText,
  sendVideoToBackendHandler,
  progress,
  removeVideoHandler,
}) => {
  return (
    <div className="container pt-3">
      <form onSubmit={addLessonHandler}>
        <input
          type="text"
          className={`form-control ${classes.square}`}
          onChange={onChanceTitleHandler}
          value={values.title}
          placeholder="Title"
          autoFocus
          required
        ></input>
      </form>
      <textarea
        className="form-control mt-3"
        cols="7"
        rows="7"
        onChange={onChanceContentHandler}
        value={values.content}
        placeholder="Content"
      ></textarea>

      <div className="d-flex justify-content-center">
        <label className="btn btn-dark btn-block text-start mt-3 w-100">
          {uploadButtonText}
          <input
            onChange={sendVideoToBackendHandler}
            type="file"
            accept="video/*"
            hidden
          ></input>
        </label>
        {!uploading && values.video.Location && (
          <Tooltip title="Remove">
            <span onClick={removeVideoHandler} className="pt-1 ps-3">
              <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
            </span>
          </Tooltip>
        )}
      </div>

      {progress > 0 && (
        <Progress
          className="d-flex justify-content-center pt-2"
          percent={progress}
          steps={10}
        />
      )}

      <Button
        onClick={addLessonHandler}
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

export default AddLessonForm;
