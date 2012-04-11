var FlavorView = Backbone.View.extend({
    
    _template: _.template($('#flavorsTemplate').html()),
    
    initialize: function() {
    	this.model.fetch();
        this.model.bind("reset", this.rerender, this);
    },
    
    events: {
        'click #flavor_delete': 'onDeleteFlavor'
    },

    onDeleteFlavor: function(e){

        e.preventDefault();
                        
       var flavor_to_delete_id =  this.model.get(this.$('input[name=object_ids]').val());
        
        console.log("Flavor id = "); 
                
        console.log(flavor_to_delete_id );             
        
        this.model.destroy();
    },	
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
    
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    }    
});