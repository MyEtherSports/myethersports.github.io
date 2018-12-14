var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

//Helpers
toInt32 = function(bytes) {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
}

function BigNumberFormat(labelValue) 
  {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9

       ? parseFloat((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(3)) + " bln"
       // Six Zeroes for Millions 
       : Math.abs(Number(labelValue)) >= 1.0e+6

       ? parseFloat((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(3)) + " mln"
       // Three Zeroes for Thousands
       : Math.abs(Number(labelValue)) >= 1.0e+3

       ? parseFloat((Math.abs(Number(labelValue)) / 1.0e+3).toFixed(3)) +" k"

       : Math.abs(Number(labelValue));
   }

String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

String.prototype.format = String.prototype.fa = function(arr) {
    var s = this,
        i = arr.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arr[i]);
    }
    return s;
};

seconds_in_a_day = 86400

var month_names = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"
}

var DailyDistributionStatus = {
  Waiting: 0,
  Live: 1,
  Closed: 2
}


function Str2DOM(string) {
    var parser = new DOMParser(),
        content = 'text/html',
        DOM = parser.parseFromString(string, content);

    return DOM.body.childNodes[0];
}


function Param(_name, _default, _remote, _remote_args, _static) {
  this.name = _name || undefined;
  this.default = _default || undefined;
  this.data = _default || undefined;
  this.remote = _remote || undefined;
  this.remote_args = _remote_args || [];
  this.static = _static || false;
  
  
  this.Fetch = function() {
    return new Promise(function(resolve, reject) {
      if (!this.remote || (this.static && this.data != undefined)) resolve(this.data);
      else {
        try {
            console.info("reading param {0}.".f(this.name));
            this.remote.apply(this.remote, this.remote_args.concat(function (err, result) {
                if (!err) {
                  this.data = result;
                  console.info("param set..");
                  resolve(this.data);
                }
            }.bind(this)));
            
            
          }
          catch(err) {
            console.info("promise retrying for param {0}...".f(this.name));
          }
        
      }
    }.bind(this));
  }
  
  
}

window.distributions = [];


_FindDistribution = function(_distribution_id) {
  var distribution = window.distributions[_distribution_id-1];
  if (!distribution) {
    distribution = new DistributionManager(_distribution_id);
  }
  return distribution;
}

_FindDailyDistribution = function(_distribution_id, _daily_dist_id) {
  var distribution = _FindDistribution(_distribution_id);
  var daily_distribution = distribution.daily_distributions[_daily_dist_id-1];
  if (!daily_distribution) {
      daily_distribution = new DailyDistribution(_distribution_id, _daily_dist_id);
      distribution.daily_distributions[_daily_dist_id-1] = daily_distribution;
  }
  return distribution.daily_distributions[_daily_dist_id-1];
}


JS.require('JS.Hash', 'JS.Observable', function(Hash, Observable) {

    DOMObject = new JS.Class({
      initialize: function() {
        this.dom_elements = [];
        this.dom_element = undefined;
        this.dom_template = '';
        this.params = {};
      },
      
      AsyncGenerateDOMElement : async function() {
        console.info("AsyncGenerateDOMElement");
        await this.AsyncPrepareDOMElement.call(this);
        return this.GenerateDOMElement.call(this);
      },
    
      AsyncPrepareDOMElement : function() {
        return new Promise(function(resolve, reject) {
          resolve();
        }.bind(this));
      },
      
      AddParam : function(_name, _default, _remote, _remote_args, _static) {
        if (!this.params[_name]) {
          this.params[_name] = new Param(_name, _default, _remote, _remote_args, _static);
        }
        return this.params[_name];
      },
      
      GetParam : function(_name) {
        return this.params[_name];
      },
      
      GetMemberArray : function() {
        return [];
      },
      
      PrepareDOMElement : function() {
        
      },
      
      GenerateDOMElement : function() {
        this.PrepareDOMElement();
    
        var tmp = this.dom_template;
        
        tmp = tmp.fa(this.GetMemberArray.call(this));
        
        this.dom_element = Str2DOM(tmp);
        
        this.dom_elements.push(this.dom_element);
        this.DOMGenerated.call(this);
        
        this.dom_element.addEventListener("DOMNodeInsertedIntoDocument", function(ev) {  //TODO: DOMNodeInserted deprecated?
          this.Highlight();
        }.bind(this), false);
        
        return this.dom_element;
      },
      
      DOMGenerated : function() {
      },
      
      Highlight : function() {
          if (!this.dom_element) return;
            // remove the highlight class so it can be applied again
            this.dom_element.classList.remove('highlight');
            
            setTimeout(function () {
                this.dom_element.classList.remove('highlight');
            }.bind(this), 3000);
            // use setTimeout to add the highlight class
            setTimeout(function () {
                this.dom_element.classList.add('highlight');
            }.bind(this), 0);
      },
      
      Select : function() {
        if (!this.dom_element.classList.contains('selected')) {
          this.dom_element.classList.add('selected');
        }
      },
      
      Deselect : function() {
        if (this.dom_element.classList.contains('selected')) {
          this.dom_element.classList.remove('selected');
        }
      }
    });



  Label = new JS.Class(DOMObject, {
    initialize: function(_shorten, _obj) {
      this.obj = _obj || 0;
      
      this.shortened = _shorten || false;
      
      this.dom_element = undefined;
      this.dom_elements = [];
      this.dom_template = '<div class="label_container">{0}</div>';
      
      watch(this, "obj", this.ObjectChanged);
    },
    
    GetMemberArray : function() {
      if (this.shortened) return [BigNumberFormat(this.obj)];
      else return [this.obj];
    },
    
    ObjectChanged : function() {
      this.dom_elements.forEach(function(_dom_element) {
          if (this.shortened) _dom_element.innerHTML = BigNumberFormat(this.obj);
          else _dom_element.innerHTML = this.obj.toString();
      }.bind(this));
    }
    
  });

  DailyDistribution = new JS.Class(DOMObject, {
    initialize: function(_dist_id, _id) {
      this.callSuper();
      
      this.dist_id = _dist_id || 0;
      this.id = _id || 0;
      
      this.daily_dist_struct1 = undefined;
      this.daily_dist_struct2 = undefined;
      
      this.daily_amount = 0;
      this.ether_deposited = 0;
      
      
      this.daily_avg_price = 0;
      
      this.daily_amount_label = new Label(true);
      this.ether_deposited_label = new Label(true);
      this.daily_avg_price_label = new Label(false);
      
      this.place_order_button = Str2DOM('<a href="#" class="pure-button pure-button-primary place_order_button" onclick="PlaceBuyOrder()">PlaceOrder</a>');
      
      this.params = {};
      this.current_status = DailyDistributionStatus.Waiting;
      
      
      this.distribution = _FindDistribution(_dist_id);
      this.date = undefined;
      
      this.countdown_template = '<ul class="countdown" id="countdown">  \
<li class="digits"> <span class="days">00</span>d \
</li> \
<li class="digits"> <span class="hours">00</span>h \
</li> \
<li class="digits"> <span class="minutes">00</span>m \
</li> \
<li class="digits"> <span class="seconds">00</span>s \
</li> \
</ul>';
      this.countdown = undefined;
      
      watch(this, "ether_deposited", this.EtherDepositedChanged);
      
      this.AddParam("daily_dist_struct1", undefined, master_contract.GetDailyDistributionStruct1, [this.dist_id, this.id], true);
      this.AddParam("daily_dist_struct2", undefined, master_contract.GetDailyDistributionStruct2, [this.dist_id, this.id], true);
      
      this.dom_template = '<div class="daily_distribution"> \
          <div class="sidebar"></div> \
          <div class="status"></div> \
          <div class="calendar"> \
              <div class="date">{0}</div> \
              <div class="month">{1}</div> \
          </div> \
      <div class="pure-g" left: 32px;"> \
    <div class="info pure-u-1 pure-u-md-1-4"><div>Distribution:</div><div id="daily_amount"></div></div> \
    <div class="info pure-u-1 pure-u-md-1-4"><div>ETH deposited:</div><div id="ether_deposited"></div></div> \
    <div class="info pure-u-1 pure-u-md-1-2"> \
          <div>Avg price:</div><div id="daily_avg_price"></div> \
    </div> \
    </div> \
        </div>';
    },
    FetchData : function() {
        return Promise.all([
          this.GetParam("daily_dist_struct1").Fetch(),
          this.GetParam("daily_dist_struct2").Fetch()
        ]);
    },
    
    GetMemberArray : function() {
      console.info("GetMemberArray()");
      return [this.date.getDate(), month_names[this.date.getMonth()]];
    },
    
    AsyncPrepareDOMElement : async function() {
      await this.distribution.GetParam("distribution1").Fetch();
      this.distribution1 = this.distribution.GetParam("distribution1").data;
      this.date = this.distribution1[4];
      
        console.info("Fetched parameter");
        console.info(this.date);
        
        this.date = new Date(parseInt(this.date.toString()) * 1000 + (this.id-1) * seconds_in_a_day * 1000);
        console.info(this.date);
        console.info("AsyncPrepareDOMElementAsyncPrepareDOMElement");
      
      var msgs_data = await this.FetchData();
      this.daily_dist_struct1 = msgs_data[0];
      this.daily_dist_struct2 = msgs_data[1];
      
        this.daily_amount = this.daily_dist_struct1.daily_amount.toNumber();
        this.ether_deposited = this.daily_dist_struct1.amount_in_orders.toNumber();
        
        
        this.daily_avg_price = this.ether_deposited / (this.daily_amount / 100 * 95);
        if (this.daily_avg_price > 0) {
          this.daily_avg_price_label.obj = (this.daily_avg_price / (10**8)).toFixed(6).toString() + " ETH";
        }
        else {
          this.daily_avg_price_label.obj = "?"
        }
        
        this.daily_amount_label.obj = Math.round(this.daily_amount / (10**8)).toString();
    },
    
    DOMGenerated : function() {
      this.dom_element.addEventListener("DOMNodeInsertedIntoDocument", function(ev) {  //TODO: DOMNodeInserted deprecated?
          console.info("DailyDist inserted");
      }.bind(this), false);
      
      this.daily_amount_label.AsyncGenerateDOMElement().then(function(daily_amount_label_dom) {
        $(this.dom_element).find("#daily_amount").append(daily_amount_label_dom);
      }.bind(this));
      
      this.ether_deposited_label.AsyncGenerateDOMElement().then(function(ether_deposited_label_dom) {
        $(this.dom_element).find("#ether_deposited").append(ether_deposited_label_dom);
      }.bind(this));
      
      this.daily_avg_price_label.AsyncGenerateDOMElement().then(function(daily_avg_price_label_dom) {
        $(this.dom_element).find("#daily_avg_price").append(daily_avg_price_label_dom);
      }.bind(this));
    },
    
    EtherDepositedChanged : function() {
      var ether = web3.toDecimal(web3.fromWei(this.ether_deposited));
      if (ether > 10) {
        this.ether_deposited_label.obj = Math.round(ether);
      }
      else {
        this.ether_deposited_label.obj = ether.toFixed(2);
      }
    },
    
    Open : function() {
      $(this.dom_element).addClass("live");
      this.current_status = DailyDistributionStatus.Live;
      
      $(this.dom_element.getElementsByClassName("info")[2]).empty();
      this.dom_element.getElementsByClassName("info")[2].appendChild(this.place_order_button);
      this.countdown = Str2DOM(this.countdown_template);
      this.dom_element.getElementsByClassName("info")[2].appendChild(this.countdown);
      
      var end_date = new Date();
      var duration = 1; //In Days
      end_date.setTime(this.date.getTime()  +  (duration * 24 * 60 * 60 * 1000));
      var jcountdown = $(this.dom_element).find("#countdown");
      jcountdown.downCount({
          date: end_date,
          offset: -(new Date().getTimezoneOffset() / 60)
      }, function () {
          
      });
      
    },
    
    Close : function() {
      $(this.dom_element).removeClass("live");
      $(this.dom_element).addClass("closed");
      this.current_status = DailyDistributionStatus.Closed;
    }
  });
  
  DistributionList = new JS.Class(DOMObject, {
    initialize: function(_id) {
      this.callSuper();
      
      this.params = {};
      
      this.distributions = [];
      
      this.current_distribution_id = 0;
      
      this.AddParam("current_distribution_id", undefined, master_contract.GetCurrentDistributionPeriod, [this.id], true);
      
      this.dom_template = '';
    },
    FetchData : function() {
        return Promise.all([
          this.GetParam("current_distribution_id").Fetch()
        ]);
    },
    
  });

  DistributionManager = new JS.Class(DOMObject, {
    initialize: function(_id) {
      this.callSuper();
      
      this.id = _id || 1;
      
      
      this.distribution_start_time = 0;
      this.distribution_end_time = 0;
      this.caption = "";
      this.total_ether = 0;
      
      this.distribution1 = undefined;
      this.distribution2 = undefined;
      
      this.current_daily_dist_day = 0;
      
      this.initial_supply = 0;
      this.burned_amount = 0;
      this.circulation = 0;
      this.avg_price = 0;
      this.timestamp = 0;
      
      this.initial_supply_label = new Label(true);
      this.burned_amount_label = new Label(true);
      this.circulation_label = new Label(true);
      this.avg_price_label = new Label(true);
      this.total_ether_label = new Label(true);
      
      watch(this, "burned_amount", this.BurnedAmountChanged);
      watch(this, "circulation", this.CirculationChanged);
      watch(this, "total_ether", this.TotalEtherChanged);
      
      this.daily_distributions = [];
      this.myScroll = undefined;
      this.daily_dist_queue = new PQueue({concurrency: 1});
      
      
      this.params = {};
      

      this.AddParam("distribution1", undefined, master_contract.GetDistributionStruct1, [this.id], false);
      this.AddParam("distribution2", undefined, master_contract.GetDistributionStruct2, [this.id], false);
      
      this.AddParam("current_daily_dist_day", undefined, master_contract.GetCurrentDailyDistributionDay, [this.id], false);
      this.AddParam("initial_supply", undefined, master_contract.INITIAL_SUPPLY, [], true);
      this.AddParam("burned_amount", undefined, master_contract.GetBurnedTokenAmount, [], false);
      this.AddParam("circulation", undefined, master_contract.GetAmountInCirculation, [], false);
      this.AddParam("timestamp", undefined, master_contract.GetBlockTimestamp, [], false);
      
      this.dom_template = '<div class="daily_distributions_list"> \
           <div class="daily_distribution_header">Daily distributions:</div> \
           <div class="daily_distributions"> \
<nav><ul> \
<li><a href="#" class="matches_created selected"><span>Spring</span></a></li> \
<li><a href="#" class="matches_created"><span>Summer</span></a></li> \
<li><a href="#" class="matches_created"><span>Autumn</span></a></li> \
<li><a href="#" class="matches_created"><span>Winter</span></a></li> \
</ul></nav> \
           </div> \
           <div class="daily_distribution_content" id="wrapper"><ul class="daily_distributions"></ul></div> \
           <div class="daily_distribution_footer"> \
<div class="stats"> \
    <div class="icon ether24"></div> \
    <div class="pure-g" style="width: 100%; left: 32px;"> \
    <div class="info pure-u-1 pure-u-md-1-3"><div>Total:</div><div id="total_ether"></div></div> \
    <div class="info pure-u-1 pure-u-md-1-2"> \
    <div class="network_info" id="network_info">0x0</div> \
    </div> \
    </div> \
</div> \
<div class="stats"> \
    <div class="icon myethersports24"></div> \
    <div class="pure-g" style="width: 100%; left: 32px; height: 32px;"> \
    <div class="info pure-u-1 pure-u-md-1-4"><div>Supply:</div><div id="initial_supply"></div></div> \
    <div class="info pure-u-1 pure-u-md-1-4"><div>Circulation:</div><div id="circulation"></div></div> \
    <div class="info pure-u-1 pure-u-md-1-4"><div>Avg price:</div><div id="avg_price"></div></div> \
    <div class="info pure-u-1 pure-u-md-1-4"><div>Burned:</div><div id="burned_amount"></div></div> \
    </div> \
</div> \
           </div> \
        </div>';
    },
    FetchData : function() {
        return Promise.all([
          this.GetParam("current_daily_dist_day").Fetch(),
          this.GetParam("initial_supply").Fetch(),
          this.GetParam("burned_amount").Fetch(),
          this.GetParam("circulation").Fetch(),
          this.GetParam("timestamp").Fetch(),
          this.GetParam("distribution1").Fetch(),
          this.GetParam("distribution2").Fetch(),
        ]);
    },
    
    AsyncPrepareDOMElement : async function() {
      console.info("MessageManager.AsyncPrepareDOMElement()");

      var msgs_data = await this.FetchData();
      this.current_daily_dist_day = msgs_data[0][0];
      this.initial_supply = msgs_data[1][0];
      this.burned_amount = msgs_data[2][0];
      this.circulation = msgs_data[3][0];
      this.timestamp = msgs_data[4] * 10000000;
      this.distribution1 = msgs_data[5];
      this.distribution2 = msgs_data[6];
      
      this.caption = this.distribution2[1];
      this.distribution_start_time = this.distribution1[4];
      this.distribution_end_time = this.distribution1[5].toNumber();
      this.total_ether = this.distribution1[0].toNumber();
      
      this.initial_supply_label.obj = Math.round(this.initial_supply / (10**8));
      
      this.ListenToEvents();
    },
    
    DOMGenerated : function() {
      this.dom_element.addEventListener("DOMNodeInsertedIntoDocument", function(ev) {  //TODO: DOMNodeInserted deprecated?
          console.info("DistributionManager inserted");
      }.bind(this), false);
      
      this.initial_supply_label.AsyncGenerateDOMElement().then(function(initial_supply_label_dom) {
        $(this.dom_element).find("#initial_supply").append(initial_supply_label_dom);
      }.bind(this));
      
      this.burned_amount_label.AsyncGenerateDOMElement().then(function(burned_amount_label_dom) {
        $(this.dom_element).find("#burned_amount").append(burned_amount_label_dom);
      }.bind(this));
      
      this.circulation_label.AsyncGenerateDOMElement().then(function(circulation_label_dom) {
        $(this.dom_element).find("#circulation").append(circulation_label_dom);
      }.bind(this));
      
      this.total_ether_label.AsyncGenerateDOMElement().then(function(total_ether_label_dom) {
        $(this.dom_element).find("#total_ether").append(total_ether_label_dom);
      }.bind(this));
      
      var contract_link = '<a href="https://etherscan.io/address/{0}" target="_blank">{0}</a>'.f(master_contract_addr);
      $(this.dom_element).find("#network_info").empty();
      $(this.dom_element).find("#network_info").append(Str2DOM(contract_link));
      
      this.myScroll = new IScroll(this.dom_element.getElementsByClassName("daily_distribution_content")[0], { mouseWheel: true, scrollbars: false});
      
      this.AddDailyDistributions();
    },
    
    ListenToEvents : function() {
      console.info("ListenToEvents");
      
      const filter_tokenburn_event = master_contract.TokensBurned();
      filter_tokenburn_event.new();
      filter_tokenburn_event.watch().then((result) => {
          this.GetParam("burned_amount").Fetch().then(function(_result) {
            this.burned_amount = _result[0];
          }.bind(this));
      });
      
      const filter_neworder_event = master_contract.BuyOrderCreated();
      filter_neworder_event.new();
      filter_neworder_event.watch().then((result) => {
        
          var distribution_id = result[0].data[0];
          var day = result[0].data[1];
          
          this.GetParam("total_ether").Fetch().then(function(_result) {
            this.total_ether = _result[0];
          }.bind(this));
      });
    },
    
    AddDailyDistributions : function() {
      console.info("Adding distributions");
      var time_diff = this.distribution_end_time - this.distribution_start_time;
      var days = time_diff / seconds_in_a_day;
      
      //this.snapshot.forEach(function(message_id) {
      for (var i = 1; i <= days; i++) {
        var daily_dist = _FindDailyDistribution(this.id , i);
        this.daily_dist_queue.add(daily_dist.AsyncGenerateDOMElement.bind(daily_dist)).then(function(daily_dist_dom) {
              console.info("appending message DOM element");
              var id = daily_dist_dom.id;
              var yo1 = parseInt(this.distribution_start_time);
              var yo2 = parseInt(seconds_in_a_day  * (id-1));
              

              
              var opens = parseInt(this.distribution_start_time) + parseInt(seconds_in_a_day  * (id-1)) ;
              var closes = parseInt(this.distribution_start_time) + parseInt(seconds_in_a_day  * id) ;
              
              var tmp1 = parseInt(this.timestamp);
              
              //var now = Math.round((new Date()).getTime() / 1000);
              var now = parseInt(this.timestamp) / 10000000
              console.info((new Date()).getTime());
              

              if (now >= closes) {
                daily_dist_dom.Close();
              }
              
              if (now >= opens && now < closes) {
                daily_dist_dom.Open();
              }
              
              this.dom_element.getElementsByClassName("daily_distribution_content")[0].getElementsByClassName("daily_distributions")[0].appendChild(daily_dist_dom.dom_element);
              this.myScroll.refresh();
              if (daily_dist_dom.id == this.current_daily_dist_day) {
              }
        }.bind(this, daily_dist));
      }
      
    },
    
    BurnedAmountChanged : function() {
      this.burned_amount_label.obj = Math.round(this.burned_amount / (10**8));
    },
    
    CirculationChanged : function() {
      this.circulation_label.obj = Math.round(this.circulation / (10**8));
    },
    
    TotalEtherChanged : function() {
      this.total_ether_label.obj = Math.round(this.total_ether / (10**18));
    },
    
    AddDailyDistribution : function(_message_id) {
      console.info("adding distribution");
    }
  });
  
  /*
  window.DistributionShelf = new JS.Singleton(DistributionManager, {
    initialize: function(_id) {
      this.callSuper();
    }
  });
  */

});