import React, { Component } from 'react';
import {Col, Form, Row, Table, Button} from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import {FaSort, FaSortUp, FaSortDown} from 'react-icons/fa';
import {connect} from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style/ListPage.css'
import { deletePlace, populateList, updatePlace } from '../redux';
import ListRow from './ListRow'

class ListPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            sort_state: 0,
            search_box_value: "",
            update_page: false
        };
    }

    componentDidMount() {
        fetch('http://127.0.0.1:8000/api/places/')
            .then(res => res.json())
            .then(
                result => {
                    console.log(result)
                    this.props.populateList(result)
                },
                error => {
                    console.log(error)
                }
            )
    }

    sort_asc() {
        let sorted = [...this.props.place_list]
        sorted.sort(function(a, b) {
            return a.rating - b.rating;
        });
        return sorted;
    }
    sort_desc() {
        let sorted = [...this.props.place_list]
        sorted.sort(function(a, b) {
            return b.rating - a.rating;
        });
        return sorted;
    }
    sort() {
        switch (this.state.sort_state) {
            case 0:
                return this.props.place_list;
            case 1:
                return this.sort_asc();
            case 2:
                return this.sort_desc();
            default:
                return this.props.place_list;
        }
    }
    sortAction = () => {
        this.setState({
            sort_state: ((this.state.sort_state+1)%3)
        })
    }

    rowDeleteById = async event => {
        console.log(event.target.parentNode.parentNode);
        const id = event.target.parentNode.parentNode.id;

        this.props.deletePlace(id);
        await fetch(`http://127.0.0.1:8000/api/places/${id}/`, {method:'DELETE'})
            .then(() => {
                console.log('successfully deleted')
            })
    }

    rowUpdateById = async event => {
        const id = event.target.parentNode.parentNode.id
        let place = {}
        await fetch(`http://127.0.0.1:8000/api/places/${id}/`, {method:'GET'})
            .then((response) => response.json())
            .then(data => {
                console.log(data)
                place = data
            })
        this.props.updatePlace(place)
        console.log(place)
        this.setState({update_page: true})
    }

    showListView(place_list) {
        let tbody = [];
        for (let i = 0; i < place_list.length; i++) {
            let row = <ListRow place_list={place_list[i]} rowUpdateById={this.rowUpdateById} rowDeleteById={this.rowDeleteById} key={i} />
    
            tbody.push(row)
        }
        return tbody;
    }

    showSearch() {
        if(this.state.search_box_value === "" || this.state.search_box_value === null){
            return this.props.place_list;
        }
        let new_list = [];

        for(var i = 0; i < this.props.place_list.length; i++) {
            if(this.props.place_list[i].name.search(new RegExp(this.state.search_box_value, 'i')) !== -1) {
                new_list.push(this.props.place_list[i]);
            }
        }
        return new_list;
    }

    handleSearchBoxChange = event => {
        this.setState({
            ...this.state,
            search_box_value: event.target.value
        });
    }
     
    render() {
        let sortIcon = <FaSort style={{marginLeft: "5px"}} />;
        if(this.state.sort_state === 1) {
            sortIcon = <FaSortUp style={{marginLeft: "5px"}} />
        } else if(this.state.sort_state === 2) {
            sortIcon = <FaSortDown style={{marginLeft: "5px"}} />
        }else {
            sortIcon = <FaSort style={{marginLeft: "5px"}} />
        }
        let test = this.state.update_page ? <Redirect to='/update' /> : ""
        return (
            <>
                <Form.Group>
                        <Row className='test'>
                            <Col>
                                <Form.Control id="search-box" size="lg" type="text" onChange={this.handleSearchBoxChange} placeholder="Enter Name to Search" bsPrefix="custom-input" required />
                            </Col>
                        </Row>
                </Form.Group>
                <br/>
                <div className="main">
                <Table bordered hover >
                    <thead className="header">
                        <tr style={{textAlign: "center"}}>
                            <th>NAME</th>
                            <th>ADDRESS</th>
                            <th onClick={this.sortAction}>
                                RATING
                                {sortIcon}
                            </th>
                            <th>PICTURE</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody >
                        {this.showListView(this.showSearch(this.sort()))}
                    </tbody>
                </Table>
                </div>
                <Link to="/create"><Button bsPrefix="custom-btn">Create New Tourist Place</Button></Link>
                {test}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        place_list: state.place_list
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updatePlace: place => dispatch(updatePlace(place)),
        deletePlace: (id) => dispatch(deletePlace(id)),
        populateList: places => dispatch(populateList(places))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPage);