require('dotnev').config();
async function apiKeyAuth(request, reply){
    if(['GET', 'HEAD'].includes(request.method)){
        return;
    }

    const apiKey = request.headers['x-api-key']
    const knownKey = process.env.APIKEY;

    if(!apiKey || apiKey !== knownKey){
        return reply.code(401).send({error:'Unauthorized'});
    }
}

async function basicAuth(request,reply) {
    const authHeader = request.headers['authorization'];
    if(!authHeader){
        return reply.status(401).send({error:' no authorization header'});

        if(authType !== 'Basic'){
            return reply.status(401).send({error:'Requires basic auth (username/password)'});
        }
    }

    const [email, password] = Buffer.from(authKey, 'base64').toString('ascii').split(":");
        console.log(email, password)

        try{
            const user = await User.findOne({email}).select("password");
            if(!user){
                return reply.status(401).send({error:" User notfound"});
            }

            const isMatch = await user.comparePassword(password);

            if(!isMatch){
                return reply.status(401).send({error: "Incorrect password "})
            }

        }catch(error){
            console.log(error)
            return reply.status(500)({error:'An error occured during authorization'})
        }
}
module.exports = {apiKeyAuth, basicAuth};