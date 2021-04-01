import {ADD_PLACE, DELETE_PLACE, POPULATE_LIST, UPDATE_PLACE} from './touristPlaceTypes';


export const addPlace = (place) => {
    return {
        type: ADD_PLACE,
        payload: place
    }
}

export const deletePlace = id => {
    return {
        type: DELETE_PLACE,
        payload: id
    }
}

export const populateList = places => {
    return {
        type: POPULATE_LIST,
        payload: places
    }
}

export const updatePlace  = place => {
    return {
        type: UPDATE_PLACE,
        payload: place
    }
}