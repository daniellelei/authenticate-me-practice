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



        // const reviews = await Review.findAll({
        //     where: {userId: currentUserId},
        //     include: [
        //         {model: User, attributes: ['id', 'firstName', 'lastName']},
        //         {model: Spot, attributes:{exclude: ['createdAt', 'updatedAt']} },
        //         {model: ReviewImage, attributes:{exclude: ['createdAt', 'updatedAt', 'reviewId']}}
        //     ]
        // })

        // return res.json({
        //     Reviews: reviews
        // });

    }
)

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
        console.log(ownerId)
        //validate currentUser and review's owner
        if(currentUserId!==ownerId){
            return res.status(400).json({
                message: "Only owner can add an image to this review",
                statusCode: 400
            })
        }

        const addedImage = await ReviewImage.addImage({reviewId, url});

        return res.json(addedImage)
    }
)

router.put(
    '/:reviewId',
    requireAuth,
    restoreUser,
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
        // console.log("currentUserId", currentUserId);
        // console.log("reviewId", reviewId)
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
                message: "Only owner can add an image to this review",
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