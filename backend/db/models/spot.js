'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User,
        {foreignKey: "ownerId"
        , as: "Owner"
      }
      )

      Spot.hasMany(
        models.SpotImage,
        {
          foreignKey: 'spotId', 
        //as: "previewImage", as: "SpotImages"
        }
      )

      Spot.hasMany(
        models.Review,
        {foreignKey: 'spotId'}

      )

      Spot.belongsToMany(
        models.User,
        {through: models.Booking}
      )

      Spot.hasMany(
        models.Booking,
        {foreignKey: 'spotId'}
      )
    }

    

    static async postAspot({ownerId, address, city, state, country, lat, lng, name, description, price}){
      const spot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat, 
        lng,
        name,
        description,
        price
      });
      return await Spot.findByPk(spot.id);
    }

    static async editAspot({spotId, address, city, state, country, lat, lng, name, description, price}){
      const spot = await Spot.findByPk(spotId);
      await spot.update({
        address: address,
        city:city,
        state:state,
        country:country,
        lat:lat,
        lng:lng,
        name:name,
        description:description,
        price:price
      })

      return await Spot.findByPk(spotId);
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address:{ 
      type: DataTypes.STRING,
      allowNull: false,
      
    }, 
    city: {
      type: DataTypes.STRING,
      //allowNull: false,
      
    },
    state: {
      type: DataTypes.STRING,
      //allowNull: false,
      
    },
    country: {
      type: DataTypes.STRING,
      //allowNull: false,
      
    },
    lat: {
      type: DataTypes.FLOAT,
      //allowNull: false,
    },
    lng: {
      type: DataTypes.FLOAT,
      //allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      //allowNull: false,
      
    },
    description: {
      type: DataTypes.STRING,
      //allowNull: false,
      
    },
    price: {
      type: DataTypes.FLOAT,
      //allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Spot',
    
  });
  return Spot;
};