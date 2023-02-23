const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Review, ReviewImage, sequelize } = require('../../db/models');
const { Spot,SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//get all of the current user's bookings
router.get('/current',
requireAuth,
restoreUser,
async (req, res) =>{

    const allbookings = await Booking.findAll({
        where:{userId: req.user.id},
        include:Spot
    })
    return res.json({
        Bookings: allbookings
    })
    //need to include previewimage url

}
)


















module.exports = router;