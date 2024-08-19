export function createHome() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
    	<h1>Movies</h1>

    <button class="button"> Add movie</button>

	<table class="table">
		<thead>
			<tr class="table-header">
				<th>Id</th>
				<th>Title</th>
				<th>Duration</th>
				<th>Genre</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    
    `

    api("https://localhost:7039/api/v1/Movie/all").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        attachMovies(data.movieList);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });


    let button = document.querySelector(".button");

    button.addEventListener("click", (eve) => {
        CreateAddMoviePage();
    });

}

export function CreateAddMoviePage() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
      <h1>New Movie</h1>
    <form>
        <p class="title-container">
            <label for="title">Title</label>
            <input name="title" type="text" id="title">
            <a class="titleErr">Title required!</a>
        </p>
        <p class="duration-container">
            <label for="duration">Duration</label>
            <input name="duration" type="text" id="duration">
            <a class="durationErr">Duration required!</a>
        </p>
        <p class="genre-container">
            <label for="genre">Genre</label>
            <input name="genre" type="text" id="genre">
            <a class="genreErr">Genre required!</a>
        </p>
        <div class="createMovie">
         <a href="#">Create New Movie</a>
        </div>
        <div class="cancel">
         <a href="#">Cancel</a>
        </div>
    </form>

    `

    let button = document.querySelector(".cancel");
    let test = document.querySelector(".createMovie");

    button.addEventListener("click", (eve) => {
        createHome();
    })

    test.addEventListener("click", (eve) => {
        createMovie();
    })

}

function createRow(movie) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td>${movie.id}</td>
				<td>${movie.title}</td>
				<td>${movie.duration}</td>
				<td>${movie.genre}</td>
    `

    return tr;
}

function api(path, method = "GET", body = null) {

    const url = path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

function attachMovies(movies) {

    let lista = document.querySelector("thead");

    movies.forEach(mv => {

        let tr = createRow(mv);
        lista.appendChild(tr);

    });

    return lista;

}

function createMovie() {

    let title = document.getElementById("title").value;
    let duration = document.getElementById("duration").value;
    let genre = document.getElementById("genre").value;

    let titleError = document.querySelector(".titleErr");
    let durationError = document.querySelector(".durationErr");
    let genreError = document.querySelector(".genreErr");

    let errors = [];

    if (title == '') {

        errors.push("Title");

    } else if (titleError.classList.contains("beDisplayed") && title !== '') {

        errors.pop("Title");
        titleError.classList.remove("beDisplayed");
    }

    if (duration == '') {

        errors.push("Duration");

    } else if (durationError.classList.contains("beDisplayed") && duration !== '') {

        errors.pop("Duration");
        durationError.classList.remove("beDisplayed");
    }

    if (genre == '') {

        errors.push("Genre");

    } else if (genreError.classList.contains("beDisplayed") && genre !== '') {

        errors.pop("Genre");
        genreError.classList.remove("beDisplayed");

    }

    if (errors.length == 0) {

        let movie = {
            title: title,
            duration: duration,
            genre: genre
        }

        api("https://localhost:7039/api/v1/Movie/create", "POST", movie)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } else {

        errors.forEach(err => {

            if (err.includes("Title")) {

                titleError.classList.add("beDisplayed");
            }

            if (err.includes("Duration")) {

                durationError.classList.add("beDisplayed");
            }

            if (err.includes("Genre")) {

                genreError.classList.add("beDisplayed");
            }

        })

    }

}