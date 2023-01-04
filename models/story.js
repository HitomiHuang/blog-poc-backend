'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Story.hasMany(models.Clap, { foreignKey: 'storyId' })
      Story.hasMany(models.Response, { foreignKey: 'storyId' })
      Story.belongsTo(models.User, { foreignKey: 'userId' })
      Story.belongsToMany(models.User, {
        through: models.Clap,
        foreignKey: 'storyId',
        as: 'ClappedStory'
      })
    }
  }
  Story.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Story',
    tableName: 'Stories',
    underscored: true
  })
  return Story
}
