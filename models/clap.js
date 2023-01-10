'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Clap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
    }
  }
  Clap.init({
    userId: DataTypes.INTEGER,
    storyId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Clap',
    tableName: 'Claps',
    underscored: true
  })
  return Clap
}
