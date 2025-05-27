import { selectFiller } from './master.js';
import { Lista } from './master.js';
class listaArmazem extends Lista{
    constructor(){
		//   console.log('ano') 
        super();
		self = this;
		this.init();

    
    // bootstrap.Toast(document.getElementById('dangerToast')).show()
    const toast = new bootstrap.Toast(document.getElementById('dangerToast'))
        toast.show()
      /* Danger toast js */
      // const dangerToast = document.getElementById('dangerToastBtn')
      // const dangertoastExample = document.getElementById('dangerToast')
      // if (dangerToast) {
      //   dangerToast.addEventListener('click', () => {
      //     const toast = new bootstrap.Toast(dangertoastExample)
      //     toast.show()
      //   })
      // }
    }

    init(){ 

      self = this;
    this.nomeTabela = 'lista_armazem';
    this.url = 'assets/model/armazem.php';
    this.colunas = 
    ['armazem',
      'responsavel',
      'total_produtos',
      'stock_total',
      'activo',
      'action'];

    this.sort = [0, 'desc'];

    this.dataRequest = {
      request: "listar"
    };
    this.notOrderable = [5];
    this.collumnFilter = [0, 1, 2, 3, 4];

    this.lista();


    // $('#datatable-new').on('click', '.detalhe-relatorio', function () {
    //   var id = $(this).data('id');
    //   window.open("relatorio/detalhe.php?id_relatorio=" + id, "_self");

    // });
    }	

    visualizar_armazem(){
      
    }
    

    // async carregarArmazem(id_armazem) {
    //   self = this;
    //   // var ficheiro;
    //   // var documento_reconhecido;
  
    //   try {
    //     await $.ajax({
    //       url: "assets/model/armazem.php",
    //       method: "POST",
    //       data: { request: 'detalhe', id_armazem: id_armazem,
    //       dataType: "json",
  
    //       success: function (response) {
    //         if (response.status == true) {
    //           self.dados_armazem = response.data;
  
    //           $('#txt_armazem').text(response.data.armazem);
    //           $('#txt_responsavel').text(response.data.responsavel);
    //           $('#txt_numero_telefones').text(response.data.numero_telefones);
    //           $('#txt_enderoco').text(response.data.enderoco);
    //           $('#txt_provincia').text(response.data.provincia);
    //           $('#txt_cidade').text(response.data.cidade);
  
    //           // $('#txt_tipo_relatorio').text(response.data.localizacao_relatorio);
             
    //           // documento_reconhecido = response.data.documento_reconhecido;
  
    //           // $('#txt_documento_reconhecido').text(documento_reconhecido);
  
    //           //Secção dos Anexos 
  
    //           // ficheiro = "arquivos/relatorio/" + response.data.localizacao_relatorio + "/" + response.data.filename;
  
    //           // //verifica se o formato do ficheiro é compatível
    //           // if((response.data.filename.toLowerCase()).includes('.pdf')){
    //           //   $('#ficheiro_relatorio').attr('src', ficheiro);
    //           //   $('#ver_ficheiro').attr('href', ficheiro);
    //           // }else{
    //           //   $('.ficheiro-compativel').each(function () {
    //           //     $(this).addClass("d-none");
    //           //   });
    //           //   $('.ficheiro-incompativel').removeClass("d-none");
    //           // }
  
    //           // $('#transferir_ficheiro').attr('href', ficheiro);
    //           // $('#transferir_ficheiro').attr('download', response.data.filename_padrao);
  
    //           // console.log(response.user_id);
  
    //           // const funcao = response.user_funcao.toLowerCase();
    //           // if (response.data.user_insert == response.user_id || funcao == 'administrador' || funcao == 'm&t'|| funcao == 'it') {
    //           //   $(".alterar-relatorio").removeClass("d-none");
    //           }
    //         }
  
    //       },
    //       erro: function (response) {
    //         Swalig.fire({
    //           icon: "error",
    //           title: "Detalhes do Armazem",
    //           html: "Ocorreu um erro ao guardar os dados do relatório, por favor <b><i>retorne</i></b> ao Menu Principal e tente Novamente."
    //         });
    //       }
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
}


// class adicionarProduto extends selectFiller {
//     constructor(){
//         super();
//         self = this;
//         // document.addEventListener("DOMContentLoaded", function() {

//             this.init();
//         // });

//     }

//     async init(){
      
//         await this.getSelect('armazem', 'slc_armazem', ['armazem', 'armazem', 'id']);
//         await this.getSelect('categoria', 'slc_categoria', ['categoria', 'categoria', 'id']);

//       $('#submeter-adicionar-categoria').on('click', function () {
//         $("#txt_nova_categoria").val().trim().length > 0 ? self.guardar_categoria() : true;
//       });
//           $('#form_adicionarproduto').on('submit', function (e) {
//         e.preventDefault();
//         validar_produto() ? guardar_categoria() : true;
//       })
//     }
    
//     getSelect(tabela, elementoId, keys) {
//         let self = this;
//         return new Promise((resolve, reject) => {
//             var element = document.getElementById(elementoId);
//             // console.log(document.getElementById('slc_armazem'));
//             $.ajax({
//                 url: 'assets/model/request.php',
//                 type: 'post',
//                 data: { request_geral: 'listar_slc', tabela: tabela },
//                 dataType: 'json',
//                 success: function (response) {
//                     self.fillSelect(element, response, keys);
//                     resolve();
//                 },
//                 error: function (error) {
//                     reject(error);
//                 }
//             })
//         });
//       }

// // guardar_categoria() {
// //     self = this;
// //     var dadosCategoria = new FormData();

// //     function pushData(key, value) {
// //       const valor = value ?? ""; // Use nullish coalescing operator for cleaner code
// //       dadosCategoria.append(key, valor);
// //     }

// //     function request(dados) {
// //       $.ajax({
// //         url: 'assets/model/categoria.php',
// //         type: "post",
// //         data: dados,
// //         dataType: "JSON",
// //         processData: false,
// //         contentType: false,
// //         success: function (response) {
// //           if (response.status == true) {
// //             // Swal.fire({
// //             //   icon: "success",
// //             //   title: "Registrar o Centro",
// //             //   html: "O centro foi guardado com sucesso!",
// //             //   allowEscapeKey: false,
// //             //   allowOutsideClick: false,
// //             //   confirmButtonText: "OK",
// //             //   preConfirm: () => {
// //             //     $('#modal_novo_centro').modal('hide');
// //             //     self.tabela.ajax.reload();
// //             //   }
// //             // });
// //             $('#modal-adicionar-categoria').modal('hide')
// //           }

// //           if (response.status == false) {
// //             console.error("Unknown error code:", response.code);
// //             switch (response.code) {
// //               case 2:
// //                 console.log(response.code);
// //                 Swal.fire({
// //                   icon: "warning",
// //                   title: "Erro ao Registrar o Centro",
// //                   html: 'Nome de Ficheiro <b>Inválido</b> <p></p> Altere o <b>nome do ficheiro</b> e tente novamente</p>'
// //                 });
// //                 break;
// //               case 1:
// //                 // modal-categoria-duplicada
// //                 $('#modal-categoria-duplicada').modal('show');
// //               break;;
// //               case 3:
// //                 Swal.fire({
// //                   icon: "error",
// //                   title: "Erro ao Registrar o Centro",
// //                   html: errorMessage
// //                 });
// //                 break;
// //               default:
// //                 $('#modal-categoria-erro').modal('show')
// //                 console.error("Unknown error code:", response.code);
// //             }
// //           }
// //         },
// //         error: function (response) {
// //           $('#modal-categoria-erro').modal('show');
// //           console.log('Erro no sistemaa, Erro - ',response.responseText);
// //         }
// //       });
// //     }

// //     pushData("request", 'guardar');
// //     // pushData("conteudo", [["categoria", $("#txt_nova_categoria").val()]]);
// //     // pushData("condicao", [['categoria', $("#txt_nova_categoria").val()]]);
// //     pushData("categoria", $("#txt_nova_categoria").val());
// //     // pushData("provincia", $("#slc_provincia").val());
// //     // pushData("distrito", $("#txt_distrito").val());

// //     request(dadosCategoria);
// //   }

// //   guardar_produto() {
// //  let formData = new FormData();

// //         // Captura dos valores dos campos
// //         formData.append('armazem', $('#slc_armazem').val());
// //         formData.append('nome_produto', $('#txt_nomeproduto').val().trim());
// //         formData.append('marca_produto', $('#txt_marcaproduto').val().trim());
// //         formData.append('categoria', $('#slc_categoria').val());
// //         formData.append('tipo_venda', $('#slc_tipovenda').val());
// //         formData.append('quantidade', $('#txt_quantidade').val());
// //         formData.append('preco', $('#txt_preco').val().replace(',', '.'));
// //         formData.append('peso', $('#txt_peso').val());
// //         formData.append('quantidade_alerta', $('#txt_quantidaalerta').val());
// //         formData.append('data_fabricacao', $('#txt_datafabricacao').val());
// //         formData.append('validade', $('#txt_validade').val());
// //         formData.append('descricao', $('#txt_descricao').val());

// //         // Se houver campos de imagem:
// //         let fileInput = $('#form_adicionarproduto input[type="file"]')[0];
// //         if (fileInput && fileInput.files.length > 0) {
// //             for (let i = 0; i < fileInput.files.length; i++) {
// //                 formData.append('imagens[]', fileInput.files[i]);
// //             }
// //         }

// //         // Adicione outros campos conforme necessário

// //         $.ajax({
// //             url: 'assets/model/produto.php',
// //             type: 'POST',
// //             data: formData,
// //             processData: false,
// //             contentType: false,
// //             dataType: 'json',
// //             success: function (response) {
// //                 if (response.status === true) {
// //                     Swal.fire({
// //                         icon: 'success',
// //                         title: 'Produto adicionado com sucesso!',
// //                         confirmButtonText: 'OK'
// //                     }).then(() => {
// //                         // Redirecionar ou limpar formulário
// //                         window.location.reload();
// //                     });
// //                 } else {
// //                     Swal.fire({
// //                         icon: 'error',
// //                         title: 'Erro ao adicionar produto',
// //                         html: response.mensagem || 'Ocorreu um erro ao salvar o produto.'
// //                     });
// //                 }
// //             },
// //             error: function (xhr) {
// //                 Swal.fire({
// //                     icon: 'error',
// //                     title: 'Erro de sistema',
// //                     html: xhr.responseText || 'Ocorreu um erro inesperado.'
// //                 });
// //             }
// //         });
// //   }
// //   validar_produto() {
// //     let valido = true;
// //     let mensagens = [];

// //     // Armazém
// //     if (!$('#slc_armazem').val()) {
// //         valido = false;
// //         mensagens.push('Selecione o Armazém.');
// //     }

// //     // Nome do Produto
// //     if (!$('#txt_nomeproduto').val() || !$('#txt_nomeproduto').val().trim()) {
// //         valido = false;
// //         mensagens.push('O nome do produto é obrigatório.');
// //     }

// //     // Marca do Produto
// //     if (!$('#txt_marcaproduto').val() || !$('#txt_marcaproduto').val().trim()) {
// //         valido = false;
// //         mensagens.push('A marca do produto é obrigatória.');
// //     }

// //     // Categoria
// //     if (!$('#slc_categoria').val()) {
// //         valido = false;
// //         mensagens.push('Selecione a categoria.');
// //     }

// //     // Tipo de Venda
// //     if (!$('#slc_tipovenda').val()) {
// //         valido = false;
// //         mensagens.push('Selecione o tipo de venda.');
// //     }

// //     // Quantidade
// //     let quantidade = $('#txt_quantidade').val();
// //     if (!quantidade || isNaN(quantidade) || Number(quantidade) <= 0) {
// //         valido = false;
// //         mensagens.push('A quantidade deve ser maior que zero.');
// //     }

// //     // Preço
// //     let preco = $('#txt_preco').val();
// //     if (!preco || isNaN(preco.replace(',', '.')) || Number(preco.replace(',', '.')) <= 0) {
// //         valido = false;
// //         mensagens.push('Introduza um preço válido.');
// //     }

// //     // Peso Total
// //     let peso = $('#txt_peso').val();
// //     if (peso && (isNaN(peso) || Number(peso) < 0)) {
// //         valido = false;
// //         mensagens.push('O peso total não pode ser negativo.');
// //     }

// //     // Quantidade Mínima para Alerta
// //     let alerta = $('#txt_quantidaalerta').val();
// //     if (alerta && (isNaN(alerta) || Number(alerta) < 0)) {
// //         valido = false;
// //         mensagens.push('A quantidade mínima para alerta não pode ser negativa.');
// //     }

// //     // Descrição
// //     let descricao = $('#txt_descricao').val();
// //     if (descricao && descricao.length > 60) {
// //         valido = false;
// //         mensagens.push('A descrição deve ter no máximo 60 caracteres.');
// //     }

// //     if (!valido) {
// //         Swal.fire({
// //             icon: 'error',
// //             title: 'Erro de Validação',
// //             html: mensagens.join('<br>'),
// //             confirmButtonText: 'OK'
// //         });
// //     }

// //     return valido;
// // }



// }


 $(document).ready(function () {
    // document.addEventListener("DOMContentLoaded", function() {
	const dataMdulo = $('#armazemjs').data('modulo');
	// console.log(dataMdulo)

 if(dataMdulo == 'armazem-lista'){
    const listaP = new listaArmazem();
 } else if(dataMdulo == 'armazem-adicionar'){
     const listaP = new adicionarProduto();
    }
    
    // console.log(document.getElementById('slc_armazem'));
});