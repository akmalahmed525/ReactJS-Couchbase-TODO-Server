/**
 * Create an instance of CouchBase Docker image.
 * Connecting CouchBase Database.
 * @author Ahmed Akmal
 * @version 1.0.0
 * 
 * ##################
 * ## Sample Query ##
 * ##################
 * bucket.query(N1qlQuery.fromString('SELECT * FROM `TODO` WHERE `username`="akmal525"'),
 *  (err, rows)=>{
 *      console.log("Got rows: %j", rows);
 *  }
 * )
 * 
 */
var couchbase = require('couchbase')
var N1qlQuery = couchbase.N1qlQuery;
var cluster = new couchbase.Cluster('couchbase://172.17.0.2')
cluster.authenticate('admin', 'admin123') // Authentication to Docker CouchBase image container.
var bucket = cluster.openBucket('TODO')

module.exports = {bucket,N1qlQuery}