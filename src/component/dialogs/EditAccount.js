import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, TextField } from '@mui/material'
import React from 'react';

export const EditAccount = (props) => {

    return (
        <Dialog open={props.openForm} onClose={props.handleCloseForm}>
            <DialogTitle className='text-center'>تعديل الصلاحيات</DialogTitle>
            <DialogContent className='d-flex flex-column gap-3 justify-content-center align-items-center' style={{ width: '300px', margin: 'auto' }}>
                <FormControlLabel
                    control={<Switch checked={props.isAdmin} onChange={() => props.setIsAdmin(!props.isAdmin)} />}
                    label="مسؤول"
                    sx={{ width: '90%', ':hover': { backgroundColor: 'var(--scrollbar-color)' }, margin: 'auto', display: 'flex', justifyContent: 'space-between', borderRadius: '5px', padding: '0 8px 0 5px' }}
                />
                <FormControlLabel
                    control={<Switch checked={props.isAssistant} onChange={() => props.setIsAssistant(!props.isAssistant)} />}
                    label="مساعد"
                    sx={{ width: '90%', ':hover': { backgroundColor: 'var(--scrollbar-color)' }, margin: 'auto', display: 'flex', justifyContent: 'space-between', borderRadius: '5px', padding: '0 8px 0 5px' }}
                />
                <FormControlLabel
                    control={<Switch checked={props.isActive} onChange={() => props.setIsActive(!props.isActive)} />}
                    label="مفعل"
                    sx={{ width: '90%', ':hover': { backgroundColor: 'var(--scrollbar-color)' }, margin: 'auto', display: 'flex', justifyContent: 'space-between', borderRadius: '5px', padding: '0 8px 0 5px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleCloseForm} color="inherit">
                    إلغاء
                </Button>
                <Button onClick={props.handleSave} color="primary" variant="contained">
                    حفظ
                </Button>
            </DialogActions>
        </Dialog>
    )
}
