import React, {useState, useEffect} from 'react';
import * as spotActions from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';


function DeleteModal ({spot}) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const history = useHistory();

    const ClickYes = (e) => {
        e.preventDefault();
        dispatch(spotActions.deleteSpotThunk(spot.id))
        closeModal()
        history.push('/spots/current');
    }

    const ClickNo = (e) => {
        e.preventDefault();
        closeModal(); 
    }

    return (
        <div>
            <h1>Confirm Delete</h1>
            <h4>Are you sure you want to remove this spot from the listing?</h4>
            <div>
                <button onClick={ClickYes}>Yes (Delete Spot)</button>
                <button onClick={ClickNo}>No (Keep Spot)</button>
            </div>
        </div>
    )

}

export default DeleteModal;