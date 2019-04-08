const express = require('express')
const met = require('./met.js')
const request = require('request')
const app = express()

const port = process.env.PORT || 3000

app.get('/students/:id', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if(!req.params.id){
        return res.send({
            error: 'Tienes que proporcionar un id'
        })
    }

    function callAlumn (id, callback) {
        if(id == "A00816810") {
            const alumno = {
                "id": "A00816810",
                "fullname": "Jesus Guillermo Herrera Arcos",
                "nickname": "Guillermo Herrera-Arcos",
                "age": 23
            }
            callback(undefined, alumno)
        } else {
            const error = {
                "error_msg": "No existe un alumno con ese id"
            }
            callback(error, undefined)
        }
    }

    callAlumn(req.params.id, function(error, response) {
        if(error) {
            return res.send({
                error: error
            })
        }
        res.send({
            id: response.id,
            fullname: response.fullname,
            nickname: response.nickname,
            age: response.age
        })
    })

})

app.get('/met', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if(!req.query.search){
        return res.send({
            error: 'Tienes que proporcionar un search term'
        })
    }

    met.metObjects(req.query.search, function(error, response) {
        if(error) {
            return res.send({
                error: error
            })
        }

        const url_object = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + response.objectID
        request(url_object, function(error, response, bodyPiece){
            if (error) {
                return res.send({
                    error: error
                })
            }
            else {
                const dataPiece = JSON.parse(bodyPiece)
                res.send({
                    searchTerm: req.query.search,
                    artist : dataPiece.constituents[0].name,
                    title: dataPiece.title,
                    year: dataPiece.objectEndDate,
                    technique: dataPiece.medium,
                    metUrl: dataPiece.objectURL
                })
            }
        })
    })

})

app.get('*', function(req, res) {
    res.send({
        error: 'Esta ruta no existe. Intenta: /students/id o /met'
    })
})

app.listen(port, function(){
    console.log('up and running')
})