import { selectFiller } from './master.js';
import { Lista } from './master.js';
class listaArmazem extends Lista {
  constructor() {
    //   console.log('ano')
    super();
    self = this;
    this.init();
    this.dados_armazem;

    this.init_alterarArmazem();

    
  
  // Exemplo de uso:


    // bootstrap.Toast(document.getElementById('dangerToast')).show()
    // const toast = new bootstrap.Toast(document.getElementById('dangerToast'))
    //     toast.show()

    // const conteudo = [
    //   ["CD", "Cabo Delgado"],
    //   ["GZ", "Gaza"],
    //   ["IB", "Inhambane"],
    //   ["MN", "Manica"],
    //   ["MC", "Maputo Cidade"],
    //   ["MP", "Matola"],
    //   ["NP", "Nampula"],
    //   ["NS", "Niassa"],
    //   ["SF", "Sofala"],
    //   ["TT", "Tete"],
    //   ["ZA", "Zambézia"],
    // ];

    // const select = document.getElementById("slc_provincia");
    // this.fillSelectFromArray(select, conteudo);
  }

   showToast(title, message) {
    $('#toast-title').text(title);
    $('#toast-body').text(message);
    var toastEl = document.getElementById('jsToast');
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
}
     showToastWarning(title, message) {
    $('#toast-warning-title').text(title);
    $('#toast-warning-body').text(message);
    var toastEl = document.getElementById('jsToastWarning');
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
}

  init() {
    self = this;
    this.formcheck();
    this.nomeTabela = "lista_armazem";
    this.url = "assets/model/armazem.php";
    this.colunas = [
      "armazem",
      "responsavel",
      // "cidade",
      "total_produtos",
      "stock_total",
      "activo",
      "action",
    ];

    this.sort = [0, "desc"];

    this.dataRequest = {
      request: "listar",
    };
    this.notOrderable = [5];
    this.collumnFilter = [0, 1, 2, 3, 4];

    this.lista();

    $("#lista_armazem").on("click", ".visualizar-armazem", function () {
      var id = $(this).data("id");
      self.carregarArmazem(id);
      // console.log("assss");
      // window.open("relatorio/detalhe.php?id_relatorio=" + id, "_self");
    });

    $("#lista_armazem").on("click", ".alterar-armazem", function () {
      var id = $(this).data("id");
      // console.log(id);
      self.carregarArmazemEdicao(id);
      // window.open("relatorio/detalhe.php?id_relatorio=" + id, "_self");
    });

    //faz o reset do formulario do modal de edicao
    $("#edit-units").on("hidden.bs.modal", function () {
      $(this).find("form")[0].reset();
      $(this).find("form").removeClass("was-validated");
    });

    $("#form_edit_armazem").on("submit", function (e) {
      e.preventDefault();
      // Sua lógica aqui
    });

    $('.telefone-control').on('input', function() {
      let valor = this.value.replace(/\D/g, '');
      if (valor.length > 9) valor = valor.slice(0, 9);
      if (valor.length > 2) {
          valor = valor.replace(/^(\d{2})(\d{0,3})(\d{0,4})$/, function(_, p1, p2, p3) {
              let out = p1;
              if (p2) out += ' ' + p2;
              if (p3) out += ' ' + p3;
              return out;
          });
      }
      this.value = valor;
  });

    //   $('#user2').on('change', function() {
    //     if ($(this).is(':checked')) {
    //         // Checkbox is checked
    //         console.log('Checkbox checked');
    //     } else {
    //         // Checkbox is unchecked
    //         console.log('Checkbox unchecked');
    //     }
    // });
  }

  init_alterarArmazem() {
    self = this;

    $("#form_edit_armazem").on("submit", function (event) {
      
      event.preventDefault();
      event.stopPropagation();

      // Bootstrap validation
      if (this.checkValidity() === false) {
        $(this).addClass("was-validated");
        return;
      }
      // Captura dos dados

      // self.adicionar_armazem();
      // Exemplo: exibir no console
      // console.log(self.verificar_alteracao());

      var idArmazem = $(this).find('#edit_id_armazem').val();
      // console.log(idArmazem);
      // self.verificar_alteracao();
      // self.alterar_armazem(idArmazem, self.verificar_alteracao()); 

      const alteracoes = self.verificar_alteracao();

      // console.log(Object.keys(alteracoes).length);
      if (Object.keys(alteracoes).length > 0) {
        self.alterar_armazem(idArmazem, alteracoes); 
      }
      else {
        self.showToastWarning('Aviso', 'Nenhum campo foi alterado!');
      }
      // else {
      //     // Tem alterações
      //     console.log('Alterações:', alteracoes);
      // }



      // Aqui você pode enviar via AJAX ou outro processamento
    });
  }

  init_adicionarArmazem() {}

  formcheck() {
    // self =
    $("#form_add_armazem").on("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      // Bootstrap validation
      if (this.checkValidity() === false) {
        $(this).addClass("was-validated");
        return;
      }

      // Captura dos dados

      self.adicionar_armazem();
      // Exemplo: exibir no console
      // console.log(dados);

      // Aqui você pode enviar via AJAX ou outro processamento
    });
  }

  adicionar_armazem() {
    self = this;
    var dadosArmazem = new FormData();

    function pushData(key, value) {
      const valor = value ?? ""; // Use nullish coalescing operator for cleaner code
      dadosArmazem.append(key, valor);
    }

    function request(dados) {
      $.ajax({
        url: "assets/model/request.php",
        type: "post",
        data: dados,
        dataType: "JSON",
        processData: false,
        contentType: false,
                    success: function (response) {
                if (response.status == true) {
                  Swal.fire({
                    icon: "success",
                    title: "Armazém Registrado",
                    html: "O armazém foi guardado com sucesso!",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    confirmButtonText: "OK",
                    preConfirm: () => {
                      $('#lista_armazem').modal('hide');
                      $('#add-units').modal('hide');
                      self.tabela.ajax.reload();
                    }
                  });
                  $("#modal-adicionar-categoria").modal("hide");
                }
              
                if (response.status == false) {
                  console.error("Unknown error code:", response.code);
                  switch (response.code) {
                    case 2:
                      Swal.fire({
                        icon: "warning",
                        title: "Erro ao Registrar o Armazém",
                        html: "Nome de ficheiro <b>inválido</b>. <br> Altere o <b>nome do ficheiro</b> e tente novamente.",
                      });
                      break;
                    case 1:
                      Swal.fire({
                        icon: "error",
                        title: "Nome já registrado",
                        text: "Já existe um armazém cadastrado com este nome. Por favor, escolha outro nome.",
                      });
                      break;
                    case 3:
                      Swal.fire({
                        icon: "error",
                        title: "Erro ao Registrar o Armazém",
                        html: errorMessage,
                      });
                      break;
                    default:
                      $("#modal-categoria-erro").modal("show");
                      Swal.fire({
                        icon: "error",
                        title: "Erro ao Registrar o Armazém",
                        html: "Ação não reconhecida ou não implementada. Por favor, tente novamente ou contacte o administrador do sistema.",
                      });
                      console.error("Unknown error code:", response.code);
                  }
                }
              },
              error: function (response) {
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Registrar o Armazém",
                  html:
                    "Por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente." +
                    "<p></p> Se o erro persistir, contacte o Administrador do Sistema para resolver o problema.",
                });
              
                $("#modal-categoria-erro").modal("show");
                console.log("Erro no sistema, Erro - ", response.responseText);
              },
      });
    }

    pushData("request_geral", "adicionar");

    const campos = [
      "armazem",
      "responsavel",
      "contacto",
      "provincia_localizacao",
      "bairro_localizacao",
      "avenida_localizacao",
      "rua_localizacao",
    ];
    const valores = [
      $("#nome_armazem").val(),
      $("#txt_responsavel_armazem").val(),
      $("#txt_telefone_armazem").val(),
      $("#slc_provincia").val(),
      $("#bairro_armazem").val(),
      $("#avenida_armazem").val(),
      $("#rua_armazem").val(),
    ];

    Array.from(campos).forEach(function (file) {
      pushData("coluna[]", file);
    });

    Array.from(valores).forEach(function (file) {
      pushData("valores[]", file);
    });

    const condicao = [
      ["armazem", $("#nome_armazem").val()]
    ];

    condicao.forEach(function (condition, index) {
      dadosArmazem.append(`condicao[${index}][]`, condition[0]); // key
      dadosArmazem.append(`condicao[${index}][]`, condition[1]); // value
    });

    pushData("tabela", "armazem");

    request(dadosArmazem);
  }

  // }

  // // Exemplo de uso:
  // const dados = extrairValoresArmazem();
  // if (dados) {
  //     console.log(dados);
  // }
  // }

  async carregarArmazem(id_armazem) {
    self = this;

    try {
      await $.ajax({
        url: "assets/model/armazem.php",
        method: "POST",
        data: { request: "detalhe", id_armazem: id_armazem },
        dataType: "json",
        success: function (response) {
          if (response.status == true) {
            // console.log(response.data.armazem);
            $("#view_armazem").val(response.data.armazem);
            $("#view_responsavel").val(response.data.responsavel);
            $("#view_numero_telefones").val(response.data.contacto);
            $("#view_enderoco").val(response.data.provincia_localizacao);
            $("#view_provincia").val(response.data.bairro_localizacao);
            $("#view_cidade").val(response.data.avenida_localizacao);
            $("#edit_id_armazem").val(response.data.id);
          } else {
            switch (response.code) {
              case 2:
                console.log(response.code);
                Swal.fire({
                  icon: "warning",
                  title: "Erro ao Visualizar Armazém",
                  // html: 'Nome de Ficheiro <b>Inválido</b> <p></p> Altere o <b>nome do ficheiro</b> e tente novamente</p>'
                });
                break;
              case 1:
                Swal.fire({
                  icon: "warning",
                  title: "Erro ao Visualizar Armazém",
                  // html: 'Nome de Ficheiro <b>Inválido</b> <p></p> Altere o <b>nome do ficheiro</b> e tente novamente</p>'
                });
                break;
              // modal-categoria-duplicada
              // $('#modal-categoria-duplicada').modal('show');
              // break;
              case 3:
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Visualizar Armazém",
                  html: errorMessage,
                });
                break;
              default:
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Visualizar Armazém",
                  html: "Ação não reconhecida ou não implementada. Por favor, tente novamente ou contacte o administrador do sistema.",
                });
                console.error("Unknown error code:", response.code);
            }
            console.error("Unknown error code:", response.code);
          }
        },
        error: function (response) {
          Swal.fire({
            icon: "error",
            title: "Detalhes do Armazem",
            html: "Não foi possível carregar os detalhes do armazém. Por favor, tente novamente ou contacte o administrador do sistema.",
          });
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async carregarArmazemEdicao(id_armazem) {
    self = this;

    try {
      await $.ajax({
        url: "assets/model/armazem.php",
        method: "POST",
        data: { request: "detalhe", id_armazem: id_armazem },
        dataType: "json",
        success: function (response) {
          if (response.status == true) {
            this.dados_armazem = null;
            self.dados_armazem = response.data;
            console.log(response.data.armazem);
            $("#edit_nome_armazem").val(response.data.armazem);
            $("#edit_txt_responsavel_armazem").val(response.data.responsavel);
            $("#edit_txt_telefone_armazem").val(response.data.contacto);
            $("#edit_slc_provincia")
              .val(response.data.provincia_localizacao)
              .change();
            $("#edit_bairro_armazem").val(response.data.bairro_localizacao);
            $("#edit_avenida_armazem").val(response.data.avenida_localizacao);
            $("#edit_rua_armazem").val(response.data.rua_localizacao);
            // response.data.activo ? $("#user2").prop("checked", true) : $("#user2").prop("checked", false);
              if(response.data.activo == 1){
                $("#user2").prop("checked", true);
              }else{
                $("#user2").prop("checked", false);
              }
              $("#edit_id_armazem").val(id_armazem);
              // console.log($('#form_edit_armazem').find('#edit_id_armazem').val());
              // console.log(id_armazem);
            // console.log(response.data.rua_localizacao);
          } else {
            switch (response.code) {
              case 2:
                console.log(response.code);
                Swal.fire({
                  icon: "warning",
                  title: "Erro ao Visualizar Armazém",
                  // html: 'Nome de Ficheiro <b>Inválido</b> <p></p> Altere o <b>nome do ficheiro</b> e tente novamente</p>'
                });
                break;
              case 1:
                Swal.fire({
                  icon: "warning",
                  title: "Erro ao Visualizar Armazém",
                  // html: 'Nome de Ficheiro <b>Inválido</b> <p></p> Altere o <b>nome do ficheiro</b> e tente novamente</p>'
                });
                break;
              // modal-categoria-duplicada
              // $('#modal-categoria-duplicada').modal('show');
              // break;
              case 3:
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Visualizar Armazém",
                  html: errorMessage,
                });
                break;
              default:
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Visualizar Armazém",
                  html: "Ação não reconhecida ou não implementada. Por favor, tente novamente ou contacte o administrador do sistema.",
                });
                console.error("Unknown error code:", response.code);
            }
            console.error("Unknown error code:", response.code);
          }
        },
        error: function (response) {
          Swal.fire({
            icon: "error",
            title: "Detalhes do Armazem",
            html: "Não foi possível carregar os detalhes do armazém. Por favor, tente novamente ou contacte o administrador do sistema.",
          });
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  verificar_alteracao() {

    function compararDados(novosDados, dadosExistentes) {
      let dadosRecentes = {};

      for (const key in novosDados) {
        if (novosDados[key] != dadosExistentes[key]) {
          // console.log(
          //   `Campo alterado: ${key}\nValor original: ${dadosExistentes[key]}\nNovo valor: ${novosDados[key]}`
          // );
          dadosRecentes[key] = novosDados[key];
        }
      }
      return dadosRecentes;
    }

    // const periodo_estatistico = $('#slc_periodo').val();
    let novosDados = {
      armazem: $("#edit_nome_armazem").val(),
      responsavel: $("#edit_txt_responsavel_armazem").val(),
      contacto: $("#edit_txt_telefone_armazem").val(),
      provincia_localizacao: $("#edit_slc_provincia").val(),
      bairro_localizacao: $("#edit_bairro_armazem").val(),
      avenida_localizacao: $("#edit_avenida_armazem").val(),
      rua_localizacao: $("#edit_rua_armazem").val(),
      activo: $("#user2").is(":checked") ? 1 : 0,
    };

    let dadosExistentes = {
      armazem: self.dados_armazem.armazem,
      responsavel: self.dados_armazem.responsavel,
      contacto: self.dados_armazem.contacto,
      provincia_localizacao: self.dados_armazem.provincia_localizacao,
      bairro_localizacao: self.dados_armazem.bairro_localizacao,
      avenida_localizacao: self.dados_armazem.avenida_localizacao,
      rua_localizacao: self.dados_armazem.rua_localizacao,
      activo: self.dados_armazem.activo,
    };

    return compararDados(novosDados, dadosExistentes);
  }

  alterar_armazem(id_armazem, dados) {
    self = this;
    var dadosArmazem = new FormData();

    function pushData(key, value) {
      const valor = value ?? ""; // Use nullish coalescing operator for cleaner code
      dadosArmazem.append(key, valor);
    }

    function request(dados) {
      $.ajax({
        url: "assets/model/request.php",
        type: "post",
        data: dados,
        dataType: "JSON",
        processData: false,
        contentType: false,
                success: function (response) {
          if (response.status == true) {
            Swal.fire({
              icon: "success",
              title: "Alteração do Armazém",
              html: "Os dados do armazém foram alterados com sucesso!",
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonText: "OK",
              preConfirm: () => {
                $('#edit-units').modal('hide');
                // ('#lista_armazem').ajax.reload();
                self.tabela.ajax.reload();
              }
            });
            $("#modal-adicionar-categoria").modal("hide");
          }
        
          if (response.status == false) {
            console.error("Unknown error code:", response.code);
            switch (response.code) {
              case 2:
                Swal.fire({
                  icon: "warning",
                  title: "Nome já registrado",
                        text: "Já existe um armazém cadastrado com este nome. Por favor, escolha outro nome.",
                });
                break;
              case 1:
                $("#modal-categoria-duplicada").modal("show");
                break;
              case 3:
                Swal.fire({
                  icon: "error",
                  title: "Erro na Alteração do Armazém",
                  html: errorMessage,
                });
                break;
              default:
                $("#modal-categoria-erro").modal("show");
                Swal.fire({
                  icon: "error",
                  title: "Erro na Alteração do Armazém",
                  html: "Ação não reconhecida ou não implementada. Por favor, tente novamente ou contacte o administrador do sistema.",
                });
                console.error("Unknown error code:", response.code);
            }
          }
        },
        error: function (response) {
          Swal.fire({
            icon: "error",
            title: "Erro na Alteração do Armazém",
            html: "Não foi possível alterar os dados do armazém. Por favor, tente novamente ou contacte o administrador do sistema.",
          });
        
          $("#modal-categoria-erro").modal("show");
          console.log("Erro no sistema, Erro - ", response.responseText);
        },
      });
    }

    pushData("request_geral", "alterar");

    // const campos = [
    //   "armazem",
    //   "responsavel",
    //   "contacto",
    //   "nnprovincia_localizacao",
    //   "bairro_localizacao",
    //   "avenida_localizacao",
    //   "rua_localizacao",
    // ];
    // pushData("id", "id");
    pushData("id", id_armazem);
    
    //caso seja alterado o nome do armazem
    //valida se o armazem ja existe
    for (const key in dados) {
      pushData("coluna[]", key);
      pushData("valores[]", dados[key]);

      if(key == 'armazem'){
        dadosArmazem.append(`condicao[0][]`, "armazem"); // key
        dadosArmazem.append(`condicao[0][]`, dados[key]); // value
      }
    }

    

   

    // condicao.forEach(function (condition, index) {
    //   dadosArmazem.append(`condicao[${index}][]`, condition[0]); // key
    //   dadosArmazem.append(`condicao[${index}][]`, condition[1]); // value
    // });

    pushData("tabela", "armazem");

    request(dadosArmazem);
  }
}



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