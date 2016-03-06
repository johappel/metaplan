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
window.__pointer = { x:0, y:0 } ;

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
    var post = $(el).parents('div.post');
    post.remove();

}
//Karte bearbeiten
function editEl(el){

    var btn = $(el);
    var post = btn.parents('div.post');

    if(btn.hasClass('active')){

        $('.toolbar').remove();
        $('div').draggable( "enable" );


    }else{
        btn.addClass('active')
        post.draggable( "disable" );
        post.find('div.content')[0].focus();
        post.css('cursor','auto');

    }

}


//Aussehen eine Karte Wechseln
function colorEl(el){
    //ausgehend vom [Farb] Button den div-Tag eines Beitrags (post) ermitteln
    var post = $(el).parents('div.post');
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

    if(clickedElem.className == 'toggle'){
        return false;
    }


    //die Toolbar existiert und wurde benutzt => nix unternehmen
    if(clickedElem && $(clickedElem).parents('.toolbar').length > 0){
        return;
    }

    //Die Toolbar existier, es wurde auf das Kärtchen geklickt => ausblenden
    //tb = $(el).find('.toolbar');

    tb = $(el).find('.toolbar');
    if( tb.length>0 ) {
        if(tb.find('.edit').hasClass('active')){
            return;
        }
        tb.remove();
    }else{

        //Werkzeugleiste innerhalb des aktiven Elements(Karte) erstellen
        $(el).find('span.tbar').first().append( '<div class="toolbar">'
            +'<div class="del" title="Karte löschen">X</div>'
            +'<div class="edit" title="Inhalt bearbeiten">'
            +'<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAYAAACJfM0wAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAJgAAACYB+E5zqwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFzSURBVDiN1dS/S5VRHMfx171pRWARQUuTOgQi4VSD0A9CnDSVIBxDUBsscHDrX7B/oEEw+gOMchAcHBzEyYbCQRRFywQdBFG0p+F8pYvdm8+9U33h4fA83/N5P59zvt9z+N+iUDI+xT005ND9xDImsIsbGMA0Pp8C6/ABnfiCg5ymdtAfjHncxj76MAODyOJDtdGKJrwORoZDdMBbfKsB2h6ut9AWBo8DPgqTWKsS2hXQEWxjDw/Ri3EUawE/x3cMY9PvLThAc+nEasCvsCEte6cEeoyhs5PzgAt4g694Ge5KnfaUE50Hrsc7nEhLPy1QJvXw/XKi4jlOi1KPN6MF67gQuS08wFwl8d8cXwpn3dKJvCZ1wTIapRP3EddrBWdScaawiJuRfxG5W2eFRRzhYgVwhpV4xuL9UbiGyzEelhMPh+BJBXiluIqF+OkfUZCq/gmPsYQfOaD1uCOttBuz5cCkLXmGu7iS0/Eq3qv+OvhH4xdNNWBdMgKaMgAAAABJRU5ErkJggg==">'
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

        //eine unverwechselbar ID generieren
        id = 'post-'+Math.round(Math.random() * 10000000);

        //Text-Umbrüche durch HTML <br> ersetzen
        c = c.replace( /\n/g,'<br>');

        //HTML-Gerüst für die neue Karte

        var karte=   '<div id="'+id+'" class="post">'
            +   '<span class="tbar"/>'	        /* Platzhalter für Werkzeugleiste */
            +   '<div class="content" contenteditable="true">'
            +       c
            +   '</div>'		                /* Der eingegebene Inhalt */
            +   '<ul class="childs"/>'        /* Angehängte Kärtchen */
            +   '<div class="toggle"/>'        /* Angehängte Kärtchen */
            + '</div>';

        //Am Ende des Platzhalters <div id="karten"> anfügen
        $('#karten').append( karte );

        //Eingabefeld leeren und den Cursor-Focus wieder in das Feld setzen
        //Damit man ohne Klick sofort das nächste Kärtchen schreiben kann
        $('#post').val('');
        $('#post')[0].focus();

        //das neu erzeugte Element positionieren
        addDragAndDropFunctions('#'+id );



    }
}

function getMyParent(el,selector){

    var parent = $(el).parents('.post');
    if(parent.length==0){
        parent = el
    }else{
        parent = parent[0];
    }
    if( selector ){
        parent = $(parent).find(selector)[0];
    }

    return parent;
}

function setToggle(el){


    var parent = $(el).parents('.post');
    if(parent.length>0){
        el = parent[0];
    }


    $(el).find('.post').removeClass('withchilds');
    $(el).removeClass('withchilds');
    $(el).find('.childs').css('min-height','auto');

    if( $(el).find('ul .post').length > 0 ){
        $(el).addClass('withchilds');
        $(el).find('ul .post').css({
            'top':'0',
            'left':'0'

        });
    }

    $(el).find('.toggle').off();
    $(el).find('.toggle:last').on('click', function(){

        if($(this).parents('.post').hasClass('closed')){

            $(this).parents('.post').removeClass('closed');

        }else{
            $(this).parents('.post').addClass('closed');
        };
    })
}

function addDragAndDropFunctions(element, exist){

    exist = exist || false;
    var elem = $(element);

    elem.__do_position = false;

    setToggle(elem);

    if(exist){

        elem.removeClass('ui-draggable');
        elem.removeClass('ui-droppable');

        if(window.__z < Number(elem.css('z-index')) ){
            window.__z =  Number(elem.css('z-index'));
        }


    }else{
        //z-index erhöhen damit das neue kärtchen ganz oben liegt
        window.__z ++;
        window.__l +=2;

        //top erhöhen, damit das Kärtchen etwas weiter unten liegt
        if(__t === 0) __t = __Const_Top;
        window.__t +=30;

        elem.css({'z-index':__z,'top': __t +'px','left': __l +'px'})
    }


    //Drag&Drop funktionalität auch zu dem neu erzeugten Elemenet hinzufürgen

    elem.draggable();
    elem.droppable({
        hoverClass: "ui-state-active",
        tolerance:'pointer',
        drop: function ( event, ui ){
                var parentpost =getMyParent(this);

                if($(parentpost).hasClass('closed')){
                    return;
                }

                var parent =getMyParent(this,'ul');
                var child  =ui.draggable[0];
                $(child).appendTo(parent);
                $(child).droppable("disable");
                setToggle(child);
            },
        over: function ( event, ui ){

            var parent =getMyParent(this,'ul');
            console.log(parent);
            var child  = ui.draggable[0];
            var height= $(child).height()+2+$(parent).height();

            $(parent).css({
                'min-height':height+'px',
                'border-radius':'5px',
                'background-color': '#dfdfdf'
            });

        },
        out: function ( event, ui ){

            var parent =getMyParent(this,'ul');
            $(parent).css({
                'min-height':'auto',
                'border': 0,
                'background-color': 'transparent'

            });

        }
    });



    elem.on('dragstart', function(e, ui){


        if(elem.css('position') != 'absolute'){

            //element befreien

            if(elem.parents('.post').length>0){
                var parent = elem.parents('.post')[0];

                elem.appendTo('#karten');
                elem.droppable("enable");
                $(parent).find('ul').css('min-height','auto')

                setToggle(this);
                setToggle(parent);

                var left = window.__pointer.x;
                var top  = window.__pointer.y


                if(top == 0 || left == 0){
                    top  = $(parent).position().top +40;
                    left = $(parent).position().left +10;
               }
               elem.__do_position = true;


            }
        }
        window.__t = __Const_Top;
        window.__z ++;
        elem.css({'z-index':Number(window.__z)});

        //alle Hilfen ausblenden
        $('.toolbar').remove();
    });

    elem.on('drag', function(e, ui){
        if(elem.__do_position){
            ui.position={'top': window.__pointer.y-30, 'left': window.__pointer.x-150};
            ui.helper[0].style.zIndex=window.__z+1;
        }
    });

    //Wenn der Nutzer das Kärtchen loslässt
    elem.on('dragstop', function(e){

        elem.__do_position = false;

        //registrieren wenn der Nutzer ein Kärtchen verschoben hat
        __d++;


    });


    //Beim Klick auf das Kärtchen soll die Werkzeugleiste angezeigt werden
    //dazu dem onclick ereignis die Funktion "showToolbar" zuordnen
    elem.on('click', function(e){
        showToolbar(this, e.target);
        //elem.draggable( "enable" );
    });
    //Zum Editieren (Doppelklick) muss die Drag 'n Drop Funktion vorrübergehend abgeschaltet werden
    elem.on('dblclick', function(){
        // elem.draggable( "disable" );
    });


}


//bereits gespeicherte Metaplankarten müssen beim Laden der Seite händelbar gemacht werden
//siehe Erklärungen beim neu anlegen eines Kärtchens
function makeDraggable(){
    $.each( $('#karten div.post') , function( key, value ) {
       addDragAndDropFunctions('#'+value.id, true);
    });
    window.__z ++;
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
