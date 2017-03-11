(function ($) {

    var clipboard = new Clipboard('.clipboard');

    clipboard.on('success', function (e) {
        Materialize.toast('Copied to clipboard', 4000);
        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        Materialize.toast('Cannot copy to clipboard :(', 4000);
    });

    // $('input.autocomplete').on('change keyup', function () {
    //     vue.validateName($(this).val());
    // });

})(jQuery);