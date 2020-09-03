// Milestone 1:Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 1.Titolo2.Titolo Originale3.Lingua4.Voto

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).

// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)

// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)

// https://api.themoviedb.org/3/search/movie  URL API MOVIE

// f447f45b0ef7c54bc18b8de515517b72 API KEY

$(document).ready(function(){

    resetInput();

    setTimeout(() => {
        
        $('.preload').addClass('disappear');

    }, 2000);

    $('.search button').click(function(){

        resetCont();
        printing('movie');
        printing('tv');

    });

    $(document).keydown(function(event){

        if (event.keyCode == 13 || event.which == 13) {

            resetCont();
            printing('movie');
            printing('tv');

        }
        
    })

});

// FUNZIONI

function printing(objs) {

    var search = $('.search input').val();

    if (search == '') {
        return;
    }

    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/search/' + objs,
            method: 'GET',
            data: {
                api_key: 'f447f45b0ef7c54bc18b8de515517b72',
                query: search,
                language: 'it-IT',
            },
            success: function(data) {
                if (objs == 'movie') {
                    ajax(data,'movie');
                }  else if (objs == 'tv') {
                    ajax(data,'tv');
                }
                
            },
            error: function(){
                alert('errore');
            }
        }
    );
}

function ajax(resp,type) {
    var search = $('.search input').val();

    if (resp.total_results == 0) {
        $('.cont').html('<h2>' + 'Nessun risultato per la ricerca:"' + search + '"' + '</h2>');
        return;
    }

    var respRes = resp.results;
    var source = $('#template').html();
    var template = Handlebars.compile(source);

    for (let i = 0; i < respRes.length; i++) {

        var title = '';
        var originTitle = '';

        if (type == 'movie') {
            title = respRes[i].title;
            originTitle = respRes[i].original_title;
        }  else if (type == 'tv') {
            title = respRes[i].name;
            originTitle = respRes[i].original_name;
        }
        
        var context = { 
            image: addImage(respRes[i].poster_path),
            title: title, 
            originalTitle: originTitle,
            lang: addFlag(respRes[i].original_language),
            vote:  addStar(respRes[i].vote_average)
        };
        var html = template(context);

        $('.cont').append(html);

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

function addImage(imageUrl) {

    if (imageUrl != null) {
        return 'https://image.tmdb.org/t/p/w342' + imageUrl;
    }  else {
        return 'https://moorestown-mall.com/noimage.gif'
    }
}