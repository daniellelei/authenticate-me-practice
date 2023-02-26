const express = require('express');
const { Op } = require("sequelize");
const { setTokenCookie, requireAuth, restoreUser,AuthErrorHandling } = require('../../utils/auth');
const { User, Review, ReviewImage, sequelize } = require('../../db/models');
const { Spot,SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');
const router = express.Router();
////////////////////////////////////////////////////////////////////////////////

/////////////////////      Helper Function        //////////////////////////////

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


//////////////////////     Spots Endpoints        //////////////////////////////

//get all spots
const{query} = require('express-validator/check');
// const validateQuery =[
//     query('page')
//     .exists({checkFalsy: true})
//     .
//     .withMessage("Page must be greater than or equal to 1"),
//     query('size')
//     .exists({checkFalsy: true})
//     .withMessage("Size must be greater than or equal to 1"),
//     query('maxLat')
//     .withMessage("Maximum latitude is invalid"),
//     query('minLat')
//     .withMessage("Minimum latitude is invalid"),
//     query('minLng')
//     .withMessage("Minimum longitude is invalid"),
//     query('maxLng')
//     .withMessage("Maximum longitude is invalid"),
//     query('minPrice')
//     .withMessage("Minimum price must be greater than or equal to 0"),
//     query('maxPrice')
//     .withMessage("Maximum price must be greater than or equal to 0"),
//     handleValidationErrors,
//     validateErrorhandling
// ]
router.get('/', 
async(req, res)=>{
    let{page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

    let query = {
        where: {},
        include:[]
    }

    page = parseInt(page);
    size = parseInt(size);
    if(!isNaN(page)&& page < 1){
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Page must be greater than or equal to 1",
        }})
    }
    if(!isNaN(size)&& size < 1){
    return res.status(400).json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
            "size": "Size must be greater than or equal to 1",
    }})
    }


    if(!page || page < 1 || page > 10 || isNaN(page)) page = 1
    if(!size || size < 1 || size > 20 || isNaN(size)) size = 20

    query.limit = size;
    query.offset = size * (page - 1)

    //minLat
    if(minLat) {
        minLat = parseFloat(minLat);
        if(!isNaN(minLat)){
            query.where.Lat = {
                [Op.gte]: minLat
            }
        } else {
            return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "minLat": "Minimum latitude is invalid",
            }
        })
        }
        
    }
    //maxLat
    if(maxLat) {
        maxLat = parseFloat(maxLat);
        if(!isNaN(maxLat)){
            query.where.Lat = {
                [Op.lte]: maxLat
            }
        } else {
            return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {   
                "maxLat": "Maximum latitude is invalid",
            }
        })
        }
        
    }
    //minLng
    if(minLng) {
        minLng = parseFloat(minLng);
        if(!isNaN(minLng)){
            query.where.Lng = {
                [Op.gte]: minLng
            }
        } else {
            return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "minLng": "Minimum longitude is invalid",
            }
        })
        }
        
    }
    //maxLng
    if(maxLng) {
        maxLng = parseFloat(maxLng);
        if(!isNaN(maxLng)){
            query.where.Lng = {
                [Op.lte]: maxLng
            }
        }
        else {
            return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "maxLng": "Maximum longitude is invalid",
            }
        })
        }
        
    }
    //minPrice
    if(minPrice) {
        minPrice = parseFloat(minPrice);
        
        if(!isNaN(minPrice) && minPrice >= 0) {
            query.where.price = {
                [Op.gte]: minPrice
            }
        }
        else{
            return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "minPrice": "Minimum price must be greater than or equal to 0",
            }
        })
        }
        
    }
    //maxPrice
    if(maxPrice) {
        maxPrice = parseFloat(maxPrice);
        if(!isNaN(maxPrice) && maxPrice >= 0) {
            query.where.price = {
                [Op.lte]: maxPrice
            }
        } else {
            return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "maxPrice": "Maximum price must be greater than or equal to 0"
            }
        })
        }
        
    }
    
    const allspots = await Spot.findAll(query); 
    
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
        Spots: payload,
        page: page,
        size: size,
    });
})

//Get all Spots owned by the Current User
router.get('/current', 
requireAuth, 
restoreUser, 
AuthErrorHandling,
async(req, res)=>{
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
            let rating = spotRating.toJSON().avgRating
    
            spotJson.avgRating = rating;
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
            let imgUrl = spotImg.toJSON().url
            spotJson.previewImage = imgUrl
        }
        payload.push(spotJson)
    }

    return res.json({
        Spots: payload
    });

})

//Get details of a Spot from an id
router.get('/:spotId', 
async(req, res, next)=>{
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
    const spotRating = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
    })
    
    
    let rating = spotRating[0].dataValues.avgRating
    if(!rating) {
        spotJson.avgStarRating = "No reviews yet";
        spotJson.numReviews = 0;
    } else {
        spotJson.avgStarRating = rating;
        const spotReviews = await Review.count({
        where:{
            spotId: spot.id
        }
        })
        spotJson.numReviews = spotReviews;
    }
    return res.json(spotJson);
})

/////// Posting a spot =========================================

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
    .withMessage("Name is required")
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

//Create a Spot
router.post('/', 
requireAuth,
restoreUser,
AuthErrorHandling,
validateSpotPost,
validateErrorhandling,
async(req, res)=>{
    
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.id;
    const newSpot = await Spot.postAspot({ownerId, address, city, state, country, lat, lng, name, description, price});
    return res.status(201).json(newSpot);
})

//Add an Image to a Spot based on the Spot's id
const validateImagePost = [
    check("url")
    .exists({checkFalsy: true})
    .withMessage("url is required"),
    check("preview")
    .exists({checkFalsy: true})
    .withMessage("preview status is required"),
    handleValidationErrors,
    validateErrorhandling,
    
]
router.post('/:spotId/images',
requireAuth,
AuthErrorHandling,
restoreUser,
validateImagePost,
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
       
        const newImage = await SpotImage.addAnImage({spotId, url, preview});
       
        return res.status(200).json(newImage);
    }
    else {
        const err = new Error(`Not owner of this spot`);
        err.status = 403;
        return res.status(400).json({
        "message": "Forbidden: Not owner of this spot",
        "statusCode": 403
        
    })
}

}
)

//edit a spot
router.put(
    "/:spotId",
    requireAuth,
    AuthErrorHandling,
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
        err.status = 403;
        return res.status(403).json({
        "message": "Forbidden: Not owner of this spot",
        "statusCode": 403
    })
}
}
)

//delete a spot 
router.delete(
    '/:spotId',
    requireAuth,
    AuthErrorHandling,
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
            err.status = 403;
            return res.status(403).json({
                message: "Forbidden: Only owner can remove this spot",
                statusCode: 403
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

//////////////////////         spots/review        /////////////////////////////


const checkReviewPost =[
    check('review')
    .exists({checkFalsy: true})
    .withMessage("Review text is required"),
    check('stars')
    .exists({checkFalsy: true})
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors,
    validateErrorhandling,
];
//Create a Review for a Spot based on the Spot's id
router.post(
    '/:spotId/reviews',
    requireAuth,
    restoreUser,
    AuthErrorHandling,
    checkReviewPost,
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
        //Error response: Review from the current user already exists for the Spot
        const allReviews = await Review.findAll({
            where:{spotId: spotId},
            attributes:['userId']
        }) 
        for(let i = 0; i < allReviews.length; i++){
            let review = allReviews[i];
            let reviewUserId = review.userId;
            
            if(userId === reviewUserId) {
                return res.status(403).json({
                    "message": "User already has a review for this spot",
                    "statusCode": 403
                })
            }
        }

        const newReview = await Review.addReview({userId, spotId, review, stars});
        res.status(201).json(newReview)
    }
);


///////////////////////       Spots/Booking      ///////////////////////////////
//get all bookings for a spot based on the spotId
router.get(
    '/:spotId/bookings',
    requireAuth,
    AuthErrorHandling,
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
        if(!allbookings.length){
            return res.json({
                "message": "There is no booking at this spot yet."
            })
        }
            return res.status(200).json({
                Bookings: allbookings
            })
        }
        // if it is not owner
        const allbookings = await Booking.findAll({
            where:{spotId: req.params.spotId},
            attributes:['id','spotId', 'startDate', 'endDate']
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
    AuthErrorHandling,
    restoreUser,
    validateBookingPost,
    validateErrorhandling,
    async (req, res)=>{
        
        const {spotId} = req.params

        //spot found?
        const spot = await Spot.findByPk(spotId)
        
        if(!spot) {
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
            return res.status(403).json({
                "message": 'Forbidden: Owners are not able to make booking with their spots',
                "statusCode": 403
            })
        }
        
        //is endDate on/before startDate
        const{startDate, endDate} = req.body;
        let newStart = new Date(startDate);
        let newEnd = new Date(endDate);
        
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

        //is startDate in the past?
        let currentDate = new Date();
        if(newStart.getTime() <= currentDate.getTime()){
            const err = new Error();
            return res.status(400).json({
                "message": "start date cannot be in the past",
                "statusCode": 400
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