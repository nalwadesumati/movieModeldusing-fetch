const cl = console.log;

const showModelbtn = document.getElementById("showModelbtn");
const movieModel = document.getElementById("movieModel");
const backDrop = document.getElementById("backDrop");
const movieContainer = document.getElementById("movieContainer");
const movieForm = document.getElementById("movieForm");
const loader = document.getElementById("loader");


const closeModel = [...document.querySelectorAll(".closeModel")];


const addMovieBtn = document.getElementById("addMovieBtn");
const updateMovieBtn = document.getElementById("updateMovieBtn");

const movieTitleControl = document.getElementById("movieTitle");
const movieImgurlControl = document.getElementById("movieImgurl");
const movieDescriptionControl = document.getElementById("movieDescription");
const movieRatingControl = document.getElementById("movieRating");


const BaseURL = "https://fetchmovie-d5309-default-rtdb.firebaseio.com/";

const movieURL = "https://fetchmovie-d5309-default-rtdb.firebaseio.com/movies.json";


const moviesObjToArr = (obj) => {
    if (!obj) return [];

    let moviesArr = [];

    for (const key in obj) {

        let data = { ...obj[key], id: key }

        moviesArr.unshift(data);
    }

    return moviesArr;
}


function toggelSpineer(flag) {
    if (flag === true) {
        loader.classList.remove('d-none')
    } else {
        loader.classList.add('d-none')
    }
}

function snackbar(title, icon) {
    Swal.fire({
        title: title,
        icon: icon,
        timer: 1000,

    });
}


const RatingClass = (rating) => {

    if (rating > 8) {

        return "badge-success";
    }
    else if (rating > 5 && rating <= 8) {

        return "badge-warning";
    }
    else {

        return "badge-danger";
    }
}


const createMovieCards = (arr) => {


    let result = "";
    arr.forEach((movie) => {

        result += `
        <div class="col-md-3 mb-4">
            <div class="card movieCard text-white" id="${movie.id}">
            <div class="card-header bg-dark text-white text-center">
                <div class="row">
                    <div class="col-10">
                        <h2 class="m-0">${movie.title}</h2>
                    </div>
                    <div class="col-2 d-flex justify-content-start align-items-center">
                        <span class="badge ${RatingClass(movie.rating)}">${movie.rating}</span>
                    </div>
                </div>
                </div>
                <div class="card-body p-0">
                    <figure>
                        <img src="${movie.url}" alt="${movie.title}" title="${movie.title}" class="img-fluid">
                        <figcaption>
                            <h5>${movie.title}</h5>
                            <p>${movie.description}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-success" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="onRemove(this)">Remove</button>
                </div>
            </div>
        </div> `;
    });

    movieContainer.innerHTML = result;
};


function onMovieSubmit(eve) {
    eve.preventDefault();
    //moview obj
    let movieObj = {
        title: movieTitleControl.value,
        description: movieDescriptionControl.value,
        rating: movieRatingControl.value,
        url: movieImgurlControl.value
    }
    cl(movieObj)

    //api call

    fetch(movieURL, {
        method: "POST",
        body: JSON.stringify(movieObj),
        headers: {
            "Auth": "Token from ls",
            "content-type": "Application/json"
        }
    })
        .then(res => res.json())
        .then(res => {
            cl(res)
            // single card show on ui


            let col = document.createElement('div')
            // col.id = res.name
            col.className = "col-md-3 mb-4"

            col.innerHTML = `
    <div class="card movieCard text-white"  id = "${res.name}" >
                <div class="card-header bg-dark text-white text-center">
                    <div class="row">
                        <div class="col-10">
                            <h2 class="m-0">${movieObj.title}</h2>
                        </div>
                        <div class="col-2 d-flex justify-content-start align-items-center">
                            <span class="badge ${RatingClass(movieObj.rating)}">${movieObj.rating}</span>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <figure>
                        <img src="${movieObj.url}" alt="${movieObj.title}" title="${movieObj.title}" class="img-fluid">
                        <figcaption>
                            <h5>${movieObj.title}</h5>
                            <p>${movieObj.description}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-success" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="onRemove(this)">Remove</button>
                </div>
            </div>
    `
            movieContainer.prepend(col)

            movieForm.reset();
            onModelToggle()

            snackbar("Movie added successfully!", "success");


        })
        .catch(err => snackbar("Something will happen while createing movieobj", 'error'))
        .finally(() => {
            toggelSpineer(false)
        })


}
function onRemove(ele) {


    Swal.fire({
        title: "Do you want to Remove this Movie Card?",

        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: '#dc3545',
        cancelButtonColor: "#212529",

    }).then((result) => {
        if (result.isConfirmed) {
            toggelSpineer(true)

            let remove_id = ele.closest('.card').id
            cl(remove_id)

            let REMOVE_URL = `${BaseURL}/movies/${remove_id}.json`

            fetch(REMOVE_URL, {
                method: "DELETE",
                body: null,
                headers: {
                    "Auth": "Token from ls",
                    "content-type": "Application/json"
                }
            })
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    cl(data)

                    ele.closest('.col-md-3').remove()
                })
                .catch(err => snackbar("Something went wrong while Removing movieCard!!!", "error"))
                .finally(() => {
                    toggelSpineer(false)
                })



        }
    });

}

function onEdit(ele) {
    toggelSpineer(true)
    let EDIT_ID = ele.closest('.card').id
    cl(EDIT_ID)
    localStorage.setItem('EDIT_ID', EDIT_ID)
    cl(EDIT_ID)

    let edit_url = `${BaseURL}/movies/${EDIT_ID}.json`

    fetch(edit_url, {
        method: "GET",
        body: null,
        headers: {
            "Auth": "Token from ls",
            "content-type": "Application/json"
        }


    })
        .then(res => res.json())
        .then(data => {
            cl(data)
            onModelToggle()
            movieTitleControl.value = data.title;
            movieDescriptionControl.value = data.description;
            movieImgurlControl.value = data.url;
            movieRatingControl.value = data.rating;

            addMovieBtn.classList.add('d-none')
            updateMovieBtn.classList.remove('d-none')

        })
        .catch(err => snackbar("Something went wrong!!", 'error'))
        .finally(() => {
            toggelSpineer(false)
        })
}

function onMovieUpdate() {


    let UPDATE_ID = localStorage.getItem("EDIT_ID");



    // updated movie object form se
    const updatedMovieObj = {
        title: movieTitleControl.value,
        description: movieDescriptionControl.value,
        rating: +movieRatingControl.value,
        url: movieImgurlControl.value,
        id: UPDATE_ID
    };
    let UPDATE_URL = `${BaseURL}/movies/${UPDATE_ID}.json`;

    toggelSpineer(true);

    fetch(UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(updatedMovieObj),
        headers: {
            "Auth": "Token from ls",
            "content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            cl(data);
            snackbar("Movie updated successfully!", "success");

            // Ui update
            let card = document.getElementById(UPDATE_ID);
            card.innerHTML = `

           <div class="card-header bg-dark text-white text-center">
                    <div class="row">
                        <div class="col-10">
                            <h2 class="m-0">${updatedMovieObj.title}</h2>
                        </div>
                        <div class="col-2 d-flex justify-content-start align-items-center">
                            <span class="badge ${RatingClass(updatedMovieObj.rating)}">${updatedMovieObj.rating}</span>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <figure>
                        <img src="${updatedMovieObj.url}" alt="${updatedMovieObj.title}" title="${updatedMovieObj.title}" class="img-fluid">
                        <figcaption>
                            <h5>${updatedMovieObj.title}</h5>
                            <p>${updatedMovieObj.description}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-success" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="onRemove(this)">Remove</button>
                </div>
           `

            movieForm.reset();
            movieModel.classList.remove("active");
            backDrop.classList.remove("active");

            addMovieBtn.classList.remove("d-none");
            updateMovieBtn.classList.add("d-none");
            localStorage.removeItem("EDIT_ID");
        })
        .catch(err => {
            cl(err);
            snackbar("Something went wrong while updating movie!!", "error");
        })
        .finally(() => {
            toggelSpineer(false);
        });
}


function fetchAllMovies() {
    toggelSpineer(true)
    fetch(movieURL, {
        method: "GET",
        body: null,
        headers: {
            "Auth": "Token from ls",
            "content-type": "Application/json"
        }
    })
        .then(res => {
            return (res.json())
        })
        .then(data => {
            let moviesArr = moviesObjToArr(data)
            cl(moviesArr)
            createMovieCards(moviesArr)


        })
        .catch(err => snackbar("something went wrong while fetching movies data!!", 'error'))
        .finally(() => {
            toggelSpineer(false)
        })
}
fetchAllMovies()



function onModelToggle() {
    movieModel.classList.toggle("active");
    backDrop.classList.toggle("active");
}

closeModel.forEach((btn) => btn.addEventListener("click", onModelToggle));
showModelbtn.addEventListener("click", onModelToggle);

movieForm.addEventListener("submit", onMovieSubmit);
updateMovieBtn.addEventListener("click", onMovieUpdate);
