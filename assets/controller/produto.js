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

$(document).ready(function () {
	const dataMdulo = $('#produtojs').data('modulo');
	// console.log(dataMdulo)

 if(dataMdulo == 'produto-lista'){
    const listaP = new listaProduto();
 }
});