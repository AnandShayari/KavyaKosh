import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import config from './index.js';

const upsertOAuthUser = async (provider, profile, email, name, avatar) => {
  let user = await User.findOne({ email });
  if (user) {
    user.oauthProvider = provider;
    user.oauthId = profile.id;
    if (!user.avatar && avatar) user.avatar = avatar;
    await user.save({ validateBeforeSave: false });
  } else {
    user = await User.create({
      name,
      email,
      oauthProvider: provider,
      oauthId: profile.id,
      avatar: avatar || '',
      isEmailVerified: true,
      isVerified: true,
    });
  }
  return user;
};

if (config.oauth.google.clientId) {
  passport.use(new GoogleStrategy(
    {
      clientID: config.oauth.google.clientId,
      clientSecret: config.oauth.google.clientSecret,
      callbackURL: `http://localhost:${config.port}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'), null);
        const avatar = profile.photos?.[0]?.value;
        const user = await upsertOAuthUser('google', profile, email, profile.displayName, avatar);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  ));
}

if (config.oauth.github.clientId) {
  passport.use(new GitHubStrategy(
    {
      clientID: config.oauth.github.clientId,
      clientSecret: config.oauth.github.clientSecret,
      callbackURL: `http://localhost:${config.port}/api/auth/github/callback`,
      scope: ['user:email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
        const avatar = profile.photos?.[0]?.value;
        const user = await upsertOAuthUser('github', profile, email, profile.displayName || profile.username, avatar);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  ));
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
