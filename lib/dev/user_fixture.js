exports.user_logged_in = function(req, res, next){
    auth = {
        github : {
            user : {
                name : "Simone",
                login: "toretto460"
            }
        }
    };
    req.session.auth = auth;
    next();
};