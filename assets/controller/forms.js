$(document).ready(function() {
    $('.moneyInput').on('input', function() {
        let inputValue = $(this).val();
        
        // Remove all non-digit characters except for the decimal point
        inputValue = inputValue.replace(/[^0-9.]/g, '');
        
        // Split the input into whole and decimal parts
        let parts = inputValue.split('.');
        let wholePart = parts[0];
        let decimalPart = parts.length > 1 ? '.' + parts[1] : '';

        // Add thousands separators
        wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        // Combine whole and decimal parts
        $(this).val(wholePart + decimalPart);
    });
    $('.contacto').on('input', function() {
        let inputValue = $(this).val();
        
        // Remove all non-digit characters
        inputValue = inputValue.replace(/[^0-9]/g, '');
    
        // Define the whole part and decimal part
        let wholePart = inputValue.slice(0, 2) + ' ' + inputValue.slice(2, 5) + ' ' + inputValue.slice(5, 9);
        
        // Set the formatted value back to the input
        $(this).val(wholePart.trim());
    });
    
});
