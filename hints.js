//Aktive Tips ausblenden, (Klasse "active" löschen)
//danach den übergebenen Hilfetext mit der Nr (n) aktivieren
// (Klasse "active" hinzufügen)
function showTip(n){
    n=n||0;

    if($('#help-'+n).hasClass('active')){
        $('.help').removeClass('active');
    }else{
        $('.help').removeClass('active');
        $('#help-'+n).addClass('active');
    }
    $('.help.active').off();
    $('.help.active').on('click', function(){
        $('.help').removeClass('active');
    });

}
