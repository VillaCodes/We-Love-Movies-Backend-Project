const knex = require("../db/connection");


function list () {
    return knex("theaters");
}

function getMovies(theaterId) {
    return knex("theaters as t")
      .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
      .join("movies as m", "mt.movie_id", "m.movie_id")
      .select("m.*", "mt.is_showing")
      .where({ "t.theater_id": theaterId });
  }


module.exports = {
    list,
    getMovies
}