// First movie to search for is MeanGirls which came out in 2004
// Initialize our application
const app = {};
// Setting the reuseable variables for our application


// API section
app.movieAPIKey = "6e1d55b2";
app.movieBaseURL = "http://www.omdbapi.com";
app.retroRewindAPIKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjA1OWYyNGU5MDk0Y2QwNDNiNzFlN2I5In0sImlhdCI6MTYxNjUwNzQ3MSwiZXhwIjoxNjQ4MDQzNDcxfQ.g5zpjH1L1H49r2DItaSQ-E7ADSgLpGD5LA2RgGtjR8E";
app.retroRewindBaseURL = "https://retroapi.hackeryou.com/api"


// jquery section
app.$movieTitle = $('.movieTitle');
app.$moviePlot = $('.moviePlot');
app.$poster = $(".poster");
app.$curtain = $(".curtain");


// Creating a reuseable function that grabs information from the OMDB API
app.getMovie = (title, year) => {
    const response = $.ajax({
        url: app.movieBaseURL,
        method: "GET",
        dataType: "JSON",
        // These are the params that we are passing to the API
        data: {
            t: title,
            y: year,
            apiKey: app.movieAPIKey
        }
    })
    return response
}


// Creating a reusable function that grabs all of the random year information
app.getRetroDetails = () => {
    const response = $.ajax({
        // https://retroapi.hackeryou.com/api/years
        url: `${app.retroRewindBaseURL}/years`,
        method: "GET",
        dataType: "JSON",
        data: {
            apiKey: app.retroRewindAPIKey
        }
    });
    return response;
}


// Lets make a function that takes in a array as a parameter
app.getRandomElement = (array) => {
    // Math.random() will return a value between 0 and 1
    // array.length will return the length of the supplied array
    // Math.floor will round down to the nearest integer
    let index = Math.floor(Math.random() * array.length)
    // this returns the random value inside of the array
    return array[index]
};


// lets create a function that displays the function to the page
app.setMovie = () => {
    // console.log('a')
    
    const retroData = app.getRetroDetails();
    retroData.done((res) => {
        // console.log(res)
        const randomYear = app.getRandomElement(res)
        // console.log(randomYear);

        // we want to get the year
        const year = randomYear.year;

        // obtaining a movie array
        const movies = randomYear.movies;
        const randomMovie = app.getRandomElement(movies);
        // console.log(randomMovie);

        // we want to get the title
        const title = randomMovie.title;

        // this will append the title and year to the page
        app.$movieTitle.append(`${title}, ${year}`)

        // using the stored information to perform second network request
        const movieData = app.getMovie(title, year);

        movieData.done((res) => {
            // Getting the plot from the response object
            const plot = res.Plot;
            // Validate whether we have plot information to display
            if(plot !== "N/A" || plot !== ""){
                // This is appending the plot information to the screen
                app.$moviePlot.append(plot); 
            } else{
                app.$moviePlot.append("No Plot Available");
            }
            // Getting the poster information from the response object
            const poster = res.Poster;
            // Validate whether the information is available
            if(poster !== "N/A" ){
                // This is appending the Poster image to our screen
                app.$poster.attr("src", poster);
                // This is appending the alt text for the Poster image
                app.$poster.attr("alt", `this is a poster for the movie: ${title}`)
            } 
        });
    })
};

// this function would refresh our movies
app.refreshMovie = () => {

    // clear the title information
    app.$movieTitle.empty()

    // clear the information in the plot
    app.$moviePlot.empty()

    // let reset and clear the image information
    app.$poster.attr("src", '');
    app.$poster.attr("alt", '')

    // we want to refetch information
    app.setMovie();


}


// INIT Function Call
app.init = () => {


    let curtainOpens = 0;

    app.setMovie();

    app.$curtain.on('click', () => {

        curtainOpens = curtainOpens + 1;

        if (curtainOpens % 2 === 0)  {
            app.refreshMovie();
        }
    })
   
    // let retroData = app.getRetroDetails();
    // retroData.done((res) => {
    //     app.getRandomElement(res);
    // })
    // Everything in this next section we will be moving it to
    // it's own method
};
// document.get ready function
$(() => {
    app.init();
});