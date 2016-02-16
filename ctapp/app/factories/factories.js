app.factory('CrumbFactory', function () {
    return {
        data: {
            user: 99,
            trip: 88,
            route: 77,
            crumbs: []
        }
    };
});

app.factory('MapFactory', function () {
    return {
        map: '',
        setMap: function (_map) {
            console.log("setMap()");
            this.map = _map;
        }
    };
});

function account(id, name, description, type, balance, balancedate) {
    this.account_id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.balance = balance;
    this.balancedate = balancedate;
}

var next_journal_entry_id = 10000;

function JournalEntry(journal_entry_date, schedule_entry_id, amount, balance) {
    this.journal_entry_id = next_journal_entry_id++;
    this.create_date = new Date();
    this.journal_entry_date = journal_entry_date;
    this.schedule_entry_id = schedule_entry_id;
    this.amount = amount;
    this.balance = balance;
}

function Model(id, user_id, create_date, sort_order, model_description) {
    var verbose = false;

    this.model_id = id;
    this.user_id = user_id;
    this.create_date = create_date;
    this.sort_order = sort_order;
    this.model_description = model_description;

    this.ledgers = new Map();

    this.setupAccounts = function (accounts) {
        var i;

        if (this.ledgers.entries() > 0) {
            console.log("ledgers already created");
            return;
        }
        else {
            console.log('setupAccounts()');
        }
        for (i = 0; i < accounts.length; i++) {
            var journal_entry = new JournalEntry(accounts[i].balancedate,
                null, accounts[i].balance, accounts[i].balance);

            this.ledgers.set(accounts[i].account_id, [journal_entry]);
        }
        if (verbose) {
            this.ledgers.forEach(function (value, key) {
                console.log(key + ' = ' + JSON.stringify(value));
            })
            //console.log(JSON.stringify(this.ledgers));
        }
    }

    this.getLedger = function (account_id) {
        //if (verbose) console.log(JSON.stringify(this.ledgers.get(account_id)));
        return this.ledgers.get(account_id);
    }
    this.addJournalEntry = function (account_id, journal_entry) {
        this.ledgers.get(account_id).push(journal_entry);
        //console.log('account ' + account_id + ' has ' + this.ledgers.get(account_id).length +
        //  ' entries');
    }
}

//TODO: don't hardcode this
var next_schedule_entry_id = 4000;

function ScheduleEntry(id, catalog_entry_id, schedule_date, account_id, amount,
                       amount_calc, model_id) {
    var verbose = false;

    if (null == id)
        this.schedule_entry_id = next_schedule_entry_id++;
    else
        this.schedule_entry_id = id;
    this.catalog_entry_id = catalog_entry_id;
    this.schedule_date = schedule_date;
    this.account_id = account_id;
    this.amount = amount;
    this.amount_calc = amount_calc;
    this.model_id = model_id;

    this.postJournalEntry = function (model) {

        // get model reference
        var ledger = model.getLedger(this.account_id);
        if (ledger != undefined) {

            var last_balance = ledger[ledger.length - 1].balance;
            var last_date = ledger[ledger.length - 1].journal_entry_date;
            if (verbose)
                console.log('postJournalEntry():defined, balance=' + last_balance +
                    ', date=' + last_date.toDateString());
            if (this.schedule_date >= last_date) {
                // TODO: when calculations are required, change to real conditional
                if (true) {
                    var new_journal_entry = new JournalEntry(this.schedule_date,
                        this.schedule_entry_id, this.amount, last_balance + this.amount);
                    model.addJournalEntry(this.account_id, new_journal_entry);
                }
            }
        }
    }
}

app.factory('LedgerFactory', function (ConstantsFactory) {
    var verbose = true;
    var ledgers = new Map();
    var account_ids = [];
    var service = {};
    var next_journey_entry_id;

    init();

    function init() {
        if (verbose) console.log('LedgerFactory.init()');
        next_journey_entry_id = ConstantsFactory.FIRST_JOURNEY_ENTRY_ID;
    }

    service.addLedger = function (account_id) {
        if (verbose) console.log('LedgerFactory.addLedger()');
        ledgers.set(account_id, []);

        account_ids.push(account_id);
    };

    service.addJournalEntry = function (account_id, journal_entry_date,
                                        schedule_entry_id, description, amount) {
        if (verbose) console.log('LedgerFactory.addJournalEntry()');

        var new_journal_entry = {
            journal_entry_id: next_journey_entry_id++,
            journal_entry_date: journal_entry_date,
            schedule_entry_id: schedule_entry_id,
            description: description,
            amount: amount
        };

        var ledger = service.getLedger(account_id);
        var last_balance = 0.0;

        if (ledger.size > 0) {
            last_balance = ledger[ledger.size - 1].balance;
        }

        new_journal_entry.balance = last_balance + amount;

        ledger.push(new_journal_entry);

        return new_journal_entry.journal_entry_id;
    };

    service.getLedgerCount = function () {
        return ledgers.size;
    };

    service.getLedger = function (account_id) {
        return ledgers.get(account_id);
    };

    service.account_list = account_ids;

    return service;
});

app.factory('ScheduleFactory', function (ConstantsFactory) {
    var verbose = true;
    var schedule_entries = [];
    var service = {};
    var next_schedule_entry_id;
    var range_start_date, range_end_date;

    init();

    function init() {
        if (verbose) console.log('ScheduleFactory.init()');
        next_schedule_entry_id = ConstantsFactory.FIRST_SCHEDULE_ENTRY_ID;
        range_start_date = ConstantsFactory.DEFAULT_RANGE_START;
        range_end_date = ConstantsFactory.DEFAULT_RANGE_END;
    }

    service.addScheduleEntry = function (catalog_entry_id, schedule_date,
                                         account_id, amount, amount_calc) {

        if (verbose) console.log('ScheduleFactory.addScheduleEntry()');

        var new_schedule_entry = {
            schedule_entry_id: next_schedule_entry_id++,
            catalog_entry_id: catalog_entry_id,
            schedule_date: schedule_date,
            account_id: account_id,
            amount: amount,
            amount_calc: amount_calc
        };

        schedule_entries.push(new_schedule_entry);


        return new_schedule_entry.schedule_entry_id;
    };
    service.getScheduleEntryCount = function () {
        return schedule_entries.length;
    };
    service.getScheduleEntries = function () {
        return schedule_entries;
    };
    service.setRangeStartDate = function (start_date) {
        range_start_date = start_date;
    };
    service.setRangeEndDate = function (end_date) {
        range_end_date = end_date;
    };


    return service;
});
function CatalogEntry(id, parent_id, user_id, name, catalog_entry_type, account_id,
                      paired_account_id, start_date, end_date, amount, description, frequency,
                      frequency_param, used_in_models, param1, param2, tax_year_maximum) {

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
    }
    else {
        this.end_date = new Date();
        this.end_date.setFullYear(2100);
    }
    this.amount = amount;
    this.param1 = param1;
    this.param2 = param2;
    this.tax_year_maximum = tax_year_maximum;

    this.calculateSchedule = function (range_start, range_end) {
        var _current_date = this.start_date;
        var _end_date;
        var _schedule_array = [];
        var _verbose = false;
        var i = 20;

        _end_date = ((range_end < this.end_date) || (null == this.end_date)) ? range_end : this.end_date;

        if (_verbose) console.log("_current date=" + _current_date.toDateString());
        if (_verbose) console.log("_end_date=" + _end_date.toDateString());
        if (_verbose) console.log("current<end? " + (_current_date.getTime() < _end_date.getTime()));

        while ((i-- > 0) && (_current_date.getTime() < _end_date.getTime())) {
            if (_verbose) console.log("_current date=" + _current_date.toDateString());

            //TODO: expand for multiple models .. assume just id sits in used_in_models
            var _current_entry = new ScheduleEntry(null, this.catalog_entry_id, _current_date,
                this.account_id, null, null, used_in_models);

            if (0 == this.catalog_entry_type.localeCompare("fixed")) {
                _current_entry.amount = this.amount;
            }

            // TODO: refactor calculation of next date
            if (0 == this.frequency.localeCompare("monthly")) {
                _current_date = new Date(new Date(_current_date).setMonth(_current_date.getMonth() + 1));
            }
            if (_verbose) console.log("ScheduleEntry=" + JSON.stringify(_current_entry));
            _schedule_array.push(_current_entry);
        }


        return _schedule_array;
    }
}

app.factory('ConstantsFactory', function () {
    var constants = {};
    var verbose = true;

    init();

    function init() {
        if (verbose) console.log("ConstantsFactory.init()");
        constants.FIRST_USER_ID = 10000;
        constants.FIRST_ACCOUNT_ID = 20000;
        constants.FIRST_CATALOG_ENTRY_ID = 30000;
        constants.FIRST_SCHEDULE_ENTRY_ID = 40000;
        constants.FIRST_JOURNEY_ENTRY_ID = 50000;

        constants.FREQ_MONTHLY = "monthly";

        constants.FIXED = "fixed";

        constants.DEFAULT_RANGE_START = new Date(2016, 1, 1);
        constants.DEFAULT_RANGE_END = new Date(2016, 7, 1);

        constants.OPENING_BALANCE = "Opening Balance";
    }

    return constants;
});
app.factory('CalculationEngine', function (ConstantsFactory) {
    var verbose = true;
    var service = {};

    init();

    function init() {
        if (verbose)console.log('CalculationEngine.init()');
    }

    service.calculateMonthlyScheduleDate = function (day_of_month, catalog_entry_start_date,
                                                     catalog_entry_end_date, ledger_balance_date) {
        if (verbose) console.log('CalculationEngine.calculateMonthlyScheduleDate()');

        var schedule_dates = [];
        var current_date;

        if (catalog_entry_end_date < ledger_balance_date) {
            return null;
        } else {
            // if start date is before opening date..
            if ((catalog_entry_start_date == null) || (catalog_entry_start_date < ledger_balance_date)) {
                current_date = ledger_balance_date;
            } else {
                current_date = catalog_entry_start_date;
            }
            // set day of month
            if ( current_date.getDate() > day_of_month ) {
                // set to next month
                current_date.setMonth(current_date.getMonth()+1);
                current_date.setDate(day_of_month);
            } else {
                current_date.setDate(day_of_month);
            }
            schedule_dates.push(new Date(current_date));

            var max_iterations = 10;
            while ( (max_iterations-- > 0) && (current_date<=catalog_entry_end_date)) {
                current_date.setMonth(current_date.getMonth()+1);
                schedule_dates.push(new Date(current_date));
            }

        }
        return schedule_dates;

    };
    // first day
    // first weekday
    // every x weeks
    // weekly
    // biweekly
    
    service.calculateLastDayOfMonths = function(catalog_entry_start_date,
    catalog_entry_end_date,ledger_balance_date) {
        if (verbose) console.log('CalculationEngine.calculateLastDayOfMonths()');

        var schedule = service.calculateMonthlyScheduleDate(1,catalog_entry_start_date,
            catalog_entry_end_date,ledger_balance_date);

        schedule.forEach(function(d) {
            d.setDate(d.getDate()-1);
            if (verbose) console.log('(last day)' + d.toDateString());
        });

        return schedule;
    };

    service.calculateLastWeekdayOfMonths = function(catalog_entry_start_date,
                                                catalog_entry_end_date,ledger_balance_date) {
        if (verbose) console.log('CalculationEngine.calculateLastWeekdayOfMonths()');

        var schedule = service.calculateLastDayOfMonths(catalog_entry_start_date,
            catalog_entry_end_date,ledger_balance_date);

        //TODO: can optimize to just 1 iteration
        schedule.forEach(function(d) {
            var subtract = 0;

            if (d.getDay()==0) subtract = 2; //Sunday
            if (d.getDay()==6) subtract = 1; //Saturday

            if (subtract>0) d.setDate(d.getDate()-subtract);
            if (verbose) console.log('(last weekday)' + d.toDateString());
        });

        return schedule;
    }

    return service;
});
app.factory('CatalogFactory', function (ScheduleFactory, ConstantsFactory, CalculationEngine) {
    var verbose = true;
    var catalog_entries = [];
    var service = {};
    var next_catalog_entry_id;

    init();

    function init() {
        if (verbose) console.log('CatalogFactory.init()');
        next_catalog_entry_id = ConstantsFactory.FIRST_CATALOG_ENTRY_ID;
    }

    service.addCatalogEntry = function (description, parent_id, catalog_entry_type, account_id,
                                        paired_account_id, start_date, end_date, amount, frequency,
                                        frequency_param, param1, param2, tax_year_maximum) {

        if (verbose) console.log('CatalogFactory.addCatalogEntry()');

        var new_catalog_entry = {
            catalog_entry_id: next_catalog_entry_id++,
            parent_catalog_entry_id: parent_id,
            account_id: account_id,
            catalog_entry_type: catalog_entry_type,
            description: description,
            frequency: frequency,
            amount: amount,
            param1: param1,
            param2: param2,
            tax_year_maximum: tax_year_maximum
        };
        if (start_date)
            new_catalog_entry.start_date = start_date;
        else
            new_catalog_entry.start_date = new Date();
        if (end_date) {
            new_catalog_entry.end_date = end_date;
        }
        else {
            new_catalog_entry.end_date = new Date();
            new_catalog_entry.end_date.setFullYear(2100);
        }

        catalog_entries.push(new_catalog_entry);

        //
        // TODO: placeholder to test create schedule
        //
        var schedule = CalculationEngine.calculateMonthlyScheduleDate(1,new Date(2016,0,12),
        new Date(2100,0,1),new Date(2016,1,14));

        schedule = CalculationEngine.calculateLastDayOfMonths(new Date(2016,0,12),
            new Date(2100,0,1),new Date(2016,1,14));

        schedule = CalculationEngine.calculateLastWeekdayOfMonths(new Date(2016,0,12),
            new Date(2100,0,1),new Date(2016,1,14));

        //schedule.forEach(function(d) {
        //    d.setDate(d.getDate()-1);
        //    console.log(d.toDateString());
        //});
        //
        //console.log(JSON.stringify(schedule));

        ScheduleFactory.addScheduleEntry(new_catalog_entry.catalog_entry_id, new_catalog_entry.start_date,
            account_id, amount, new_catalog_entry.amountamount_calc);

        return new_catalog_entry.catalog_entry_id;
    };

    service.getCatalogEntryCount = function () {
        return catalog_entries.length;
    };

    service.getCatalogEntries = function () {
        return catalog_entries;
    };

    return service;
});

app.factory('AccountFactory', function (ConstantsFactory, LedgerFactory) {
    var verbose = true;
    var accounts = [];
    var service = {};
    var next_account_id;

    init();

    function init() {
        if (verbose) console.log('AccountFactory.init()');
        next_account_id = ConstantsFactory.FIRST_ACCOUNT_ID;
    }

    service.addAccount = function (name, type, balance, balance_date) {
        if (verbose) console.log('AccountFactory.addAccount()');

        var new_account = {
            account_id: next_account_id++,
            name: name,
            type: type,
            balance: balance,
            balance_date: balance_date
        };

        accounts.push(new_account);

        LedgerFactory.addLedger(new_account.account_id);

        // add initial balance
        LedgerFactory.addJournalEntry(new_account.account_id, balance_date, null,
            ConstantsFactory.OPENING_BALANCE, balance);

        return new_account.account_id;
    };

    service.getAccountCount = function () {
        return accounts.length;
    };

    service.getAccountList = function () {
        return accounts;
    };

    return service;
});

app.factory('UserFactory', function (ConstantsFactory) {
    var verbose = true;
    var users = [];
    var service = {};
    var next_user_id;

    init();

    function init() {
        if (verbose) console.log("UserFactory.init()");
        next_user_id = ConstantsFactory.FIRST_USER_ID;
    };

    service.addUser = function (name) {
        if (verbose) console.log('UserFactory.addUser()');

        var new_user = {
            user_id: next_user_id++,
            name: name
        };

        users.push(new_user);

        return new_user.user_id;
    };

    service.getUserCount = function () {
        return users.length;
    };

    service.getUserList = function () {
        return users;
    };

    return service;

});

app.factory('FSUser', function () {
    return {
        user: {
            name: '',
            accounts: [],
            catalog: [],
            models: [],

            mockdata: function () {
                this.name = "John";

                // accounts
                this.accounts = [
                    new account(2000, "CHK", "Checking", "Liquid", 1000.0, new Date()),
                    new account(2001, "SAV", "Savings", "Liquid", 2000.0, new Date()),
                    new account(2002, "HOM", "Home Fixed Asset", "Asset", 500000.0, new Date()),
                    new account(2003, "HM", "Home Mortgage", "Loan", 250000.0, new Date()),
                    new account(2004, "SS", "Social Security", "Report Only", 0, new Date(2016, 0, 1))
                ];

                this.models = [
                    new Model(3000, 1000, new Date(), 10, "Current Model")
                ];

                var catalog_entry_id = 4000;
                this.catalog = [
                    new CatalogEntry(catalog_entry_id++, null, 1000, "Storage", "fixed", 2000, null, new Date(2016, 1, 11), null, -75.0,
                        "Storage", "monthly", 11, 3000, null, null, null),
                    new CatalogEntry(catalog_entry_id++, null, 1000, "Gross Salary", "fixed",
                        2000, null, new Date(2016, 2, 28), null, 10000.0, "Salary", "monthly", null,
                        3000, null, null, null),
                    new CatalogEntry(catalog_entry_id++, catalog_entry_id - 2, 1000,
                        "Social Security", "ratio to parent", 2000, 2004, new Date(2016, 0, 28),
                        null, 0.0, "Social Security", "monthly", 28, 3000, -0.065, null, 118000.0)
                ];
                // var day_of_month = 10;
                // while (catalog_entry_id < 4010) {
                //   this.catalog.push(new CatalogEntry(catalog_entry_id++, null, 1000, "HOA", "fixed", 2000, null, new Date(2016, 1, day_of_month), null, -75.0,
                //     "Home Owners Association", "monthly", day_of_month++, 3000, null, null, null));
                // }
            },
            getJSON: function () {
                return JSON.stringify(this);

            },
            generateSchedule: function () {
                var i;
                var cumulative_schedule = null;

                for (i = 0; i < this.catalog.length; i++) {
                    var new_schedule = this.catalog[i].calculateSchedule(new Date(2016, 1, 1),
                        new Date(2017, 3, 1));

                    if (null == cumulative_schedule)
                        cumulative_schedule = new_schedule;
                    else
                        cumulative_schedule = cumulative_schedule.concat(new_schedule);

                }

                //console.log("cumulative_schedule="+JSON.stringify(cumulative_schedule));
                if (null != cumulative_schedule) {
                    cumulative_schedule.sort(function (a, b) {
                        return (a.schedule_date - b.schedule_date);
                    })
                }
                //return cumulative_schedule;

                for (i = 0; i < cumulative_schedule.length; i++) {
                    cumulative_schedule[i].postJournalEntry(this.models[0]);
                }
                return "schedule entries = " + cumulative_schedule.length;
            }
        }

    }
})