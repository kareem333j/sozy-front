import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const Confirm = ({ open, onClose, onConfirm, title, message, cancelTitle, confirmTitle }) => {
    return (
        <Dialog dir="rtl" open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">{cancelTitle}</Button>
                <Button onClick={onConfirm} color="error" variant="contained">{confirmTitle}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Confirm;
