var config = require('./config.json'),
    fs = require('fs'),
    ldf = require('ldf-client');
ldf.Logger.setLevel('WARNING');


var argv = require('minimist')(process.argv.slice(2));



var type = '1k';

if (!argv['type']) {
    argv['type'] = '1k';
    console.log('no api passed as param. Running 1k one');
}
if (!config.md5[argv['type']]) {
    console.log('MD5 not found for ' + argv['type']);
    process.exit(1);
}

var showResults = !!argv['showResults'];
var api = 'http://ldf.lodlaundromat.org/' + config.md5[argv['type']];
//var query = 'SELECT * { ?s <http://www.w3.org/2000/01/rdf-schema#label> ?label } LIMIT 100';
if (!argv['query']) {
    console.log('no api passed as param. Just selecting simple query one');
} else {
    query = fs.readFileSync(argv['query'], 'UTF-8');
}

var startTime = new Date();


var fragmentsClient = new ldf.FragmentsClient(api);
//} catch(e) {
//    console.log(e);
//    console.log(typeof e);
//    process.exit(1);
//}
//var fragmentsClient = new ldf.FragmentsClient('http://fragments.dbpedia.org/2014/en');

var results;
try {
    results = new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient });
} catch(e) {
    if (e.name && e.name == 'UnsupportedQueryError') {
        console.log(query);
        console.log(argv['query']);
//        console.log(e.name);
        process.exit(1);
    }
}
if (showResults) {
    results.on('data', console.log);
} else {
    results.on('data', function(){
        process.stdout.write(".");
    });
}

results.on('end', function(){
    process.stdout.write("\n");
//    var endTime = new Date();
//    var timeSpent = endTime - startTime;
//    console.log('totalTimeSpent', timeSpent);
//    console.log('server time', fragmentsClient._serverTiming);
//    //server time spent can be larger than client time spent. Something wrong here. Async requests 
//    var clientTime = timeSpent - fragmentsClient._serverTiming;
//    console.log('calculated client time', clientTime);
//    console.log('Client: ' + clientTime + ' (' + (clientTime / timeSpent) + ')');
//    console.log('Server: ' + fragmentsClient._serverTiming + ' (' + (fragmentsClient._serverTiming / timeSpent + ')'));
});//always all the way at the end
//results.on('response', function(){console.log('response')});
results.on('error', console.log);


