const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.get('/', async(req, res)=>{
    const spots = await Spot.findAll();
    return res.json(spots);
})

//Get all Spots owned by the Current User
router.get('/current', requireAuth, restoreUser, async(req, res)=>{
    const{id} = req.user;
    const user = await User.findByPk(id);

    const spotsOwnedbyCurrentUser = await user.getSpots();

    return res.json(spotsOwnedbyCurrentUser);
})

//Get details of a Spot from an id
router.get('/:spotId', async(req, res)=>{
    const {spotId} = req.params;
    const spot = await Spot.findByPk(spotId, {
        include: User
    });

    if(!spot) return res.status(404).json({
        "message": "Spot couldn't be found",
        "statusCode": 404
    })

    return res.json(spot);
})
//validateSpotPost
const validateSpotPost = [
    check('address')
    .exists({checkFalsy: true})
    .withMessage("Street address is required"),
    check('city')
    .exists({checkFalsy: true})
    .withMessage("City is required"),
    check('state')
    .exists({checkFalsy: true})
    .withMessage("State is required"),
    check('country')
    .exists({checkFalsy: true})
    .withMessage("Country is required"),
    check('lat')
    .exists({checkFalsy: true})
    .withMessage("Latitude is not valid"),
    check('lng')
    .exists({checkFalsy: true})
    .withMessage("Longitude is not valid"),
    check('name')
    .exists({checkFalsy: true})
    .withMessage("Name must be less than 50 characters"),
    check('description')
    .exists({checkFalsy: true})
    .withMessage("Description is required"),
    check('price')
    .exists({checkFalsy: true})
    .withMessage("Price per day is required"),
    handleValidationErrors
    
];


//Create a Spot
router.post('/', 
validateSpotPost,
requireAuth,
restoreUser,
async(req, res)=>{
    console.log('i passed validation');
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.id;
    const newSpot = await Spot.postAspot({ownerId, address, city, state, country, lat, lng, name, description, price});



    return res.status(201).json(newSpot);
})



module.exports = router;