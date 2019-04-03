var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var qs = require("qs");
var User = require("../models/users");
const adminUsers = require("../config");
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

/* GET user listing. */
router.get("/", function(req, res, next) {
    res.send("respond with a resource");
});
/**
 * 前台的登录注册逻辑： checkLogin
 * 后台的登录逻辑： token
 *  */
// 注册
router.post("/api/register", function(req, res, next) {
    var param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd,
        userEmail: req.body.userEmail
    };
    Object.keys(param).forEach(key => {
        if (!param[key]) {
            res.json({
                status: 0,
                success: false,
                msg: "请填写" + key
            });
            return;
        }
    });
    User.findOne(param, function(err, doc) {
        if (err) {
            res.json({
                status: 0,
                success: false,
                msg: err.message
            });
        } else {
            // 查找到了用户
            if (doc) {
                res.json({
                    status: 0,
                    success: false,
                    msg: "用户已存在"
                });
            } else {
                // 添加到数据库中
                let user = new User({ ...param });
                user.save().then(data => {
                    // 往服务端写cookie
                    res.cookie("userId", data.userId, {
                        path: "/", // 放到域名里
                        maxAge: 1000 * 60 * 60 // 1h
                    });
                    res.cookie("userName", data.userName, {
                        path: "/", // 放到域名里
                        maxAge: 1000 * 60 * 60 * 3 // 1h
                    });
                    res.json({
                        status: 200,
                        success: true,
                        msg: "注册成功",
                        data: data
                    });
                });
            }
        }
    });
});
// 前台登录
router.post("/api/login", function(req, res, next) {
    var param = {
        userEmail: req.body.userEmail,
        userPwd: req.body.userPwd
    };
    User.findOne(param, function(err, doc) {
        if (err) {
            res.json({
                status: 0,
                success: false,
                msg: err.message
            });
        } else {
            // 查找到了用户
            if (doc) {
                // 往服务端写cookie
                res.cookie("userId", doc.userId, {
                    path: "/", // 放到域名里
                    maxAge: 1000 * 60 * 60 // 1h
                });
                res.cookie("userName", doc.userName, {
                    path: "/", // 放到域名里
                    maxAge: 1000 * 60 * 60 * 3 // 1h
                });
                // 信息写到session里,需要安装express-session
                // req.session.user = doc;
                res.json({
                    status: 200,
                    success: true,
                    msg: "",
                    data: doc
                });
            } else {
                res.json({
                    status: 0,
                    success: false,
                    msg: "用户名或密码错误"
                });
            }
        }
    });
});

// 退出登录, get/post都可以，不需要带参数
router.get("/api/logout", function(req, res, next) {
    res.cookie("userId", "", {
        path: "/",
        maxAge: -1
    });
    res.json({
        status: 200,
        success: true,
        msg: "",
        result: ""
    });
});

// 检测是否登录
router.get("/api/checkLogin", function(req, res, next) {
    if (req.cookies.userId) {
        res.json({
            status: 200,
            success: true,
            msg: "",
            data: {
                userName: req.cookies.userName
            }
        });
    } else {
        res.json({
            status: 200,
            success: true,
            msg: "未登录",
            result: ""
        });
    }
});
// 后台登录
router.post("/api/admin/login", function(req, res, next) {
    var param = {
        userEmail: req.body.userEmail,
        userPwd: req.body.userPwd
    };

    const user = adminUsers.filter(item => item.userEmail === param.userEmail);
    if (user.length > 0 && user[0].userPwd === param.userPwd) {
        const now = new Date();
        now.setDate(now.getDate() + 1);
        res.cookie(
            "token",
            JSON.stringify({ id: user[0].id, deadline: now.getTime() }),
            {
                maxAge: 900000,
                httpOnly: true
            }
        );
        res.json({
            status: 200,
            success: true,
            msg: "登录成功"
        });
    } else {
        res.json({
            status: 0,
            success: false,
            msg: "请重新登录"
        });
    }
});
// 后台退出登录
router.get("/api/admin/loginout", function(req, res, next) {
    res.clearCookie("token");
    res.json({
        status: 200,
        success: true,
        msg: "退出登录成功"
    });
});
// 后台获取当前登录的用户
router.get("/api/admin/user", function(req, res, next) {
    const cookie = req.headers.cookie || "";
    const cookies = qs.parse(cookie.replace(/\s/g, ""), { delimiter: ";" });
    const response = {};
    let user = {};
    if (!cookies.token) {
        res.json({
            status: 0,
            success: false,
            msg: "请重新登录"
        });
        return;
    }
    const token = JSON.parse(cookies.token);
    if (token) {
        response.success = token.deadline > new Date().getTime();
    }
    if (response.success) {
        const userItem = adminUsers.find(_ => _.id === token.id);
        if (userItem) {
            const { password, ...other } = userItem;
            user = other;
        }
    }
    response.data = user;
    res.json(response);
});

// 获取所有用户
router.get("/api/users", function(req, res, next) {
    //从数据库中分页获取分类内容
    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;
    const skip = pageSize * (page - 1);
    User.find({})
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
// 删除用户
router.delete("/api/user/:_id", function(req, res, next) {
    const _id = req.params._id;
    User.deleteMany({ _id: _id })
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
// 删除多个用户
router.post("/api/users/delete", function(req, res, next) {
    const _ids = req.body._ids;
    //数据库中删除
    User.deleteMany({ _id: { $in: _ids } })
        .then(data => {
            res.json({
                status: 200,
                msg: "删除成功"
            });
        })
        .catch(err => {
            res.json({
                status: 0,
                msg: err.message
            });
        });
});
// 更新某个用户
router.patch("/api/user/:_id", function(req, res, next) {
    const _id = req.params._id;
    var param = {
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        updateTime: new Date()
    };
    // 更新到数据库中
    User.update({ _id: _id }, param)
        .then(data => {
            if (data) {
                res.json({
                    status: 200,
                    msg: "更新成功",
                    success: true,
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
module.exports = router;
