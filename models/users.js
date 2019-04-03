var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
var userSchema = new Schema({
    userName: String,
    userPwd: String,
    userEmail: String,
    userAvatar: {
        type: String,
        default:
            "http://img.52z.com/upload/news/image/20180110/20180110125042_98769.jpg"
    },
    createTime: { type: Date, default: Date.now }
});
// 自增 ID 插件配置
userSchema.plugin(autoIncrement.plugin, {
    model: "User",
    field: "userId",
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model("User", userSchema);
/*
默认：
module.exports = mongoose.model("User", userSchema);
 等于
module.exports = mongoose.model("User", userSchema, "users");
*/
