/*
MIT License

Copyright (c) 2020 Olavo Alexandrino, http://www.oalexandrino.com.br

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var mongoose = require('mongoose');
var TeamModel = mongoose.model('team');
var TeamMemberImageModel = mongoose.model('teamMemberImage');
var CloudinarySettings = require('../../lib/agency/upload/CloudinarySettings');

var teamFunctions =  {

    findTeamMember : function (email) {
        return new Promise((resolve, reject) => {
            var query = {"members.email": email };
            const options = { 'members.$': 1 };
            TeamModel.find(query, options).exec(function (err, result) {
                var member = [];
                if (result.length !== 0 ) {
                    member = result[0].members;
                }
                err ? reject(err) : resolve(member);
            });
        });
    },
    removeMember: function (email) {
        return new Promise((resolve, reject) => {
            const query = {};
            const pull = { $pull: { members: { email: email } } };
            const options = { new: true };
            TeamModel.updateOne(query, pull, options).exec(function (err, result) {
                err ? reject(err) : resolve(result);
            });
        });
    },
    deleteImageMember: function (email) {

        return new Promise((resolve, reject) => {

            TeamMemberImageModel.findOneAndDelete({ email: email }).exec(function (err, result) {
                err ? reject(err) : resolve(result)
            });

        });
    },
    findImageMember: function (imageName) {
        
        return new Promise((resolve, reject) => {
            let imageQuery = { imageName: imageName };
            TeamMemberImageModel.find(imageQuery, (err, result) => {
                err ? reject(err) : resolve(result)
            });
        });
    },
    createImageMember(imageDetails) {

        return new Promise((resolve, reject) => {
            TeamMemberImageModel.create(imageDetails, (err, result) => {
                err ? reject(err) : resolve(result)
            });
        });
    },
    uploadImageMember(cloudImage) {

        return new Promise((resolve, reject) => {
            CloudinarySettings.uploads(cloudImage, (err, result) => {
                err ? reject(err) : resolve(result)
            });
        });
    }
    
}

module.exports = teamFunctions;