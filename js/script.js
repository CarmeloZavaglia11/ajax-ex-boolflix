// Milestone 1:Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 1.Titolo2.Titolo Originale3.Lingua4.Voto

// https://api.themoviedb.org/3/search/movie  URL API

// f447f45b0ef7c54bc18b8de515517b72 API KEY

$(document).ready(function(){

    $('.search button').click(function(){

        printFilm();

    });

    $(document).keydown(function(event){

        if (event.keyCode == 13 || event.which == 13) {
            printFilm();
        }
        
    })

});

// FUNZIONI

function printFilm() {

        $('.films').addClass('active');

        $('.films').empty();

        var search = $('.search input').val();

        $.ajax(
            {
                url: 'https://api.themoviedb.org/3/search/movie',
                method: 'GET',
                data: {
                    api_key: 'f447f45b0ef7c54bc18b8de515517b72',
                    query: search,
                    language: 'it-IT'
                },
                success: function(data) {
                    console.log(data);
                    var films = data.results
                    var source = $('#film-template').html();
                    var template = Handlebars.compile(source);

                    if (data.total_results == 0) {
                        $('.films').html('<h2>' + 'Nessun Risultato per la ricerca:"' + search + '"' + '</h2>');
                        return;
                    }

                    for (let i = 0; i < data.results.length; i++) {
                        
                        var context = { 
                            title: data.results[i].title, 
                            originalTitle: data.results[i].original_title,
                            lang: data.results[i].original_language,
                            vote:  data.results[i].vote_average
                        };
                        var html = template(context);

                        $('.films').append(html);
                    }
                },
                error: function(){
                    alert('errore');
                }
            }
        );
}