var responseUtilities =  {

    sendJsonResponse: function (res, err, content, httpStatus = 200) {
        if (err) {
            content = err;
            httpStatus = 404;
        }

       // console.log("Result: " + content);
        
        res.status(httpStatus);
        res.json(content);
    },
    sendStop: function (res, err, content, httpStatus = 200) {
        if (err) {
            content = err;
            httpStatus = 404;
        }

        console.log("Result: " + content);

        res.status(httpStatus);
        res.json(content);
        
    } 
    
    

}

module.exports = responseUtilities;