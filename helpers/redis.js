const redis = require('redis');
const { promisify } = require('util');
const config = require('config').get('redis');
const client = redis.createClient(config.url);
client.get = promisify(client.get);

exports.set = (key, object) => {
    client.set(key, JSON.stringify(object));
};

exports.setex = (key, time, object) => {
    client.setex(key, time, JSON.stringify(object));
};

exports.get = async (key) => {
    const string = await client.get(key);
    if(string){
        return JSON.parse(string);
    }
    return null;
}

exports.delete = async (key) => {
    await client.del(key);
}
