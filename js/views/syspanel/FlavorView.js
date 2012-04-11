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
                        
       var flavor =  this.model.get(e.target.value);
        
        console.log(e.target.value); 
        
        flavor.destroy();      
        
     
    },	
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
    
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    }    
});