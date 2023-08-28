
$(document).on('change', '#unit, #levels', function () {
    var unit = $('#unit').val();
    var level = $('#levels').val();

    $('#group option').css({ display: 'none' });

    $('#group option').filter(function () {
        let $this = $(this);
        return $this.data('level') && $this.data('level').includes(level) && $this.data('unit') && $this.data('unit').includes(unit);
    }).css("display", "block");

    $('#group option[value=""]').css("display", "block");
    $('#group option[value=""]').prop('selected', true);
});

$('.loadYourACL').click(function () {
    acl_manage.your_role();
})