import { selectFiller } from './master.js';
import { Lista } from './master.js';
class listaProduto extends Lista {
    constructor(){
        //   console.log('ano') 
    super();
        self = this;
        this.init();
    }

    init(){ 
        //   console.log('ano')
            // Datatable
          
      // if($('.datatable-new').length > 0) {
      //   $('.datatable-new').DataTable({
      //     "bFilter": true,
      //     "sDom": 'fBtlpi',  
      //     "ordering": true,
      //     "language": {
      //       search: ' ',
      //       sLengthMenu: '_MENU_',
      //       searchPlaceholder: "Search",
      //       info: "_START_ - _END_ of _TOTAL_ items",
      //       paginate: {
      //         next: ' <i class=" fa fa-angle-right"></i>',
      //         previous: '<i class="fa fa-angle-left"></i> '
      //       },
      //     },
      //     initComplete: (settings, json)=>{
      //       $('.dataTables_filter').appendTo('#tableSearch');
      //       $('.dataTables_filter').appendTo('.search-input');
      //     },	
      //   });
      // }

      self = this;
   
    this.nomeTabela = "tabela_produto";
    this.url = "assets/model/produto.php";

    this.colunas = ['nome_produto',
      'codigo_stock',
      'nome_categoria',
      'marca_produto',
      'preco_de_venda',
      'tipo_venda',
      'quantidade_estoque',
      'action'];

    this.sort = [0, "desc"];

    this.dataRequest = {
      request: "listar",
    };

    this.notOrderable = [7];
    this.collumnFilter = [2, 3, 4];

    this.lista();

    
    $('#tabela_produto').on('click', '.detalhe-produto', function () {
      var id = $(this).data('id');
      window.open("product-details.html?id_produto=" + id, "_self");

    });
    }
}

class adicionarStock extends selectFiller {
    constructor(){
        super();
        self = this;
            this.init();
            this.carregarStock();

    }

    async init(){
        await this.getSelect('armazem', 'slc_armazem', ['armazem', 'id', 'id']);

        
        $('#slc_produtos').on('change', function() {
          const selectedValue = $(this).val();
          // Faça o que desejar com o valor selecionado
          console.log('Produto selecionado:', selectedValue);
      });
      }


      async carregarStock() {
        self = this;
        var categorias = [];
        var produtos = [];
    
        try {
          await $.ajax({
            url: "assets/model/stock.php",
            method: "POST",
            data: { request: 'stock_lista' },
            dataType: "json",
    
            success: function (response) {
              if (response.status == true) {

              //   $('.select2-sasa').select2({
              //     placeholder: "Select a product...",
              //     width: '100%'
              // });
                // $('.select2').select2();
                self.dados_produto = response.data;
                Object.entries(response.data).forEach(([categoria, produtosArr]) => {
                  categorias.push(categoria);
                  // console.log(`Categoria: ${categoria}`);
                  produtosArr.forEach(produto => {
                    produtos.push(produto);
                    // console.log(' -', produto);
                  });
                });

                // Para o select de categorias
                // function preencherSelectComOptgroups() {
                                   const $select = $('#slc_produtos');
                  $select.empty().append('<option value="" selected disabled>Selecione um produto</option>');
                  
                  $.each(response.data, function(categoria, produtos) {
                      const $optgroup = $(`<optgroup label="${categoria}"></optgroup>`);
                      $.each(produtos, function(index, produto) {
                          $optgroup.append(`<option value="${produto}">${produto}</option>`);
                      });
                      $select.append($optgroup);
                  });
              // }

              //   $('#nested-select').select2({
              //     placeholder: "Choose an option...",
              //     allowClear: true,
              //     width: '100%'
              //     // data: yourOptgroupData // for dynamic data
              // });

            //   $('#ajax-select').select2({
            //     ajax: {
            //         url: '/api/search', // Your API endpoint
            //         dataType: 'json',
            //         delay: 250,
            //         data: function (params) {
            //             return {
            //                 q: params.term,
            //                 page: params.page
            //             };
            //         },
            //         processResults: function (data, params) {
            //             return {
            //                 results: data.items // Expected format with optgroups
            //             };
            //         }
            //     },
            //     placeholder: "Type to search...",
            //     minimumInputLength: 2
            // });

                const $selectt = $('#nested-select');

                $.each(response.data, function(group, items) {
                  const $optgroup = $('<optgroup></optgroup>').attr('label', group);
                  $.each(items, function(index, item) {
                    $optgroup.append($('<option></option>').text(item));
                  });
                  $selectt.append($optgroup);
                });
                    //                 const array2d = Object.values(response.data);

                    // console.log(array2d);
                    // Supondo que response.data seja um objeto com categorias como chaves e arrays de produtos como valores

                    // Transforma em array 2D, mantendo a relação categoria-produtos
                    // const array2d = Object.entries(response.data).map(([categoria, produtos]) => {
                    //   // Cada subarray começa com o nome da categoria seguido dos produtos
                    //   return [categoria, ...produtos];
                    // });

                    // console.log(array2d);
                    /*
                    Exemplo de saída:
                    [
                      ["Eletrônicos", "Smartphone Galaxy S23 Ultra"],
                      ["Ferramentas para Obra", "Furadeira Parafusadeira Bivolt", "Furadeira Parafusadeira Boch"],
                      ["Limpeza", "Desinfetante Acty Pinho 5L "]
                    ]
                    */

                
    
                // $('#txt_nome_produto').text(response.data.nome_produto);
                // $('#txt_categoria').text(response.data.nome_categoria);
                // $('#txt_subcatgoria').text(response.data.nome_subcategoria);
                // $('#txt_marca').text(response.data.marca_produto);
                // $('#txt_unidade').text(response.data.produto_unidade);
                // $('#txt_codigo_stock').text(response.data.produto_codigo);
                // $('#txt_quantidade_minima').text(response.data.quantidade_minima_alerta);
                // $('#txt_quantidade').text(response.data.quantidade_estoque);
                // // $('#txt_imposto').text(response.data.filename);
                // // $('#txt_desconto').text(response.data.id);
                // $('#txt_preco').text(response.data.produto_preco);
    
                // $('#txt_estado').text(response.data.produto_estado);
                // $('#txt_descricao').text(response.data.produto_descricao);
                
                //Secção dos fotos 
    
                // ficheiro = "arquivos/produto/" + response.data.localizacao_produto + "/" + response.data.filename;
    
                // //verifica se o formato do ficheiro é compatível
                // if((response.data.filename.toLowerCase()).includes('.pdf')){
                //   $('#ficheiro_produto').attr('src', ficheiro);
                //   $('#ver_ficheiro').attr('href', ficheiro);
                // }else{
                //   $('.ficheiro-compativel').each(function () {
                //     $(this).addClass("d-none");
                //   });
                //   $('.ficheiro-incompativel').removeClass("d-none");
                // }
    
              }
    
            },
            erro: function (response) {
              Swal.fire({
                icon: "error",
                title: "Detalhes do Produto",
                html: "Ocorreu um erro ao carregar os dados do produto, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente."
            });
            console.log("Erro no sistema, Erro - ", response.responseText);
            }
          });
        } catch (error) {
          console.error(error);
          // console.log("Erro no sistema, Erro - ", response.responseText);
        }
      }

      // codigostock() {
      //   const now = new Date();
      //   const microseconds = now.getTime() * 150 + Math.floor(now.getMilliseconds() * 110);
      //   $('#txt_codigostock').val(String(microseconds).slice(-12).padStart(12, '1'));
      // }
    
      
    formcheck() {
      self = this;
      $("#form_adicionarstock").on("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Bootstrap validation
        if (this.checkValidity() === false) {
          $(this).addClass("was-validated");
          return;
        }

        // Captura dos dados

        self.adicionar_produto();
        // Exemplo: exibir no console
        // console.log(dados);

        // Aqui você pode enviar via AJAX ou outro processamento
      });
    }

}

class detalheProduto{
  constructor(idProduto) {
    // super();
    this.id_produto = idProduto;
    this.dados_produto;

    // this.preencherselect();

    self = this;

    // this.init();
    // this.formvalidation();
    this.carregarProduto(idProduto);
  }

  async carregarProduto(id_produto) {
    self = this;

    try {
      await $.ajax({
        url: "assets/model/produto.php",
        method: "POST",
        data: { request: 'detalhe', id_produto: id_produto },
        dataType: "json",

        success: function (response) {
          if (response.status == true) {
            self.dados_produto = response.data;

            $('#txt_nome_produto').text(response.data.nome_produto);
            $('#txt_categoria').text(response.data.nome_categoria);
            $('#txt_subcatgoria').text(response.data.nome_subcategoria);
            $('#txt_marca').text(response.data.marca_produto);
            $('#txt_unidade').text(response.data.produto_unidade);
            $('#txt_codigo_stock').text(response.data.produto_codigo);
            $('#txt_quantidade_minima').text(response.data.quantidade_minima_alerta);
            $('#txt_quantidade').text(response.data.quantidade_estoque);
            // $('#txt_imposto').text(response.data.filename);
            // $('#txt_desconto').text(response.data.id);
            $('#txt_preco').text(response.data.produto_preco);

            $('#txt_estado').text(response.data.produto_estado);
            $('#txt_descricao').text(response.data.produto_descricao);
            
            //Secção dos fotos 

            // ficheiro = "arquivos/produto/" + response.data.localizacao_produto + "/" + response.data.filename;

            // //verifica se o formato do ficheiro é compatível
            // if((response.data.filename.toLowerCase()).includes('.pdf')){
            //   $('#ficheiro_produto').attr('src', ficheiro);
            //   $('#ver_ficheiro').attr('href', ficheiro);
            // }else{
            //   $('.ficheiro-compativel').each(function () {
            //     $(this).addClass("d-none");
            //   });
            //   $('.ficheiro-incompativel').removeClass("d-none");
            // }

          }

        },
        erro: function (response) {
          Swal.fire({
            icon: "error",
            title: "Detalhes do Produto",
            html: "Ocorreu um erro ao carregar os dados do produto, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente."
        });
        console.log("Erro no sistema, Erro - ", response.responseText);
        }
      });
    } catch (error) {
      console.error(error.responseText);
      // console.log("Erro no sistema, Erro - ", response.responseText);
    }
  }

}

class gerirStock extends selectFiller{
    constructor(){
        super();
        self = this;
            this.init();
            this.carregarStock();
            // Supondo que você quer transferir o conteúdo de #div1 para #div2:
            // $('#product-search').html($('#lista-produtos').html());
            // $('#product-search').append($('#lista-produtos').children());

    }

    async init(){
        // await this.getSelect('armazem', 'slc_armazem', ['armazem', 'id', 'id']);
        // await this.detalhe();
      }

      

      // detalhe(){
      //   $.ajax({
      //     url: 'assets/model/stock.php',
      //     type: 'POST',
      //     dataType: 'json',
      //     data: {
      //         request: 'stock_lista' // substitua pelo id desejado
      //     },
      //     success: function(response) {
      //         if (response.status === true) {
      //             // Manipule os dados recebidos
      //             console.log(response.data);
      //         } else {
      //             // Trate erro de dados não encontrados
      //             alert('Produto não encontrado!');
      //         }
      //     },
      //     error: function(xhr, status, error) {
      //         // Trate erro de requisição
      //         console.error('Erro na requisição:', error);
      //     }
      // });
      // }

}

// $(document).ready(function () {
    document.addEventListener("DOMContentLoaded", function() {
    const dataMdulo = $('#stockjs').data('modulo');
    // console.log(dataMdulo)

 if(dataMdulo == 'stock-gerir'){
    const listaS = new gerirStock();
  } else if(dataMdulo == 'stock-adicionar'){
    const adicionarS = new adicionarStock();
    }
    
});