var responseUtilities =  {

    sendJsonResponse: function (res, err, content) {
        var httpStatus = 200;
        if (err) {
            content = err;
            httpStatus = 404;
        }

        console.log("Result: " + content);
        res.status(httpStatus);
        res.json(content);
    }
    
}
