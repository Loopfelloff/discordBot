const {eventEmitter} = require('../events/read')
const crypto = require('crypto')
const pushHandler = async(req , res)=>{

    const {added , removed , modified , committer, message} = req.body.head_commit

    const headers_secret = req.headers['x-hub-signature-256']
    const headersSecret = headers_secret.split('=')[1];
    const secret = process.env.GITHUB_WEBHOOK_SECRET.toString()

    const encryptedCheck = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex')
    const securityCheck = (headersSecret === encryptedCheck);
    console.log(securityCheck)
    if(!securityCheck) return res.sendStatus(400) 
    console.log(`Handler:${committer.username} , has added ${added.length}, removed ${removed.length} , modified ${modified.length} files`)
    eventEmitter.emit('pushCommit' , {added , removed , modified , committer , message})
    return res.sendStatus(200)
}

module.exports = {pushHandler}
