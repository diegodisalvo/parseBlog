$(document).ready(function(){

$(function() {

    Parse.$ = jQuery;

    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("ZdQJsU9fycxYI8MNpi0EGaa1GZ74rZBsYEZhbjJS", "t9VcOwJ9ETDGBKUA7bBfTO3N7H4AR5e1faPImuiN");

    var Blog = Parse.Object.extend("Blog");
    var Blogs = Parse.Collection.extend({
      model: Blog
    });

    var BlogsView = Parse.View.extend({
      template: Handlebars.compile($('#blog-tpl').html()),
      render: function(){
        var collection = { blog: this.collection.toJSON() };
        this.$el.html(this.template(collection));
      }
    });

    var blogs = new Blogs();
    blogs.fetch({
      success: function(blogs){
        var blogsView = new BlogsView({ collection: blogs });
        blogsView.render();
        $('.main-container').html(blogsView.el);
      },
      error: function(blogs, error){
        console.log(error);
      }
    });






});
});
