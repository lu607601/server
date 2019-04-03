var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
// 分类集合模型
var tagSchema = new Schema({
    title: { type: String, required: true, validate: /\S+/ },
    desc: { type: String, default: "" },
    createTime: { type: Date, default: Date.now }
});

//自增 ID 插件配置
tagSchema.plugin(autoIncrement.plugin, {
    model: "Tag",
    field: "id",
    startAt: 1,
    incrementBy: 1
});

// 分类模型
module.exports = mongoose.model("Tag", tagSchema);
