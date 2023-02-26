const express = require('express');

const { setTokenCookie, requireAuth, restoreUser,AuthErrorHandling, } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot, SpotImage } = require('../../db/models');
const { Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const isOwner = (currentUserId, imageId) => {
    const spot = SpotImage.findOne({
        where:{id:imageId},
        attributes: ['spotId']
    })
    const spotId = spot.spotId
    const owner = Spot.findOne({
        where:{id:spotId},
        attributes: ['ownerId']
    })
    const ownerId = owner.ownerId
    if(currentUserId===ownerId) return true;
    return false;
}

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
        const img = await SpotImage.findByPk(imageId);
        
        if(!img) {
            const err = new Error();
            return res.status(400).json({                
                "message": "Spot Image couldn't be found",
                "statusCode": 404
            })
        }

        //res.json("i got here1")

        //isOwner?
        const spot = await SpotImage.findOne({
                where:{id:imageId},
                attributes: ['spotId']
        })
        const spotId = spot.spotId
        const owner = await Spot.findOne({
            where:{id:spotId},
            attributes: ['ownerId']
        })
        
        const ownerId = owner.ownerId
        
        if(currentUserId!==ownerId) {
            const err = new Error();
            return res.status(403).json({
            message: 'Not owner of this spot',
            statusCode: 403
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