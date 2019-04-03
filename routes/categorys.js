var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Category = require("../models/categorys");
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

// 添加分类
router.post("/api/category", function(req, res, next) {
    var param = {
        title: req.body.title,
        desc: req.body.desc
    };
    // 添加到数据库中
    let category = new Category({ ...param });
    category
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
// 更新分类
router.patch("/api/category/:_id", function(req, res, next) {
    const _id = req.params._id;
    var param = {
        title: req.body.title,
        desc: req.body.desc
    };
    // 更新到数据库中
    Category.update({ _id: _id }, param)
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
// 删除分类
router.delete("/api/category/:_id", function(req, res, next) {
    const _id = req.params._id;
    //数据库中删除
    Category.deleteMany({ _id: _id })
        .then(() => {
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
// 获取分类列表
router.get("/api/categorys", function(req, res, next) {
    //从数据库中分页获取分类内容
    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;
    const skip = pageSize * (page - 1);
    Category.find({})
        .sort({ date: -1 })
        .limit(pageSize)
        .skip(skip)
        .exec()
        .then(data => {
            if (data) {
                res.json({
                    status: 200,
                    success: true,
                    msg: "获取成功",
                    data: data,
                    total: data.length
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    msg: "没有更多了",
                    data: [],
                    total: 0
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
module.exports = router;
