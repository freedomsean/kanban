import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { Env } from '../constant/env.constant';

const signOptions: jwt.SignOptions = {
  expiresIn: Env.JWT_EXPIRES_IN
};

export class PassportService {
  /**
   * Sign the token by the given data.
   *
   * @param {any} payload - Payload.
   * @param {string} payload.id - User id.
   * @param {string} payload.username - Username.
   */
  static sign(payload: { id: string; username: string }): string {
    const options: jwt.SignOptions = { ...signOptions, subject: payload.id };
    return jwt.sign(payload, Env.JWT_SECRET, options);
  }

  /**
   * Config passport.
   *
   * @param {any} passport - Passport obj.
   */
  static config(passport: any) {
    const opts: any = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = Env.JWT_SECRET;

    passport.use(
      new Strategy(opts, async (jwtPayload, done) => {
        try {
          const user = true;

          if (user) {
            return done(null, user);
          }

          return done(null, false);
        } catch (error) {
          return done(error);
        }
      })
    );
  }
}
