import React, {useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'

function SuggestionDropDown({initialValue, items, onChange}) {
  const [selected, setSelected] = useState(initialValue)

  return (
    <div>
      <Autocomplete
        multiple
        id="tags-standard"
        options={items}
        value={selected}
        onChange ={(event, value) => {
          setSelected(value)
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
      />
    </div>
  )
}

export default SuggestionDropDown


