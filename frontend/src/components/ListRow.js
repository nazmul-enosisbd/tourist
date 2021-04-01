import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style/ListPage.css'

class ListRow extends Component {
    render() {
        return (
            <tr id={this.props.place_list.id} className="content">
                <td> {this.props.place_list.name} </td>
                <td > {this.props.place_list.address} </td>
                <td > {this.props.place_list.rating} </td>
                <td className="picture"> <img src={this.props.place_list.picture} alt={this.props.place_list.name} /> </td>
                <td >
                
                    <button className="custom-btn-update" onClick={this.props.rowUpdateById} >
                        Update
                    </button> 
                
                    <button className="custom-btn-delete" onClick={this.props.rowDeleteById}>Delete</button>
                </td>
            </tr>
        );
    }
}

export default ListRow;