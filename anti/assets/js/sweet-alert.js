$(function() {

  showSwal = function(type) {
  'use strict';
    if (type === 'basic') {
      swal.fire({
        text: 'Qualquer tolo pode usar um computador',
        confirmButtonText: 'Fechar',
        confirmButtonClass: 'btn btn-danger',
      })
    } else if (type === 'title-and-text') {
      Swal.fire(
        'A Internet?',
        'Essa coisa ainda existe?',
        'question'
      )
    } else if (type === 'title-icon-text-footer') {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Algo correu mal!',
        footer: '<a href>Por que tenho este problema?</a>'
      })
    } else if (type === 'custom-html') {
      Swal.fire({
        title: '<strong>Exemplo de <u>HTML</u></strong>',
        icon: 'info',
        html:
          'Você pode usar <b>texto em negrito</b>, ' +
          '<a href="//github.com">links</a> ' +
          'e outras tags HTML',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Ótimo!',
        confirmButtonAriaLabel: 'Polegar para cima, ótimo!',
        cancelButtonText:
          '<i data-feather="thumbs-up"></i>',
        cancelButtonAriaLabel: 'Polegar para baixo',
      });
      feather.replace();
    } else if (type === 'custom-position') {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'O seu trabalho foi salvo',
        showConfirmButton: false,
        timer: 1500
      })
    } else if (type === 'passing-parameter-execute-cancel') {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger mr-2'
        },
        buttonsStyling: false,
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'mr-2',
        confirmButtonText: 'Sim, delete!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Deletado!',
            'O seu arquivo foi deletado.',
            'success'
          )
        } else if (
          // Leia mais sobre como lidar com cancelamentos
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'O seu arquivo imaginário está seguro :)',
            'error'
          )
        }
      })
    } else if (type === 'message-with-auto-close') {
      let timerInterval
      Swal.fire({
        title: 'Alerta de fechamento automático!',
        html: 'Eu vou fechar em <strong></strong> segundos.',
        timer: 2000,
        onBeforeOpen: () => {
          Swal.showLoading()
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector('strong')
              .textContent = Swal.getTimerLeft()
          }, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        if (
          // Leia mais sobre como lidar com cancelamentos
          result.dismiss === Swal.DismissReason.timer
        ) {
          console.log('Eu fui fechado pelo temporizador')
        }
      })
    } else if (type === 'chaining-modals') {
      Swal.mixin({
        input: 'text',
        confirmButtonText: 'Próximo &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2', '3']
      }).queue([
        {
          title: 'Pergunta 1',
          text: 'Encadear modais swal2 é fácil'
        },
        'Pergunta 2',
        'Pergunta 3'
      ]).then((result) => {
        if (result.value) {
          Swal.fire({
            title: 'Tudo feito!',
            html:
              'As suas respostas: <pre><code>' +
                JSON.stringify(result.value) +
              '</code></pre>',
            confirmButtonText: 'Adorável!'
          })
        }
      })
    } else if (type === 'dynamic-queue') {
      const ipAPI = 'https://api.ipify.org?format=json'
      Swal.queue([{
        title: 'O seu IP público',
        confirmButtonText: 'Mostrar o meu IP público',
        text:
          'O seu IP público será recebido ' +
          'via requisição AJAX',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return fetch(ipAPI)
            .then(response => response.json())
            .then(data => Swal.insertQueueStep(data.ip))
            .catch(() => {
              Swal.insertQueueStep({
                icon: 'error',
                title: 'Incapaz de obter o seu IP público'
              })
            })
        }
      }])
    } else if (type === 'mixin') {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1113000
      });
      
      Toast.fire({
        icon: 'success',
        title: 'Iniciado sessão com sucesso'
      })
    }
  }

});
