import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'

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
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'banned'],
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

export default User