const bodyParser = require('body-parser');
const express=require('express');
const fs=require('fs');

const path=require('path')
const PORT=3000;
const app=express();

app.use(bodyParser.json());

function findIndex(arr,id){
    for(let i=0;i<arr.length;i++){
        if(arr[i].id==id)return i;
    }
    return -1;
}
function removeAtIndex(arr,index){
    let newArr=[];
    for(let i=0;i<arr.length;i++){
        if(i!==index)newArr.push(arr[i]);
    }
    return newArr;
}

app.get('/todos',(req,res)=>{
    fs.readFile("todos.json","utf-8",(err,data)=>{
        if(err)throw err;
        res.json(JSON.parse(data));
    })
})

app.post('/todos',(req,res)=>{
        const newTodo={
            id:Math.floor(Math.random()*1000),
            title:req.body.title,
            description:req.body.description
        };
    fs.readFile("todos.json","utf-8",(err,data)=>{
        if(err)throw err;
        const todos=JSON.parse(data);
        todos.push(newTodo);
        fs.writeFile("todos.json",JSON.stringify(todos),(err)=>{
            if(err)throw err;
            res.status(201).json(newTodo);
        })
    })
})

app.delete('/todos/:id',(req,res)=>{
    fs.readFile("todos.json","utf-8",(err,data)=>{
        if(err)throw err;
        let todos=JSON.parse(data);
        const todoIndex=findIndex(todos,parseInt(req.params.id));
        if(todoIndex==-1){
            res.send(401).send();
        }else{
            todos=removeAtIndex(todos,todoIndex);
            fs.writeFile("todos.json",JSON.stringify(todos),(err)=>{
                if(err)throw err;
                res.status(201).send();
            })
        }
    })
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
})

app.listen(PORT,()=>{
    console.log(`server is up`);
})