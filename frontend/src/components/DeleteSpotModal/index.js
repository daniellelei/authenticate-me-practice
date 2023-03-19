import React, {useState, useEffect} from 'react';
import * as spotActions from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';


function DeleteModal ({spot}) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const history = useHistory();

    const ClickYes = async (e) => {
        e.preventDefault();
        await dispatch(spotActions.deleteSpotThunk(spot.id))
        await closeModal()
        await dispatch(spotActions.loadSpotsCurrentThunk());
        await dispatch(spotActions.loadAllSpots())
        
    }

    const ClickNo = (e) => {
        e.preventDefault();
        closeModal(); 
    }

    return (
        <div className='deleteModal'>
            <h1>Confirm Delete</h1>
            <h4>Are you sure you want to remove this spot from the listing?</h4>
            <div>
                <div className='submitDiv de'>
                    <button onClick={ClickYes}
                    className='createSubmit'
                    >Yes (Delete Spot)</button>
                </div>
                <div className='submitDiv de'>
                    <button onClick={ClickNo}
                    className='createSubmit'
                    >No (Keep Spot)</button>
                </div>
            </div>
        </div>
    )

}

export default DeleteModal;