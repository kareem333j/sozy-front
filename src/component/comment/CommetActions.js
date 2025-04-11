import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ReplyIcon from "@mui/icons-material/Reply";
import axiosInstance from "../../Axios";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import Confirm from "../dialogs/DialogForm_1";


const CommentActions = ({ commentId, initialLikes, isLikedByUser, toggleExpandedReplaysForm }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(isLikedByUser);

    const toggleLike = async () => {
        const newLikes = isLiked ? likes - 1 : likes + 1;
        setLikes(newLikes);
        setIsLiked(!isLiked);

        try {
            const response = await axiosInstance.patch(`/api/comment/${commentId}/like`);
            if (response.status === 201) {
                setLikes(newLikes);
            }
        } catch (error) {
            setLikes(likes);
            setIsLiked(isLiked);
        }
    };

    return (
        <div className="flex items-center space-x-2 mt-2">
            <IconButton onClick={toggleLike} size="small" className={isLiked ? "text-blue-500" : "text-gray-400"}>
                {isLiked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
            </IconButton>
            <span className="text-gray-400 text-xs">{likes}</span>
            <IconButton onClick={toggleExpandedReplaysForm} size="small" className="text-gray-400 ms-2">
                <ReplyIcon fontSize="small" />
            </IconButton>
            <span className="text-gray-400 text-xs">رد</span>
        </div>
    );
};

export const MoreActions = ({ deleteAction = {},isChild }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [openAlert, setOpenAlert] = useState(false);
    
    return (
        <>
            <Confirm
                open={openAlert}
                onConfirm={()=>{
                    deleteAction.onConfirm();
                    setOpenAlert(false);
                }}
                onClose={() => setOpenAlert(false)}
                title={deleteAction.title}
                message={deleteAction.message}
                cancelTitle={deleteAction.cancelTitle}
                confirmTitle={deleteAction.confirmTitle}
            />
            <IconButton
                sx={{ width: '40px', height: '40px', marginRight: isChild ? '5px' : '' }}
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { handleClose(); setOpenAlert(true) }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography sx={{ padding: 0, margin: 0, paddingRight: 5 }}>حذف</Typography>
                </MenuItem>
            </Menu>
        </>
    )
}

export default CommentActions;
