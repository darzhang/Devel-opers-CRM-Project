import React, {useState} from 'react'
import { 
  DataGrid, 
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@mui/x-data-grid'

/* Create a data grid component (table) to show list of objects
 *
 * @param events The list of objects to be shown on the data grid
 * @param columns The list of columns header for each object's field
 * @param fields The fields included in the exported csv file
 */
function DataGridComp({events, columns, fields}) {
  const initialHeaderFooter = 36 + 56 + 54
  const rowHeight = 52
  const [pageSize, setPageSize] = useState(5)
  const [dataGridHeight, setDataGridHeight] = useState(rowHeight*5 + initialHeaderFooter)

  // const requestSearch = (searchValue) => {
  //   setSearchText(searchValue)
  //   console.log(searchValue)
  //   const newEvents = events.filter((event) => (event.eventName.toUpperCase()).includes(searchValue.toUpperCase()))
  //   // console.log(events.filter((event) => console.log(event.eventName.includes())))
  //   setShownEvents(newEvents)
  // }

  function CustomToolbar(props) {
    return (
      <GridToolbarContainer>
        {/* <TextField 
          variant="standard"
          value={props.value}
          onChange={props.onChange}
          placeholder="Search…"
          // className={classes.textField}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
            endAdornment: (
              <IconButton
                title="Clear"
                aria-label="Clear"
                size="small"
                style={{ visibility: props.value ? 'visible' : 'hidden' }}
                onClick={props.clearSearch}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
        /> */}
        <GridToolbarFilterButton />
        <GridToolbarExport csvOptions={{ fields: fields }} />
      </GridToolbarContainer>
    );
  }

  return (
    <div>
      <DataGrid
        style={{height: `${dataGridHeight}px`, width: '100%'}}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize)=> {setPageSize(newPageSize); setDataGridHeight(newPageSize*rowHeight + initialHeaderFooter)}}
        rowsPerPageOptions={[5,10,25]}
        columns={columns}
        rows={events}
        components={{Toolbar: CustomToolbar}}
        // componentsProps = {{
        //   toolbar: {
        //     value: searchText,
        //     onChange: (event) => requestSearch(event.target.value),
        //     clearSearch: () => requestSearch(''),
        //   }
        // }}
        disableColumnSelector
      />
    </div>
  )
}

export default DataGridComp