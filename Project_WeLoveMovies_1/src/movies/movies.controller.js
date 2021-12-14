const service = require("./movies.service");
const asyncErrorBoundary = require("../db/errors/asyncErrorBoundary");


//middleware

const movieExists = async (req, res, next) => {
    const { movieId } = req.params

    const foundMovie = await service.read(Number(movieId))

    if (foundMovie.length === 0 || !foundMovie) {
        return next({status: 404, error: `Movie ${movieId} cannot be found.`})
    }

    res.locals.movie = foundMovie[0];
    next();
}




//crud below, validation middleware above

async function list (req, res) {
    const {is_showing} = req.query;
    const data = is_showing 
    ? await (await service.listShowing()).splice(0, 15)
    : await service.list();

    res.status(200).json({data: data})
}

async function read (req, res) {
    res.status(200).json({data: res.locals.movie})
}

async function listReviews(req, res) {
    const movieId = res.locals.movie.movie_id;
    const reviews = await service.listReviews(movieId);
    const reviewArray = []

    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        const critic = await service.getCritics(review.critic_id)

        review.critic = critic[0];

        reviewArray.push(review);
    }

    res.status(200).json({data: reviewArray})
}

async function listTheaters(req, res) {
    const movieId = res.locals.movie.movie_id;
    const theaters = await service.listTheaters(movieId);

    res.status(200).json({data: theaters})
}


module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    listTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters)],
    listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
}