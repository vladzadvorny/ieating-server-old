import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
import User from './user'

class Note extends Model {}

Note.init(
  {
    meal: {
      type: DataTypes.ENUM,
      values: ['breakfast', 'lunch', 'dinner', 'snack'],
      allowNull: false,
      defaultValue: 'breakfast',
      public: true
    },
    time: { type: DataTypes.DATE, public: true },
    place: {
      type: DataTypes.STRING,
      allowNull: true,
      public: true
    },
    satietyBefore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      public: true
    },
    moodBefore: {
      type: DataTypes.ENUM,
      values: ['excellent', 'calm', 'neutral', 'sad', 'guilty', 'terrible'],
      defaultValue: 'neutral',
      public: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      public: true
    },
    satietyAfter: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      public: true
    },
    moodAfter: {
      type: DataTypes.ENUM,
      values: ['excellent', 'calm', 'neutral', 'sad', 'guilty', 'terrible'],
      defaultValue: 'neutral',
      public: true
    },
    cause: {
      type: DataTypes.STRING,
      allowNull: true,
      public: true
    },

    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  },
  {
    sequelize,
    modelName: 'note',
    timestamps: true
  }
)

// 1:M
Note.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false
  }
})

export default Note