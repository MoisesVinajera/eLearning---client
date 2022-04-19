import { Select, Button, Avatar, Badge } from 'antd';
import classes from '../../public/css/styles.module.css';

const { Option } = Select;

const CourseCreateForm = ({
  onSubmit,
  onChange,
  onSelectChange,
  imageHandler,
  onSelectPriceChange,
  values,
  imagePreview,
  uploadButtonText,
  imageRemoveHandler,
  editPage = false,
  image,
}) => {
  const children = [];
  for (let i = 9.99; i <= 100.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }
  return (
    <>
      {values && (
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={onChange}
            />
          </div>

          <div className="form-group pt-3">
            <textarea
              name="description"
              cols="7"
              rows="7"
              className="form-control"
              placeholder="Description"
              value={values.description}
              onChange={onChange}
            />
          </div>

          <div className={`${classes.form_row} pt-3`}>
            <div className={values.paid ? 'col-md-11' : 'w-100'}>
              <div className="form-group">
                <Select
                  onChange={onSelectChange}
                  value={values.paid}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>
            {values.paid && (
              <div className="col-md-1">
                <div className="form-group">
                  <Select
                    defaultValue={editPage ? values.price : '$9.99'}
                    style={{ width: '100%' }}
                    onChange={onSelectPriceChange}
                    tokenSeparators={[,]}
                    size="large"
                  >
                    {children}
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="form-group pt-3 ">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Category"
              value={values.category}
              onChange={onChange}
            />
          </div>

          <div className={`${classes.form_row} pt-3`}>
            <div className="col">
              <div className="form-group">
                <label className="btn btn-outline-secondary btn-block text-start w-100">
                  {uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={imageHandler}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>
            {imagePreview && (
              <Badge count="X" onClick={imageRemoveHandler} className="pointer">
                <Avatar width={200} src={imagePreview} />
              </Badge>
            )}

            {/* {editPage && values.image && (
              <Avatar width={200} src={values.image.Location} />
            )} */}
          </div>

          <div className="row pt-3">
            <div className="col">
              <Button
                onClick={onSubmit}
                disabled={values.loading || values.uploading}
                className="btn btn-primary"
                loading={values.loading}
                type="primary"
                size="large"
                shape="round"
              >
                {values.loading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
