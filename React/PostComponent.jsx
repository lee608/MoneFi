import React, { useState } from "react";
import "./comments.css";
import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import commentService from "services/commentService";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import Icon from "@mdi/react";
import {
  mdiReply,
  mdiNoteEdit,
  mdiTrashCan,
  mdiUpdate,
  mdiCircle,
  mdiAt,
  mdiThumbUpOutline,
  mdiThumbDownOutline,
} from "@mdi/js";
import toastr from "toastr";
import Swal from "sweetalert2";
import ReplyForm from "./ReplyForm";

const _logger = debug.extend("PostComponent");

const PostComponent = ({
  post: { id, text: originalText, submittedTime, entityId, entityTypeId },
  onUpdate,
  currentUser,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(originalText);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showEdited, setShowEdited] = useState("");

  const handleLikeClick = () => {
    setLikes(likes + 1);
  };

  const handleDislikeClick = () => {
    setDislikes(dislikes + 1);
  };

  const handleEditClick = () => {
    setEditing(true);
    _logger("Editing mode firing");
  };

  const handleUpdateClick = () => {
    _logger("Updated text:", editedText);

    const payload = {
      subject: null,
      text: editedText,
      entityId,
      entityTypeId,
    };

    commentService
      .updateComment(id, payload)
      .then((response) => {
        _logger("Comment updated successfully:", response.data, id);
        onUpdate(id, editedText);
        setEditing(false);
        if (editedText !== originalText) {
          setShowEdited("(Edited)");
        } else {
          setShowEdited("");
        }
      })
      .catch((error) => {
        _logger("Failed to update comment: ", error, id);
      });
  };

  const handleTextChange = (value) => {
    setEditedText(value);
  };

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  const handleDeleteClick = () => {
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
        commentService
          .deleteComment(id)
          .then((response) => {
            _logger("Comment deleted successfully: ", response.data, id);
            toastr.success("Your comment has been deleted");
            setIsDeleted(true);
          })
          .catch((error) => {
            _logger("Failed to delete comment: ", error, id);
          });
      }
    });
  };

  const isAdmin = currentUser.roles === "Admin" && currentUser.roles !== "User";

  return (
    <React.Fragment>
      <br />
      <div className="comment-container">
        <div className="card-body">
          <div className="comment-form">
            <p className="card-text">
              <img
                icon={mdiCircle}
                src={currentUser.avatarUrl}
                alt="Avatar"
                className="comment-avatar-icon"
              />
              <Icon path={mdiAt} size={0.7} />
              <span>
                <strong>
                  {currentUser.firstName +
                    " " +
                    currentUser.lastName.charAt(0) +
                    "."}
                </strong>
              </span>

              {submittedTime && (
                <span className="comment-time">
                  {formatDistanceToNow(new Date(submittedTime), {
                    addSuffix: true,
                  })}
                </span>
              )}
              <span className="show-edited-comment">{showEdited}</span>
              {editing ? (
                <>
                  <Icon
                    path={mdiUpdate}
                    type="button"
                    size={1}
                    className="comment-update"
                    onClick={handleUpdateClick}
                    title="Update"
                  />
                  <span
                    type="button"
                    className="comment-icons"
                    onClick={handleUpdateClick}
                  >
                    Update
                  </span>
                </>
              ) : (
                <>
                  {!isDeleted && !isAdmin && (
                    <>
                      <Icon
                        path={mdiNoteEdit}
                        type="button"
                        size={1}
                        className="comment-edit"
                        onClick={handleEditClick}
                        title="Edit"
                      />
                      <span
                        type="button"
                        className="comment-icons"
                        onClick={handleEditClick}
                      >
                        Edit
                      </span>
                    </>
                  )}
                </>
              )}
              {isDeleted ? null : (
                <>
                  <Icon
                    path={mdiTrashCan}
                    type="submit"
                    size={1}
                    className="comment-delete"
                    onClick={handleDeleteClick}
                    title="Delete"
                  />
                  <span
                    type="button"
                    className="comment-icons"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </span>
                </>
              )}
            </p>
            {isDeleted ? (
              <div className="comment-deleted">
                <em>This comment has been deleted.</em>
              </div>
            ) : editing ? (
              <ReactQuill
                className="comment-quill-container-edit"
                value={editedText}
                onChange={handleTextChange}
              />
            ) : (
              <div
                className="comment-reply-comments"
                dangerouslySetInnerHTML={{
                  __html: isDeleted
                    ? "<em>This comment has been deleted.</em>"
                    : editedText,
                }}
              />
            )}
          </div>
          {isDeleted ? null : (
            <>
              <Icon
                path={mdiReply}
                type="submit"
                size={1}
                className="comment-reply"
                onClick={handleReplyClick}
                title="Reply"
              />
              <span
                type="button"
                className="comment-icons"
                onClick={handleReplyClick}
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
          )}
          <div className="post-form">
            {isReplying && (
              <ReplyForm
                setIsReplying={setIsReplying}
                currentUser={{
                  firstName: currentUser.firstName,
                  avatarUrl: currentUser.avatarUrl,
                  lastName: currentUser.lastName,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

PostComponent.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    subject: PropTypes.string,
    text: PropTypes.string.isRequired,
    submittedTime: PropTypes.instanceOf(Date),
    entityId: PropTypes.number,
    entityTypeId: PropTypes.number,
  }).isRequired,

  onUpdate: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    roles: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostComponent;
