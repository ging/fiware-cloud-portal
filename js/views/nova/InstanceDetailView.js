var InstanceDetailView = Backbone.View.extend({
    
    _template: _.itemplate($('#instanceDetailTemplate').html()),
    
    events: {
        'click #instance_vnc': 'showVNC',
        'click #instance_logs': 'showLogs'
    },
    
    initialize: function() {
        this.model.bind("change", this.onInstanceDetail, this);
        this.model.fetch();
    },
    
    showVNC: function() {
        var options = {};
        options.callback = this.onVNC;
        this.model.vncconsole(options);
    },
    
    onVNC: function(resp) {
        $('#instance_details__vnc').html('<h3>Instance VNC Console</h3><p class="alert alert-info">If VNC console is not responding to keyboard input: click the grey status bar below.</p><iframe src="' + resp.console.url + '" width="720" height="450"></iframe>');
    },
    
    showLogs: function() {
        var options = {};
        options.callback = this.onLogs;
        this.model.consoleoutput(options);
    },
    
    onLogs: function(resp) {
        $('#instance_details__log').html('<div class="clearfix"><h3 class="pull-left">Instance Console Log</h3></div><pre class="logs">'+resp.output+'</pre>');
    },
    
    onInstanceDetail: function() {
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