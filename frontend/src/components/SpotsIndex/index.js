import React from 'react';
import { Link } from 'react-router-dom'

function SpotsIndex({ spots }) {
    return (
        <div className='spots-index'>
            <h2>All Spots</h2>
            {spots.map((spot) => (
                <Link to = {`/spots${spot.id}`}>{spot.name}</Link>
            ))}
        </div>
    )
}
