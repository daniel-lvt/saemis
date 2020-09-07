module.exports = {
    isloggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else if (req.user.tipo_usuario_root != undefined) {
            return res.redirect('/root');
        } else if (req.user.tipo_usuario_admin != undefined) {
            return res.redirect('/admin');
        } else {
            return res.redirect('/');
        }
    }
}