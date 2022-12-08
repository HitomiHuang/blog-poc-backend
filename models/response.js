'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Response extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Response.init({
    content: DataTypes.TEXT,
    userId: DataTypes.STRING,
    storyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Response',
    tableName: 'Responses',
    underscored: true
  })
  return Response
}
