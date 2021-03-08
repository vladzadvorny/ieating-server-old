import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
import Upload from './upload'

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      public: true
    },
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'admin'],
      allowNull: false,
      defaultValue: 'user',
      public: true
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      public: true
    },
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'banned', 'inactive'],
      allowNull: false,
      defaultValue: 'active'
    },
    providers: {
      type: DataTypes.JSON
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pushToken: {
      type: DataTypes.STRING,
      allowNull: true
    },

    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: true
  }
)

User.hasMany(Upload, {
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false
  }
})

export default User
