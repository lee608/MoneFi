import React, { useState } from "react";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import "./comments.css";
import ReactQuill from "react-quill";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import {
  mdiCircle,
  mdiAt,
  mdiReply,
  mdiNoteEdit,
  mdiTrashCan,
  mdiThumbUpOutline,
  mdiThumbDownOutline,
  mdiUpdate,
} from "@mdi/js";

const ReplyForm = ({ currentUser, level = 0 }) => {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(true);
  const [replyPosted, setReplyPosted] = useState(false);
  const [nestedReplies, setNestedReplies] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showEdited, setShowEdited] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [showDeletedMessage, setShowDeletedMessage] = useState(false);
  const [originalReplyText, setOriginalReplyText] = useState("");

  const handleLikeClick = () => {
    setLikes(likes + 1);
  };

  const handleDislikeClick = () => {
    setDislikes(dislikes + 1);
  };

  const handlePostReply = () => {
    if (replyText.trim() === "") {
      return;
    }

    setReplyPosted(true);
    setShowReply(false);
    setOriginalReplyText(replyText);
  };

  const onReplyHandler = (value) => {
    setReplyText(value);
  };

  const handleAddNestedReply = () => {
    setNestedReplies([...nestedReplies, {}]);
  };

  const nestedEditHandler = () => {
    if (editMode) {
      setShowEdited("");
      if (replyText !== originalReplyText) {
        setShowEdited("(Edited)");
      } else {
        setShowEdited("");
      }
    }
    setEditMode(!editMode);
    setReplyText(replyPosted ? replyText : "");
  };

  const nestedDeleteHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this comment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleted(true);
        setShowDeletedMessage(true);
      }
    });
  };

  return (
    <React.Fragment>
      <br />
      <div className={`reply-card-form reply-level-${level}`}>
        <div className="card-body">
          <div className="comment-form">
            <div className="vertical">
              <div className="comment-form-group">
                <p className="card-text">
                  {currentUser && currentUser.avatarUrl && replyPosted && (
                    <img
                      icon={mdiCircle}
                      src={currentUser.avatarUrl}
                      alt="Avatar"
                      className="comment-avatar-icon"
                    />
                  )}
                  <Icon path={mdiAt} size={0.7} />
                  {replyPosted && (
                    <span>
                      <strong>
                        {currentUser &&
                          currentUser.firstName +
                            " " +
                            currentUser.lastName.charAt(0) +
                            "."}
                      </strong>
                    </span>
                  )}
                  <span className="comment-time">
                    {formatDistanceToNow(new Date(), {
                      addSuffix: true,
                    })}
                  </span>
                  {showEdited && (
                    <span className="show-edited-comment">{showEdited}</span>
                  )}

                  {!isDeleted && editMode ? (
                    <>
                      <Icon
                        path={mdiUpdate}
                        type="button"
                        size={1}
                        className="comment-update"
                        title="Update"
                        onClick={nestedEditHandler}
                      />
                      <span
                        type="button"
                        className="comment-icons"
                        onClick={nestedEditHandler}
                      >
                        Update
                      </span>
                    </>
                  ) : null}
                  {!isDeleted && !editMode ? (
                    <>
                      <Icon
                        path={mdiNoteEdit}
                        type="button"
                        size={1}
                        className="nested-comment-edit"
                        onClick={nestedEditHandler}
                        title="Edit"
                      />
                      <span
                        type="button"
                        className="comment-icons"
                        onClick={nestedEditHandler}
                      >
                        Edit
                      </span>
                    </>
                  ) : null}
                  {!isDeleted ? (
                    <>
                      <Icon
                        path={mdiTrashCan}
                        type="submit"
                        size={1}
                        className="comment-delete"
                        title="Delete"
                        onClick={nestedDeleteHandler}
                      />
                      <span
                        type="button"
                        className="comment-icons"
                        onClick={nestedDeleteHandler}
                      >
                        Delete
                      </span>
                    </>
                  ) : null}
                </p>
                {showReply ? (
                  <>
                    <ReactQuill
                      id="comment"
                      name="text"
                      value={replyText}
                      onChange={onReplyHandler}
                      placeholder="Add a reply..."
                      className="reply-quill-container"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary reply-post-button"
                      onClick={handlePostReply}
                    >
                      Reply
                    </button>
                  </>
                ) : (
                  <>
                    {editMode ? (
                      <ReactQuill
                        id="comment"
                        name="text"
                        value={replyText}
                        onChange={onReplyHandler}
                        placeholder="Edit your reply..."
                        className="nested-reply-quill-container"
                      />
                    ) : (
                      <div
                        className="comment-reply-comments reply-container"
                        dangerouslySetInnerHTML={{
                          __html:
                            showDeletedMessage && isDeleted
                              ? "<em>This comment has been deleted.</em>"
                              : replyText,
                        }}
                      />
                    )}
                    <>
                      {!isDeleted ? (
                        <>
                          <Icon
                            path={mdiReply}
                            type="submit"
                            size={1}
                            className="nested-reply"
                            title="Reply"
                          />
                          <span
                            type="button"
                            className="comment-icons"
                            onClick={handleAddNestedReply}
                          >
                            Reply
                          </span>

                          <Icon
                            path={mdiThumbUpOutline}
                            size={1}
                            className="comment-thumbsup-icon"
                            onClick={handleLikeClick}
                          />
                          <span>{likes}</span>
                          <Icon
                            path={mdiThumbDownOutline}
                            size={1}
                            className="comment-thumbsdown-icon"
                            onClick={handleDislikeClick}
                          />
                          <span>{dislikes}</span>
                        </>
                      ) : null}
                    </>
                  </>
                )}
              </div>
              <div className="content-fit">
                {nestedReplies.map((_, index) => (
                  <ReplyForm
                    key={index}
                    currentUser={currentUser}
                    level={level + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ReplyForm.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  level: PropTypes.number,
};

export default React.memo(ReplyForm);
