import React from 'react';
import { List, Avatar } from 'antd';

const { Item } = List;

const SingleCourseLessons = ({
  lessons,
  preview,
  setPreview,
  showModal,
  setShowModal,
}) => {
  const setPreviewHandler = (item) => {
    setPreview(item.video.Location);
    setShowModal((prev) => {
      return !prev;
    });
  };

  const renderItemsListHandler = (item, index) => {
    return (
      <Item>
        <Item.Meta avatar={<Avatar>{index + 1}</Avatar>} title={item.title} />

        {item.video && item.video !== null && item.free_preview && (
          <span
            className="pointer text-primary "
            onClick={() => setPreviewHandler(item)}
          >
            Preview
          </span>
        )}
      </Item>
    );
  };

  return (
    <div className="container">
      <div className="row pt-5">
        <div className="col lesson-list">
          {lessons && <h4>{lessons.length} Lessons</h4>}
          <hr />
          <List
            itemLayout="horizontal"
            dataSource={lessons}
            renderItem={renderItemsListHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleCourseLessons;
