const express = require('express');

const { setTokenCookie, requireAuth, restoreUser,AuthErrorHandling, } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot, SpotImage } = require('../../db/models');
const { Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//delete a spot image
router.delete(
    '/:imageId',
    requireAuth,
    AuthErrorHandling,
    restoreUser,

    async (req, res) => {
        const currentUserId = req.user.id;
        const {imageId} = req.params;

        //spotImage exists?
        const img = await ReviewImage.findByPk(imageId);
        console.log(img)
        if(!img) {
            const err = new Error();
            return res.status(400).json({                
                "message": "Spot Image couldn't be found",
                "statusCode": 404
            })
        }

        //isOwner?
        const review = await ReviewImage.findOne({
                where:{id:imageId},
                attributes: ['reviewId']
        })
        const reviewId = review.reviewId
        const user = await Review.findOne({
            where:{id:reviewId},
            attributes: ['userId']
        })
        
        const userId = user.userId
        
        if(currentUserId!==userId) {
            const err = new Error();
            return res.status(400).json({
            message: 'Not owner of this spot',
            statusCode: 400
        })
        }

        await img.destroy();
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })



    }
)



module.exports = router;