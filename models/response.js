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
      Response.belongsTo(models.User, { foreignKey: 'userId' })
      Response.belongsTo(models.Story, { foreignKey: 'storyId' })
    }
  }
  Response.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.STRING,
    userId: DataTypes.STRING,
    storyId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Response',
    tableName: 'Responses',
    underscored: true
  })
  return Response
}
