const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot,SpotImage } = require('../../db/models');
const { Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get(
    '/current',
    requireAuth,
    restoreUser,
    async(req, res)=>{
        const currentUserId = req.user.id;
        const allspots = await Review.findAll({
            where: {userId: currentUserId},
            //attributes: ['spotId']
        })
        let payload = []
        for (let i = 0; i < allspots.length; i++){
            const spot = allspots[i];
            let spotJson = spot.toJSON();
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
        res.json(payload)

    const userId = req.user.id;

    const allbookings = await Booking.findAll({
        where:{userId: userId},
        attributes:['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        include:Spot
    })
    if(!allbookings.length){
        return res.status(404).json({
            "message": "You don't have a booking yet",
            "statusCode": 404
        })
    }
    const spots = [];
    for(let b of allbookings){
        let s = b.Spot;
        spots.push(s)
    }

    const findPreview = spot => {
        const img = SpotImage.findAll({
             where: {
                spotId: spot.id,
                preview: true
            },
        })
        if(img.length) return true;
        return false
    }

    const findUrl = spot =>{
        const spotImg = SpotImage.findOne({
        where:{
            spotId: spot.id
        },
        attributes:['url']
        })
        return spotImg.dataValues.url
    }
    
    // const SpotsWithPreviewImg = spots.reduce((acc, spot) => [
    //     ...acc,
    //     {
    //         ...spot,
    //         previewImage: findPreview(spot) 
    //         ? findUrl(spot)
    //         : "No preview image yet"
    //     }
    // ], [])

    for(let b = 0; b < allbookings.length; b++){
        let spot = spots[b]
        if(findPreview(spot)){
            allbookings[b].dataValues.Spot.dataValues.preiewImage = findUrl(spot)
        }

        allbookings[b].dataValues.Spot.dataValues.preiewImage = "No preview image yet"
    }
    return res.json({
        Bookings: allbookings
       
    })

    }
)

//Add an Image to a Review based on the Review's id
router.post(
    '/:reviewId/images',
    requireAuth,
    restoreUser,
    async(req, res) => {
        const currentUserId = req.user.id;
        const reviewId = req.params.reviewId;
        const {url} = req.body;

        //find owner of review
        const review = await Review.findByPk(reviewId)
        if(!review) {
            //need to generate new error
            return res.status(404).json({
                "message": "Review couldn't be found",
                "statusCode": 404
            })
        }
        let owner = await review.getUser();
        owner = owner.toJSON();
        const ownerId = owner.id
        
        //validate currentUser and review's owner
        if(currentUserId!==ownerId){
            return res.status(400).json({
                message: "Only owner can add an image to this review",
                statusCode: 400
            })
        }

        //Error response: Cannot add any more images because 
        //there is a maximum of 10 images per resource
        const allreviewImgs = await ReviewImage.findAll({
            where:{reviewId: reviewId}
        })
        if(allreviewImgs.length===10){
            return res.status(400).json({
                "message": "Maximum number of images for this resource was reached",
                "statusCode": 403
            })
        }

        const addedImage = await ReviewImage.addImage({reviewId, url});
        return res.status(200).json(addedImage)
    }
)

const checkReviewPost =[
    check('review')
    .exists({checkFalsy: true})
    .withMessage("Review text is required"),
    check('stars')
    .exists({checkFalsy: true})
    .withMessage("Stars must be an integer from 1 to 5"),
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

//Edit a Review
router.put(
    '/:reviewId',
    requireAuth,
    restoreUser,
    checkReviewPost,
    validateErrorhandling,
    async (req, res) =>{
        const currentUserId = req.user.id;
        const reviewId = req.params.reviewId;
        const {review, stars} = req.body;

        //find owner of review
        const review1 = await Review.findByPk(reviewId)
        if(!review1) {
            //need to generate new error
            return res.status(404).json({
                "message": "Review couldn't be found",
                "statusCode": 404
            })
        }
        let owner = await review1.getUser();
        owner = owner.toJSON();
        const ownerId = owner.id
        //console.log(ownerId)
        //validate currentUser and review's owner
        if(currentUserId!==ownerId){
            return res.status(400).json({
                message: "Only owner can add an image to this review",
                statusCode: 400
            })
        }

        let spot = await review1.getSpot();
        spot = spot.toJSON();
        const spotId = spot.id

        const reviewEdited = await Review.editReview({reviewId, spotId, ownerId, review, stars})

        return res.status(200).json(reviewEdited);

    }
)

router.delete(
    '/:reviewId',
    requireAuth,
    restoreUser,
    async (req, res) => {
        const currentUserId = req.user.id;
        const reviewId = req.params.reviewId;
        
        //find owner of review
        const review1 = await Review.findByPk(reviewId, {include: User})
        //console.log("currentUserId", currentUserId);
        if(!review1) {
            //need to generate new error
            return res.status(404).json({
                "message": "Review couldn't be found",
                "statusCode": 404
            })
        }
        let owner = review1.User;
        
        owner = owner.toJSON();
        const ownerId = owner.id
        //console.log(ownerId)
        //validate currentUser and review's owner
        if(currentUserId!==ownerId){
            return res.status(400).json({
                message: "Not authorized to delete this review",
                statusCode: 400
            })
        }

        await review1.destroy();

        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
)



module.exports = router;