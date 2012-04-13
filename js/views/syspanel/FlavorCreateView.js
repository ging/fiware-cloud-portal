var FlavorCreateView = Backbone.View.extend({
    
    _template: _.template($('#flavorsCreateTemplate').html()),
    
    initialize: function() {
        this.model.bind("reset", this.rerender, this);
    },
    
    events: {
        'click #submit': 'onSubmit'
    },

    onSubmit: function(e){
    	console.log("onSubmit called");
        e.preventDefault();

        var new_flavor = new Flavor();
        
        new_flavor.set({'flavor_id': this.$('input[name=flavor_id]').val()});
        new_flavor.set({'name': this.$('input[name=name]').val()});
        new_flavor.set({'vcpus': this.$('input[name=vcpus]').val()});
        new_flavor.set({'memory_mb': this.$('input[name=memory_mb]').val()});
        new_flavor.set({'disk_gb': this.$('input[name=disk_gb]').val()});
        new_flavor.set({'eph_gb': this.$('input[name=eph_gb]').val()});
            
    	new_flavor.save();
    	this.model.fetch();

    },
           
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    }    
});