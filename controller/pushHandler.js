const {eventEmitter} = require('../events/read')

const pushHandler = async(req , res)=>{

    const {body} = req
    const {added , removed , modified , committer} = req.body.head_commit
//    console.log(req.body.commits)
//    console.log("--------------------------------------")
//   console.log(req.body.head_commit)
//   console.log('--------------------')
    console.log(`Handler:${committer.username} , has added ${added.length}, removed ${removed.length} , modified ${modified.length} files`)

    eventEmitter.emit('pushCommit' , {added , removed , modified , committer})
	 
    return res.sendStatus(200)
}

module.exports = {pushHandler}
