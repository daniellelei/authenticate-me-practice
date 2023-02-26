const express = require('express');

const { setTokenCookie, requireAuth, restoreUser, AuthErrorHandling, } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot,SpotImage } = require('../../db/models');
const { Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get(
    '/current',
    requireAuth,
    AuthErrorHandling,
    restoreUser,
    async(req, res)=>{
    const userId = req.user.id;

    const allreviews = await Review.findAll({
        where:{userId: userId},
        attributes:['id', 'spotId', 'userId', 'review', 'stars', 'createdAt', 'updatedAt'],
        include:[
            {model: User, attributes:['id', 'firstName', 'lastName']},
            {model:Spot, attributes:{exclude: ['createdAt', 'updatedAt']}}, 
            {model:ReviewImage, attributes:['id', 'url']}
        ]
    })
    if(!allreviews.length){
        return res.status(404).json({
            "message": "You have not posted a review yet",
            "statusCode": 404
        })
    }
    const spots = [];
    for(let b of allreviews){
        let s = b.Spot;
        spots.push(s)
    }

    for(let b = 0; b < allreviews.length; b++){
        let spot = spots[b];
        let img = await SpotImage.findAll({
            where: {
                spotId: spot.id,
                preview: true
            },
            attributes:['url']
        })
        
        let imgJson = img[0].toJSON();
        let imgUrl = imgJson.url
        
        if(!img.length){
            allreviews[b].dataValues.Spot.dataValues.preiewImage = "No preview image yet"
        }
        allreviews[b].dataValues.Spot.dataValues.preiewImage = imgUrl
    }
    return res.json({
        Reviews: allreviews
    })

    }
)

//Add an Image to a Review based on the Review's id
router.post(
    '/:reviewId/images',
    requireAuth,
    AuthErrorHandling,
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
            return res.status(403).json({
                message: "Forbidden: Only owner can add an image to this review",
                statusCode: 403
            })
        }

        //Error response: Cannot add any more images because 
        //there is a maximum of 10 images per resource
        const allreviewImgs = await ReviewImage.findAll({
            where:{reviewId: reviewId}
        })
        if(allreviewImgs.length===10){
            return res.status(403).json({
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
    AuthErrorHandling,
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
        
        //validate currentUser and review's owner
        if(currentUserId!==ownerId){
            return res.status(403).json({
                message: "Forbidden: Only owner can add an image to this review",
                statusCode: 403
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
    AuthErrorHandling,
    restoreUser,
    async (req, res) => {
        const currentUserId = req.user.id;
        const reviewId = req.params.reviewId;
        
        //find owner of review
        const review1 = await Review.findByPk(reviewId, {include: User})
        
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
        
        //validate currentUser and review's owner
        if(currentUserId!==ownerId){
            return res.status(403).json({
                message: "Forbidden: Not authorized to delete this review",
                statusCode: 403
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