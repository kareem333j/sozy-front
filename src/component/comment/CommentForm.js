import { Avatar, Box, Button, FormControl, IconButton, Popover, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import Picker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../Axios';

export const CommentForm = ({ label, confirmButton, onCancel = () => { }, replay = { isReplay: false, data: "" }, video_id, onCommentAdded,changeCommentCount }) => {
    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleEmojiClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const onEmojiClick = (emojiObject) => {
        setComment((prev) => prev + emojiObject.emoji);
    };
    

    const handleSubmit = async () => {
        if (comment.trim().length === 0 || loading) return;
        setLoading(true);

        try {
            const url = replay.isReplay
                ? `/api/comments/${replay.data.comment_id}/replies/`
                : `/api/videos/${video_id}/comments/`;

            const response = await axiosInstance.post(url, { content: comment });

            if (response.status === 201) {
                setComment("");
                onCancel();
                onCommentAdded(response.data);
                changeCommentCount(response.data.total_comments);
            } else {
                console.error("Error adding comment:", response);
            }
        } catch (error) {
            console.error("Network error:", error);
        }

        setLoading(false);
    };

    return (
        <Box className='w-100'>
            <FormControl sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%', marginBottom: '5px' }}>
                    <Avatar sx={{ width: 30, height: 30, mr: 1 }} src={user.user.profile.avatar} />
                    <TextField
                        multiline
                        variant="standard"
                        sx={{ width: '100%', marginTop: "-15px" }}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        label={replay.isReplay ? `@${replay.data.authorData.full_name || replay.data.authorData.profile_id} الرد علي` : label}
                    />
                    <IconButton onClick={handleEmojiClick}>
                        <EmojiEmotionsIcon color="active" />
                    </IconButton>
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                        <Picker onEmojiClick={onEmojiClick} />
                    </Popover>
                </div>
                {(comment.length > 0) &&
                    <div className='d-flex w-100 justify-content-end gap-2'>
                        <Button onClick={() => { setComment(''); onCancel(); }} size="small">Cancel</Button>
                        <Button onClick={handleSubmit} size="small" disabled={loading} sx={{ borderRadius: '50px' }} variant="contained">
                            {loading ? "Sending..." : confirmButton}
                        </Button>
                    </div>
                }
            </FormControl>
        </Box>
    );
};
