const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Review, ReviewImage, sequelize } = require('../../db/models');
const { Spot,SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');

const router = express.Router();

//get all spots
router.get('/', async(req, res)=>{
    const allspots = await Spot.findAll(); 
    
    let payload = []
    for(let i = 0; i < allspots.length; i++) {
        const spot = allspots[i];
        let spotJson = spot.toJSON()
        //avgRating
        const spotRating = await Review.findOne({
            where: {
                spotId: spot.id
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
        })
        if(!spotRating || spotRating === undefined) spotJson.avgRating = "No reviews yet"
        else {
            let rating = spotRating.dataValues.avgRating
            spotJson.avgRating = rating
        }
        //previewImage
        const spotImg = await SpotImage.findOne({
            where:{
                spotId: spot.id
            },
            attributes: ['url']
        })
        if(!spotImg) spotJson.previewImage = "No images yet"
        else{
            let imgUrl = spotImg.dataValues.url
            spotJson.previewImage = imgUrl
        }
        payload.push(spotJson)    
    }

    return res.json({
        Spots: payload
    });
})

//Get all Spots owned by the Current User
router.get('/current', requireAuth, restoreUser, async(req, res)=>{
    const{id} = req.user;
    const user = await User.findByPk(id);
    const allspots = await user.getSpots();
    if(!allspots.length){
        return res.json({
            message: "No spots posted yet"
        })
    }
    let payload = []
    for(let i = 0; i < allspots.length; i++) {
        const spot = allspots[i];
        let spotJson = spot.toJSON()
        //avgRating
        const spotRating = await Review.findOne({
            where: {
                spotId: spot.id
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
        })
        if(!spotRating) spotJson.avgRating = "No reviews yet"
        else {
            let rating = spotRating.dataValues.avgRating
            spotJson.avgRating = rating
        } 
        
        //previewImage
        const spotImg = await SpotImage.findOne({
            where:{
                spotId: spot.id
            },
            attributes: ['url']
        })
        if(!spotImg) spotJson.previewImage = "No images yet"
        else{
            let imgUrl = spotImg.dataValues.url
            spotJson.previewImage = imgUrl
        }
        payload.push(spotJson)
    }

    return res.json({
        Spots: payload
    });

})

//Get details of a Spot from an id
router.get('/:spotId', async(req, res, next)=>{
    const {spotId} = req.params;
    const spot = await Spot.findByPk(spotId, {
        include: [
                    {model: SpotImage, as: "SpotImages"},
                    {model: User, as: "Owner"},
                ]
    });

    if(!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    let spotJson = spot.toJSON();
    const spotRating = await Review.findOne({
            where: {
                spotId: spot.id
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
        })
        let rating = spotRating.dataValues.avgRating
        if(!rating) spotJson.avgStarRating = "No reviews yet"
        else spotJson.avgStarRating = rating

    return res.json(spotJson);
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
    .isNumeric({checkFalsy: true})
    .withMessage("Latitude is not valid"),
    check('lng')
    .exists({checkFalsy: true})
    .isNumeric({checkFalsy: true})
    .withMessage("Longitude is not valid"),
    check('name')
    .exists({checkFalsy: true})
    .isLength({max: 50})
    .withMessage("Name must be less than 50 characters"),
    check('description')
    .exists({checkFalsy: true})
    .withMessage("Description is required"),
    check('price')
    .exists({checkFalsy: true})
    .isNumeric({checkFalsy: true})
    .withMessage("Price per day is required"),
    handleValidationErrors
    
];

const validateErrorhandling = (err, req, res, next)=>{
  if(err){
    res.status(err.status)
    return res.json({
      message: err.message,
      statusCode: err.status,
      errors: err.errors
    })
  }

  next();
}
//Create a Spot
router.post('/', 
requireAuth,
restoreUser,
validateSpotPost,
validateErrorhandling,
async(req, res)=>{
    console.log('i passed validation');
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.id;
    const newSpot = await Spot.postAspot({ownerId, address, city, state, country, lat, lng, name, description, price});
    return res.status(201).json(newSpot);
})

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images',
requireAuth,
restoreUser,
async(req, res)=>{
    const {spotId} = req.params
    const {id} = req.user
    
    let {url, preview} = req.body
    if(preview===true) preview=true
    else preview = false;

    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        const err = new Error(`Spot couldn't be found`);
        err.status = 404;
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    if(id === spot.ownerId){
        console.log("spotId", spotId);
        console.log("url", url);
        console.log("preview", preview);
        const newImage = await SpotImage.addAnImage({spotId, url, preview});
        console.log('i added an image.')
        return res.status(200).json(newImage);
    }
    else {
        const err = new Error(`Not owner of this spot`);
        err.status = 400;
        return res.status(400).json({
        "message": "Not owner of this spot",
        "statusCode": 400
        
    })
}

}
)

//edit a spot
router.put(
    "/:spotId",
    requireAuth,
    restoreUser,
    validateSpotPost,
    validateErrorhandling,
    async (req, res)=>{
    const {spotId} = req.params
    const {id} = req.user
    const{ address, city, state, country, lat, lng, name, description, price} = req.body;

    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        const err = new Error(`Spot couldn't be found`);
        err.status = 404;
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    if(id === spot.ownerId){
        const spotEdited = await Spot.editAspot({spotId, address, city, state, country, lat, lng, name, description, price});
        return res.status(200).json(spotEdited);
    }
    else {
        const err = new Error(`Not owner of this spot`);
        err.status = 400;
        return res.status(400).json({
        "message": "Not owner of this spot",
        "statusCode": 400
    })
}
}
)

//delete a spot --still cannot delete due to foreign key constraints error
router.delete(
    '/:spotId',
    requireAuth,
    restoreUser,
    async (req, res) =>{
        //check owner
        const currentUserId = req.user.id;
        const{spotId} = req.params;

        const spot = await Spot.findByPk(spotId, {attributes:['ownerId']});
        
        if(!spot){
            const err = new Error(`Spot couldn't be found`);
            err.status = 404;
            return res.status(404).json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
        

        let ownerID = spot.dataValues.ownerId
        if(currentUserId!==ownerID){
            const err = new Error(`Only the owner can add an image to this review`);
            err.status = 400;
            return res.status(400).json({
                message: "Only owner can add an image to this review",
                statusCode: 400
            })
        }
        const deleteSpot = await Spot.findByPk(spotId);
        await deleteSpot.destroy();

        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
)
//Get all Reviews by a Spot's id
router.get(
    '/:spotId/reviews',
    async (req, res) =>{
        const {spotId} = req.params;
        const spot  = await Spot.findByPk(spotId);
        if(!spot){
            return res.status(404).json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }

        const reviews = await Review.findAll({
            where: {spotId: spotId},
            include:[
                {model: User, attributes:['id', 'firstName', 'lastName']},
                {model: ReviewImage, attributes:{exclude: ['createdAt', 'updatedAt', 'reviewId']}}
            ]
        })

        return res.json({
            Reviews: reviews
        })

    }

)
//Create a Review for a Spot based on the Spot's id
const checkReviewPost =[
    check('review')
    .exists({checkFalsy: true})
    .withMessage("Review text is required"),
    check('stars')
    .exists({checkFalsy: true})
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

router.post(
    '/:spotId/reviews',
    checkReviewPost,
    requireAuth,
    restoreUser,
    
    async (req, res) =>{
        const{review, stars} = req.body;
        const userId = req.user.id;
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);
        if(!spot){
            return res.status(404).json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }

        const newReview = await Review.addReview({userId, spotId, review, stars});
        res.status(201).json(newReview)

    }
);

//get all bookings for a spot based on the spotId
router.get(
    '/:spotId/bookings',
    requireAuth,
    restoreUser,
    async (req, res) =>{
        //find this spot
        const spot = await Spot.findByPk(req.params.spotId)
        if(!spot) {
            const err = new Error();
            return res.status(404).json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }

        //if it is the owner
        
        const currentUser = req.user.id;
        let owner = await Spot.findByPk(req.params.spotId, {
            attributes:['ownerId']
        })
        let ownerJson = owner.toJSON();
        let ownerId = ownerJson.ownerId;
        if(currentUser === ownerId){
            //find all bookings of this spot
            const allbookings = await Booking.findAll({
            where:{spotId: req.params.spotId},
            include:{model:User, attributes:['id', 'firstName', 'lastName']},
            attributes:['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
        })
            return res.status(200).json({
                Bookings: allbookings
            })
        }
        // if it is not owner
        const allbookings = await Booking.findAll({
            where:{spotId: req.params.spotId},
            attributes:['spotId', 'startDate', 'endDate']
        })
        return res.status(200).json({
            Bookings: allbookings
        })
    }
)


const validateBookingPost = [
    check('startDate')
    .exists({checkFalsy: true}),
    check('endDate')
    .exists({checkFalsy: true}),
    handleValidationErrors
]
//Create a Booking from a Spot based on the Spot's id
router.post(
    '/:spotId/bookings',
    requireAuth,
    restoreUser,
    validateBookingPost,
    validateErrorhandling,
    async (req, res)=>{
        
        const {spotId} = req.params

        //spot found?
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            const err = new Error();
            err.status(404);
            return res.status(404).json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }

        //isOwner?
        const userId = req.user.id
        let owner = await Spot.findByPk(spotId, {
            attributes:['ownerId']
        })
        let ownerJson = owner.toJSON();
        let ownerId = ownerJson.ownerId;
        if(userId===ownerId) {
            return res.status(400).json({
                "message": 'Hi Owner',
                "statusCode": 400
            })
        }
        
        //is endDate on/before startDate
        const{startDate, endDate} = req.body;
        let newStart = new Date(startDate);
        let newEnd = new Date(endDate);
        console.log(newStart, newEnd)
        let isStartDateSmaller = false;
        if(newStart.getTime()<newEnd.getTime()) {
            isStartDateSmaller = true;
        }
        if(!isStartDateSmaller) {
            const err = new Error();
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                    "endDate": "endDate cannot be on or before startDate"
                }
            })
        }

        //is conflict
        //newStart, newEnd
        const allbookings = await Booking.findAll({
            where: {spotId: spotId},
            attributes: ['startDate', 'endDate']
        })

        for(let i = 0; i < allbookings.length; i++){
            let existedBooking = allbookings[i];
            let existedBookingJson = existedBooking.toJSON();
            let existedStart = existedBookingJson.startDate;
            let existedEnd = existedBookingJson.endDate;
            let newExistedStart = new Date(existedStart);
            let newExistedEnd = new Date(existedEnd);
            if(newStart.getTime() < newExistedStart.getTime()){
                if(newEnd.getTime()>newExistedStart.getTime()){
                    const err = new Error();
                    return res.status(403).json(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                "endDate": "End date conflicts with an existing booking"
                            }
                            }
                    )
                }
            }
            if(newStart.getTime() === newExistedStart.getTime()){
                const err = new Error();
                    return res.status(403).json(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                "endDate": "End date conflicts with an existing booking"
                            }
                            }
                    )
            }
            if(newStart.getTime() > newExistedStart.getTime()) {
                if(newStart.getTime()<newExistedEnd.getTime()){
                    const err = new Error();
                    return res.status(403).json(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                "endDate": "End date conflicts with an existing booking"
                            }
                            }
                    )
                }
            }

        }
        //not owner => post booking
        //no error, then create new booking
        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate
        })
        return res.status(200).json(newBooking)
    }
)




module.exports = router;