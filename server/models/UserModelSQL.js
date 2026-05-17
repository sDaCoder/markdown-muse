import { sequelize } from "../dbConfigSQL.js"

export const UserModelSQL = sequelize.define("User", {
    userId: {
        type: sequelize.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    passwordHash: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    refreshToken: {
        type: sequelize.Sequelize.STRING
    }
})