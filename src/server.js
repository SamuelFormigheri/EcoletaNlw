const express = require("express");
const server = express();

//Pegar o banco de dados
const db = require("./database/db");

//Configurar pasta publica
server.use(express.static("public"));

//Habilitar o uso do Req.body
server.use(express.urlencoded({extended: true}));

//Utilizando template engine - para poder editar htmls
const nunjucks = require("nunjucks");
nunjucks.configure("src/views",{
    express: server,
    noCache: true
});

//Configurar os caminhos da aplicação
//req: requisição
//res: resposta
server.get("/", function(req, res){
    return res.render("index.html");
});



server.get("/create-point", function(req, res){
    //console.log(darkModeVariable);
    return res.render("create-point.html");
});

// server.get("/save-point", function(req, res){
//     return res.render("save-point.html");
// });

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

         return res.render("save-point.html");
     }
    
     db.run(query, values, afterInsertData);
     // // ------------------------------------------------------------------    
});


server.get("/search-results", function(req, res){
    const searchCity = req.query.searchCity;
    const searchState = req.query.searchState;
    if(searchCity == "" && searchState == ""){
        return res.render("search-results.html",{ total: 0 });
    };
    //Pegar os dados do db antes de retornar a view
    // ------------------------------------------------------------------
    // ---------------- 3 Consultar os dados ---------------------------- 
    // ------------------------------------------------------------------
    // var pesquisa = `WHERE name is not null `;
    // if(searchCity != ""){
    //     pesquisa = ` and city = '${searchCity}'`;
    // }

    // if(searchState != ""){
    //     pesquisa = ` and state = '${searchState}'`;
    // }

    db.all(`SELECT * FROM db_places WHERE city = '${searchCity}' and state = '${searchState}'`, function(error, rows){
        // if (error){
        //     return console.log(error);
        // }
        // console.log("Aqui estão seus registros!");
        // console.log(rows);
        const total = rows.length;

        return res.render("search-results.html",{ places: rows, total: total });
    });
    // ------------------------------------------------------------------


});


//Ligar o servidor
server.listen(3000);