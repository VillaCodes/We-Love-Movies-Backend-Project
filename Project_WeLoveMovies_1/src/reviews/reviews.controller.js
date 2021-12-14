const service = require("./reviews.service");
const asyncErrorBoundary = require("../db/errors/asyncErrorBoundary");


const reviewExists = async (req, res, next) => {
    const { reviewId } = req.params;

    const foundReview = await service.read(reviewId);

    if (foundReview.length === 0 || !foundReview) {
        return next({status: 404, message: `Review cannot be found.`})
    }

    res.locals.review = foundReview[0];
    next();
}

const bodyValidation = async (req, res, next) => {
    const {data: {score = null, content = null} = {}} = req.body;

    let updatedObj = {};

    if(!score && !content) {
       return next({status: 400, message: `Missing score or content.`})
    }

    if (score) {
        updatedObj.score = score
    }
    if (content) {
        updatedObj.content = content
    }

    res.locals.update = updatedObj;

    next();
}


//crud below

async function list (req, res) {
    const data = await service.list()

    res.status(200).json({data: data})
};


async function read (req, res) {
    res.status(200).json({data: res.locals.review})
};

async function put (req, res) {
    const { critic_id, review_id } = res.locals.review;
    const update = res.locals.update;
    await service.update(update, review_id);
    
    const updatedReview = await service.read(review_id);
    const critic = await service.getCritic(critic_id);
    res.status(200).json({ data: { ...updatedReview[0], critic: critic[0] } });
}

async function destroy (req, res) {
    const {review_id} = res.locals.review;

    await service.destroy(review_id)
    
    res.sendStatus(204);
}


module.exports = {
list: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(list)],
read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
put: [asyncErrorBoundary(reviewExists), bodyValidation, asyncErrorBoundary(put)],
delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}