var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Article = require("../models/articles");
// 链接MongoDB数据库
mongoose.connect("mongodb://127.0.0.1:27017/blog", {
    useCreateIndex: true,
    useNewUrlParser: true
});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected success.");
});

mongoose.connection.error("connected", () => {
    console.log("MongoDB connected fail.");
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB connected disconnected.");
});

// 添加文章
router.post("/api/article", function(req, res, next) {
    var param = {
        title: req.body.title,
        author: req.body.author,
        keyword: req.body.keyword,
        desc: req.body.desc,
        imgUrl: req.body.imgUrl,
        content: req.body.content,
        categorys: req.body.categorys ? req.body.categorys : [],
        tags: req.body.tags ? req.body.tags : [],
        state: req.body.state,
        type: req.body.type,
        origin: req.body.origin
    };
    // 添加到数据库中
    let article = new Article({ ...param });
    article
        .save()
        .then(data => {
            res.json({
                status: 200,
                success: true,
                msg: "保存成功",
                data: data
            });
        })
        .catch(err => {
            res.json({
                status: 0,
                success: false,
                msg: err.message
            });
        });
});
// 更新文章
router.patch("/api/article/:_id", function(req, res, next) {
    const _id = req.params._id;
    var param = {
        title: req.body.title,
        author: req.body.author,
        keyword: req.body.keyword,
        desc: req.body.desc,
        imgUrl: req.body.imgUrl,
        content: req.body.content,
        categorys: req.body.categorys ? req.body.categorys : [],
        tags: req.body.tags ? req.body.tags : [],
        state: req.body.state,
        type: req.body.type,
        origin: req.body.origin,
        updateTime: new Date()
    };
    // 更新到数据库中
    Article.update({ _id: _id }, param)
        .then(data => {
            if (data) {
                res.json({
                    status: 200,
                    success: true,
                    msg: "更新成功",
                    data: data
                });
            } else {
                res.json({
                    status: 0,
                    success: false,
                    msg: "_id不存在"
                });
            }
        })
        .catch(err => {
            res.json({
                status: 0,
                success: false,
                msg: err.message
            });
        });
});
// 删除文章
router.delete("/api/article/:_id", function(req, res, next) {
    const _id = req.params._id;
    //数据库中删除
    Article.deleteMany({ _id: _id })
        .then(data => {
            res.json({
                status: 200,
                success: true,
                msg: "删除成功"
            });
        })
        .catch(err => {
            res.json({
                status: 0,
                success: false,
                msg: err.message
            });
        });
});
// 删除多篇文章
router.post("/api/articles/delete", function(req, res, next) {
    const _ids = req.body._ids;
    //数据库中删除
    Article.deleteMany({ _id: { $in: _ids } })
        .then(data => {
            res.json({
                status: 200,
                success: true,
                msg: "删除成功"
            });
        })
        .catch(err => {
            res.json({
                status: 0,
                success: false,
                msg: err.message
            });
        });
});
// 获取某篇文章
router.get("/api/article/:_id", function(req, res, next) {
    const _id = req.params._id;
    //数据库中获取
    Article.findOne({ _id: _id })
        .then(data => {
            if (data) {
                res.json({
                    status: 200,
                    success: true,
                    msg: "获取成功",
                    data: data
                });
            } else {
                res.json({
                    status: 0,
                    success: false,
                    msg: "文章_id错误"
                });
            }
        })
        .catch(err => {
            res.json({
                status: 0,
                success: false,
                msg: err.message
            });
        });
});
// 获取文章列表
router.get("/api/articles", function(req, res, next) {
    //从数据库中分页获取文章内容
    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;
    const skip = pageSize * (page - 1);
    Article.find({})
        .sort({ date: -1 })
        .limit(pageSize)
        .skip(skip)
        .exec()
        .then(data => {
            res.json({
                status: 200,
                success: true,
                msg: "获取成功",
                data: data,
                total: data.length
            });
        })
        .catch(err => {
            res.json({
                status: 0,
                success: false,
                msg: err.message
            });
        });
});
module.exports = router;
