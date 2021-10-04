import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'

const SuggestionDropDownDisabled = ({participants, items, onChange}) => {
  return (
    <div>
      <Autocomplete
        multiple
        open={false}
        id="tags-standard"
        options={items}
        value={participants}
        onChange ={(event, value) => {
          void(0)
        }}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Participants"
            placeholder=""
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ ...params.inputProps, readOnly:true }}
          />
        )}
        ListboxProps={
          {
            style:{
                maxHeight: '200px',
            }
          }
        }
      />
    </div>
  )
}

export default SuggestionDropDownDisabled
