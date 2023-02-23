const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Review, ReviewImage, sequelize } = require('../../db/models');
const { Spot,SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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
        let rating = spotRating.dataValues.avgRating
        if(!rating) spotJson.avgRating = "No reviews yet"
        else spotJson.avgRating = rating
        //previewImage
        const spotImg = await SpotImage.findOne({
            where:{
                spotId: spot.id
            },
            attributes: ['url']
        })
        let imgUrl = spotImg.dataValues.url
        if(!imgUrl) spotJson.previewImage = "No images yet"
        else spotJson.previewImage = imgUrl
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
        let rating = spotRating.dataValues.avgRating
        if(!rating) spotJson.avgRating = "No reviews yet"
        else spotJson.avgRating = rating
        //previewImage
        const spotImg = await SpotImage.findOne({
            where:{
                spotId: spot.id
            },
            attributes: ['url']
        })
        let imgUrl = spotImg.dataValues.url
        if(!imgUrl) spotJson.previewImage = "No images yet"
        else spotJson.previewImage = imgUrl
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
    if(preview==="true") preview=true
    else preview = false;

    const spot = await Spot.findByPk(spotId);
    if(!spot) {
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
    else return res.status(400).json({
        "message": "Not owner of this spot",
        "statusCode": 400
    })

}
)

//edit a spot
router.put(
    "/:spotId",
    requireAuth,
    restoreUser,
    validateSpotPost,
    async (req, res)=>{
        const userId = req.user.id;
        const{spotId} = req.params;
        const spot = await Spot.findByPk(spotId);
        console.log(spot)
        // console.log()
        // const owner = 
        // if(userId !== owner.id) {
        //     return res.status(400).json({
        //         "message": "Only owner can edit a spot",
        //         "statusCode": "400"
        //     })
        // }
        const{ address, city, state, country, lat, lng, name, description, price} = req.body;

        const spotEdited = await Spot.editAspot({spotId, address, city, state, country, lat, lng, name, description, price})

        return res.status(200).json(spotEdited)

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

        const spot = await Spot.findByPk(req.params.spotId, {include: Owner});
        let owner = spot.Owner;
        owner = owner.toJSON();
        const ownerId = owner.id;
        if(currentUserId!==ownerId){
            return res.status(400).json({
                message: "Only owner can add an image to this review",
                statusCode: 400
            })
        }
        if(!spot){
            return res.status(404).json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }

        
        await spot.destroy();

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
)






module.exports = router;