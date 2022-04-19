import React from 'react';
import { Modal } from 'antd';
import ReactPlayer from 'react-player';

const PreviewModal = ({ preview, showModal, setShowModal }) => {
  const onCancelHandler = () => {
    setShowModal((prev) => {
      !prev;
    });
  };
  return (
    <>
      <Modal
        title="Course Preview"
        visible={showModal}
        onCancel={onCancelHandler}
        width={720}
        footer={null}
      >
        <div className="wrapper">
          <ReactPlayer
            url={preview}
            playing={showModal}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
      </Modal>
    </>
  );
};

export default PreviewModal;
