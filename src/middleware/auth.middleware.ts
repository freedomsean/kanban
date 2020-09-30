import * as passport from 'passport';

export const AuthMiddleware = passport.authenticate('jwt', { session: false });
