import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
// import User from './user'

class Upload extends Model {}

Upload.init(
  {
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM,
      values: ['image'],
      allowNull: false,
      defaultValue: 'image',
      public: true
    },

    createdAt: { type: DataTypes.DATE, field: 'created_at' }
  },
  {
    sequelize,
    modelName: 'upload',
    timestamps: true,
    updatedAt: false
  }
)

// 1:M
// Upload.belongsTo(User, {
//   foreignKey: {
//     name: 'uploaderId',
//     field: 'uploader_id',
//     allowNull: false
//   }
// })

export default Upload
