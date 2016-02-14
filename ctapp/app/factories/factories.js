
app.factory('CrumbFactory', function() {
  return {
    data: {
      user: 99,
      trip: 88,
      route: 77,
      crumbs: []
    }
  };
});

app.factory('MapFactory', function() {
  return {
    map: '',
    setMap: function(_map) {
      console.log("setMap()");
      this.map = _map;
    }
  };
});

function account(id,name, description, type, balance, balancedate) {
  this.account_id = id;
  this.name = name;
  this.description = description;
  this.type = type;
  this.balance = balance;
  this.balancedate = balancedate;
}

function Model(id, user_id, create_date, sort_order, model_description) {
  this.model_id = id;
  this.user_id = user_id;
  this.create_date = create_date;
  this.sort_order = sort_order;
  this.model_description = model_description;
}

//TODO: don't hardcode this
var next_schedule_entry_id = 4000;

function ScheduleEntry(id,catalog_entry_id,schedule_date, account_id,amount, amount_calc) {
  if (null==id) 
    this.schedule_entry_id=next_schedule_entry_id++;
  else
    this.schedule_entry_id = id;
  this.catalog_entry_id = catalog_entry_id;
  this.schedule_date = schedule_date;
  this.account_id = account_id;
  this.amount = amount;
  this.amount_calc = amount_calc;
  
}


function CatalogEntry(id,parent_id,user_id,name,catalog_entry_type,account_id,
paired_account_id,start_date,end_date,amount,description,frequency,
frequency_param,used_in_models,param1,param2,tax_year_maximum) {
  
  this.catalog_entry_id = id;
  this.parent_catalog_entry_id = parent_id;
  this.user_id = user_id;
  this.name = name;
  this.account_id = account_id;
  this.catalog_entry_type = catalog_entry_type;
  this.description = description;
  this.frequency = frequency;
  if (start_date)
    this.start_date = start_date;
  else
    this.start_date = new Date();
  if (end_date) {
    this.end_date = end_date;
  } else {
    this.end_date = new Date();
    this.end_date.setFullYear(2100);
  }
  this.amount = amount;
  this.param1 = param1;
  this.param2 = param2;
  this.tax_year_maximum = tax_year_maximum;
  
  this.calculateSchedule = function(range_start,range_end) {
    var _current_date = this.start_date;
    var _end_date;
    var _schedule_array = [];
    var _verbose = false;
    var i = 20;
    
    _end_date = ((range_end<this.end_date) || (null==this.end_date)) 
    ? range_end : this.end_date;
    
    if (_verbose) console.log("_current date="+_current_date.toDateString());
    if (_verbose) console.log("_end_date="+_end_date.toDateString());
    if (_verbose) console.log("current<end? "+(_current_date.getTime()<_end_date.getTime()));
    
    while ((i-->0) && (_current_date.getTime()<_end_date.getTime())) {
      if (_verbose) console.log("_current date="+_current_date.toDateString());
      
      
      var _current_entry = new ScheduleEntry(null,this.catalog_entry_id,_current_date,
      this.account_id,null,null);
      
      if (0==this.catalog_entry_type.localeCompare("fixed")) {
        _current_entry.amount = this.amount;
      }
      
      // TODO: refactor calculation of next date
      if (0==this.frequency.localeCompare("monthly")) {
        _current_date = new Date(new Date(_current_date).setMonth(_current_date.getMonth()+1));
      }
      if (_verbose) console.log("ScheduleEntry=" + JSON.stringify(_current_entry));
      _schedule_array.push(_current_entry);
    }
    
    
    return _schedule_array;
  }
}

app.factory('FSUser', function() {
  return {
    user: {
      name: '',
      accounts: [],
      catalog: [],
      models: [],
      
      mockdata: function() {
        this.name = "John";
    
        // accounts
        this.accounts = [
          new account(2000,"CHK","Checking","Liquid",1000.0,new Date()),
          new account(2001,"SAV","Savings","Liquid",2000.0,new Date()),
          new account(2002,"HOM","Home Fixed Asset","Asset",500000.0,new Date()),
          new account(2003,"HM","Home Mortgage","Loan",250000.0,new Date())
          ];
          
        this.models = [
          new Model(3000,1000,new Date(),10,"Current Model")
          ];
        this.catalog = [
          new CatalogEntry(4000,null,1000,"Storage","fixed",2000,null,new Date(2016,1,11),null,75.0,
          "Storage","monthly",11,3000,null,null,null),
          new CatalogEntry(4001,null,1000,"HOA","fixed",2000,null,new Date(2016,1,10),null,75.0,
          "Home Owners Association","monthly",10,3000,null,null,null)
          ];
        
      },
      getJSON: function() {
        return JSON.stringify(this);
        
      },
      generateSchedule: function() {
        var i;
        var cumulative_schedule = null;
        
        for (i=0;i<this.catalog.length;i++) {
          var new_schedule = this.catalog[i].calculateSchedule(new Date(2016,1,1),
          new Date(2017,3,1));
          
          if (null==cumulative_schedule) 
            cumulative_schedule=new_schedule;
          else
            cumulative_schedule = cumulative_schedule.concat(new_schedule);
          
        }
        
        //console.log("cumulative_schedule="+JSON.stringify(cumulative_schedule));
        if (null!=cumulative_schedule) {
          cumulative_schedule.sort(function(a,b) {
            return (a.schedule_date-b.schedule_date);
          })
        }
        //return cumulative_schedule;
        return "good";
      }
    }
    
  }
})