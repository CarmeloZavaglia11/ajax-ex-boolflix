// Milestone 1:Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 1.Titolo2.Titolo Originale3.Lingua4.Voto

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).

// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)

// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)

// https://api.themoviedb.org/3/search/movie  URL API MOVIE

// f447f45b0ef7c54bc18b8de515517b72 API KEY

$(document).ready(function(){

    setTimeout(() => {
        
        $('.preload').addClass('disappear');

    }, 2000);

    $('.search button').click(function(){

        resetCont();
        printFilm();
        printTv();

    });

    $(document).keydown(function(event){

        if (event.keyCode == 13 || event.which == 13) {

            resetCont();
            printFilm();
            printTv();

        }
        
    })

});

// FUNZIONI

function printFilm() {

    var search = $('.search input').val();

    if (search == '') {
        return;
    }

    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/search/movie',
            method: 'GET',
            data: {
                api_key: 'f447f45b0ef7c54bc18b8de515517b72',
                query: search,
                language: 'it-IT',
            },
            success: function(data) {
                ajaxFilm(data);
            },
            error: function(){
                alert('errore');
            }
        }
    );
}

function printTv() {

    var search = $('.search input').val();

    if (search == '') {
        return;
    }

    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/search/tv',
            method: 'GET',
            data: {
                api_key: 'f447f45b0ef7c54bc18b8de515517b72',
                query: search,
                language: 'it-IT',
            },
            success: function(data) {
                ajaxTv(data);
            },
            error: function(){
                alert('errore');
            }
        }
    );
}

function ajaxFilm(resp) {
    var search = $('.search input').val();

    if (resp.total_results == 0) {
        $('.cont').html('<h2>' + 'Nessun Risultato per la ricerca:"' + search + '"' + '</h2>');
        return;
    }

    var films = resp.results
    var source = $('#template').html();
    var template = Handlebars.compile(source);

    for (let i = 0; i < films.length; i++) {
        
        var context = { 
            title: films[i].title, 
            originalTitle: films[i].original_title,
            lang: addFlag(films[i].original_language),
            vote:  addStar(films[i].vote_average)
        };
        var html = template(context);

        $('.cont').append(html);

        resetInput();
    }
}

function ajaxTv(resp) {
    var search = $('.search input').val();

    if (resp.total_results == 0) {
        $('.cont').html('<h2>' + 'Nessun Risultato per la ricerca:"' + search + '"' + '</h2>');
        return;
    }

    var tvs = resp.results
    var source = $('#template').html();
    var template = Handlebars.compile(source);

    for (let i = 0; i < tvs.length; i++) {
        
        var context = { 
            title: tvs[i].name, 
            originalTitle: tvs[i].original_name,
            lang: addFlag(tvs[i].original_language),
            vote:  addStar(tvs[i].vote_average)
        };
        var html = template(context);

        $('.cont').append(html);

        resetInput();
    }
}

function resetCont() {

    $('.cont').empty();

}

function resetInput() {

    $('.search input').val('');
    $('.search input').attr('placeholder', 'Cerca un film..');

}

function addStar(vote) {
    var star = '<i class="far fa-star"></i>';
    var fullStar = '<i class="fas fa-star yellow"></i>';
    var res = '';
    var arrVote = Math.round(vote / 2);
    for (let i = 0; i < 5; i++) {
        if (arrVote > 0) {
            res += fullStar;
            arrVote -= 1;
        } else {
            res += star;
        }  
    }
    return res;
} 

function addFlag(iso) {

    var langs = ['en','it'];

    if (langs.includes(iso)) {
        return '<img src="img/' + iso + '.png">';
    }  else {
        return iso;
    }
    
}