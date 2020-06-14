const { UserError } = require('../../../errors-types/index');

module.exports = (req, res, next) => {
    if (req.session.isUserAuthorized) {
        next();
    } else {
        next(
            new UserError.UNAUTHORIZED(
                {
                    isUserAuthorized: false,
                    employeeID: null,
                },
                null,
            ),
        );
    }
};
