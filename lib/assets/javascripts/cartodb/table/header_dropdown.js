
/**
 * dropdown when user clicks on a column name
 */
cdb.admin.HeaderDropdown = cdb.admin.DropdownMenu.extend({

  className: "dropdown border",
  isPublic: false,

  events: {
    'click .asc': 'orderColumnsAsc',
    'click .desc': 'orderColumnsDesc',
    'click .rename_column': 'renameColumn',
    'click .change_data_type': 'changeType',
    'click .georeference': 'georeference',
    'click .filter_by_this_column': 'filterColumn',
    'click .delete_column': 'deleteColumn',
    'click .add_new_column': 'addColumn'
  },

  initialize: function() {
    this.options.reserved_column = false;
    this.options.isPublic = this.isPublic;
    this.elder('initialize');
  },

  setTable: function(table, column) {
    this.table = table;
    this.column = column;


    // depending on column type (reserved, normal) some fields should not be shown
    // so render the dropdown again
    this.options.reserved_column = this.table.data().isReadOnly() || this.table.isReservedColumn(column);
    this.render();

    this.$('.asc').removeClass('selected');
    this.$('.desc').removeClass('selected');
    //set options for ordering
    if(table.data().options.get('order_by') === column) {
      if(table.data().options.get('mode') === 'asc') {
        this.$('.asc').addClass('selected');
      } else {
        this.$('.desc').addClass('selected');
      }
    }
  },

  orderColumnsAsc: function(e) {
    e.preventDefault();
    this.table.data().setOptions({
      mode: 'asc',
      order_by: this.column
    });
    this.hide();
    return false;
  },

  orderColumnsDesc: function(e) {
    e.preventDefault();
    this.table.data().setOptions({
      mode: 'des',
      order_by: this.column
    });
    this.hide();
    return false;
  },

  renameColumn: function(e) {
    e.preventDefault();
    this.hide();
    this.trigger('renameColumn');
    return false;
  },

  changeType: function(e) {
    e.preventDefault();
    this.hide();
    this.trigger('changeType', this.column);
    return false;
  },

  georeference: function(e) {
    e.preventDefault();
    this.trigger('georeference', this.column);
    this.hide();
    return false;
  },

  filterColumn: function(e) {
    var self = this;
    var dlg = new cdb.admin.FilterColumnDialog({
      table: this.table,
      column: this.column,
      ok: function(filter) {
        self.trigger('applyFilter', self.column, filter);
      }
    });

    $('body').append(dlg.render().el);
    this.hide();
    dlg.open();
    e.preventDefault();
  },

  deleteColumn: function(e) {
    e.preventDefault();
    var self = this;
    cdb.log.debug("removing column: " + this.column);
    this.hide();
    var confirmation = new cdb.admin.DeleteColumnConfirmationDialog ({
      model: self.table,
      globalError: self.globalError,
      column: this.column
    });
    confirmation.appendToBody().open();
    var promise = confirmation.confirm();
    $.when(promise).done(function() {
      self.table.deleteColumn(self.column)
    });

    return false;
  },

  addColumn: function(e) {
    e.preventDefault();
    var dlg = new cdb.admin.NewColumnDialog({
      table: this.table
    });
    $('body').append(dlg.render().el);
    this.hide();
    dlg.show();
    return false;
  }
});

