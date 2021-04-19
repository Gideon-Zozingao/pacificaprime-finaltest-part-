
//import the sequelize ORM library  
const {Model, DataTypes, Sequelize} = require('sequelize');

//create and instace  of Sequelize and connect to a sqlite db
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "temp.db",
    logging: false
})

//create a user Model with Seqluelize insid the da
class User extends Model {}
User.init({
    role: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
}, {sequelize})


//create a message model
class Message extends Model{}
Message.init({
    content: DataTypes.STRING,
    upVotes:{
        type:DataTypes.INTEGER,
        default:0
    } ,
    time: DataTypes.TIME,
}, {sequelize})

//create the model assoscaition
// One user is can have many message associted with it
User.hasMany(Message)
// each message withtih the db is owned y a user
Message.belongsTo(User);


//synchronises the actual models inside db with the Seqluelize defined models.
(async()=>{
    sequelize.sync()
}
)()

//export the models to e used in other application functions
module.exports = {
    User, 
    Message, 
    sequelize
}

