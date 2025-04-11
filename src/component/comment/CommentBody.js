import React, { useContext, useState } from "react";
import { Avatar, IconButton, Typography, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Replay from "./Replay";
import { CommentForm } from "./CommentForm";
import './comment.css';
import CloseIcon from '@mui/icons-material/Close';
import formatYoutubeTime from "../date-time/formatYoutubeTime";
import CommentActions, { MoreActions } from "./CommetActions";

import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../Axios";
import { useSnackbar } from "notistack";

export default function Comment({ comment_id, author, video_id, is_liked_by_user, time, isChild = false, content, likes, replies = [], replies_count = 0, changeCommentCount, getComments }) {
    const { user, loading } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);
    const [expandedReplays, setExpandedReplays] = useState(false);
    const [expandedReplaysForm, setExpandedReplaysForm] = useState(false);
    const [repliesList, setRepliesList] = useState(replies);
    const [repliesCountDefault, setRepliesCountDefault] = useState(replies_count);

    const toggleExpand = () => setExpanded(!expanded);
    const toggleExpandReplays = () => setExpandedReplays(!expandedReplays);
    const toggleExpandedReplaysForm = () => setExpandedReplaysForm(!expandedReplaysForm);

    const handleReplyAdded = (newReply) => {
        setRepliesList((prev) => [newReply, ...prev]);
        setRepliesCountDefault(repliesCountDefault + 1);
        getComments();
    };

    // snackbar
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (msg, variant) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: "top", horizontal: "right" } });
    };

    // delete comment action
    const deleteComment = async () => {
        const response = await axiosInstance.delete(`/api/comments/${comment_id}/delete`);
        if (response.status === 204) {
            getComments();
            handleClickVariant('تم حذف التعليق بنجاح', 'success');
        } else {
            handleClickVariant('لقد حدث خطأ', 'error');
        }
    }

    return (
        <>
            <div className={`d-flex ${isChild ? 'child-comment' : ''} items-start space-x-3 gap-2 w-100 mb-3`}>
                <Avatar src={author.avatar} alt={author.full_name ? author.full_name : author.profile_id} className="w-10 h-10" />

                <div className="flex-1 w-100">
                    <Typography className="text-sm font-bold text-gray-300">
                        <span style={{ color: 'var(--main-color)', fontWeight: 'bold' }}>@{author.full_name ? author.full_name : author.profile_id}</span>
                        <span style={{ color: 'var(--main-50)' }} className="text-gray-500 text-xs ms-2">
                            {formatYoutubeTime(time)}
                        </span>
                    </Typography>

                    <Typography className="text-sm text-gray-300 d-flex flex-column">
                        <span style={{ color: 'var(--main-color)', whiteSpace: 'pre-wrap', fontSize: '1em' }}>
                            {expanded ? content : content.slice(0, 150) + (content.length > 150 ? '.....' : '')}
                        </span>
                        {content.length > 150 && (
                            <Button
                                onClick={toggleExpand}
                                sx={{
                                    textTransform: "none",
                                    color: "var(--main-50)",
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    width: '85px',
                                    padding: 0,
                                    marginTop: 1,
                                    "&:hover": { backgroundColor: "transparent", textDecoration: 'underline' },
                                }}
                            >
                                {expanded ? "تقليص" : "رؤية المزيد"}
                                {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                            </Button>
                        )}
                    </Typography>

                    <CommentActions
                        commentId={comment_id}
                        toggleExpandedReplaysForm={toggleExpandedReplaysForm}
                        initialLikes={likes}
                        isLikedByUser={is_liked_by_user}
                    />

                </div>
                {
                    user.user.profile.profile_id === author.profile_id ?
                        <MoreActions
                            isChild={isChild}
                            deleteAction={{
                                onConfirm: deleteComment,
                                title: "حذف التعليق",
                                message: "هل متأكد من حذف التعليق",
                                cancelTitle: "إلغاء",
                                confirmTitle: "نعم،حذف",
                            }}
                        />
                        :
                        <></>
                }
            </div>

            {expandedReplaysForm && (
                <div className="w-100 mt-2 d-flex flex-row align-items-start w-100 ps-4">
                    <IconButton
                        size="small"
                        className="text-gray-400 mt-1"
                        sx={{
                            textTransform: "none",
                            fontSize: "13px",
                            fontWeight: "bold",
                            borderRadius: "50px",
                            width: '30px',
                            height: '30px',
                            "&:hover": { backgroundColor: "transparent" },
                        }}
                        onClick={toggleExpandedReplaysForm}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <CommentForm
                        label="Enter Reply"
                        confirmButton="Reply"
                        onCancel={toggleExpandedReplaysForm}
                        replay={{ isReplay: true, data: { comment_id: comment_id, authorData: author } }}
                        onCommentAdded={handleReplyAdded}
                        video_id={video_id}
                        changeCommentCount={changeCommentCount}
                    />
                </div>
            )}

            {repliesList.length > 0 && (
                <div className="flex items-center space-x-2 ps-4">
                    <Button
                        style={{ fontSize: '1.1em', color: '#3EA6FF', cursor: 'pointer' }}
                        sx={{
                            textTransform: "none",
                            color: "var(--main-50)",
                            fontSize: "13px",
                            fontWeight: "bold",
                            margin: '0',
                            borderRadius: "50px"
                        }}
                        onClick={toggleExpandReplays}
                    >
                        {expandedReplays ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        <div className="d-flex gap-1">
                            <span>
                            ردود
                            </span>
                            <span>
                                {repliesCountDefault}
                            </span>
                        </div>
                    </Button>
                </div>
            )}

            {expandedReplays && (
                <div className="replies-container ps-4">
                    {repliesList.map((reply, index) => (
                        <Comment
                            key={reply.id}
                            author={reply.author}
                            time={reply.created_dt}
                            content={reply.content}
                            likes={reply.likes_count}
                            replies_count={reply.total_replies}
                            replies={reply.replies}
                            isChild={true}
                            comment_id={reply.id}
                            is_liked_by_user={reply.is_liked_by_user}
                            getComments={getComments}
                            changeCommentCount={changeCommentCount}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
