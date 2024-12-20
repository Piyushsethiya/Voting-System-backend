const express = require("express");
const router = express.Router();
const Candidate = require("../model/candidate");
const User = require("../model/user");

const checkAdmin = async (userId)=>{
  try{
    const user = await User.findById(userId)
    return user && user.role === 'admin';
  }catch(err){
    return false;
  }
}

// list of candidate

router.get("/", async (req, res) => {
    try {
      // if(! await checkAdmin(req.user.id)){
      //   return res.status(403).json({error: 'User is not Admin'});
      // }
      const data = await Candidate.find();
      console.log("data find successfully");
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: " Internal server Error." });
    }
  }
);

// Add candidate
router.post("/", async (req, res) => {
  try {
    if(! await checkAdmin(req.user.id)){
      return res.status(403).json({error: 'User is not Admin'});
    }
    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("Data saved");
    res.status(200).json(response);
    // res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server Error." });
  }
});

// profile of candidate

// router.get("/profile", async (req, res) => {
//   try {
//     const userData = req.user;
//     const userid = userData.id;
//     console.log(userData);
//     const User = await Candidate.findById(userid);
//     res.status(200).json({ User });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error." });
//   }
// });

// update Password
router.put("/:candidateId", async (req, res) => {
  try {
    if(! await checkAdmin(req.user.id)){
      return res.status(403).json({error: 'User is not Admin'});
    }
    const candidateId = req.params.candidateId;
    const updateData = req.body;
    const response = await Candidate.findByIdAndUpdate(candidateId, updateData, {
      new: true,
      runValidators:true
    })
    
    if(!response){
      return res.status(404).json({error: 'Candidate not found'})
    }
    console.log("Candidate data Updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server Error." });
  }
});

// delete Candidate

router.delete('/:candidateId', async(req,res)=>{
  try{
    if(! await checkAdmin(req.user.id)){
      return res.status(403).json({error: 'User is not Admin'});
    }
    const candidateId = req.params.candidateId;
    const response = await Candidate.findByIdAndDelete(candidateId);
    if(!response){
      return res.status(404).json({error: 'Candidate Not Found'});
    }
    console.log("candidate Deleted");
    res.status(200).json({message: 'Candidate Deleted Successfully.'})
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal server Error." });
  }
})

// voting 

router.post('/vote/:candidateId', async (req, res)=>{
  // no admin role
  // user vote only once
  const candidateId = req.params.candidateId;
  const userId = req.user.id;
  try{
    const candidate = await Candidate.findById(candidateId);
    if(!candidate){
      res.status(404).json({message: "candidate not found."});
    }
    const user = await User.findById(userId);
    if(!user){
      res.status(404).json({message: "user not found."});
    }
    if(user.isVoted){
      res.status(400).json({message: "user already voted."});
    }
    if(user.role == "admin"){
      res.status(403).json({message: "admin is not allowed."});
    }

    candidate.votes.push({user: userId});
    candidate.voteCount++
    await candidate.save();

    user.isVoted=true;
    await user.save();

    res.status(200).json({message: "vote record successfully."});
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal server Error." });
  }
})

// vote count 
router.get('/vote/count', async (req, res) =>{
  try{
    const candidate = await Candidate.find().sort({voteCount: 'desc'});
    const voteRecord = candidate. map((data)=>{
      return{
        party: data.party,
        count: data.voteCount
      } 
    });
    res.status(200).json(voteRecord);
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal server Error." });
  }
})
module.exports = router;