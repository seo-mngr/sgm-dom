var $modalFormWrapper = $('.modal-form-wrapper');
var $modalForm = $('.modal-form', $modalFormWrapper);
var $modalContent = $('.live-content', $modalFormWrapper);

function closeModalForm() {
    $modalFormWrapper.fadeOut(200, function () {
        $modalContent.html('');
        $modalForm.attr('class', 'modal-form');
    });
}

function openModalForm(formContent, formClass) {
    $modalForm.attr('class', 'modal-form');
    if (formContent && formClass) {
        $modalForm.addClass(formClass);
        $modalContent.html(formContent);
    }
    $modalFormWrapper.fadeIn(200);
    $("input[type='tel']:not(.calc-input)").inputmask("+7(999)-999-99-99");
}

$($modalForm).on('click', '.close', function () {
    closeModalForm();
});
$('body').on('click', '.modal-form-wrapper', function (e) {
    if (e.target != this) {
        return;
    } else {
        closeModalForm();
    }
});
$('body').on('click', '.open-modal-form', function (e) {
    var $this = $(this);

    var modalType = $(this).data('modal-type');

    var modalTitle = ($(this).data('modal-title')) ? $(this).data('modal-title') : '';
    var modalDesc = ($(this).data('modal-desc')) ? $(this).data('modal-desc') : '';
    var modalText = ($(this).data('modal-text')) ? $(this).data('modal-text') : '';
    var modalImage = ($(this).data('modal-image')) ? $(this).data('modal-image') : '';
    var modalLbl = ($(this).data('modal-lbl')) ? $(this).data('modal-lbl') : '';

    var submitButtonText = ($(this).data('modal-button-text')) ? $(this).data('modal-button-text') : 'Отправить';
    var modalFormSubject = $(this).data('modal-form-subject');

    $.ajaxSetup({cache: false});
    $.get($('body').data('theme-name')+"/includes/templates/modal-forms/" + modalType + ".html", function(response) {
        var $modalHtml = $(response);

        $modalHtml.find('.modal-submit-button-text').html(submitButtonText);
        $modalHtml.find('form').attr('data-form-subject', modalFormSubject);

        (modalTitle) ? $modalHtml.find('.modal-title').html(modalTitle) : $modalHtml.find('.modal-title').remove();
        (modalDesc) ? $modalHtml.find('.modal-desc').html(modalDesc) : $modalHtml.find('.modal-desc').remove();
        (modalText) ? $modalHtml.find('.modal-text').html(modalText) : $modalHtml.find('.modal-text').remove();
        (modalImage) ? $modalHtml.find('.modal-image img').attr('src', modalImage) : $modalHtml.find('.modal-image').remove();
        (modalLbl) ? $modalHtml.find('.modal-lbl').html(modalLbl) : $modalHtml.find('.modal-lbl').remove();

        openModalForm($modalHtml, modalType);
        if (modalType == 'map-modal') {
            $('#map-modal-map', $modalHtml).data($this.data());
            initYmap($('#map-modal-map', $modalHtml), '');
        }
    });
    return false;
});
