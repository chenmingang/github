var githubFile = {
    config: {
        userName: "",
        accessToken: "",
        repo: "",
        branch: "",
        path: ""
    },
    gitHubController: null,
    init: function (userName, accessToken, repo, path) {
        this.config.userName = userName;
        this.config.accessToken = accessToken;
        this.config.repo = repo;
        this.config.path = path;
        this.gitHubController = gitHubController.init(userName, accessToken);
        return this;
    },
    get: function (cb) {
        var param = {
            repo: this.config.repo,
            branch: this.config.branch,
            path: this.config.path
        };
        this.gitHubController.getFile(param, function (err, res) {
            if (err) {
                console.log(err);
                cb('ERROR');
            } else {
                cb(res);
            }
        });
    },
    create: function (content, cb) {
        var param = {
            repo: this.config.repo,
            branch: this.config.branch,
            path: this.config.path,
            message: 'first commit',
            content: content
        };
        this.gitHubController.createJsonFile(param, cb);

    },
    update: function (content, cb) {
        var param = {
            repo: this.config.repo,
            branch: this.config.branch,
            path: this.config.path,
            message: 'update',
            content: content
        };
        this.gitHubController.updateJsonFile(param, cb);
    },
    delete: function (cb) {
        var param = {
            repo: this.config.repo,
            branch: this.config.branch,
            path: this.config.path,
            message: 'delete'
        };
        this.gitHubController.deleteFile(param, cb);
    }

};
// gh = githubFile.init('chenmingang', '84e405780ad6ce9f0cfed1dc75327e0ae3b9741b', 'wx', 'README.md');

var gitHubKV = {
    dbs: [],
    dbNum: 16,
    init: function (userName, accessToken, repo, dbNum) {
        this.dbNum = dbNum;
        for (var i = 0; i < dbNum; i++) {
            var dbFileName = dbNum + '.json';
            var gitHubDB = githubFile.init(userName, accessToken, repo, dbFileName);
            gitHubDB.get(function (res) {
                if (res === 'ERROR') {
                    gitHubDB.create('', function (r) {
                        console.log('创建成功');
                    });
                }
            });
            this.dbs.push(gitHubDB);
        }
    },
    put: function (key, value) {
        var index = getHashCode(key) % this.dbNum;
        var db = this.dbs[index];
        db.get(function (jsonStr) {
            jsonStr = putValueToJsonStr(jsonStr, key, value);
            db.update(jsonStr, function (u) {
                console.log("put成功" + u);
            });
        });
    },
    get: function (key, cb) {
        var index = getHashCode(key) % this.dbNum;
        var db = this.dbs[index];
        db.get(function (jsonStr) {
            var value = getValueFromJsonStr(jsonStr, key);
            cb(value);
        });
    }
};

function getValueFromJsonStr(jsonStr, key) {
    return JSON.parse(jsonStr)[key];
}

function putValueToJsonStr(jsonStr, key, value) {
    var json = JSON.parse(jsonStr);
    json[key] = value;
    return JSON.stringify(json);
}

function getHashCode(str) {
    var hash = 1315423911, i, ch;
    for (i = str.length - 1; i >= 0; i--) {
        ch = str.charCodeAt(i);
        hash ^= ((hash << 5) + ch + (hash >> 2));
    }
    return (hash & 0x7FFFFFFF);
}