const express = require('express');

const app = express();
const axios = require('axios').default;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//MAPEAMENTO DA PASTA PUBLIC
app.use(express.static('public'));

//CONFIGURA O EJS COMO VIEW ENGINE (REDENRIZA AS PÁGINAS DE FRONT-END)
app.set('view engine', 'ejs');


//ROTA DE CADASTRO DE CATEGORIAS
app.get('/cadastroCategorias', (req, res)=>{
    res.render('categoria/cadastro');
});

// Renderização Cadastro de ingrediente
    app.post("/cadastroCategoria", (req, res)=>{
        const urlcadastrarIngrediente = "http://localhost:3000/inserirCategoria";
        console.log(req.body);
        axios.post(urlcadastrarIngrediente, req.body)
        .then((response)=>{
            axios.get("http://localhost:3000/listarCategoria").then((response)=>{
                let categorias = response.data;
               // console.log("Response:" + response.data);
                res.render("categoria/listagemCategoria", {categorias});
            });
        });
    });

//ROTA DE LISTAGEM DE CATEGORIAS
app.get('/listagemCategoria', (req, res)=>{
    
    const urlListagemCategoria = 'http://localhost:3000/listarCategoria';

    /*
    CHAMADA PELO AXIOS:
    1 - URL DA ROTA (urlListagemCategoria)
    2 - CALLBACK DA RESPOSTA DA CHAMADA
    */
    axios.get(urlListagemCategoria)
        .then(
            (response)=>{
                // console.log(response.data);
                // res.send(response.data);
                let categorias = response.data;
                res.render('categoria/listagemCategoria', {categorias});

        }); 
    });

    //ROTA DE LISTAGEM DE EDIÇÃO
    app.get('/formEdicaoCategorias/:codCategoria', (req, res)=>{
        
        //RECEBE O ID DE CATEGORIA QUE VAI SER EDITADO
        let {codCategoria} = req.params;
        // console.log(codCategoria);

        //CHAMADA DO AXIOS PARA A API:
        const urlListagemCategoria = `http://localhost:3000/selecionarcategoria/${codCategoria}`;
        
        axios.get(urlListagemCategoria)
        .then(
            (response)=>{

                let categoria = response.data;
                res.render('categoria/editarCategoria', {categoria});

            }
        )
    });

    //ROTA DE EDIÇÃO
    app.post('/alterarCategoria', (req, res)=>{

        const urlAlterarCategoria = 'http://localhost:3000/atualizarCategoria';
        console.log(req.body);

        axios.put(urlAlterarCategoria, req.body)
        .then(
            axios.get("http://localhost:3000/listarCategoria")
            .then(
                    (response)=>{
                            let categorias = response.data;
                            console.log("RESPONSE:" + response.data);
                            res.render("categoria/listagemCategoria", {categorias});
                    }
            )
        )

    });
// ROTA EXCLUIR
app.get('/excluirCategoria/:codCategoria', (req, res)=>{

	// console.log('ROTA DE EXCLUSÃO - ID: ' + req.params.id);
	let {codCategoria} = req.params;

	const urlExcluirCategoria = 
	`http://localhost:3000/excluirCategoria/${codCategoria}`;
	
	/*
	PARAMETROS DO AXIOS:
	1 - URL (ROTA)
	*/
	axios.delete(urlExcluirCategoria)
	.then(
        (response)=>{
		// console.log(response);
		                const urlListarCategoria = 
		                'http://localhost:3000/listarCategoria';
	
		                axios.get(urlListarCategoria)
		            .then(
                    (response)=>{
			        let categorias = response.data;
			        res.render('categoria/listagemCategoria', {categorias});
		});

	})

});


app.listen(3001, ()=>{
     const urlHome = 'http://localhost:3001/cadastroCategorias';
    console.log('SERVIDOR RODANDO EM:' + urlHome);
});
