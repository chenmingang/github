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
// gh = githubFile.init('chenmingang', '***********', 'wx', 'README.md');