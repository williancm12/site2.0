
let modalKey = 0

// variavel para controlar a quantidade inicial de pizzas na modal
let quanthotdog = 1

let cart = [] // carrinho


// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.hotdogWindowArea').style.opacity = 0 // transparente
    seleciona('.hotdogWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.hotdogWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.hotdogWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.hotdogWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.hotdogInfo--cancelButton, .hotdogInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDoshotdog = (hotdogItem, item, index) => {
   
    // setar um atributo para identificar qual elemento foi clicado
	hotdogItem.setAttribute('data-key', index)
    hotdogItem.querySelector('.hotdog-item--img img').src = item.img
    hotdogItem.querySelector('.hotdog-item--price').innerHTML = formatoReal(item.price[2])
    hotdogItem.querySelector('.hotdog-item--name').innerHTML = item.name
    hotdogItem.querySelector('.hotdog-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.hotdogBig img').src = item.img
    seleciona('.hotdogInfo h1').innerHTML = item.name
    seleciona('.hotdogInfo--desc').innerHTML = item.description
    seleciona('.hotdogInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

// aula 05
const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .hotdog-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.hotdog-item').getAttribute('data-key')
    console.log('hotdog clicada ' + key)
    console.log(hotdogJson[key])

    // garantir que a quantidade inicial de hotdog é 1
    quanthotdog = 1

    // Para manter a informação de qual hotdog foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    seleciona('.hotdogInfo--size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.hotdogInfo--size').forEach((size, sizeIndex) => {
        // selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = hotdogJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.hotdogInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar a selecao de tamanho atual e selecionar o tamanho grande
            seleciona('.hotdogInfo--size.selected').classList.remove('selected')
            // marcar o que vc clicou, ao inves de usar e.target use size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.hotdogInfo--actualPrice').innerHTML = formatoReal(hotdogJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.hotdogInfo--qtmais').addEventListener('click', () => {
        quanthotdog++
        seleciona('.hotdogInfo--qt').innerHTML = quanthotdog
    })

    seleciona('.hotdogInfo--qtmenos').addEventListener('click', () => {
        if(quanthotdog > 1) {
            quanthotdog--
            seleciona('.hotdogInfo--qt').innerHTML = quanthotdog	
        }
    })
}
const adicionarNoCarrinho = () => {
    seleciona('.hotdogInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual hotdog? pegue o modalKey para usar hotdogJson[modalKey]
    	console.log("hotdog " + modalKey)
    	// tamanho
	    let size = seleciona('.hotdogInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	    // quantidade
    	console.log("Quant. " + quanthotdog)
        // preco
        let price = seleciona('.hotdogInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = hotdogJson[modalKey].id+'t'+size

        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quanthotdog
        } else {
            // adicionar objeto hotdog no carrinho
            let hotdog = {
                identificador,
                id: hotdogJson[modalKey].id,
                size, // size: size
                qt: quanthotdog,
                price: parseFloat(price) // price: price
            }
            cart.push(hotdog)
            console.log(hotdog)
            console.log('Sub total R$ ' + (hotdog.qt * hotdog.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let hotdogItem = hotdogJson.find( (item) => item.id == cart[i].id )
			console.log(hotdogItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let hotdogSizeName = cart[i].size

			let hotdogName = `${hotdogItem.name} (${hotdogSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = hotdogItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = hotdogName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}


// MAPEAR pizzaJson para gerar lista de hotdog
hotdogJson.map((item, index ) => {
    //console.log(item)
    let hotdogItem = document.querySelector('.models .hotdog-item').cloneNode(true)
    //console.log(hotdogItem)
    //document.querySelector('.hotdog-area').append(hotdogItem)
    seleciona('.hotdog-area').append(hotdogItem)

    // preencher os dados de cada hotdog
    preencheDadosDoshotdog(hotdogItem, item, index)
    
    // hotdog clicada
    hotdogItem.querySelector('.hotdog-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou no hotdog')

        
        let chave = pegarKey(e)
      

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.hotdogInfo--qt').innerHTML = quanthotdog

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)
        
        
    })

    botoesFechar()

}) // fim do MAPEAR pizzaJson para gerar lista de hotdog

// mudar quantidade com os botoes + e -
mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()

