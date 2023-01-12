import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '94478855614-rf7tuiqleddghdojsm20hlg18n7k2etu.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:5000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // const { name, emails, photos } = profile;
    //
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   picture: photos[0].value,
    //   accessToken,
    // };
    // done(null, user);
    const { id, name, emails, photos } = profile;

    return {
      provider: 'google',
      providerId: id,
      name: name.givenName,
      email: emails[0].value,
      picture: photos[0].value,
    };
  }
}
