Router.configure({
    layoutTemplate: 'main'
});

Websites = new Mongo.Collection("websites");

if (Meteor.isClient) {

	Router.route('/', {
		template:'website_list_page'
	});

	Router.route('/details/:_id', {
		template: 'website_details',
		data: function() {
				var website_id = this.params._id;
				return Websites.findOne({_id: website_id});
			}
		});

	Accounts.ui.config({
	  requestPermissions: {
	    facebook: ['user_likes'],
	    github: ['user', 'repo']
	  },
	  requestOfflineToken: {
	    google: true
	  },
	  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
	});

	/////
	// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort: { upvotes: -1}});
		}
	});


	/////
	// template events
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);

			Websites.update(website_id,
				{$inc: {upvotes: 1}}
			);
			// put the code in here to add a vote to a website!

			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			Websites.update(website_id,
				{$inc: {downvotes: 1}}
			);

			// put the code in here to remove a vote from a website!

			return false;// prevent the button from reloading the page
		}
	})

	Template.registerHelper('date', function(){
		console.log(this);

		if(!jQuery.isEmptyObject(this)){
			var website_id = this._id;
			var website = Websites.findOne({_id: website_id});
			return (website.createdOn.getMonth() + 1) + "/" +  website.createdOn.getDay() + "/" + website.createdOn.getFullYear();
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){
			event.preventDefault();
			// here is an example of how to get the url out of the form:
			var target = event.target;
			console.log("My target: "+target);
			var url = target.url.value;
			var title = target.title.value;
			var description = target.description.value;
			console.log("The url they entered is: "+url);

			//  put your website saving code in here!

			Websites.insert({
			 title:title,
			 url:url,
			 description:description,
			 createdOn:new Date(),
			 upvotes: 0,
			 downvotes: 0,
		 });

			return false;// stop the form submit from reloading the page

		}
	});
}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department",
    		url:"http://www.gold.ac.uk/computing/",
    		description:"This is where this course was developed.",
    		createdOn:new Date(),
				upvotes: 0,
				downvotes: 0,
    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
    		createdOn:new Date(),
				upvotes: 0,
				downvotes: 0,
    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
    		createdOn:new Date(),
				upvotes: 0,
				downvotes: 0,
    	});
    	Websites.insert({
    		title:"Google",
    		url:"http://www.google.com",
    		description:"Popular search engine.",
    		createdOn:new Date(),
				upvotes: 0,
				downvotes: 0,
    	});
    }
  });
}
