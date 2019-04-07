const express = require('express')
const omdb = require('./omdb.js')
const app = express()

app.get('/omdb', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if(!req.query.search){
        return res.send({
            error: 'Tienes que dar una pelicula'
        })
    }
    omdb.omdbMovie(req.query.search, function(error, response) {
        if(error) {
            return res.send({
                error: error
            })
        }
        if(req.query.season) {
            omdb.omdbSeason(response.title, req.query.season, function(error, response) {
                if(error) {
                    return res.send({
                        error: error
                    })
                }
                res.send({
                    title: response.title,
                    season: response.season,
                    episodes: response.episodes
                })
            })
        } else {
            res.send({
                title: response.title,
                plot: response.plot,
                rating: response.rating
            })
        }
    })
})

app.get('*', function(req, res) {
    res.send({
        error: 'Esta ruta no existe'
    })
})

app.listen(4000, function(){
    console.log('up and running')
})