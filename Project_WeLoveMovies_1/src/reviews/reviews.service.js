const knex = require("../db/connection");

async function list() {
    return knex("reviews")
}

async function read (reviewId) {
    return knex("reviews")
    .where({review_id: reviewId})
}

async function update (updatedReview, reviewId) {
    return knex("reviews")
    .where({review_id: reviewId})
    .update({ ...updatedReview, updated_at: knex.fn.now() })
    .then((updatedRecords) => updatedRecords[0]);
}

async function destroy (reviewId) {
    return knex("reviews")
    .where({review_id: reviewId})
    .delete()
}

async function getCritic(criticId) {
    return knex("critics")
    .where({ critic_id: criticId })
    .select();
}

module.exports = {
    list,
    read,
    update,
    destroy,
    getCritic
}