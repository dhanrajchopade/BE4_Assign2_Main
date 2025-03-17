const express = require("express")
const app = express()

const {initializeDatabase} = require("./db/db.connect")
const Recipees = require("./models/recipee.models")

app.use(express.json())

const fs = require("fs")
initializeDatabase()

 

// Display Recipees
app.get("/recipes", async(req,res)=>{
    try{
        const recipee = await Recipees.find()
        res.status(200).json(recipee)
    }catch(error){
        res.status(500).json({error:"Failed to retrieve recipees.", error})
    }
})

// Post/Update/Add Recipees
app.post("/recipees", async(req,res)=>{
    try{
        const newRecipee = new Recipees(req.body)
        if(newRecipee){
            await newRecipee.save()
            res.status(200).json({message:"Recipee details added successfully", recipee:newRecipee})
        }else{
            res.status(404).json({error:"Recipee Details required."})
        }
    }catch(error){
        res.status(500).json({error:"Failed to add Recipee.", error})
    }
})

//Find a recipee with title

async function readRecipeeByTitle(recipeeTitle) {
    try{
        const RecipeebyTitle = await Recipees.find({title:recipeeTitle})
return RecipeebyTitle
    }catch(error){
        console.error(error)
    }
}

app.get("/recipees/titles/:recipeeTitle", async(req,res)=>{
    try{
        const recipee = await readRecipeeByTitle(req.params.recipeeTitle)
        if(recipee.length !=0){
            res.json(recipee)
        }else{
            res.status(404).json({error:"No Recipee Found."})
        }
    }catch(error){
        res.status(500).json({error:"Failed to fetch Recipees by Recipee titles."})
    }
})


// FInd a recipee by author

async function readRecipeeByAuthor(authorName) {
    try{
        const RecipeeByAuthor = await Recipees.find({author:authorName})
        return RecipeeByAuthor
    }catch(error){
        console.log(error)
    }
}

app.get("/recipees/author/:authorName", async(req,res)=>{
    try{
        const recipee = await readRecipeeByAuthor(req.params.authorName)
        if(recipee.length!=0){
            res.json(recipee)
        }else{
            res.status(400).json({error:"No Recipee Found."})
        }
    }catch(error){
        res.status(500).json({error:"Failed to fetch Recipees by Author."})
    }
})

// Find a Recipee by difficulty level

async function readRecipeeByDifficulty(level) {
    try{
        const recipee = await Recipees.find({difficulty:level})
        return recipee
    }catch(error){
        console.log(error)
    }
    }

    app.get("/recipees/difficulty/:level", async(req,res)=>{
        try{
            const recipee = await readRecipeeByDifficulty(req.params.level)
            if(recipee.length!=0){
                res.json(recipee)
            }else{
                res.status(400).json({error:"No recipee found."})
            }
        }catch(error){
res.status(500).json({error:"Failed to fetch recipee details."})
            }        
    })
// Find Recipee by ID and update

async function updateReceipeeById(recipeeId, dataToUpdate) {
    try{
const recipee = await Recipees.findByIdAndUpdate(recipeeId, dataToUpdate,{new:true})
return recipee    
}catch(error){
    console.log("Error in updating a Recipee Data by Id", error)
    }
}

app.post("/recipee/id/:recipeeId", async(req,res)=>{
    try{
        const updatedRecipee = await updateReceipeeById(req.params.recipeeId, req.body)
    if(updatedRecipee){
        res.status(200).json({message:"Recipee data updated successfully by Id", updatedRecipee:updatedRecipee})
    }else{
        res.status(404).json({error:"Recipe not found."})
    }
    }catch(error){
        res.status(500).json({error:"Failed to update books by Id."})
    }
})


// Find Recipee by Title and update

async function updateRecipeeByTitle(recipeeTitle, datatoUpdate) {
    try{
        const recipee = await Recipees.findOneAndUpdate({title:recipeeTitle}, datatoUpdate,{new:true})
        return recipee
    }catch(error){
        console.log("Error in updating a Recipee By Title")
    }
}


app.post("/recipee/title/:recipeeTitle", async(req,res)=>{
    try{
        const updatedRecipee = await updateRecipeeByTitle(req.params.recipeeTitle,req.body)
        if(updatedRecipee){
            res.status(200).json({message:"Recipee data updated successfully by title.", updatedRecipee:updatedRecipee})
        }else{
            res.status(404).json({error:"Recipe not found."})
        }
        }catch(error){
            res.status(500).json({error:"Failed to update books by title."})
        }
})

// Delete recipee by Id

app.delete("/recipee/:id", async(req,res)=>{
    try{
        const recipeeId = req.params.id
        const deletedRecipee = await Recipees.findByIdAndDelete(recipeeId)
        if(deletedRecipee){
            res.status(200).json({message:"Recipee deleted Successfully."})
        }else{
            res.status(404).json({error:"Recipee not found."})
        }
    }catch(error){
        res.status(500).json({error:"Failed to delete book", error})
    }
})


const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})