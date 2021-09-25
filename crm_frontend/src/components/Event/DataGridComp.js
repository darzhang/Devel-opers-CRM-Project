import React from 'react'
import { 
  DataGrid, 
  GridToolbarContainer,
  // GridToolbarColumnsButton,
  GridToolbarFilterButton,
  // GridToolbarExport,
  // GridToolbarDensitySelector 
} from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import Button from './Button'

function DataGridComp({events, onDelete}) {
  const showDetailColumn = {
    width: 120,
    field:'showDetail',
    headerName: 'Detail',
    renderCell: (cellValues) => {
      return (
        <Link to={`/event/${cellValues.row.id}`}>
        <Button color={'blue'} text={'Detail'} onClick={null}/>
        </Link>
      );
    }
  }

  const deleteColumn = {
    width: 120,
    field:'deleteEvent',
    headerName: 'Delete',
    renderCell: (cellValues) => {
      return (
        <Tooltip title="Delete Event">
          <IconButton onClick={() => onDelete(cellValues.row.id)}>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      )
    }
  }

  const columns = [
    { field: 'eventName', headerName: 'Event Name', width: 160 },
    { field: 'startTime', headerName: 'Start Time', width: 160},
    {field: 'endTime', headerName: 'End Time', width: 160},
    // { field: 'description', headerName: 'Description', width: 180},
    { field: 'location', headerName: 'Location', width: 160},
    { field: 'participants', headerName: 'Participants', width: 160},
    // { field: 'dateAdded', headerName: 'Date Added', width: 180},
    showDetailColumn,
    deleteColumn
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  }

  return (
    <div>
      <DataGrid
          autoHeight
          autoPageSize
          columns={columns}
          rows={events}
          components={{Toolbar: CustomToolbar}}
        />
    </div>
  )
}

export default DataGridComp
