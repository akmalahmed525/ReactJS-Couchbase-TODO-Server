/**
 * Create an instance of CouchBase Docker image.
 * Connecting CouchBase Database.
 * @author Ahmed Akmal
 * @version 1.0.0
 * 
 */
var couchbase = require('couchbase');
var N1qlQuery = couchbase.N1qlQuery;
var cluster = new couchbase.Cluster('couchbase://x.x.x.x'); // prepend it with the docker image name.
cluster.authenticate('<your_username>', '<your_password>'); // Authentication to Docker CouchBase image container.
var bucket = cluster.openBucket('<your_bucket_name>'); // Couchbase bucket name.

module.exports = { bucket, N1qlQuery }; // Exporting the bucket and N1q1Query
