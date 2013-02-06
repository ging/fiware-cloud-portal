var InstanceDetailView = Backbone.View.extend({
    
    _template: _.itemplate($('#instanceDetailTemplate').html()),
    
    flavorResp: false,
    imageResp: false,
    vncResp: false,
    logResp: false,
    
    initialize: function() {   
        var self = this; 

        this.delegateEvents({
            'click #overviewBtn': "showOverview",
            'click #instance_vnc': 'showVNC',
            'click #instance_logs': 'showLogs'
        });         

        this.model.bind("change", this.onInstanceDetail, this);
        this.model.fetch();

		var options = {};
        options.callback = function(resp) {
            self.options.vncUrl = resp.console.url;
            self.vncResp = true;
            self.checkAll();
        }       
        this.model.vncconsole(options);

        var options2 = {};
        options2.callback = function(resp) {
            self.options.logs = resp.output;
            self.logResp = true;
            self.checkAll();
        }
        this.model.consoleoutput(options2);
    },
    
    showOverview: function() {
        $('#instance_details__overview').addClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#overview').addClass('active'); 
        $('#vnc').removeClass('active'); 
        $('#log').removeClass('active');
    },
    
    showVNC: function() {
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#instance_details__vnc').addClass('active');
        $('#overview').removeClass('active');
        $('#log').removeClass('active');
        $('#vnc').addClass('active');
    },
    
    showLogs: function() {
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__log').addClass('active');
        $('#overview').removeClass('active'); 
        $('#vnc').removeClass('active'); 
        $('#log').addClass('active');
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    close: function(e) {
    	this.undelegateEvents();
    	$('#instance_details__overview').removeClass('active'); 
    	$('#instance_details__log').removeClass('active'); 
        $('#instance_details__vnc').removeClass('active'); 
        $('#overview').removeClass('active'); 
    	$('#log').removeClass('active'); 
        $('#vnc').removeClass('active'); 
    	this.onClose();
    },
    
    onInstanceDetail: function() {
        var self = this;    	
        this.options.flavor = new Flavor();
        this.options.flavor.set({id: this.model.get("flavor").id});
        this.options.flavor.bind("change", function() {
            self.flavorResp = true;
            self.checkAll();
        }, this);
        this.options.image = new Image();
        this.options.image.set({id: this.model.get("image").id});
        this.options.image.bind("change", function() {
            self.imageResp = true;
            self.checkAll();
        }, this);
        this.options.image.fetch();
        this.options.flavor.fetch();
        this.checkAll();
    },
    
    checkAll: function() {
        if (this.flavorResp && this.imageResp && this.vncResp && this.logResp) {
            this.render();
        }
    },
    
    render: function () {       
    	var self = this; 
        if ($("#consult_instance").html() == null) {
        	mySuccess = function(object) {
            UTILS.Render.animateRender(self.el, self._template, {rules: object.security_groups[0].rules, vdc: self.options.vdc, service: self.options.service, model:self.model, flavor:self.options.flavor, image:self.options.image, logs: self.options.logs, vncUrl: self.options.vncUrl, subview: self.options.subview});
        	}
        	JSTACK.Nova.getsecuritygroupforserver(self.model.id, mySuccess);
        } else {
        	mySuccess = function(object) {
        	$(this.el).html(this._template({rules: object.security_groups[0].rules, vdc: this.options.vdc, service: this.options.service, model:this.model, flavor:this.options.flavor, image:this.options.image, logs: this.options.logs, vncUrl: this.options.vncUrl, subview: this.options.subview}));
        	}            
        	JSTACK.Nova.getsecuritygroupforserver(this.model.id, mySuccess);
        }
        
        if (this.options.subview == 'log') {
            this.showLogs();
        } else if (this.options.subview == 'vnc') {
            this.showVNC();
        }
        
        $("#instance_vnc").unbind();
        $("#instance_logs").unbind();
        $("#instance_vnc").bind("click", this.showVNC);
        $("#instance_logs").bind("click", this.showLogs);
        return this;
    }
});