const express = require("express");
const server = express();

//Pegar o banco de dados
const db = require("./database/db");

//Ter acesso ao bcrypt para adicionar hash nas senhas
const bcrypt = require('bcrypt');

const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

//#region Variáveis globais de ambiente
var darkModeVariable = "";
var userLogged = "";
var userAux = null;
//#endregion

//#region Funções utilitários

//#region Sleep function
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
//#endregion

//#endregion   

const initializePassport = require('./passport-config')
initializePassport(passport, 
    async function(username){
        db.get(`SELECT * FROM db_users where username = '${username}'`, function(error, rows){
            userAux = rows;      
        });
        //Espera 2 segundos para terminar a pesquisa,se não ele sempre retorna null
        await sleep(2000); 
        return userAux;
    },
    async function(id){
        db.get(`SELECT * FROM db_users where id = ${id}`, function(error, rows){
            userAux = rows; 
        }); 
        //Espera 2 segundos para terminar a pesquisa,se não ele sempre retorna null
        await sleep(2000);
        return userAux;       
});

//Configurar pasta publica
server.use(express.static("public"));

//Habilitar o uso do Req.body
server.use(express.urlencoded({extended: true}));

//Habilitar ao backend receber Json
server.use(express.json());

server.use(flash());
server.use(session({
    secret: "secret",
    resave:false,
    saveUninitialized: false
}));

server.use(passport.initialize());
server.use(passport.session());
//Utilizado para conseguir usar função delete no html
server.use(methodOverride('_method'));

//Utilizando template engine - para poder editar htmls
const nunjucks = require("nunjucks");
nunjucks.configure("src/views",{
    express: server,
    noCache: true
});

//#region Dark Mode - Tema
//Altera a variável do backend que controla o tema - dark/normal
server.post('/dark-mode',function(req,res){
    if(req.body.opt == 1){
        darkModeVariable = "";
    }
    else{
        darkModeVariable = "checked";
    }
    res.end();
});
//#endregion

//#region Autenticação - Login - Logout - Register - (get) e (post)
// Autenticação 
// Views de login / registro de usuário
server.get("/login",checkNotAuthenticated, function(req, res){
    return res.render("login.html");   
});
server.post("/login",checkNotAuthenticated, passport.authenticate('local',{

    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
server.get("/register",checkNotAuthenticated, function(req, res){
    return res.render("register.html");   
});
server.post("/register",checkNotAuthenticated, async function(req, res){
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const query = `INSERT INTO db_users (
            username,
            password,
            email
        ) VALUES (?,?,?);`;
        const values = [
            req.body.user,
            hashedPassword,
            req.body.email
                ];
        //Depois de inserir retorna sucesso/erro
        function afterInsertData(error){
            if (error){
                return console.log(error);
            }
        console.log("Cadastrado com sucesso!");
        console.log(this);

        return res.render("save-point.html",{ objetoAlterado: "Usuário", linkDeRedirecionamento: "login" });
        }
   
        db.run(query, values, afterInsertData);
        // // ------------------------------------------------------------------  
    }catch{
        return res.render("register.html");
    }
});

server.delete('/logout',function(req, res){
    req.logOut();
    userLogged = "";
    res.redirect('login');
});

//#region Verifica se está ou não autenticado

// Verifica se está autenticado, se não redireciona para o login
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// Verifica se não está autenticado, se estiver redireciona para a home
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}
//#endregion

//#endregion

//#region Caminhos da aplicacao - páginas html

//#region index.html - Home page
server.get("/", function(req, res){   
    if(req.user != undefined && req.user != null && req.user.username != undefined && req.user.username != null){
        userLogged = req.user.username;
        
    }
    return res.render("index.html",{ darkModeVariable, userLogged });
});
//#endregion

//#region create-point
server.get("/create-point",checkAuthenticated, function(req, res){
    return res.render("create-point.html",{ darkModeVariable, userLogged });   
});
//#endregion

//#region save-point Tela de salvo com sucesso 
server.post("/save-point", function(req, res){
    // // ------------------------------------------------------------------
     // // ---------------- 2 Inserir os dados ------------------------------
     // // ------------------------------------------------------------------
     const query = `INSERT INTO db_places (
                         name,
                         image,
                         address,
                         address2,
                         state,
                         city,
                         itens
                     ) VALUES (?,?,?,?,?,?,?);`;

    //req -> pegar o post do form
    const values = [
        req.body.name,
        req.body.image,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.itensSelecionados
            ];
     //Depois de inserir retorna sucesso/erro
     function afterInsertData(error){
         if (error){
             return console.log(error);
         }
         console.log("Cadastrado com sucesso!");
         console.log(this);

         return res.render("save-point.html",{ objetoAlterado: "Ponto de Coleta", linkDeRedirecionamento: "create-point" });
     }
    
     db.run(query, values, afterInsertData);
     // // ------------------------------------------------------------------    
});
//#endregion

//#region search-results
server.get("/search-results", function(req, res){
    const searchCity = req.query.searchCity;
    const searchState = req.query.searchState;
    if(searchCity == "" && searchState == ""){
        return res.render("search-results.html",{ total: 0, darkModeVariable, userLogged });
    };
    //Pegar os dados do db antes de retornar a view
    // ------------------------------------------------------------------
    // ---------------- 3 Consultar os dados ---------------------------- 
    // ------------------------------------------------------------------

     var pesquisa = `WHERE name is not null `;
     if(searchCity != ""){
         pesquisa += ` and city = '${searchCity}'`;
     }

     if(searchState != ""){
         pesquisa += ` and state = '${searchState}'`;
     }

    db.all(`SELECT * FROM db_places ${pesquisa}`, function(error, rows){
        const total = rows.length;

        return res.render("search-results.html",{ places: rows, total: total, darkModeVariable, userLogged });
    });
    // ------------------------------------------------------------------

});
//#endregion

//#endregion

//Ligar o servidor
server.listen(3000);