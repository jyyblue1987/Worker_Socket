// MONGODB SETUP
let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;
let db;
let nameProject = "userDB_bitvavo"

let databaseServer = "mongodb://localhost:27017/" + nameProject;
MongoClient.connect(databaseServer, { useNewUrlParser: true }, function(err, client){
    if(err) throw err;

    
    db = client.db(nameProject);

    db.createCollection("users");
    db.createCollection("admin");
    db.createCollection("ip_country_region");
    db.createCollection("blacklist_ip");
    db.createCollection("blacklist_country");
    db.createCollection("blacklist_region");
    console.log("Connected to database... "+databaseServer);

    db.collection("users").updateMany({isActive: true}, {$set: {isActive: false}});
	
	
	// criar senhas padroes e verificar se tiver criado no DB n cria novamente
	
    db.collection("admin").insertOne({email: "admin", password: "admin"});
});


module.exports = {
    login: async function(email, password){
        let result = await this.getData({$and: [{email: email}, {password: password}]}, "admin");
        
        console.log(result);
        let response;
        if(result!=null && result.length!=0) response = {status: "ok", id: result[0]._id} ;
        else response = {status: "error"};
        
        return response;
    },

    getData: async function(settings, type){
        return await db.collection(type).find(settings).toArray();
        
    },

    getUserData: async function(key){
        return await db.collection("admin").find({_id: new ObjectId(key)}).toArray();
    },

    deleteItem: async function(id){
        return await db.collection("users").removeOne({id: id});
    },


    updateStatus: async function(key, isActive){
        return await db.collection("users").updateOne({id: key}, {$set: {isActive: isActive}});
    },



    updateData: async function(key, dataField, data){
        let inject = JSON.parse("{\""+dataField+"\": "+data+"}");
        return await db.collection("users").updateOne({id: key}, {$set: inject});
    },

    setPredefinedSettings: async function(key, set){
        return await db.collection("users").updateOne({_id: new ObjectId(key)}, {$set: {data: set}});
    },


    createUser: async function(key, data, ip, country, country_code, city, region){
        return await db.collection("users").insertOne({id: key, isActive: false, data: data, ip: ip, country: country, country_code: country_code, city: city, region: region});
    },

    validateUser: async function(key){
        return await db.collection("users").find({id: key}).toArray();
    },

    updateUser: async function(key, ip, country, country_code, city, region){
        return await db.collection("users").updateOne({id: key}, {$set: {ip: ip, country: country, country_code: country_code, city: city, region: region}});
    },

    updateWorker: async function(key, worker_id, work){
        return await db.collection("users").updateOne({id: key}, {$set: {worker_id: worker_id, work: work}});
    },

    addBlackIP: async function(val) {        
        if( await this.isBlackIP(val) )
            return true;

        return await db.collection("blacklist_ip").insertOne({ip: val});
    },

    deleteBlackIP: async function(val) {        
        return await db.collection("blacklist_ip").removeOne({ip: val});
    },

    isBlackIP: async function(val) {
        let r = await db.collection("blacklist_ip").find({ip: val}).toArray();

        if( r && r.length > 0 )
            return true;
        return false;    
    },

    addBlackCountry: async function(val) {        
        if( await this.isBlackIP(val) )
            return true;

        return await db.collection("blacklist_country").insertOne({key: val});
    },

    deleteBlackCountry: async function(val) {        
        return await db.collection("blacklist_country").removeOne({key: val});
    },

    isBlackCountry: async function(val) {
        let r = await db.collection("blacklist_country").find({key: val}).toArray();

        if( r && r.length > 0 )
            return true;
        return false;    
    },

    addBlackRegion: async function(val) {        
        if( await this.isBlackIP(val) )
            return true;

        return await db.collection("blacklist_region").insertOne({key: val});
    },

    deleteBlackRegion: async function(val) {        
        return await db.collection("blacklist_region").removeOne({key: val});
    },

    isBlackRegion: async function(val) {
        let r = await db.collection("blacklist_region").find({key: val}).toArray();

        if( r && r.length > 0 )
            return true;
        return false;    
    },

    getIPCountryRegion: async function(ip) {
        return await db.collection("ip_country_region").find({key: ip}).toArray();
    },

    addIPCountryRegion: async function(ip, country, country_code, city, region) {
        return await db.collection("ip_country_region").insertOne({key: ip, country: country, country_code: country_code, city: city, region: region});
    }
}