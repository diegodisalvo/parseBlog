$(document).ready(function(){

$(function() {

    Parse.$ = jQuery;

    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("ZdQJsU9fycxYI8MNpi0EGaa1GZ74rZBsYEZhbjJS", "t9VcOwJ9ETDGBKUA7bBfTO3N7H4AR5e1faPImuiN");
    Parse.User.logOut();


    //Blog class
    var Blog = Parse.Object.extend('Blog', {
      create: function(title, content){
        this.save({
          'title': title,
          'content': content,
          'author': Parse.User.current(),
          'authorName': Parse.User.current().get('username'),
          'time': new Date().toDateString()
        }, {
          success: function(blog){
            alert('You just added a new blog: ' + blog.get('title'))
          },
          error: function(blog, error){
              console.log(blog);
              console.log(error);
          }
        });
      }
    });


    var Blogs = Parse.Collection.extend({
        model: Blog
    }),
    BlogsAdminView = Parse.View.extend({
        template: Handlebars.compile($('#blogs-admin-tpl').html()),
        render: function() {
            var collection = { blog: this.collection.toJSON() };
            this.$el.html(this.template(collection));
        }
    });


    //Render the login View
    var LoginView = Parse.View.extend({
      template: Handlebars.compile($('#login-tpl').html()),
      events: {
          'submit .form-signin': 'login',
      },
      login: function(e){
        // Prevent Default Submit Event
        e.preventDefault();

        // Get data from the form and put them into variables
        var data = $(e.target).serializeArray(),
            username = data[0].value,
            password = data[1].value;

        // Call Parse Login function with those variables
        Parse.User.logIn(username, password, {
            // If the username and password matches
            success: function(user) {
                blogRouter.navigate('admin', { trigger: true });
            },
            // If there is an error
            error: function(user, error) {
                console.log(error);
            }
        });
      },
      render: function(){
        this.$el.html(this.template());
      }
    });

    var AddBlogView = Parse.View.extend({
      template: Handlebars.compile($('#add-tpl').html()),
      events: {
        'submit .form-add' : 'submit'
      },
      submit: function(e){
        // Prevent Default Submit Event
        e.preventDefault();
        // Take the form and put it into a data object
        var data = $(e.target).serializeArray(),
        // Create a new instance of Blog
        blog = new Blog();
        // Call .create()
        blog.create(data[0].value, data[1].value);
      },
      render: function(){
          this.$el.html(this.template());
      }
    });



    WelcomeView = Parse.View.extend({
      template: Handlebars.compile($('#welcome-tpl').html()),
      events: {
        'click .add-blog':'add'
      },
      add: function(){
        var addBlogView = new AddBlogView();
        addBlogView.render();
        $('.main-container').html(addBlogView.el);
      },
      render: function() {
        var attributes = this.model.toJSON();
        this.$el.html(this.template(attributes));
        var blogs = new Blogs();
        blogs.fetch({
          success: function(blogs) {
            var blogsAdminView = new BlogsAdminView({ collection: blogs });
            blogsAdminView.render();
            $('.main-container').append(blogsAdminView.el);
          },
          error: function(blogs, error) {
            console.log(error);
          }
        });
      }
    });










    var BlogRouter = Parse.Router.extend({

      //define shared variables
      initialize: function(options){
        this.blogs = new Blogs();
      },

      //this runs when we start the Router
      start: function(){
        Parse.history.start({pushState: true});
        this.navigate('admin', { trigger: true });
      },

      //This is where you map functions to URLs:
      //just add '{{URL pattern}}':'{{function name}}'
      routes: {
        'admin': 'admin',
        'login': 'login',
        'add': 'add',
        'edit/:url': 'edit'
      },

      admin: function() {
        // This is how you can current user in Parse
        var currentUser = Parse.User.current();

        if (!currentUser){
          // This is how you can do url redirect in JS
          blogRouter.navigate('login', { trigger: true });
        } else {
          var welcomeView = new WelcomeView({ model: currentUser });
          welcomeView.render();
          $('.main-container').html(welcomeView.el);

          // We change it to this.blogs so it stores the content for other Views
          // Remember to define it in BlogRouter.initialize()
          this.blogs.fetch({
            success: function(blogs) {
              var blogsAdminView = new BlogsAdminView({ collection: blogs });
              blogsAdminView.render();
              $('.main-container').append(blogsAdminView.el);
            },
            error: function(blogs, error) {
              console.log(error);
            }
          })
        };
      },
      login: function() {
        var loginView = new LoginView();
        loginView.render();
        $('.main-container').html(loginView.el);
      },
      add: function() {},
      edit: function(url) {}

    });

    blogRouter = new BlogRouter();
    blogRouter.start();



});
});
