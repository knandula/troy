/**
* Created by rachanti on 5/30/2015.
*/

module.exports=function(){
    var client = './src/client/';
    var clientApp = client +'app/';
    var config={
        alljs:[
            'src/*.js'
        ],
        client : client,
        index :  client +'index.html',
        js:[
            clientApp +'**/*.modules.js',
            clientApp + '**/*.js',
            '!'+clientApp + '**/*.spec.js'
        ],
        bower :{
            json:require('./bower.json'),
            directory : './bower_components',
            ignorePath : '../..'
        }

    } ;

    config.getWireDepDefaultOptions = function(){
        var options ={
            bowerJson : config.bower.json,
            directory : config.bower.directory,
            ignorePath : config.bower.ignorePath
        }
        return options;
    }
    return config;
};
