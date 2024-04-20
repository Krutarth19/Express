import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { config } from "../types/default";
import * as dotenv from 'dotenv';
dotenv.config();
import Customer from "../models/customer";
import { CustomerDocument } from "../types/customer.interface";

const opts = {
    jwt: {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWT_SECRET
    },
};

// var cookieExtractor = function (req) {
//     var token = null;
//     if (req && req.cookies) {
//         token = req.cookies['authToken'];
//     }
//     return token;
// };

const createJwtStrategy = (userModel: any, payloadProperties: string[], userType: string) => {
    return new JwtStrategy(opts.jwt, async (jwtPayload, done) => {
        try {
            const whereClause = {};
            let shouldSkip = false;

            payloadProperties.forEach(prop => {
                if (jwtPayload[prop]) {
                    whereClause[prop] = jwtPayload[prop];
                } else {
                    shouldSkip = true;
                }
            });

            if (shouldSkip) {
                return done(null, false);
            }

            const user = await userModel.findOne({ where: whereClause });
            user.userType = true;

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    });
};

export default {
    initialize: () => {
        // passport.use(
        //     'superAdmin',
        //     createJwtStrategy(SuperAdmin, ['email'], 'isSuperAdmin')
        // );

        // passport.use(
        //     'admin',
        //     createJwtStrategy(Admin, ['email'], 'isAdmin')
        // );

        passport.use(
            'customer',
            createJwtStrategy(Customer, ['email'], 'isCustomer')
        );

        // passport.use(
        //     'seller',
        //     createJwtStrategy(Seller, ['email'], 'isSeller')
        // );

        // passport.use(
        //     'distributor',
        //     createJwtStrategy(Distributor, ['email'], 'isDistributor')
        // );


    },
    pass: () => {
        return passport;
    },
};


passport.use(
    new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
        try {
            let user = await Customer.findOne({
                googleId: profile.id
            });

            const { id, displayName, _json: { picture } } = profile;
            let email = '';

            if (Array.isArray(profile?.emails) && profile?.emails?.length > 0) {
                email = profile.emails[0].value;
            }


            if (!user) {
                const name = displayName || 'Unknown';
                user = await Customer.create({
                    name: name,
                    googleId: id,
                    profilePicture: picture,
                    authMethod: 'google',
                    email: email,
                });
            }


            done(null, { user, accessToken });
        } catch (error: any) {
            console.log("Error in Google Strategy:", error);
            done(null, error);
        }
    })
);

passport.serializeUser(function (user: any, done) {
    done(null, user);
});

passport.deserializeUser(function (user: any, done) {
    done(null, user);
});