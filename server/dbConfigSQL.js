import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.resolve(__dirname, "./dbsql/db.db"),
    logging: false
});

// export const TextModelSQL = sequelize.define("Text", {
//     textId: {
//         type: sequelize.Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     textTitle: {
//         type: sequelize.Sequelize.STRING,
//         defaultValue: "Untitled Text"
//     },
//     text: {
//         type: sequelize.Sequelize.TEXT
//     }
// })

// export const UserModelSQL = sequelize.define("User", {
//     userId: {
//         type: sequelize.Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     name: {
//         type: sequelize.Sequelize.STRING,
//         unique: true,
//         allowNull: false
//     },
//     email: {
//         type: sequelize.Sequelize.STRING,
//         unique: true,
//         allowNull: false
//     },
//     passwordHash: {
//         type: sequelize.Sequelize.STRING,
//         allowNull: false
//     }
// })

// UserModelSQL.hasMany(TextModelSQL, { foreignKey: "userId" });

// let userId = 1;
// sequelize
//     .sync()
//     .then(() => {
//         return UserModelSQL.create({
//             name: "exampleuser",
//             email: "exampleuser@example.com",
//             passwordHash: "hashedpassword123"
//         });
//     })
//     .then((User) => {
//         userId = User.userId;
//         console.log(User.toJSON())
//         console.log("Example user entry created!");
//     })
//     .then(() => {
//         console.log("Database & tables created!");
//         return TextModelSQL.create({
//             userId,
//             textTitle: "Example Text4",
//             text: "This is a maal for the text table."
//         });
//     })
//     .then((Text) => {
//         console.log(Text.toJSON())
//         console.log("Example text entry created!");
//     })
//     .catch((error) => {
//         console.error("Error creating database & tables:", error);
//     });