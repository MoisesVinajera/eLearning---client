import React from 'react';
import classes from '../../public/css/styles.module.css';
import { SyncOutlined } from '@ant-design/icons';

const GForm = ({
  inputFormElements,
  formTitle,
  submitLegend,
  submitHandler,
  loading,
}) => {
  const showInputElements = () =>
    inputFormElements
      .filter((element) => element.isVisible)
      .map((element, index) => (
        <input
          type={element.type}
          className={
            element.className ? element.className : 'form-control mb-4 p-4'
          }
          value={element.value}
          onChange={element.onChange}
          placeholder={element.placeholder}
          required={element.required}
          key={element.type + index}
        ></input>
      ));

  const contentForm = (
    <>
      {showInputElements()}
      <button
        type="submit"
        className="btn w-100 btn-primary "
        disabled={
          loading ||
          inputFormElements.find(
            (element) => element.value === '' && element.required
          )
        }
      >
        {loading ? <SyncOutlined spin /> : submitLegend}
      </button>
    </>
  );

  return (
    <>
      <h1
        className={`${classes.jumbotron} p-5 mb-4 text-center bg-primary ${classes.square}`}
      >
        {formTitle}
      </h1>
      <div className={`container col-md-4 offset-md-4 pb-4`}>
        <form onSubmit={submitHandler}>{contentForm}</form>
      </div>
    </>
  );
};

export default GForm;
