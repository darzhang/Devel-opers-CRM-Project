import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'

function SuggestionDropDown({participants, items, onChange}) {
  return (
    <div>
      <Autocomplete
        multiple
        id="tags-standard"
        options={items}
        value={participants}
        onChange ={(event, value) => {
          onChange(value)
        }}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Participants"
            placeholder="Add Participant"
            InputLabelProps={{
              shrink: true,
            }}
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

export default SuggestionDropDown


