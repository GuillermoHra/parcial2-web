const request = require('request')

const metObjects = function( searchTerm, callback ) {

  const url = 'https://collectionapi.metmuseum.org/public/collection/v1/search?q=' + searchTerm

  request({ url, json: true }, function(error, response ) {  
    if (error) {
      callback('Servicio no disponible, revisa tu conexión a internet', undefined)
    } else {
        const data = response.body
        if(data == null || data.objectIDs == null) {
            callback('No se encontró ningun id con ese search term', undefined) 
        }
        else if (data.objectIDs.length == 0) {
            callback('No se encontró ningun id con ese search term', undefined) 
        } else {
            const info = {
                objectID: data.objectIDs[0]
            }
            callback(undefined, info) 
        }   
    }
  })
}

module.exports = {
  metObjects: metObjects
}





