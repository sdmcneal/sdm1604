'use strict';

angular.module('fsApp.common.factories.Ledger',[
    'fsApp.common.models'
])
    .factory('LedgerFactory', function (ConstantsFactory,CalculationEngine) {
        var verbose = 1; // 1=error only, 2=init/tracer, 3=debug
        var ledgers = [];
        var accounts = [];
        var account_ids = [];
        var service = {};
        var next_journal_entry_id;
        var next_account_id;

        init();

        function init() {
            if (verbose>=2) console.log('LedgerFactory.init()');
            next_journal_entry_id = ConstantsFactory.FIRST_JOURNAL_ENTRY_ID;
            next_account_id = ConstantsFactory.FIRST_ACCOUNT_ID;
        }

        service.getMonthEndBalances = function(account_id,start_date,end_date) {
            if (verbose>=2) console.log('LedgerFactory.getMonthEndBalances()');
            var s=Date.now();
            var result = {
                labels: [],
                data: []
            };
            var month_end_dates = CalculationEngine.calculateLastDayOfMonths(start_date,end_date,start_date);
            var ledger = service.getJournalEntries(account_id);

            var i,j=1;
            var previous_je_date = ledger[0].journal_entry_date;
            var previous_je_balance = ledger[0].balance;
            var current_je_date;
            var current_je_balance;
            var current_month_end;

            if (ledger.length<2) {
                for (i=0;i<month_end_dates.length;i++) {
                    result.labels.push(CalculationEngine.getYearMonthText(month_end_dates[i]));
                    result.data.push(previous_je_balance);
                }
            } else {
                for (i=month_end_dates.length-1;i>=0;i--) {
                    current_month_end = month_end_dates[i];
                    
                    
                    
                    for(j=ledger.length-1;j>=0;j--) {
                        current_je_date = ledger[j].journal_entry_date;
                        
                        if (current_je_date<=current_month_end) {
                            current_je_balance = ledger[j].balance;
                            
                            result.labels.unshift(CalculationEngine.getYearMonthText(current_month_end));
                            result.data.unshift(current_je_balance);        
                            
                            j=-1; //end search .. move on to next month
                        }
                    }
                }
            }
            if (verbose>=3) console.log('  result: '+JSON.stringify(result) +
            'in '+(Date.now()-s)+' ms');
            return result;
        };
        service.addAccount = function (form) {
            if (verbose>=2) console.log('LedgerFactory.addAccount()');

            var new_account = {

                name: form.name,
                type: form.type,
                balance: form.balance,
                balance_date: new Date(form.balance_date)
            };
            if (form._id === undefined) {
                if (verbose >= 1) console.log('  error: no _id defined');
            } else {
                new_account._id = form._id;

                accounts.push(new_account);

                service.addLedger(new_account._id);

                // add initial balance
                service.addJournalEntry(new_account._id, form.balance_date, null,
                    ConstantsFactory.OPENING_BALANCE, form.balance);

                return new_account._id;
            }
            return form._id;
        };
        service.getAccountDetails = function(account_id) {
            var account;

            if (accounts.length>0) {
                accounts.forEach(function(a) {
                    if (account_id== a._id) account = a;
                    if (verbose>=3) console.log(' match');
                });
            }
            return account;
        };
        service.updateAccount = function (id,name, type, balance, balance_date) {
            if (verbose>=2) console.log('LedgerFactory.updateAccount()');

            var new_account = {
                _id: id,
                name: name,
                type: type,
                balance: balance,
                balance_date: balance_date
            };

            var i;
            for (i=0;i<accounts.length;i++) {
                if (accounts[i]._id==id) {
                    accounts[i] = new_account;
                    i=accounts.length;
                }
            }

            // update initial balance
            service.updateOpeningBalance(new_account._id, balance, balance_date);

            return new_account._id;
        };
        service.getAccountCount = function () {
            return accounts.length;
        };
        service.getAccountList = function () {
            return accounts;
        };
        service.addLedger = function (account_object_id) {
            if (verbose>=2) console.log('LedgerFactory.addLedger()');
            var new_ledger = {
                account_object_id: account_object_id,
                journal_entries: []
            };
            ledgers.push(new_ledger);

            account_ids.push(account_object_id);
        };
        service.resetLedgers = function () {
            var journal_entries;
            var i,l;

            for (l=0;l<ledgers.length;l++) {
                var new_journal_entires = [];
                var je;
                for (i=0;i<ledgers[l].journal_entries.length;i++) {
                    je = ledgers[l].journal_entries[i];
                    if (je.schedule_entry_id==null) new_journal_entires.push(je);
                }
                ledgers[l].journal_entries = new_journal_entires;
            }
        };
        service.addJournalEntry = function (account_id, journal_entry_date,
                                            schedule_entry_id, description, amount) {
            if (verbose>=2) console.log('LedgerFactory.addJournalEntry()');

            var new_journal_entry = {
                journal_entry_id: next_journal_entry_id++,
                journal_entry_date: new Date(journal_entry_date),
                schedule_entry_id: schedule_entry_id,
                description: description,
                amount: amount
            };

            var ledger = service.getJournalEntries(account_id);
            if (verbose>=3) console.log('  account_id: '+account_id);
            
            
                var last_balance = 0.0;
    
                if (ledger.length > 0) {
                    last_balance = ledger[ledger.length - 1].balance;
                }
                if (verbose>=3) console.log('Number(amount)='+Number(amount)+' last balance='+Number(last_balance));
                new_journal_entry.balance = last_balance + Number(amount);
    
                if (verbose>=3) console.log('  logging journal: '+JSON.stringify(new_journal_entry));
                if (ledger.length>0) {
                    if (verbose>=3) console.log ('  opening: '+ledger[0].journal_entry_date+' je: '+journal_entry_date);
                    if  (ledger[0].journal_entry_date<=journal_entry_date)  {
                        ledger.push(new_journal_entry);
                    }
                } else  {
                    ledger.push(new_journal_entry);
                }
                return new_journal_entry.journal_entry_id;
            
        };
        service.updateOpeningBalance = function(account_id,balance,balance_date) {
            if (verbose>=2) console.log('LedgerFactory.updateOpeningBalance()');
            var l = service.getJournalEntries(account_id);

            l[0].balance = balance;
            l[0].amount = balance;
            l[0].balance_date = balance_date;
        };
        service.getLedgerCount = function () {
            if (verbose>=3) console.log('ledger size='+ledgers.length)
            return ledgers.length;
        };
        service.getJournalEntries = function (account_id) {
            if (verbose>=2) console.log('LedgerFactory.getJournalEntries('+account_id+')');
            var _journal_entries;
            var i;
            var l;

            for (i = 0; i < ledgers.length; i++) {
                l = ledgers[i];
                if (account_id == l.account_object_id) {
                    _journal_entries = l.journal_entries;
                }
            }
            if (verbose>=3) console.log('  returning journal entries: '+JSON.stringify(_journal_entries));
            if (undefined === _journal_entries) {
                if (verbose>=1) console.log(' error: no journal found for account: '+account_id);
            }
            return _journal_entries;
        };
        service.getLastBalance = function (account_id) {
            var journal_entries = service.getJournalEntries(account_id);
            if (undefined==journal_entries) {
                if (verbose>=1) console.log('no entries in account '+account_id);
                return 0.0
            } else {
                var count = journal_entries.length;
                if (count == 0) {
                    return 0.0;
                } else {
                    return journal_entries[count - 1].balance;
                }
            }
        };
        service.account_list = account_ids;

        return service;
    })
