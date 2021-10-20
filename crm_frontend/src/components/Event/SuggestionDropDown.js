import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

/* Create a textfield with suggestion dropdown for participants field of the event
 *
 * @param participants List of ids of selected participants
 * @param items The list of contacts object with name and ids
 * @param onChange Function to handle the change of participants props
 * @param size The size of the text field
 */
function SuggestionDropDown({participants, items, onChange, size}) {
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
            size={size}
            label="Participants"
            // placeholder="Add Participant"
            // InputLabelProps={{
            //   shrink: true,
            // }}
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


