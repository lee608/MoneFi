import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import commentFormSchema from "../../schemas/commentFormSchema";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import commentService from "services/commentService";
import toastr from "toastr";
import "./comments.css";
import PostComponent from "./PostComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const _logger = debug.extend("ChildCommentForm");

const ChildCommentForm = ({ entityId, entityTypeId, currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("newest");

  const initialValues = {
    subject: null,
    text: "",
    parentId: null,
    entityId: entityId,
    entityTypeId: entityTypeId,
  };

  const onSubmit = (values, { resetForm }) => {
    _logger("Submitted values:", values);

    commentService
      .addComment(values)
      .then((response) => {
        _logger("response.data: ", response, response.data);
        const newPost = {
          id: response.data.item,
          submittedComment: values.text,
          submittedTime: new Date(),
        };
        setPosts((prevPosts) => [...prevPosts, newPost]);
        toastr.success("Comment added successfully");
        resetForm();
      })
      .catch((error) => {
        _logger("Failed to add comment:", error);
        toastr.error("Failed to add comment");
      });
  };

  const handleCommentUpdate = (postId, updatedText) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              updatedText,
            }
          : post
      )
    );
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.submittedTime) - new Date(a.submittedTime);
    } else if (sortOption === "oldest") {
      return new Date(a.submittedTime) - new Date(b.submittedTime);
    }
    return 0;
  });

  return (
    <div className="border-bottom align-items-center">
      <br />

      <Formik
        initialValues={initialValues}
        validationSchema={commentFormSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleSubmit }) => (
          <div className="card-body">
            <Form className="comment-for" onSubmit={handleSubmit}>
              <div className="comment-form-group comment-quill-container comment-quill-editor">
                <ReactQuill
                  placeholder="Post a comment here"
                  name="text"
                  value={values.text}
                  onChange={handleChange("text")}
                />
                <ErrorMessage
                  name="text"
                  component="div"
                  className="comment-error"
                />
                <br />
                <button
                  type="submit"
                  className="btn btn-primary comment-submit"
                >
                  Submit
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>

      <h3 className="comments-all-headline">All Comments ({posts.length})</h3>
      <div className="comment-sort">
        <span>Sort by </span>
        <select
          className="comment-filter-selection"
          value={sortOption}
          onChange={handleSortOptionChange}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <>
        {sortedPosts.map((post) => (
          <PostComponent
            key={post.id}
            post={{
              id: post.id,
              text: post.submittedComment,
              submittedTime: post.submittedTime,
              entityId: entityId,
              entityTypeId: entityTypeId,
            }}
            onUpdate={handleCommentUpdate}
            currentUser={currentUser}
          />
        ))}
      </>
    </div>
  );
};

ChildCommentForm.propTypes = {
  entityId: PropTypes.number.isRequired,
  entityTypeId: PropTypes.number.isRequired,
  currentUser: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    roles: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChildCommentForm;
