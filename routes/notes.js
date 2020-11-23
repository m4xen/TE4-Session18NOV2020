var express = require('express');
var router = express.Router();
var fs = require('fs'); //filesystem
const { resolve } = require('path');

const dataPath = "./data/notes.json";

const errorMsg = [
	{
		//getAll error = 0
		"id" : 0,
		"code": 500,
		"description" : "Can't read From JSONFile"
	},
	{
		//get Specific = 1
		"id" : 1,
		"code" : 400,
		"description" : "Could not find the specified Note"
	},
	{
		//post new note = 2
		"id" : 2,
		"code" : 400,
		"description" : "query not defined correctly"
	},
	{
		//update(put) note = 3
		"id" : 3,
		"code" : 400,
		"description" : "Could not find note to edit"
  }
];

/* GET all Notes. */
router.get('/', function(req, res, next) {
  fs.readFile(dataPath, (err,data) =>{
      if(err) {
      	console.log(err);
	throw err;
	
      }

      res.send(JSON.parse(data));
  });
});

//POST a new Note
router.post('/', function(req, res, next) {
    //jag vill läsa in hela filen och ta reda på hur många poster som finns
    //fundera på JavaScript Object vs JSON som text, dvs vi har en Array med data
    //öka antalet poster med 1
    //Det blir det nya id
        fs.readFile(dataPath, (err,data) =>{
            if(err) {
		console.log(err);
                throw err;
            }
            var notesdata = JSON.parse(data);
            var newNotesId = Object.keys(notesdata).length + 1;
            notesdata[newNotesId] = JSON.parse(req.body.data);
            notesdata[newNotesId].id = newNotesId;
            fs.writeFile(dataPath, JSON.stringify(notesdata), (err) => { 
                if (err) { 
                  console.log(err);
                  res.status(500).send("Could not write note[" + newNotesId + "] to file" );
                }
                else {
                  res.status(200).send("added new note[" + newNotesId + "]");
                }
              }); 
        });
  });

/* GET  Note by id. */
router.get('/:id', function(req, res, next) {
  fs.readFile(dataPath, (err,data) =>{
      if(err) {
          throw err;
      }
      var id = req.params.id;
      var notesdata = JSON.parse(data);

      res.send(notesdata[id]);
      //TODO: Hantera att endast giltiga ID funkar
  });
});

router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  var title = req.body.title;
  var content = req.body.content;
  var NoteArray;
  fs.readFile(dataPath, (err,data) =>{
    if(err) {
        console.log(err);
        throw err;
    }
    //change data
    NoteArray = JSON.parse(data);
    NoteArray[id].title = title;
    NoteArray[id].content = content;
    //save to file
    fs.writeFile(dataPath, JSON.stringify(NoteArray), (err) => { 
      if (err) { 
        console.log(err);
        res.status(500).send("Could not write note[" + id + "] to file" );
      }
      else {
        res.status(200).send("changed note[" + id + "]");
      }
    }); 
  });
});
module.exports = router;