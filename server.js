const express = require("express");
const path = require("path");
const data = require("./db/db.json")
const fs = require("fs")
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"))

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes",function(req, res){
    res.sendFile(path.join(__dirname, "public/notes.html"));
});
app.get("/api/notes", (req, res)=>{
    res.json(data)
})

app.post("/api/notes", function(req, res){
    const newNotes = req.body;
    let id 
    if(!data.length) id = 0
    else id = data[data.length-1].id + 1 
    newNotes.id = id 
    data.push(newNotes)
    fs.writeFile("./db/db.json", JSON.stringify(data),err=>{
        if(err){
            res.sendStatus(500)
            throw err  
        } 
        res.json(data);

    })
})

app.delete("/api/notes/:id", (req, res)=>{
    const idToDelete = req.params.id
    const index = data.findIndex(note=> note.id === parseInt(idToDelete))
    console.log(index)
    data.splice(index, 1)
    fs.writeFile("./db/db.json", JSON.stringify(data),err=>{
        if(err){
            res.sendStatus(500)
            throw err  
        } 
        res.json(data);

    })
})



app.listen(PORT, () =>{
    console.log("Server listening at PORT" + PORT);
})
