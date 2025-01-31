$(document).ready(function () {
    (function(){
        $(".lead-form__control").each(function(){
            if( $(this).find(".lead-form__label_input").length == 1 ) {
                let label_input = $($(this).find(".lead-form__label_input")[0]);
                $($(this).find(".lead-form__input")[0]).on("focus", function(){
                    label_input.addClass("active");
                });
                $($(this).find(".lead-form__input")[0]).on("blur", function(){
                    if(!$(this).val()) {
                        label_input.removeClass("active");
                    }
                });
            }
        });
    }());

    (function(){
        var inProgress = false;
        var tmp_files = new Array();

        $('body').on('click', 'form:not(".filter-form") .submit', function() {
            $this = $(this).parents('form');
            $this.validate({
                errorPlacement: function(error, element) {},
                ignore: [],
                rules: {
                    name: {
                        minlength: 3,
                        maxlength: 30
                    },
                    phone: {
                        minlength: 5,
                        maxlength: 20,
                        phoneRule: true
                    },
                    email: {
                        minlength: 5,
                        maxlength: 50,
                        email: true
                    },
                },
                submitHandler: function(form) {
                    if (!inProgress) {
                        inProgress = true;
                        var submitDefaultValue = $(form).find('.submit').html();
                        $(form).find('.submit').html('Подождите');
                        var yandexMetrikaId;
                        var yandexGoalName;
                        if ($('body').data('yandex-goal-name')) {
                            yandexGoalName = $('body').data('yandex-goal-name');
                        }
                        if ($('body').data('yandex-metrika-id')) {
                            yandexMetrikaId = $('body').data('yandex-metrika-id');
                        }
                        var formData = new FormData(form);
                        formData.append('formSubject', $(form).data('form-subject'));
                        formData.append('emailTo', $('body').data('cb-email-to'));
                        formData.append('currentUrl', window.location.href);

                        var count = 0;
                        $.each(tmp_files, function (i, file) {
                            formData.append(count, file);
                            count++;
                        });
                        $.ajax({
                            url: $('body').data('theme-name')+"/handlers/sendMail.php",
                            type: "POST",
                            data: formData,
                            dataType: "json",
                            contentType: false,
                            cache: false,
                            processData: false
                        }).done(function(res) {
                            if (res.type == "error") {
                                alert(res.text);
                            }
                            if (res.type == "done") {
                                successModal(form);
                                clearForm(form);

                                if (yandexMetrikaId && yandexGoalName) {
                                    window['yaCounter' + yandexMetrikaId].reachGoal(yandexGoalName);
                                }
                                console.log(yandexMetrikaId);
                                console.log(yandexGoalName);
                                if (yandexGoalName == "telegram") {
                                    window.location.replace("https://t.me/spbsgm_bot");
                                } else if (yandexGoalName == "whatsapp") {
                                    window.location.replace("https://wa.me/78126451205");
                                }
                            }
                            $(form).find('.submit').html(submitDefaultValue);
                            inProgress = false;
                        });
                    }
                }
            });
        });

        $.validator.addMethod("phoneRule", function(value, element) {
            var phone = parseInt(value.replace(/\D+/g, ""));
            if (/(?:(?=((?=([^]))(?=\2{0,2}(?!\2)|\2{4,}(?!\2))\2+(?!\2)))\1)*(([^])\4{4}(?!\4))/.test(phone)) {
                return false;
            } else {
                if (phone.toString().length >= 11) {
                    return true;
                } else {
                    return false;
                }
            };
        });

        function clearForm(form) {
            $(form).find('input[type="text"]').val('');
            $(form).find('input[type="tel"]').val('');
            $(form).find('input[type="email"]').val('');
            $(form).find('textarea').val('');
            $(form).find('.attach-info').removeClass('added');
            $(form).find('.inp-file').val('');
            $(form).find('.file-added').html('').hide();
        }

        function successModal(form) {
            $.get($('body').data('theme-name')+"/includes/templates/modal-forms/success-modal.html", function(response) {
                var $modalHtml = $(response);
                $modalHtml.find('.modal-title').html(($(form).find('input[name="name"]').val()) ? $(form).find('input[name="name"]').val()+',' : $modalHtml.find('.modal-title').remove());
                openModalForm($modalHtml, 'success');
            });
        }
    }());
});
