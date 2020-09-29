const jwt = require('jsonwebtoken');
const { BadRequestError, UnAuthorizedError } = require('../helpers/errors');
const secret = process.env.JWT_SIGN_SECRET;

module.exports = {
  genToken: (userData) => {
    return jwt.sign(
      {
        userId: userData.id,
        userRole: userData.role,
      },
      secret,
      { expiresIn: '20h'},
    );
  },

  authenticateJWT: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, secret, (err, user) => {
        if (err) {
          throw new UnAuthorizedError('Accès refusé', 'Vous devez être connecté pour accéder à cette ressource 👀');
        }
        req.user = user;
        next();
      });
    } else {
      throw new BadRequestError('Mauvaise requête', "le token n'as pas été fournit 😿");
    }
  },
};

