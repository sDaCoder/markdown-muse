import { sequelize } from "../dbConfigSQL.js";

export const TextModelSQL = sequelize.define("Text", {
    textId: {
        type: sequelize.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    textTitle: {
        type: sequelize.Sequelize.STRING,
        defaultValue: "Untitled Text"
    },
    text: {
        type: sequelize.Sequelize.TEXT
    }
})