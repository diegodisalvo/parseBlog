$(document).ready(function(){

$(function() {

    Parse.$ = jQuery;

    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("ZdQJsU9fycxYI8MNpi0EGaa1GZ74rZBsYEZhbjJS", "t9VcOwJ9ETDGBKUA7bBfTO3N7H4AR5e1faPImuiN");

    var Blog = Parse.Object.extend("Blog");
    var Blogs = Parse.Collection.extend({
      model: Blog
    });



});
});
