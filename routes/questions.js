var express = require('express');
let request = require('request');
let rp = require("request-promise");
var router = express.Router();
let Questions = require('../models/questions');

/* GET home page. */
router.post('/', function(req, res, next) {
    let title = req.body.title;
    let body = req.body.body;
    let id = req.body.id;
    let fos = req.body.fos;

    let question = new Questions({
        id: id,
        title: title,
        body: body,
        fos: fos
    });
    question.save();
    res.status(200).json({title: title, body:body, id: id});
});

router.get('/gethomework', function(req, res, next) {
    let ids = [];
    let existingIds = [];
    let urlarr = [];
    let new_id_arr = [];

    async function getArray(){
        let idsArr = await Questions.find({id: { $gt: 1 }}, { id: 1});
        return idsArr;
    }
    getArray()
    .then((obj)=>{
        for (i = 0;  i < obj.length ; i++) {
             existingIds.push(obj[i].id);
        }
      
        // console.log(existingIds);
    })
    .catch((err)=>{
        console.log(err);
    });

    let options = {
        uri: 'https://www.homeworkmarket.com/api/questions?offset=0&limit=10',
        auth: {
            bearer: 'z9pPavgygpzzlRKZ18MNy9Wq2RDuVzFsQYs5sWVGdLy',
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    
    }
    
    rp(options)
    .then(function (body) {
        let a = body.data;
        a.forEach(post => {
            let path = post.path.path;
            let url = `https://www.homeworkmarket.com/api/object?path=${path}`;
            urlarr.push(url); 
        });
    })
    .then(()=>{
        urlarr.forEach(url_link => { 
            request(url_link, {
                'auth': {
                    'bearer': 'z9pPavgygpzzlRKZ18MNy9Wq2RDuVzFsQYs5sWVGdLy'
                }
                }, (err, response, body) => {
                    if(err) console.log(err);
                   
                    let id = JSON.parse(body).question.id;
                    let title = JSON.parse(body).question.title;
                    let questionBody = JSON.parse(body).question.body;
                    let fos = JSON.parse(body).question.fieldOfStudy.name;
                    
                    // for (i = 0; i < id.length; i++) {
                    //     ids.push(id);
                    // }
                    getids(id); 

                    // let questions = new Questions({
                    //     id: id,
                    //     title: title,
                    //     body: questionBody,
                    //     fos: fos
                    // });
                    // questions.save();
            });
        });
        function getids(x){
            
            if (existingIds.indexOf(x) == -1) {
                console.log("run command");
               
                
            }
        }
        
    })
    .catch(function (err) {
        console.log(err);
    });
});


module.exports = router;