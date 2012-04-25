var InstanceDetailView = Backbone.View.extend({
    
    _template: _.template($('#instanceDetailTemplate').html()),
    
    events: {
        'click #overviewBtn': '' 
    },
    
    initialize: function() {
        this.model.bind("change", this.onInstanceDetail, this);
        this.model.fetch();
    },
    
    onInstanceDetail: function() {
        console.log(this.model.get("flavor").id);
        this.options.flavor = new Flavor();
        this.options.flavor.set({id: this.model.get("flavor").id});
        this.options.flavor.bind("change", this.render, this);
        this.options.image = new Image();
        this.options.image.set({id: this.model.get("image").id});
        this.options.image.fetch();
        this.options.flavor.fetch();
    },
    
    render: function () {
        if ($("#consult_instance").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, {model:this.model, flavor:this.options.flavor, image:this.options.image});
        } else {
            $(this.el).html(this._template({model:this.model, flavor:this.options.flavor, image:this.options.image}));
        }
        return this;
    },
});