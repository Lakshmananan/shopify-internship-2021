import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { Router, Route } from 'react-router-dom';

import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsExports from './aws-exports';

import { createBrowserHistory as createHistory } from 'history';

import HomePage from './components/HomePage';
import UploadImage from './components/UploadImage';
import Signout from './components/Signout';

import './App.css';

Amplify.configure(awsExports);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const history = createHistory();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Router history={history}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" className={classes.title}>
              Snap
            </Typography>
            <Button href="/" color="inherit">
              Home
            </Button>
            <Button href="/uploadImage" color="inherit">
              Upload Image
            </Button>
            <Button href="/signout" color="inherit">
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
        <Route path="/" exact component={HomePage} />
        <Route path="/uploadImage" exact component={UploadImage} />
        <Route path="/signout" exact component={Signout} />
      </Router>
    </div>
  );
}

export default withAuthenticator(App);
