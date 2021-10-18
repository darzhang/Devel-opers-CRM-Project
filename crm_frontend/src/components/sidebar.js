import React from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LanguageIcon from '@mui/icons-material/Language';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function SideBar() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  
  const history = useHistory();
  function redirectHome() {
    history.push('/');
  }
  function redirectProfile() {
    history.push('/profile');
  }
  function redirectContact() {
    history.push('/contact');
  }
  function redirectEvent() {
    history.push('/event');
  }
  function redirectCalendar() {
    history.push('/calendar');
  }
  function redirectOrganisation() {
    history.push('/organisation');
  }
  function redirectLogout() {
    Swal.fire({
      title: `Do You Want to Logout?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout',
      showClass: {
        icon: ''
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios.post('http://localhost:5000/logout', {}, {withCredentials: true});
        sessionStorage.setItem("isAuthenticated", "false")
        history.push('/login');
      }
    });
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="sticky"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Personal CRM
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button key={'Profile'} onClick={redirectProfile}>
                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                <ListItemText primary={'Profile'} />
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem button key={'Home'} onClick={redirectHome}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary={'Home'} />
            </ListItem>
        </List>
        <List>
            <ListItem button key={'Contacts'} onClick={redirectContact}>
                <ListItemIcon><PeopleAltIcon /></ListItemIcon>
                <ListItemText primary={'Contacts'} />
            </ListItem>
        </List>
        <List>
            <ListItem button key={'Events'} onClick={redirectEvent}>
                <ListItemIcon><ScheduleIcon /></ListItemIcon>
                <ListItemText primary={'Events'} />
            </ListItem>
        </List>
        <List>
            <ListItem button key={'Calendar'} onClick={redirectCalendar}>
                <ListItemIcon><DateRangeIcon /></ListItemIcon>
                <ListItemText primary={'Calendar'} />
            </ListItem>
        </List>
        <List>
            <ListItem button key={'Organisation'} onClick={redirectOrganisation}>
                <ListItemIcon><LanguageIcon /></ListItemIcon>
                <ListItemText primary={'Organisation'} />
            </ListItem>
        </List> 
        <List>
            <ListItem button key={'Logout'} onClick={redirectLogout}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary={'Logout'} />
            </ListItem>
        </List> 
      </Drawer>
    </div>
  );
}