function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.status(401);
        return res.send("not logged in")
    }
}

module.exports = {
    checkAuthentication
};