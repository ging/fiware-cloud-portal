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
        flavor_id = this.$('input[name=flavor_id]').val();
        this.model.set("flavor_id", this.$('input[name=flavor_id]').val());
        name = this.$('input[name=name]').val();
        vcpus = this.$('input[name=vcpus]').val();
        memory_mb = this.$('input[name=memory_mb]').val();
        disk_gb = this.$('input[name=disk_gb]').val();
        eph_gb = this.$('input[name=eph_gb]').val();    
        
        console.log(name);             
        
        this.model.submitForm(flavor_id, name, vcpus, memory_mb, disk_gb, eph_gb);
    },
           
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    }    
});