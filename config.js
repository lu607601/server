const EnumRoleType = {
    ADMIN: "admin",
    DEFAULT: "guest",
    DEVELOPER: "developer"
};

const userPermission = {
    DEFAULT: {
        visit: ["1", "4", "5"],
        role: EnumRoleType.DEFAULT
    },
    ADMIN: {
        role: EnumRoleType.ADMIN
    },
    DEVELOPER: {
        role: EnumRoleType.DEVELOPER
    }
};

const adminUsers = [
    {
        id: 0,
        userEmail: "584628303@qq.com",
        userPwd: "CRYSTAL",
        permissions: userPermission.ADMIN,
        avatar:
            "http://img.52z.com/upload/news/image/20180110/20180110125042_98769.jpg"
    },
    {
        id: 1,
        userEmail: "guest@qq.com",
        userPwd: "guest",
        permissions: userPermission.DEFAULT,
        avatar:
            "http://img.52z.com/upload/news/image/20180110/20180110125042_98769.jpg"
    },
    {
        id: 2,
        userEmail: "developer@qq.com",
        userPwd: "CRYSTAL",
        permissions: userPermission.DEVELOPER,
        avatar:
            "http://img.52z.com/upload/news/image/20180110/20180110125042_98769.jpg"
    }
];
module.exports = adminUsers;
