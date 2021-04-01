import React, { Component } from 'react';
import CreatePage from './CreatePage';
import ListPage from './ListPage';
import UpdatePage from './UpdatePage'

import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import { connect } from 'react-redux';


class TouristApp extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <ListPage />
                    </Route>
                    <Route exact path='/create'>
                        <CreatePage />
                    </Route>
                    <Route exact path='/update'>
                        <UpdatePage inputs={this.props.inputs} />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        inputs: state.inputs
    }
}

// export default TouristApp;
export default connect(mapStateToProps, null)(TouristApp)