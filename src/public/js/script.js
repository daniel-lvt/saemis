$(document).ready(() => {
    $('id_foro').DataTable();
});
$(document).ready(() => {
    $('#id_user_root').DataTable();
});
$(document).ready(() => {
    $('#id_user_admin').DataTable();
});
$(document).ready(() => {
    $('#id_user').DataTable({
        "scrollY": "600px",
        "scrollCollapse": true,
        "paging": true,
    });
})
tinymce.init({
    selector: '#example'
});