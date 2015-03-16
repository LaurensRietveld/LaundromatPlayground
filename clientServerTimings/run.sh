#!/bin/bash
type='1k'

resultsDir="results"
#real vs user time (i.e., total time vs client time) 
#/usr/bin/time -f '%e %U'





count=1
while [[ $count -le $k ]]; do
  # your-unix-command-here
   echo "$count"
   let count=count+1
done



#apis=( 1k 10k 100k 1m )
k=10
apis=( 1k )

#we want to exit the run script on ctrl-c, and not only the node script
trap "echo stopped; exit;" SIGINT SIGTERM

for api in "${apis[@]}"; do
    #echo "Running for $api ($k times)"
    
    count=1
    while [[ $count -le $k ]]; do
        resultsFile="$resultsDir/${api}_$count.csv"
        
        rm -f $resultsFile;
        qCount=0;
        for query in queries/*.sparql; do
            qBase=`basename $query`
            let qCount=qCount+1
            echo -en "Running for $api (k $count/$k, query $qBase ($qCount))\r"
            /usr/bin/time -f '%e\t%U' node ./index.js --type $type --query $query > /dev/null 2>> $resultsFile;
        done
        #echo "$count"
        let count=count+1
    done

    echo "";
    
    
done

