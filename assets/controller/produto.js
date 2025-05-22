import { selectFiller } from './master.js';
class listaProduto{
    constructor(){
		//   console.log('ano') 
		self = this;
		this.init();
    }
    init(){ 
		//   console.log('ano')
        	// Datatable
          
      if($('.datatable-new').length > 0) {
        $('.datatable-new').DataTable({
          "bFilter": true,
          "sDom": 'fBtlpi',  
          "ordering": true,
          "language": {
            search: ' ',
            sLengthMenu: '_MENU_',
            searchPlaceholder: "Search",
            info: "_START_ - _END_ of _TOTAL_ items",
            paginate: {
              next: ' <i class=" fa fa-angle-right"></i>',
              previous: '<i class="fa fa-angle-left"></i> '
            },
          },
          initComplete: (settings, json)=>{
            $('.dataTables_filter').appendTo('#tableSearch');
            $('.dataTables_filter').appendTo('.search-input');
          },	
        });
      }
    }
	
}


class adicionarProduto extends selectFiller {
    constructor(){
        super();
        self = this;
        // document.addEventListener("DOMContentLoaded", function() {

            this.init();
        // });

    }

    async init(){
      
        await this.getSelect('armazem', 'slc_armazem', ['armazem', 'armazem', 'id']);
        await this.getSelect('categoria', 'slc_categoria', ['categoria', 'categoria', 'id']);

      $('#submeter-adicionar-categoria').on('click', function () {
        $("#txt_nova_categoria").val().trim().length > 0 ? self.guardar_categoria() : true;
  
      });
    }
    
    getSelect(tabela, elementoId, keys) {
        let self = this;
        return new Promise((resolve, reject) => {
            var element = document.getElementById(elementoId);
            // console.log(document.getElementById('slc_armazem'));
            $.ajax({
                url: 'assets/model/request.php',
                type: 'post',
                data: { request_geral: 'listar_slc', tabela: tabela },
                dataType: 'json',
                success: function (response) {
                    self.fillSelect(element, response, keys);
                    resolve();
                },
                error: function (error) {
                    reject(error);
                }
            })
        });
      }

guardar_categoria() {
    self = this;
    var dadosCategoria = new FormData();

    function pushData(key, value) {
      const valor = value ?? ""; // Use nullish coalescing operator for cleaner code
      dadosCategoria.append(key, valor);
    }

    function request(dados) {
      $.ajax({
        url: 'assets/model/categoria.php',
        type: "post",
        data: dados,
        dataType: "JSON",
        processData: false,
        contentType: false,
        success: function (response) {
          if (response.status == true) {
            // Swal.fire({
            //   icon: "success",
            //   title: "Registrar o Centro",
            //   html: "O centro foi guardado com sucesso!",
            //   allowEscapeKey: false,
            //   allowOutsideClick: false,
            //   confirmButtonText: "OK",
            //   preConfirm: () => {
            //     $('#modal_novo_centro').modal('hide');
            //     self.tabela.ajax.reload();
            //   }
            // });
            $('#modal-adicionar-categoria').modal('hide')
          }

          if (response.status == false) {
            console.error("Unknown error code:", response.code);
            switch (response.code) {
              case 2:
                console.log(response.code);
                Swal.fire({
                  icon: "warning",
                  title: "Erro ao Registrar o Centro",
                  html: 'Nome de Ficheiro <b>Inválido</b> <p></p> Altere o <b>nome do ficheiro</b> e tente novamente</p>'
                });
                break;
              case 1:
                // modal-categoria-duplicada
                $('#modal-categoria-duplicada').modal('show');
              break;;
              case 3:
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Registrar o Centro",
                  html: errorMessage
                });
                break;
              default:
                $('#modal-categoria-erro').modal('show')
                console.error("Unknown error code:", response.code);
            }
          }
        },
        error: function (response) {
          $('#modal-categoria-erro').modal('show');
          console.log('Erro no sistemaa, Erro - ',response.responseText);
        }
      });
    }

    pushData("request", 'guardar');
    // pushData("conteudo", [["categoria", $("#txt_nova_categoria").val()]]);
    // pushData("condicao", [['categoria', $("#txt_nova_categoria").val()]]);
    pushData("categoria", $("#txt_nova_categoria").val());
    // pushData("provincia", $("#slc_provincia").val());
    // pushData("distrito", $("#txt_distrito").val());

    request(dadosCategoria);
  }

}

// $(document).ready(function () {
    document.addEventListener("DOMContentLoaded", function() {
	const dataMdulo = $('#produtojs').data('modulo');
	// console.log(dataMdulo)

 if(dataMdulo == 'produto-lista'){
    const listaP = new listaProduto();
 } else if(dataMdulo == 'produto-adicionar'){
     const listaP = new adicionarProduto();
    }
    
    // console.log(document.getElementById('slc_armazem'));
});