const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Buscar si el usuario ya existe
        let existingEmail = await prisma.usuario.findFirst({
          where: {
            correo: email
          }
        });

        if (existingEmail) {
          return done(null, false, { message: 'El correo ya está registrado' });
        }

        // Si no existe, crearlo
        if (!existingEmail) {
          // Extraer la información del perfil de Google
          const nombre = profile.displayName;
          const foto = profile.photos[0].value;

          // El usuario es nuevo, se necesita más información para completar el registro
          return done(null, {
            isNewUser: true,
            google_id: profile.id,
            correo: email,
            nombre: nombre,
            foto: foto
          });
        }

        // Usuario ya existe
        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;