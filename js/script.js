// Milestone 1:Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 1.Titolo2.Titolo Originale3.Lingua4.Voto

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).

// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)

// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)

// https://api.themoviedb.org/3/search/movie  URL API MOVIE

// f447f45b0ef7c54bc18b8de515517b72 API KEY

$(document).ready(function(){

    // INTRO

    $('#intro')[0].play();

    setTimeout(() => {

        $('.preload').addClass('disappear');

    }, 1500);

    // FILM e SERIE TV INIZIALI

    resetInput();

    var url1 = 'https://api.themoviedb.org/3/search/movie';

    var url2 = 'https://api.themoviedb.org/3/search/tv';

    var search = 'a';

    printing(url1,'movie',search);
    printing(url2,'tv',search);

    // ASIDE GENERATION 

    asideGeneration('https://api.themoviedb.org/3/genre/tv/list');

    // CLICK LOGO

    $('.logo img').click(function(){

        var url1 = 'https://api.themoviedb.org/3/search/movie';
        var url2 = 'https://api.themoviedb.org/3/search/tv';

        var search = 'a';

        resetCont();

        printing(url1,'movie',search);
        printing(url2,'tv',search);
        
    }),

    // RICERCHE

    $('.search button').click(function(){

        $('.aside ul li').removeClass('genre-active');

        var search = $('.search input').val();

        if (search == '') {
            return;
        }

        var url1 = 'https://api.themoviedb.org/3/search/movie';
        var url2 = 'https://api.themoviedb.org/3/search/tv';

        resetCont();
        printing(url1,'movie',search);
        printing(url2,'tv',search);

    });

    $(document).keydown(function(event){

        $('.aside ul li').removeClass('genre-active');

        if(event.which == 13 || event.keyCode == 13) {
            var search = $('.search input').val();

            if (search == '') {
                return;
            }

            var url1 = 'https://api.themoviedb.org/3/search/movie';
            var url2 = 'https://api.themoviedb.org/3/search/tv';

            resetCont();
            printing(url1,'movie',search);
            printing(url2,'tv',search);
        }

    });

    $('.search input').click(function(){

        var search = $('.search input').val();

        if (search == '') {
            return;
        }

        var url1 = 'https://api.themoviedb.org/3/search/movie';
        var url2 = 'https://api.themoviedb.org/3/search/tv';

        resetCont();
        printing(url1,'movie',search);
        printing(url2,'tv',search);

    });

    $('.search button').on('focus', function() {

        $(".search input").animate({bottom: '0px'});

    });
    
});



// MATCH GENRES

$(document).on('click','.aside ul li',function(){

    var query = $('.search input').val();

    $('.aside ul li').removeClass('genre-active');

    $(this).addClass('genre-active');

    var thisId = $(this).data('id-genres');

    var url1 = 'https://api.themoviedb.org/3/search/movie';

    resetCont();

    printing(url1,'genres',query,thisId);


});

// CLICK FOR INFORMATION

$(document).on('click','.film',function(){

    var poster = $(this).children('img').clone();
    var format = $(this).find('.tipo').text();
    var title = $(this).find('.titolo').text();
    var language = $(this).find('.lingua').html();
    var average = $(this).find('.voto').html();
    var summary = $(this).find('.overview').text();
    var actors = $(this).find('.actors').text();

    
    $('.img-info').html(poster);
    $('.tipo-info').text(format);
    $('.titolo-info').text(title);
    $('.lingua-info').html(language);
    $('.voto-info').html(average);
    $('.overview-info').text(summary);
    $('.attori-info').text(actors);

    $('.fake-background').show();
    $('.info').addClass('info-active');



});

// CLICK FAKE SCREEN

$('.fake-background').click(function(){

    $('.info').removeClass('info-active');
    $('.fake-background').hide();

})

// CLICK X FAKE SCREEN

$('.info .x i').click(function(){

    $('.info').removeClass('info-active');
    $('.fake-background').hide(); 

});

// FUNZIONI

function asideGeneration(url) {
    
    var source = $('#aside-template').html();
    var template = Handlebars.compile(source);


    $.ajax(
        {
            url: url,
            method: 'GET',
            data: {
                api_key: 'f447f45b0ef7c54bc18b8de515517b72'
            },
            success: function(data) {
                for (let i = 0; i < data.genres.length; i++) {
                    var context = { 
                        genres: data.genres[i].name,
                        id: data.genres[i].id
                    };
                    var html = template(context);
            
                    $('.aside ul').append(html);              
                }
            },
            error: function(){
                alert('errore');
            }
        }
    );
}

function printing(url,objs,search,idGen) {

    if (search == '') {
        $('.cont').append('<h2>' + 'SCRIVI QUALCOSA PER CERCARE' + '</h2>');
        return;
    }

    $.ajax(
        {
            url: url,
            method: 'GET',
            data: {
                api_key: 'f447f45b0ef7c54bc18b8de515517b72',
                query: search,
                language: 'it-IT',
            },
            success: function(data) {
                if (objs == 'movie') {
                    ajax(data,'movie',search);
                }  else if (objs == 'tv') {
                    ajax(data,'tv',search);
                }  else if (objs == 'genres') {
                    filterGenrs(data,idGen,'movie');
                }
            },
            error: function(){
                alert('errore');
            }
        }
    );
}

function ajax(resp,type,search) {

    if (resp.total_results == 0) {
        $('.cont').append('<h2>' + 'Nessun risultato per la ricerca:"' + search + '" in (' + type + ')' + '</h2>');
    }  else {
        $('.cont').append('<h2> Risultati per: ' + type + '</h2>');
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

        var overview;

        if (respRes[i].overview == '') {
            overview = 'NO TRAMA';
        }  else {
            overview = respRes[i].overview;
        }
        
        var context = {
            id: respRes[i].id,
            genre: respRes[i].genre_ids[0],
            overview: overview,
            type: type.toUpperCase(),
            image: addImage(respRes[i].poster_path),
            title: title, 
            originalTitle: originTitle,
            lang: addFlag(respRes[i].original_language),
            vote:  addStar(respRes[i].vote_average),
        };

        var html = template(context);

        $('.cont').append(html);

        var id = respRes[i].id;
        filterActors(id,type);

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
    var star = '<i class="far fa-star yellow"></i>';
    var fullStar = '<i class="fas fa-star yellow"></i>';
    var halfStar = '<i class="fas fa-star-half-alt yellow"></i>';
    var resto = vote % 2;
    var res = '';
    var arrVote = Math.floor(vote / 2);
    for (let i = 0; i < 5; i++) {
        if (arrVote > 0) {
            res += fullStar;
            arrVote -= 1;
        }  else if (resto != 0){
            res += halfStar;
            resto = 0;
        }  else {
            res += star;
        }  
    }
    return res;
} 

function addFlag(iso) {

    var langs = ['en','it'];

    if (langs.includes(iso)) {
        return '<img src="img/' + iso + '.png">';
    }  

    return iso;
    
}

function addImage(imageUrl) {

    if (imageUrl != null) {
        return 'https://image.tmdb.org/t/p/w342' + imageUrl;
    }

    return 'https://moorestown-mall.com/noimage.gif';

}

function filterGenrs(dataObj,id,type) {

    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/genre/'+ type + '/list',
            method: 'GET',
            data: {
                api_key: 'f447f45b0ef7c54bc18b8de515517b72'
            },
            success: function(data) {
                var source = $('#template').html();
                var template = Handlebars.compile(source);

                var dataObjRes = dataObj.results;

                for (let i = 0; i < dataObjRes.length; i++) {
                        var genresIdDataObj = dataObjRes[i].genre_ids;

                        if (genresIdDataObj.includes(id)) {

                            // CHECKING

                            var overview;

                            if (dataObjRes[i].overview == '') {
                                overview = 'NO TRAMA';
                            }  else {
                                overview = dataObjRes[i].overview;
                            }

                            var title = '';
                            var originTitle = '';

                            if (type == 'movie') {
                                title = dataObjRes[i].title;
                                originTitle = dataObjRes[i].original_title;
                            }  else if (type == 'tv') {
                                title = dataObjRes[i].name;
                                originTitle = dataObjRes[i].original_name;
                            }

                            var context = {
                                id: dataObjRes[i].id,
                                genre: dataObjRes[i].genre_ids[0],
                                overview: overview,
                                type: type.toUpperCase(),
                                image: addImage(dataObjRes[i].poster_path),
                                title: title, 
                                originalTitle: originTitle,
                                lang: addFlag(dataObjRes[i].original_language),
                                vote:  addStar(dataObjRes[i].vote_average)
                            }
                            var html = template(context);
                    
                            $('.cont').append(html);
                            
                            var ids = dataObjRes[i].id;
                            filterActors(ids,type);
                        }
                    
                }

                
            },
            error: function(){
                alert('errore');
            }
        }
    );

}

function filterActors(id,type) {
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/'+ type + '/' + id + '/credits',
            method: 'GET',
            data: {
                api_key: 'f447f45b0ef7c54bc18b8de515517b72'
            },
            success: function(data) {
                checkNameCast(data.cast, id);
            },
            error: function() {
                $('.film[data-id-film="' + id + '"').find('.desc .actors').append('Nomi attori non disponibili');
            }
        }
    );
}

function checkNameCast(array , id) {
    if (array.length > 0) {
		for (let i = 0; i < 3; i++) {
			if (array[i] != undefined) {
				$('.film[data-id-film="' + id + '"').find('.desc .actors').append(array[i].name + ',');
			} else {
				return;
			}
		}
	}
}