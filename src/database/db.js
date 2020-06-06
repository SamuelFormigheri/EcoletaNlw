//Importar a dependência do SQLite 3 
const sqlite3 = require("sqlite3").verbose();

//Iniciar o database object
const db = new sqlite3.Database("./src/database/database.db");

module.exports = db;

//Utilizar o db object para as operações
// db.serialize(function(){

    //// ------------------------------------------------------------------
    //// ---------------- 1 Criar a tabela --------------------------------
    //// ------------------------------------------------------------------
//     db.run(`
//         CREATE TABLE IF NOT EXISTS db_places(
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT,
//             image TEXT,
//             address TEXT,
//             address2 TEXT,
//             state TEXT,
//             city TEXT,
//             itens TEXT
//         );
//     `);
    //// ------------------------------------------------------------------


    // // ------------------------------------------------------------------
    // // ---------------- 2 Inserir os dados ------------------------------
    // // ------------------------------------------------------------------
    // const query = `INSERT INTO db_places (
    //                     name,
    //                     image,
    //                     address,
    //                     address2,
    //                     state,
    //                     city,
    //                     itens
    //                 ) VALUES (?,?,?,?,?,?,?);`;
    // const values = [
    //     "Papersider",
    //     "http://localhost:3000/images/ecologia.jpg",
    //     "Guilherme Gemballa, Jardim América",
    //     "Número 260",
    //     "Santa Catarina",
    //     "Rio do Sul",
    //     "Papéis e Papelão"
    // ];

    // //Depois de inserir retorna sucesso/erro
    // function afterInsertData(error){
    //     if (error){
    //         return console.log(error);
    //     }
    //     console.log("Cadastrado com sucesso!");
    //     console.log(this);
    // }

    // db.run(query, values, afterInsertData);
    // // ------------------------------------------------------------------

    // // ------------------------------------------------------------------
    // // ---------------- 3 Consultar os dados ---------------------------- 
    // // ------------------------------------------------------------------
    // db.all(`SELECT * FROM db_places`, function(error, rows){
    //     if (error){
    //         return console.log(error);
    //     }
    //     console.log("Aqui estão seus registros!");
    //     console.log(rows);
    // });
    // // ------------------------------------------------------------------

    // // ------------------------------------------------------------------
    // // ---------------- 4 Deletar um dado na tabela --------------------- 
    // // ------------------------------------------------------------------
    // db.run(`DELETE FROM db_places WHERE id = ?`,[5], function(error){
    //     if (error){
    //         return console.log(error);
    //     }
    //     console.log("Registros deletado com sucesso!");
    // });//Deleta o primeiro dado da tabela
    // // ------------------------------------------------------------------
// });