const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');

function initialize(passport, getUserByUserName, getUserById){
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUserName(username);
        if(user == null){
            return done(null,false, {message:'Usuário não foi encontrado'});
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            }else{
                return done(null, false, {message:'Senha incorreta'});
            }
        }catch(e){
            return done(e);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'username' },authenticateUser))
    passport.serializeUser((user,done) => {
        return done(null, user.id);
    });
    passport.deserializeUser(async function(id,done){
        return done(null, await getUserById(id));
    });
}
module.exports = initialize;