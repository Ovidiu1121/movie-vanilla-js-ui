export function createHome(alert) {

    let container = document.querySelector(".container");


    container.innerHTML = `
     <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
       </div>  

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
    let button = document.querySelector(".button");
    let table = document.querySelector(".table");
    const alertPlaceholder = document.querySelector('.container-alert');
    let load = document.querySelector(".spinner-border");

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    api("https://localhost:7039/api/v1/Movie/all").then(response => {
        return response.json();
    }).then(data => {
        load.classList = "";
        console.log(data);
        attachMovies(data.movieList);
    }).catch(error => {
        load.classList = "";

        console.error('Error fetching data:', error);

        appendAlert(error, "danger");
    });

    button.addEventListener("click", (eve) => {
        CreateAddMoviePage();
    });

    table.addEventListener("click", (eve) => {

        if (eve.target.classList.contains("updateMovie")) {
            api(`https://localhost:7039/api/v1/Movie/id/${eve.target.textContent}`).then(res => {
                return res.json();
            }).then(data => {
                console.log(data);

                let movie = {
                    title: data.title,
                    duration: data.duration,
                    genre: data.genre
                }

                CreateUpdatePage(movie, eve.target.textContent);

            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }

    });

    if (alert === "deleted") {
        load.classList = "";
        appendAlert("Movie has been DELETED with success!", "success");
    }

    if (alert === "updated") {
        load.classList = "";
        appendAlert("Movie has been UPDATED with success!", "success");
    }

    if (alert === "added") {
        load.classList = "";
        appendAlert("Movie has been ADDED with success!", "success");
    }

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
        createHome("");
    })

    test.addEventListener("click", (eve) => {
        createUpdateMovie("create");
    })

}

export function CreateUpdatePage(movie, idMovie) {

    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Update Movie</h1>
    <form>
        <p>
            <label for="title">Title</label>
            <input name="title" type="text" id="title" value="${movie.title}">
             <a class="titleErr">Title required!</a>
        </p>
        <p>
            <label for="duration">Duration</label>
            <input name="duration" type="text" id="duration" value="${movie.duration}">
             <a class="durationErr">Duration required!</a>
        </p>
        <p>
            <label for="genre">Genre</label>
            <input name="genre" type="text" id="genre" value="${movie.genre}">
             <a class="genreErr">Genre required!</a>
        </p>

        <div class="submitUpdate">
         <a href="#">Update Movie</a>
        </div>

          <div class="cancel">
         <a href="#">Cancel</a>
        </div>
        <div class="submitDelete">
         <a href="#">Delete Movie</a>
        </div>
    </form>
    `

    let cancelButton = document.querySelector(".cancel");
    let submitUpdateButton = document.querySelector(".submitUpdate");
    let submitDeleteButton = document.querySelector(".submitDelete");
    let titleinput = document.getElementById("title");

    titleinput.disabled = true;

    cancelButton.addEventListener("click", (eve) => {
        createHome("");
    });

    submitUpdateButton.addEventListener("click", (eve) => {
        createUpdateMovie("update", idMovie);
    });

    submitDeleteButton.addEventListener("click", (eve) => {

        api(`https://localhost:7039/api/v1/Movie/delete/${idMovie}`, "DELETE")
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);

                createHome("deleted");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    })


}

function createRow(movie) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td class="updateMovie">${movie.id}</td>
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

function createUpdateMovie(request, idMovie) {

    const isNumber = (str) => {
        return /^[+-]?\d+(\.\d+)?$/.test(str);
    };

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

    if (!isNumber(duration) && duration != '') {

        errors.push("Duration2");

    }
    else if (isNumber(duration)) {

        errors.pop("Duration2");

    } else if (durationError.classList.contains("beDisplayed") && duration !== '') {

        errors.pop("Duration2");
        durationError.classList.remove("beDisplayed");

    }

    if (errors.length == 0) {

        let movie = {
            title: title,
            duration: duration,
            genre: genre
        }

        if (request === "create") {
            api("https://localhost:7039/api/v1/Movie/create", "POST", movie)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("added");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else if (request === "update") {
            api(`https://localhost:7039/api/v1/Movie/update/${idMovie}`, "PUT", movie)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("updated");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
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

            if (err.includes("Duration2")) {

                durationError.classList.add("beDisplayed")
                durationError.textContent = "Only numbers";
            }

        })

    }

}