import React, {useState, useEffect} from 'react';
import * as spotActions from '../../store/spot';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';

function DeleteModal () {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const ClickYes = (e) => {
        e.preventDefault();
        return dispatch(spotActions.deleteSpotThunk(id))
        .then(closeModal)
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