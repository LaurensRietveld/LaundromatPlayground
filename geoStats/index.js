var request = require('superagent'),
    fs = require('fs');

var ldfServer = 'http://ldf.lodlaundromat.org';


var busyDatasets = 0;
var getGeoFromDataset = function(md5, callback) {
//    console.log('getgeo');
    console.log(md5);
//    http://www.w3.org/2003/01/geo/wgs84_pos#long
//        http://www.w3.org/2003/01/geo/wgs84_pos#lat
    request
        .get(ldfServer + '/' + md5)
        .send({predicate: 'http://www.w3.org/2003/01/geo/wgs84_pos#long'})
        .set('Accept', 'application/json')
        .end(function(error, res){
            if (typeof res.body != 'object') {
                res.body['@graph'].forEach(function(triple){
                    if (triple['@id'] == 'http://ldf.lodlaundromat.org/00031fb147239f85335143f6b3723f90#metadata') {
                        //not interesting. we're looking for the actual results
                        console.log('meta')
                    } else {
                        console.log(geo);
                        console.log('geo!!');
                        process.exit(1);
                    }
                });
            }
            callback();
        })
    
};



var datasetsToProcess = [];
var next = null;
var getDatasetsViaLdf = function(ldfUrl, callback) {
    request
    .get(ldfUrl)
    .set('Accept', 'application/json')
    .end(function(error, res){
        res.body['@graph'].forEach(function(ds){
            if ('http://purl.org/dc/terms/title' in ds) {
                datasetsToProcess.push(ds['http://purl.org/dc/terms/title']);
            } else if (ds['@id'] == 'http://ldf.lodlaundromat.org/#metadata'){
                var metadata = ds['@graph'];
                metadata.forEach(function(md) {
                    if (md['http://www.w3.org/ns/hydra/core#nextPage']) {
                        next = md['http://www.w3.org/ns/hydra/core#nextPage']['@id'];
                    } 
                });
            }
        });
        callback()
    }); 
}
var getDatasetsFromFile = function(callback) {
    var datasetString = fs.readFileSync('geoDatasets.txt', {encoding: 'UTF-8'});
    datasetsToProcess = datasetString.split('\n');
    
    callback();
}

var processDsQueue = function() {
//    console.log('process');
   var ds = datasetsToProcess.shift();
   if (ds) {
       getGeoFromDataset(ds, processDsQueue);
   } else {
       if (next) {
           getDatasetsViaLdf(next);
       } else {
           console.log('done!');
       }
   }
};


//getDatasetsViaLdf(ldfServer, processDsQueue);
getDatasetsFromFile(processDsQueue);