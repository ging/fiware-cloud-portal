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
    	console.log("onDeleteFlavor called");
        e.preventDefault();
        flavor_id = this.$('input[name=object_ids]').val();
                
        console.log(flavor_id);             
        
        this.model.deleteFlavor(flavor_id);
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
    
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    }    
});