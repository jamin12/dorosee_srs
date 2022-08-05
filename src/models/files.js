const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('files', {
    fid: {
      type: DataTypes.STRING(256),
      allowNull: false,
      primaryKey: true,
      comment: "파일 id(PK)"
    },
    fieldname: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "필드명(form-data field)"
    },
    originalname: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: "기존 파일명"
    },
    encoding: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "인코딩"
    },
    mimetype: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "mime-type"
    },
    destination: {
      type: DataTypes.STRING(512),
      allowNull: false,
      comment: "목적지 경로"
    },
    filename: {
      type: DataTypes.STRING(256),
      allowNull: false,
      comment: "파일명"
    },
    ext: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: "확장자명(file extension)"
    },
    path: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      comment: "파일 경로; full file path"
    },
    size: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "파일크기(bytes)"
    }
  }, {
    sequelize,
    tableName: 'files',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fid" },
        ]
      },
    ]
  });
};
