var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
var articleSchema = new Schema({
    title: String,
    author: String,
    keyword: String,
    desc: String,
    imgUrl: String,
    content: String,
    state: String, // 发布状态=>0 草稿，1 发布
    type: String, // 文章类型=>1: 普通文章，2: 简历，3: 管理员介绍
    origin: String, // 文章转载状态=>0 原创，1 转载，2 混合
    categorys: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        }
    ],
    tags: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true }
    ],
    comments: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    email: String,
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now }
});
// 自增 ID 插件配置
articleSchema.plugin(autoIncrement.plugin, {
    model: "article",
    field: "id",
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model("article", articleSchema);
