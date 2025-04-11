import React, { useState } from "react";
import { Avatar, IconButton, Typography, Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ReplyIcon from "@mui/icons-material/Reply";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { CommentForm } from "./CommentForm";
import CloseIcon from '@mui/icons-material/Close';
import formatYoutubeTime from "../date-time/formatYoutubeTime";

export default function Replay({ author={avatar:''}, time, content, likes, replies = [] }) {
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => setExpanded(!expanded);
    const [expandedReplaysForm, setExpandedReplaysForm] = useState(false);
    const toggleExpandedReplaysForm = () => {
        setExpandedReplaysForm(!expandedReplaysForm);
    };
    console.log('replies:',replies)
    return (
        <div className="d-flex replay-main-div items-start space-x-3 gap-2 w-100 mb-3">
            <Avatar sx={{ color: 'var(--main-color)' }} src={author.avatar} alt={author.full_name?author.full_name:author.profile_id} className="w-10 h-10" />

            <div className="flex-1 w-100">
                <Typography className="text-sm font-bold text-gray-300">
                    <span style={{ color: 'var(--main-color)', fontWeight: 'bold' }}>@{author.full_name?author.full_name:author.profile_id}</span> <span style={{ color: 'var(--main-50)' }} className="text-gray-500 text-xs ms-2">{formatYoutubeTime(time)}</span>
                </Typography>

                <Typography className="text-sm text-gray-300 d-flex flex-column">
                    <span style={{ color: 'var(--main-color)', whiteSpace: 'pre-wrap' }}>{expanded ? content : content.slice(0, 150) + `${(content.length === 0) ? '' : (content.length > 150) ? '.....' : ''}`}</span>
                    <div>
                        {content.length > 150 && (
                            <Button
                                onClick={toggleExpand}
                                className="text-blue-500 text-xs font-bold ml-1"
                                sx={{
                                    textTransform: "none",
                                    color: "var(--main-50)",
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    padding: 0,
                                    "&:hover": { backgroundColor: "transparent", textDecoration: 'underline' },
                                }}
                            >
                                {expanded ? "Show less" : "Read more"}
                                {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                            </Button>
                        )}
                    </div>
                </Typography>

                <div className="flex items-center space-x-2 mt-2">
                    <IconButton size="small" className="text-gray-400">
                        <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <span className="text-gray-400 text-xs">{likes}</span>
                    <IconButton onClick={toggleExpandedReplaysForm} size="small" className="text-gray-400 ms-2">
                        <ReplyIcon fontSize="small" />
                    </IconButton>
                    <span className="text-gray-400 text-xs">Reply</span>
                </div>
                {
                    expandedReplaysForm ?
                        <div className="w-100 mt-2 d-flex flex-row align-items-start w-100">
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
                                confirmButton="Replay"
                                onCancel={toggleExpandedReplaysForm}
                                replay={{isReplay:true,data:'karim magdy'}}
                            />
                        </div> :
                        <></>
                }
            </div>
            <IconButton sx={{ width: '50px', height: '50px' }}>
                <MoreVertIcon />
            </IconButton>
        </div>
    );
}
