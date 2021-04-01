import React, { Component } from 'react';
import {Form,Row, Col, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style/CreatePage.css';
import { addPlace } from '../redux';

class UpdatePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputs: {
                name: this.props.inputs.name,
                address: this.props.inputs.address,
                rating: this.props.inputs.rating,
                type: "beach",
                picture: this.dataURLtoFile(this.props.inputs.picture, 'input.png'),
            },
            typeList: ["Beach", "Hills", "Fountain", "Landmark"],
        }
        
    }

    validateInputs() {
        var name = document.getElementById('name').value;
        var address = document.getElementById('address').value;
        var rating = document.getElementById('rating').value;
        var type = document.getElementById('type').value;
        var picture = document.getElementById('picture').files;

        if(name === "") {
            alert("Name must be filled out");
            return false;
        }
        if(address === "") {
            alert("Address must be filled out");
            return false;
        }
        if(rating === "" || parseInt(rating) < 1 || parseInt(rating) > 5) {
            alert("Rating must be between 1 and 5");
            return false;
        }

        var types = {
            BEACH : 0,
            HILLS : 1,
            FOUNTAIN : 2,
            LANDMARK : 3
        };

        if(!(type.toUpperCase() in types)) {
            alert("Type must be Beach/Hills/Fountain/Landmark");
            return false;
        }

        if(picture.length < 1) {
            alert("Picture fiels is empty");
            return false;
        }

        return true;
    }

    convertBase64ToFile = async function (image) {
        const byteString = atob(image.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
          ia[i] = byteString.charCodeAt(i);
        }
        const newBlob = new Blob([ab], {
          type: 'image/jpeg',
        });
        return newBlob;
    };

    dataURLtoFile = async (dataurl, filename) => {
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    handleReset = event => {
        [ "type", "name", "address", "rating"].map( id =>
            document.getElementById(id).value = null  
        );
        document.getElementById('picture').value = null;

        this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                name: null, address: null, rating: null, type: null, picture: null
            }
        });
    }

    handleSubmit = async event => {
        if(!this.validateInputs()){
            return;
        }
        const base_string = await this.toBase64(this.state.inputs.picture);
        const place = {
            id: this.props.id,
            name: this.state.inputs.name,
            address: this.state.inputs.address,
            rating: this.state.inputs.rating,
            type: this.state.inputs.type,
            picture: base_string
        }

        // this.props.addPlace(place);

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: place.name,
                address: place.address,
                rating: place.rating,
                type_id: 2,
                picture: place.picture
            })
        };
        await fetch(`http://127.0.0.1:8000/api/places/${this.props.inputs.id}/`, requestOptions)
            .then(response => {
                response.json()
                console.log(response)
            })
            .then(data => console.log(data));

        this.handleReset(this);
    }

    handleInputChange = event => {
        let {id, value} = event.target;
        if(id === 'picture') {
            this.setState({
                ...this.state,
                inputs: {
                    ...this.state.inputs,
                    picture: event.target.files[0]
                }
            });
            return;
        }

        this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                [id]: value
            }
        });
    }

    createOptinos = () => 
        this.state.typeList.length 
        ? this.state.typeList.map(data => 
            <option key={data}>{data}</option>
        )
        : "";

    render() {
        return (
            <div className="centered-wrapper">
                <h2 style={{textAlign: "center"}}> Add a New Tourist Place </h2>
                <br /> <br />
                <Form.Group id="test-form">
                    <Row>
                        <Form.Label column="lg" lg={3}>
                            Name:
                        </Form.Label>
                        <Col>
                            <Form.Control id="name" value={this.state.inputs.name} contentEditable size="lg" type="text" bsPrefix="custom-input" onChange={this.handleInputChange} required />
                        </Col>
                    </Row>
                    <br /> <br />
                    <Row>
                        <Form.Label column="lg" lg={3}>
                            Address:
                        </Form.Label>
                        <Col>
                            <Form.Control id="address" value={this.state.inputs.address} contentEditable size="lg" type="text" bsPrefix="custom-input" onChange={this.handleInputChange} required />
                        </Col>
                    </Row>
                    <br /> <br />
                    <Row>
                        <Form.Label column="lg" lg={3}>
                            Rating:
                        </Form.Label>
                        <Col>
                            <Form.Control id="rating" value={this.state.inputs.rating} contentEditable size="lg" type="number" min="1" max="5" bsPrefix="custom-input" onChange={this.handleInputChange} required />
                        </Col>
                    </Row>
                    <br /> <br />
                    <Row>
                        <Form.Label column="lg" lg={3}>
                            Type:
                        </Form.Label>
                        <Col>
                            <Form.Control id="type" value={this.state.inputs.type} contentEditable size="lg" as="select" bsPrefix="custom-input" onChange={this.handleInputChange} required>
                                {this.createOptinos()}
                            </Form.Control>
                        </Col>
                    </Row>
                    <br /> <br />
                    <Row>
                        <Form.Label column="lg" lg={3}>
                            Picture:
                        </Form.Label>
                        <Col>
                            <Form.Control id="picture" size="lg" type="file" accept="image/*" bsPrefix="custom-input" onChange={this.handleInputChange} required />
                        </Col>
                    </Row>
                    <br />
                    <Button bsPrefix="custom-btn-reset" onClick={this.handleReset}> Reset </Button>
                    <Button bsPrefix="custom-btn-submit" onClick={this.handleSubmit}> Update </Button>
                    <br />
                    <Link to='/'><p className="back-link">Back to Tourist Place List</p> </Link>
                </Form.Group>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        id: state.id,
        //inputs: state.inputs
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addPlace: (place) => dispatch(addPlace(place))
    }
}

//export default CreatePage;
export default connect(mapStateToProps, mapDispatchToProps)(UpdatePage)