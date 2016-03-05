/**
 * Created by Joachim on 05.03.2016.
 */
//globale Variablen für
window.__Const_Top = 120;

window.__z = 0; 	//aktueller z-index
window.__t = 0;		//aktuelle top position von neuen Kärtchen
window.__l = 0;		//aktuelle left position von neuen Kärtchen
window.__lvl = 0; 	//hilfe level
window.__d = 0; 	//speichert ob der Nutzer schon kärtchen verschoben hat

//Inititialisierung
function init(){
    //vorhandene Inhalte Ziehbar machen
    makeDraggable();

    //Tips sollen beim ANklicken wieder verschwinden
    $('.help').on('click', function(){
        $(this).removeClass('active');
    });

    //Tastaturbefehle abfangen
    $( "#post" ).keypress(function(e) {
        //wenn <strg>+<return> gedrückt wird, Formular absenden
        if((e.keyCode == 13 || e.keyCode == 10) && e.ctrlKey){
            createEl($('#post'));

            /*}else if(e.keyCode==27){//ESC => Formular ein-/ausblenden
             toggleForm();*/
        }
    });
    $(document).keypress(function(e) {
        if(e.keyCode==27){//ESC => Formular ein-/ausblenden
            toggleForm();
        }
    });
    //zum entwickeln der Hilfetexte folgende Zeile entkommentieren
    // localStorage.removeItem('metaplan-tips');
}

//Karte löschen
function deleteEl(el){
    var post = $(el).parents('p.post');
    post.remove();

}
//Karte bearbeiten
function editEl(el){

    var btn = $(el);
    var post = btn.parents('p.post');

    if(btn.hasClass('active')){

        $('.toolbar').remove();
        $('p').draggable( "enable" );


    }else{
        btn.addClass('active')
        post.draggable( "disable" );
        post.find('span.content')[0].focus();
        post.css('cursor','auto');

    }

}


//Aussehen eine Karte Wechseln
function colorEl(el){
    //ausgehend vom [Farb] Button den p-Tag eines Beitrags (post) ermitteln
    var post = $(el).parents('p.post');

    //Layouteinstellungen zurücksetzen
    post.removeClass('bold');
    post.removeClass('red');
    post.removeClass('green');
    post.removeClass('blue');

    //die Klasse des gewählten Toolbar Button auf die Karte übertragen
    if($(el).hasClass('bold')){
        post.addClass('bold');
    }else if($(el).hasClass('red')){
        post.addClass('red');
    }else if($(el).hasClass('green')){
        post.addClass('green');
    }else if($(el).hasClass('blue')){
        post.addClass('blue');
    }

    //Werkzeugleiste ausblenden
    if(!$('.toolbar').find('.edit').hasClass('active'))
        $('.toolbar').remove();

}


//Beim Klicken auf die Metaplan Karte, soll eine kleine Werkzeugleiste erscheinen
function showToolbar(el, clickedElem){
    var tb;

    //die Toolbar existiert und wurde benutzt => nix unternehmen
    if(clickedElem && $(clickedElem).parents('.toolbar').length > 0){
        return;
    }

    //Die Toolbar existier, es wurde auf das Kärtchen geklickt => ausblenden
    tb = $(el).find('.toolbar');
    if( tb.length>0 ) {
        if(tb.find('.edit').hasClass('active')){
            return;
        }
        tb.remove();
    }else{

        //Werkzeugleiste innerhalb des aktiven Elements(Karte) erstellen
        $(el).find('span.tbar').append( '<div class="toolbar">'
            +'<div class="del" title="Karte löschen">X</div>'
            +'<div class="edit" title="Inhalt bearbeiten">'
            +'<img src="http://upload.wikimedia.org/wikipedia/commons/4/4c/Edit_font_awesome.svg">'
            +'</div>'
            +'<div class="clr bold" title="Fett">F</div>'
            +'<div class="clr yellow">&nbsp;</div>'
            +'<div class="clr red">&nbsp;</div>'
            +'<div class="clr blue">&nbsp;</div>'
            +'<div class="clr green">&nbsp;</div>'
            +'</div>' );
        $('.del').on('click', function(){ deleteEl(this); } );
        $('.clr').on('click', function(){ colorEl(this); }  );
        $('.edit').on('click', function(){ editEl(this); }  );

        tb = $(el).find('.toolbar');
        tb.css({'position':'absolute',top:'-25px','left':'0px'});
        tb.show();
    }
}



//eine neue Karte nach absenden der Daten erstellen
function createEl(el){
    //Den Inhalt des Eingabefelds in der Variabel c speichern
    var c = $('#post').val().trim();

    //Wenn der Inhalt nicht leer ist
    if(c){

        //z-index erhöhen damit das neue kärtchen ganz oben liegt
        window.__z ++; window.__l +=2;

        //top erhöhen, damit das Kärtchen etwas weiter unten liegt
        if(__t === 0) __t = __Const_Top;
        window.__t +=30;

        //eine unverwechselbar ID generieren
        id = 'post-'+Math.round(Math.random() * 10000000);

        //Text-Umbrüche durch HTML <br> ersetzen
        c = c.replace( /\n/g,'<br>');

        //HTML-Gerüst für die neue Karte

        c = '<p id="'+id+'" class="post">'
            + '<span class="tbar"/>'	/* Platzhalter für Werkzeugleiste */
            + '<span class="content" contenteditable="true">'
            +c+'</span>'		/* Der eingegebene Inhalt */
            + '</p>';

        //Am Ende des Platzhalters <div id="thesen"> anfügen
        $('#thesen').append( c );

        //Eingabefeld leeren und den Cursor-Focus wieder in das Feld setzen
        //Damit man ohne Klick sofort das nächste Kärtchen schreiben kann
        $('#post').val('');
        $('#post')[0].focus();

        //das neu erzeugte Element positionieren
        var el = $('#'+id);
        el.css({'z-index':__z,'top': __t +'px','left': __l +'px'})

        //Drag&Drop funktionalität auch zu dem neu erzeugten Elemenet hinzufürgen

        el.draggable(); /* ab jetzt kann man ziehen */

        //Wenn der Nutzer anfängt, ein Kärtschen zu ziehen....
        el.on('dragstart', function(e){
            //Beim Ziehen eines Kärtchen sollte dieses immer ganz oben sein
            //dazu den z-index des aktuellen Kärtchens erhöhen
            window.__t = __Const_Top;
            window.__z ++;
            el.css('z-index', window.__z);
            //alle Hilfen ausblenden
            $('.toolbar').remove();
        });

        //Wenn der Nutzer das Kärtchen loslässt
        el.on('dragstop', function(e){
            //registrieren wenn der Nutzer ein Kärtchen verschoben hat
            __d++;
            //Hilfestellungen geben
            showTip();
        });

        //Beim Klick auf das Kärtchen soll die Werkzeugleiste angezeigt werden
        //dazu dem onclick ereignis die Funktion "showToolbar" zuordnen
        el.on('click', function(e){
            showToolbar(this, e.target);
            //el.draggable( "enable" );
        });
        //Zum Editieren (Doppelklick) muss die Drag 'n Drop Funktion vorrübergehend abgeschaltet werden
        el.on('dblclick', function(){
            // el.draggable( "disable" );
        });
        //Hilfe-Tips zur Bedienung anzeigen
        showTip();
    }
}

//bereits gespeicherte Metaplankarten müssen beim Laden der Seite händelbar gemacht werden
//siehe Erklärungen beim neu anlegen eines Kärtchens
function makeDraggable(){
    $('#thesen p').draggable();
    $('#thesen p').on('click', function(){
        showToolbar(this);
    });
    $('#thesen p').on('dblclick', function(){
        $(this).draggable( "disable" );
    });
}


//Formularbox ein und ausblenden
//dazu wird der oberer Rand des Formular in in den negativen Bereich (nach oben) geschoben

function toggleForm(){

    //top position (margin-top) des Formulars ermitteln
    var pos = $('.formula').css('margin-top').replace('px','');

    //falls der wert bereits negativ ist auf 0 setzen (Formular ist dann sichtbar)
    //sonst um den Wert der Formularhöhe mal -1  nehmen
    //(Formular ist oberhalb des sichtbaren Seiten-Bereiches)
    var t = (Number(pos) < 0)? 0 : ($('.formula').height() *-1);
    var o = (Number(pos) < 0)? 1 : 0;

    if(t>-1) $('#post').focus();

    //den Forgang animieren, so dass das Formular langsam nach oben oder unten schiebt
    $('.formula').animate({'margin-top': t+'px', opacity:o}, function(){
        //am Ende der Animation den Editierknopf ein- bzw. ausblenden
        //$('#toggleFormBtn').fadeToggle();
    });



}

//Nutzungslevel abhängige Hilfe, die angezeigt wird,
//wenn der User etwas erfolgreich ein neues Level erreicht hat
//und inaktiv ist, wenn ein Nutzer das max Level erreicht hat

function showTip(){
    if(localStorage.getItem('metaplan-tips')){
        return;
    }
    var max = $('.help').length -1;
    if (__lvl > max){
        return;
    }else if(__z == 1 ){  //erste Karte erzeugt
        _displayTip(1)
        __lvl ++ ;
    }else if(__z == 10 ){ //10 mal Karten erzeugt/verschoben
        __lvl ++ ;
        _displayTip(3)
    }else if(__d == 1 ) { //Karte zum ersten mal verschoben
        __lvl ++ ;
        _displayTip(4)
    }else if( __lvl == 3){ //weiterer Tip (wie man speichert)
        __lvl ++;
        _displayTip(2)
    }else if(__z == 20 && __lvl >3 ){ //noch ein Tip
        __lvl ++ ;
        _displayTip(6)
    }else if(__lvl == max){ //max Level erreichet
        __lvl++;
        _displayTip(5);
        //im Browser speichern, dass alle Tipps angezeigt wurden
        localStorage.setItem('metaplan-tips', 1);
    }else if(__lvl > max){

    }
}

//Helfer Routine von showTip():
//Aktive Tips ausblenden, (Klasse "active" löschen)
//danach den übergebenen Hilfetext mit der Nr (n) aktivieren
// (Klasse "active" hinzufügen)

function _displayTip(n){
    $('.help').removeClass('active');
    $('#help-'+n).addClass('active');
}
