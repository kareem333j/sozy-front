import { Autocomplete, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';

export const CustomTextField = (props) => {
    return (
        <TextField
            required={props.required}
            id="outlined-required"
            label={props.label}
            defaultValue={props.defaultValue}
            value={props.value}
            onChange={props.onChange}
            name={props.name}
            sx={props.sx}
            error={props.error}
            helperText={props.helperText}
            type={props.type}
            inputProps={props.inputProps}
        />
    )
}


export const CustomTextAreaField = (props) => {
    return (
        <TextField
            id="outlined-multiline-static"
            label={props.label}
            multiline
            rows={props.rows}
            defaultValue={props.defaultValue}
            value={props.value}
            name={props.name}
            required={props.required}
            sx={props.sx}
            onChange={props.onChange}
            error={props.error}
            helperText={props.helperText}
        />
    )
}

export const CustomSelectField = (props) => {

    return (
        <FormControl error={props.error} sx={{ m: 1, width: '100%' }}>
            <InputLabel id="demo-simple-select-helper-label">{props.label}</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={props.value}
                label={props.label}
                onChange={props.handleChange}
                name={props.name}
                required={props.required}
                error={props.error}
            >
                <MenuItem value="">
                    <em>----------</em>
                </MenuItem>
                {
                    props.data.map((item) => {
                        if (props.is_users) {
                            return (
                                <MenuItem dir='rtl' key={item.profile_id} value={item.profile_id}>{item.full_name} - {item.email}</MenuItem>
                            )
                        }
                        return (
                            <MenuItem dir='rtl' key={item.id} value={item.id}>{item.title}</MenuItem>
                        )
                    })
                }
            </Select>
            <FormHelperText className='text-danger'>{props.helperText}</FormHelperText>
        </FormControl>
    )
}

export const CustomAutocompleteField = (props) => {
    return (
        <FormControl error={props.error} sx={{ m: 1, width: '100%' }}>
            <Autocomplete
                options={props.data}
                getOptionLabel={(option) =>
                    props.is_users
                        ? `${option.full_name} - ${option.email}`
                        : option.title || ""
                }
                value={props.data.find(
                    (item) =>
                        item.id === props.value || item.profile_id === props.value
                ) || null}
                onChange={(event, newValue) =>
                    props.handleChange({
                        target: {
                            name: props.name,
                            value: newValue
                                ? (props.is_users ? newValue.profile_id : newValue.id)
                                : "",
                        },
                    })
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={props.label}
                        required={props.required}
                        error={props.error}
                        helperText={props.helperText}
                    />
                )}
                isOptionEqualToValue={(option, value) =>
                    props.is_users
                        ? option.profile_id === value.profile_id
                        : option.id === value.id
                }
            />
        </FormControl>
    );
};

export function SearchField(props) {
    return (
        <TextField
            dir='rtl'
            label={props.label}
            variant="outlined"
            value={props.value}
            onChange={props.onChange}
            fullWidth
            placeholder={props.placeholder}
            InputProps={{
                startAdornment: (
                    <InputAdornment sx={{ marginRight: '20px' }} position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
}