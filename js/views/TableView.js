var TableView = Backbone.View.extend({

    _template: _.itemplate($('#tableTemplate').html()),
    cid: undefined,
    lastEntryClicked: undefined,
    lastEntries: [],
    orderBy: {},

    initialize: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        // dropdown_buttons: [{label:label, action: action_name}]
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        // entries: [{id:id, cells: [{value: value, link: link}] }]
        // onAction: function() {}
        this.orderBy = {column: 0, direction: 'down'};
        this.cid = Math.round(Math.random() * 1000000);
        var events = {};
        events['click .btn-action-' + this.cid] = 'onDropdownAction';
        events['click .btn-main-' + this.cid] = 'onMainAction';
        events['change .checkbox_entries_' + this.cid] = 'changeActionButtons';
        events['change .checkbox_all_' + this.cid] = 'onBigCheck';
        events['contextmenu .entry_' + this.cid] = 'onContextMenu';
        events['click .btn-' + this.cid] = 'onContextMenuBtn';
        events['click .entry_' + this.cid] = 'onEntryClick';
        events['click .header_entry_' + this.cid] = 'onHeaderEntryClick';
        events['mousedown .entry_' + this.cid] = 'onEntryMouseDown';

        if (this.options.draggable || this.options.sortable) {
            events['dragstart .scrollable_' + this.cid + ' .tr'] = 'onDragStart';
        }
        if (this.options.dropable || this.options.sortable) {
            events['dragover .scrollable_' + this.cid + ' .vp'] = 'onDragOver';
            events['dragover .scrollable_' + this.cid + ' .tr'] = 'onDragOver';
            events['dragleave .scrollable_' + this.cid + ' .vp'] = 'onDragLeave';
            events['dragleave .scrollable_' + this.cid + ' .tr'] = 'onDragLeave';

            events['drop .scrollable_' + this.cid + ' .tr'] = 'onDrop';
            events['drop .scrollable_' + this.cid + ' .vp'] = 'onDrop';
        }
        this.options.draggable = this.options.draggable || false;
        this.options.dropable = this.options.dropable || false;
        this.options.sortable = this.options.sortable || false;

        this.delegateEvents(events);
        this.options.disableContextMenu = this.options.disableContextMenu || false;
        if (this.getDropdownButtons().length === 0 || this.options.disableContextMenu) {
            this.options.disableContextMenu = true;
        }
    },

    onDragStart: function(evt) {
        //evt.preventDefault();
        var entryId = $(evt.originalEvent.target)[0].id;
        var entry = $(evt.originalEvent.target)[0].id.split("entries__row__")[1];
        var entries = this.getEntries();
        for (var idx in entries) {
            var e = entries[idx];
            if ((e.id + "") === entry && e.isDraggable === false) return false;
        }
        //$("#" + entryId)[0].style.opacity = '0.4';
        UTILS.DragDrop.setData("EntryId", entryId);
        UTILS.DragDrop.setData("Draggable", this.options.draggable);
        UTILS.DragDrop.setData("From", this.cid);

        var resp = this.options.onDrag.call(this.options.context, entry);
        UTILS.DragDrop.setData("Data", resp);
        event.dataTransfer.setData('hola', 'hola');
    },

    onDragOver: function(evt) {
        evt.preventDefault();

        var item = $(evt.target);
        if (item[0].tagName === "TD") {
            item = item.parent();
        }
        if (this.isDroppable()) {
            item.addClass("over");
        }
    },

    isDroppable: function() {
        //console.log(this.options.dropable, UTILS.DragDrop.getData("Draggable"));
        if (this.options.sortable || this.options.dropable) {
            if (UTILS.DragDrop.getData("Draggable") ||
                (!UTILS.DragDrop.getData("Draggable") && 
                    this.cid === UTILS.DragDrop.getData("From"))) {
                return true;
            }
        }
        return false;
    },

    onDragLeave: function(evt) {
        evt.preventDefault();

        var item = $(evt.target);
        if (item[0].tagName === "TD") {
            item = item.parent();
        }
        item.removeClass("over");
    },

    onDrop: function(evt) {
        evt.preventDefault();
        var entryId = UTILS.DragDrop.getData("EntryId");
        var parentId = $(evt.target).parent()[0].id;
        //$("#" + entryId)[0].style.opacity = '1';
        var item = $(evt.target);
        if (item[0].tagName === "TD") {
            item = item.parent();
        }
        item.removeClass("over");
        var data = UTILS.DragDrop.getData("Data");
        var targetId = item[0].id.split("entries__row__")[1];
        if (this.isDroppable()) {
            console.log(data);
            if (this.options.sortable && this.cid === UTILS.DragDrop.getData("From")) {
                this.options.onMove.call(this.options.context, targetId, data);
            } else {
                this.options.onDrop.call(this.options.context, targetId, data);
            }
        }
        UTILS.DragDrop.clear();
    },

    getSelectedEntries: function() {
        var entries = [];
        var data_entries = $(".checkbox_entries_" + this.cid + ":checked").each(function(id, cb) {
            entries.push($(cb).val());
        });
        return entries;
    },

    getEntries: function() {
        var self = this;
        var entries = this.options.getEntries.call(this.options.context);
        if (entries === 'loading') {
            return entries;
        }
        if (this.options.order === false) {
            return entries;
        }
        var order = 1;
        if (this.orderBy.direction === 'up') {
            order = -1;
        }
        return entries.sort(function (a,b) {
            if (a.cells[self.orderBy.column].value === b.cells[self.orderBy.column].value) {
                return 0;
            }
            if (a.cells[self.orderBy.column].value > b.cells[self.orderBy.column].value) {
                return order * 1;
            }
            return order * -1;
        });
    },

    getHeaders: function() {
        return this.options.getHeaders.call(this.options.context);
    },

    getDropdownButtons: function() {
        return this.options.getDropdownButtons.call(this.options.context);
    },

    getMainButtons: function() {
        return this.options.getMainButtons.call(this.options.context);
    },

    onAction: function(action, entries) {
        entries.forEach(function(entry) {
            entry.id = entry.id;
        });
        return this.options.onAction.call(this.options.context, action, entries);
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    onContextMenuBtn: function(evt) {
        evt.preventDefault();
        var btn_idx = $(evt.target)[0].id.split("_" + this.cid)[0];
        var btn = this.getDropdownButtons()[btn_idx];
        var entry = $("#context-menu-" + this.cid).attr("data-id");
        var entries = [];
        var data_entries = $(".checkbox_entries_" + this.cid + ":checked").each(function(id, cb) {
            entries.push($(cb).val());
        });
        if (entries.length === 0) {
            entries.push(entry);
        }
        this.onAction(btn.action, entries);
    },

    onContextMenu: function(evt) {
        evt.preventDefault();
        var entry = $(evt.target).parent()[0].id.split("entries__row__")[1];
        this.onEntryClick(evt);
        var self = this;
        $("#context-menu-" + this.cid).attr("data-id", entry);
        var entries = [];
        var data_entries = $(".checkbox_entries_" + this.cid + ":checked").each(function(id, cb) {
            entries.push($(cb).val());
        });
        if (entries.length === 0) {
            entries.push(entry);
        }
        $('.btn-' + this.cid).each(function(id, button) {
            $(button).attr("disabled", !self.getDropdownButtons()[id].activatePattern(entries.length, entries));
        });
    },

    onEntryMouseDown: function(e) {
        if (e.ctrlKey || e.shiftKey) {
            // For non-IE browsers
            e.preventDefault();

            // For IE
            if ($.browser.msie) {
                this.onselectstart = function() {
                    return false;
                };
                var me = this; // capture in a closure
                window.setTimeout(function() {
                    me.onselectstart = null;
                }, 0);
            }
        }
    },

    onHeaderEntryClick: function(evt) {
        var node = $(evt.target)[0].nodeName;
        var self = this;
        if (node === "BUTTON" || node == "DIV") {
            var column =  parseInt($(evt.target).parent()[0].id.toString().substring(10), 10);
            //console.log(column);
            if (this.orderBy.column === column) {
                if (this.orderBy.direction === 'up') {
                    this.orderBy.direction = 'down';
                } else {
                    this.orderBy.direction = 'up';
                }
            } else {
                this.orderBy.column = column;
                this.orderBy.direction = 'down';
            }
            this.render();
        }
    },

    onEntryClick: function(evt) {
        var node = $(evt.target)[0].nodeName;
        var self = this;
        console.log(evt);
        if (node !== "INPUT" && node !== "LABEL") {
            var parentId = $(evt.target).parent()[0].id;
            if (node !== "TD") {
                parentId = $(evt.target).parent().parent()[0].id;
            }
            var parentEntry = parentId.split("entries__row__")[1];
            var metaKey = evt.metaKey || evt.altKey;
            if (evt.shiftKey && !metaKey) {
                this.checkNone();
            }
            if (evt.shiftKey) {
                // Multiple consecutive selection
                var entries = [];
                var inside = false;
                var stopped = false;
                this.lastEntryClicked = this.lastEntryClicked || parentEntry;
                this.uncheckRange(this.lastEntries);
                this.getEntries().forEach(function(entry) {
                    if (inside) {
                        entries.push(entry.id);
                    }
                    if (entry.id === self.lastEntryClicked) {
                        inside = !inside;
                        entries.push(entry.id);
                    }
                    if (entry.id === parentEntry) {
                        entries.push(entry.id);
                        inside = !inside;
                    }
                });
                this.checkRange(entries);
                this.lastEntries = entries;
            } else if (metaKey) {
                // Multiple non-consecutive selection. Do nothing.
                var checked = $("[id='" + parentId + "'] .checkbox").attr('checked');
                if (evt.type === "contextmenu" && !checked) {
                    $("[id='" + parentId + "'] .checkbox").attr('checked', !checked);
                }
                this.lastEntries = [];
                this.lastEntryClicked = parentEntry;
            } else {
                this.checkNone();
                $("[id='" + parentId + "'] .checkbox").attr('checked', true);
                this.lastEntries = [];
                this.lastEntryClicked = parentEntry;
            }
        }
        this.changeActionButtons();
    },

    checkRange: function(entries) {
        entries.forEach(function(entry) {
            $("[id='entries__row__" + entry + "'] .checkbox").attr('checked', true);
        });
    },

    uncheckRange: function(entries) {
        entries.forEach(function(entry) {
            $("[id='entries__row__" + entry + "'] .checkbox").attr('checked', false);
        });
    },

    onBigCheck: function() {
        if ($(".checkbox_all_" + this.cid + ":checked").size() > 0) {
            this.checkAll();
        } else {
            this.checkNone();
        }
    },

    checkAll: function() {
        $(".checkbox_entries_" + this.cid).attr('checked', 'checked');
        this.changeActionButtons();
    },

    checkNone: function() {
        $(".checkbox_entries_" + this.cid).attr('checked', false);
        this.changeActionButtons();
    },

    changeActionButtons: function() {
        var self = this;
        var entries = [];
        $(".checkbox_entries_" + this.cid + ":checked").each(function(id, cb) {
            entries.push($(cb).val());

        });
        var size = $(".checkbox_entries_" + this.cid + ":checked").size();
        if (size < self.getEntries().length) {
            $(".checkbox_all_" + this.cid + ":checked").attr('checked', false);
        }

        $(".checkbox_entries_" + this.cid).parent().parent().each(function(id, tr) {
            $(tr).children().css("background-color", "");
        });


        $(".checkbox_entries_" + this.cid + ":checked").parent().parent().each(function(id, tr) {
            $(tr).children().css("background-color", "#e9e9e9");
        });

        $('.btn-action-' + this.cid).each(function(id, button) {
            $(button).attr("disabled", !self.getDropdownButtons()[id].activatePattern(size, entries));
        });
    },

    onMainAction: function(evt) {
        var btn_idx = $(evt.target)[0].id.split("_" + this.cid)[0];
        var btn = this.getMainButtons()[btn_idx];
        var entries = [];
        this.onAction(btn.action, entries);
    },

    onDropdownAction: function(evt) {
        evt.preventDefault();
        var btn_idx = $(evt.target)[0].id.split("_" + this.cid)[0];
        var btn = this.getDropdownButtons()[btn_idx];
        var entries = [];
        var data_entries = $(".checkbox_entries_" + this.cid + ":checked").each(function(id, cb) {
            entries.push($(cb).val());
        });
        this.onAction(btn.action, entries);
    },

    render: function() {
        var entries = this.getEntries();
        var new_template = this._template({
            cid: this.cid,
            actionsClass: this.options.actionsClass,
            headerClass: this.options.headerClass,
            bodyClass: this.options.bodyClass,
            footerClass: this.options.footerClass,
            main_buttons: this.getMainButtons(),
            dropdown_buttons: this.getDropdownButtons(),
            disableActionButton: this.options.disableActionButton,
            headers: this.getHeaders(),
            entries: entries,
            draggable: this.options.draggable,
            droppable: this.options.droppable || this.options.sortable,
            disableContextMenu: this.options.disableContextMenu,
            dropdown_buttons_class: this.options.dropdown_buttons_class,
            orderBy: this.orderBy
        });
        var checkboxes = [];
        var checkboxAll = false;
        var dropdowns = [];
        var index, id, check, drop, drop_actions_selected;
        for (index in entries) {
            id = entries[index].id;
            if ($("#checkbox_" + id).is(':checked')) {
                checkboxes.push(id);
            }
            if ($(".checkbox_all_" + this.cid).is(':checked')) {
                checkboxAll = true;
            }
            if ($("#dropdown_" + id).hasClass('open')) {
                dropdowns.push(id);
            }
            if ($(".dropdown_actions_" + this.cid).hasClass('open')) {
                drop_actions_selected = true;
            }
        }
        var contextMenuOpen = $("#context-menu-" + this.cid).hasClass("open");
        var contextMenuTop, contextMenuLeft, contextMenuData, attributes;
        if (contextMenuOpen) {
            contextMenuTop = $("#context-menu-" + this.cid).css('top');
            contextMenuLeft = $("#context-menu-" + this.cid).css('left');
            contextMenuData = $("#context-menu-" + this.cid).attr("data-id");
            attributes = [];
            $('.btn-' + this.cid).each(function(id, button) {
                attributes.push($(button).attr("disabled"));
            });
        }
        var scrollTo = 0;
        if ($('.scrollable_' + this.cid).data('tsb')) {
            scrollTo = $('.scrollable_' + this.cid).data('tsb').getScroll();
            $('.scrollable_' + this.cid).data('tsb').stop();
        }
        $(this.el).html(new_template);
        //$(".scrollable_" + this.cid).scrollTop(scrollTo);
        for (index in checkboxes) {
            id = checkboxes[index];
            check = $("#checkbox_" + id);
            if (check.html() != null) {
                check.prop("checked", true);
            }
        }

        if (checkboxAll) {
            check = $(".checkbox_all_" + this.cid);
            check.prop("checked", true);
        }

        for (index in dropdowns) {
            id = dropdowns[index];
            drop = $("#dropdown_" + id);
            if (drop.html() != null) {
                drop.addClass("open");
            }
        }
        if (($(".dropdown_actions_" + this.cid).html() !== null) && (drop_actions_selected)) {
            $(".dropdown_actions_" + this.cid).addClass("open");
        }
        if (contextMenuOpen) {
            $("#context-menu-" + this.cid).addClass("open");
            $("#context-menu-" + this.cid).css('position', 'fixed');
            $("#context-menu-" + this.cid).css('top', contextMenuTop);
            $("#context-menu-" + this.cid).css('left', contextMenuLeft);
            $("#context-menu-" + this.cid).attr("data-id", contextMenuData);
            attributes = attributes.reverse();
            $('.btn-' + this.cid).each(function(id, button) {
                $(button).attr("disabled", attributes.pop());
            });
        }
        this.changeActionButtons();
        $('.scrollable_' + this.cid).tinyscrollbar({offsetTop: 0, offsetBottom: 0, scrollTo: scrollTo});
        return this;
    }
});