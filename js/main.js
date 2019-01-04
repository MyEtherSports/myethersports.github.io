var selected_section = null;

var HeaderMenuState = {
  Default: 1,
  Order: 2,
};

var distribution_active = false;

//Thanks, stackoverflow
window.urlParams = undefined;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       window.urlParams[decode(match[1])] = decode(match[2]);
})();

var simulateClick = function (elem) {
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	var canceled = !elem.dispatchEvent(evt);
};

var header_menu_state = HeaderMenuState.Default;

var images = ["dot1", "dot2", "dot3", "dot4"];
var next_image_id = 0;
var current_image_id = 0;
var current_timeout = 0;

function InitCountdown(dist_period_id, latest_block) {
  master_contract.GetDistributionStruct1(dist_period_id).then((dist_struct) => {
      
      
      var dist_start_time = dist_struct[4].toNumber();
      var dist_end_time = dist_struct[5].toNumber();
      
      var time_until = 0;
      
      if (latest_block.timestamp < dist_start_time) {
        time_until = dist_start_time
        distribution_active = false;
        $('#countdown_text').text("Time left until upcoming distribution period of GEN tokens begins.");
      }
      else {
        time_until = dist_end_time;
        $('#countdown_text').text("Time left until current distribution period of GEN tokens ends.");
        distribution_active = true;
        $("#OrderButton").addClass("green");
      }
      
      var _date = new Date(time_until * 1000);
      var formatted_date = (_date.getMonth()+1)  + "/" + (_date.getDate()) + "/" + _date.getFullYear() + " " +
_date.getHours() + ":" + _date.getMinutes() + ":" + + _date.getSeconds();
      
      //Init countdown
      $('.countdown').downCount({
          date: formatted_date,
          offset: -(new Date().getTimezoneOffset() / 60)
      }, function () {
          //TODO: change distribution and reset clock
      });
      
    });
}

function Base64Encode(str, encoding = 'utf-8') {
    var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str);        
    return base64js.fromByteArray(bytes);
}

function Base64Decode(str, encoding = 'utf-8') {
    var bytes = base64js.toByteArray(str);
    return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
}

if (master_contract) {
  master_contract.GetCurrentDistributionPeriod().then((dist_period_id) => {
    
    if (dist_period_id[0] == 0) {
      //Wait for distribution
    
      const filter = master_contract.NewDistributionPeriod().new((error, result) => {
        if (error) return;
        
          var test_filter = master_contract.NewDistributionPeriod({});
          test_filter.filterId = result;
          var topic = window.web3.sha3("NewDistributionPeriod(uint256)");
          
          test_filter.watch().then((result) => {
              //InitCountdown(result[0].data[0]);
          });
      });
      
      return;
    }
    
    /*
    eth.blockNumber().then((block_number) => {
      console.info(block_number);
      //sync clock
      InitCountdown(dist_period_id[0]);
    });
    */
    eth.getBlockByNumber('latest', true).then((block) => {
      //InitCountdown(dist_period_id[0], block);
    });
  
    //If injected web3 has a default account
    if (window.web3.eth.accounts[0] && master_contract) {
        master_contract.GetReferralLink(window.web3.eth.accounts[0]).then((referral_link) => {
          console.info("Referral link: {0}".f(referral_link));
          var encoded = Base64Encode(referral_link[0]);
          var _decoded = Base64Decode(encoded);
          
          
          console.info(encoded);
          console.info(_decoded);
          console.info(referral_link);
      });
    }
  
  });
}
else {
      //Preliminary date
      var dist_start_time = 1547186400;
      var dist_end_time = dist_start_time + 30 * 86400
      
      var _date = new Date(dist_start_time * 1000);
      var formatted_date = (_date.getMonth()+1)  + "/" + (_date.getDate()) + "/" + _date.getFullYear() + " " +
_date.getHours() + ":" + _date.getMinutes() + ":" + + _date.getSeconds();
 
      
      //$('#countdown_text').text("Time left until upcoming distribution period of GEN tokens begins.");
      

      //Init countdown
      /*
      $('.countdown').downCount({
          date: formatted_date,
          offset: -(new Date().getTimezoneOffset() / 60)
      }, function () {
          //TODO: change distribution and reset clock
      });
      */
}

JS.require('JS.Hash', 'JS.Observable', function(Hash, Observable) {
    // ...

    // Classes
    ArcherAnimation = new JS.Class({
      initialize: function(_path, _container) {
        this.archer_object = undefined;
        this.timer = undefined;
        this.path = _path || undefined;
        this.container = _container || undefined;
        this.counter = 0;
        this.is_playing = false;
        
        this.archer_object = LoadArcherAnimation(_path, _container);
      },
      
      Play : function(_name) {
        this.counter = 0;
        if (this.is_playing) {
          return;
        }
        
        this.timer = setInterval(function tick() {
          this.counter += 1;
          if (this.counter >= 120) {
            clearInterval(this.timer);
            this.is_playing = false;
            return 0;
          }
          this.is_playing = true;
          this.archer_object.setValue(_name, this.counter);
        }.bind(this), 60);
      },
      
      Stop : function(_name) {
        if (this.is_playing && this.timer) {
          clearInterval(this.timer);
        }
      }
    });
    
    
    $(document).ready(function(){
    
    if ("ref" in urlParams) {
      window.url_ref_id = urlParams["ref"];
      window.url_decoded_ref_id = Base64Decode(window.url_ref_id);
      
      var re = /[0-9A-Fa-f]{6}/g;
    
      if(re.test(window.url_decoded_ref_id)) {
          console.info('valid hex');
          console.info("Found referral:");
          console.info(window.url_decoded_ref_id);
      } else {
          console.info('invalid ref link');
      }
    }
      
    InitPopups();
    InitCharts();
    InitCheckboxes();
    InitImages();
    ChangeImage();
      
      //Timeline
    $('.member-title').click(function(e) {
      console.log("Clicked");
      $(this).next().slideToggle();
      $(this).next().next().next().slideToggle();
    })
    
      
      //Highlight and scroll down the current navbar link
      if (window.location.hash) {
          $('html, body').animate({
            scrollTop: $(window.location.hash).offset().top
          }, 800);
        selected_section = $('.pure-menu-list').find("."+window.location.hash.substring(1));
      }
      else {
        selected_section = $('.pure-menu-list').find("li:first-child");
      }
      selected_section.toggleClass("pure-menu-selected");
      
      // Add smooth scrolling to all links
      $("a").on('click', function(event) {
        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
          // Prevent default anchor click behavior
          event.preventDefault();
    
          // Store hash
          var hash = this.hash;
    
          // Using jQuery's animate() method to add smooth page scroll
          // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
          $('html, body').animate({
            scrollTop: $(hash).offset().top
          }, 800, function(){
       
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
          });
        } // End if
      });
      
      //Add onclick highlight to navbar menus
      $('.pure-menu-list').find("li").click(function(event) {
        selected_section.toggleClass("pure-menu-selected"); //deselect old
        var old_selected_section = selected_section;
        selected_section = $(this);
        selected_section.toggleClass("pure-menu-selected"); //select new
      });
      
      
      //ScrollSpy Alternative
    /*
      var section = document.querySelectorAll(".section");
      var sections = {};
      var i = 0;
    
      Array.prototype.forEach.call(section, function(e) {
        sections[e.id] = e.offsetTop + screen.height - 60 - 70;
      });
    
      window.onscroll = function() {
        var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    
        for (i in sections) {
          if (sections[i] <= scrollPosition) {
            
            selected_section.toggleClass("pure-menu-selected");
            var old_selected_section = selected_section;
            selected_section = $('.pure-menu-list').find("."+i);
            if (old_selected_section != selected_section) selected_section.toggleClass("pure-menu-selected");
          }
        }
      };
      */
      
      var roadmap_animation = new ArcherAnimation("roadmap", document.getElementById('roadmap_animation'))  //LoadArcherAnimation("roadmap", roadmap_container);
      
      var whitepaper_animation = new ArcherAnimation("whitepaper", document.getElementById('whitepaper_animation')) //LoadArcherAnimation("whitepaper", whitepaper_container);
      var opengenesis_animation = new ArcherAnimation("opengenesis", document.getElementById('opengenesis_animation'));
      
      roadmap_animation.Play("Spawn");
      whitepaper_animation.Play("Spawn");
      opengenesis_animation.Play("Spawn");
      
      //Observer
      var options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
      
      var roadmap_visibility_toggle = function(entries, observer) { 
        roadmap_animation.Play("Spawn");
      };
      
     var whitepaper_visibility_toggle = function(entries, observer) { 
        whitepaper_animation.Play("Spawn");
      };
      
     var opengenesis_visibility_toggle = function(entries, observer) { 
        opengenesis_animation.Play("Spawn");
      };
      
      if ('IntersectionObserver' in window) {
        var roadmap_observer = new IntersectionObserver(roadmap_visibility_toggle, options);
        var whitepaper_observer = new IntersectionObserver(whitepaper_visibility_toggle, options);
        var opengenesis_observer = new IntersectionObserver(opengenesis_visibility_toggle, options);
        
        var roadmap_target = document.getElementById('roadmap_animation');
        var whitepaper_target = document.getElementById('whitepaper_animation');
        var opengenesis_target = document.getElementById('opengenesis_animation');
        
        roadmap_observer.observe(roadmap_animation.container);
        whitepaper_observer.observe(whitepaper_animation.container);
        opengenesis_observer.observe(opengenesis_animation.container);
      }
      
      
    });
    
    
    function LoadArcherAnimation(_subfolder, _container) {
        var rootUrl = 'animations/' + _subfolder + "/";
    
        /**
         * Location of the assets folder, by default resolved relative from root URL
         */
        var assetUrl = rootUrl + 'assets';
    
        /**
         * Location of the SVG file, by default resolved relative from root URL
         */
        var graphicUrl = rootUrl + 'archer.graphic.svg';
    
        /**
         * Location of the graphic configuration file, by default resolved relative from root URL
         */
        var configUrl = rootUrl + 'archer.config.json';
    
        /**
         * The container HTML element in which to display the graphic
         */
        var container = _container;
    
        // Create a graphic instance over the container
        var graphic = archer.create(container);
    
        // Tell the graphic where assets (e.g. images) are located
        graphic.document.setAssetRoot(assetUrl);
    
        // Load graphic and configuration
        graphic.loadUrl(graphicUrl, configUrl);
    
        // Wait until files are loaded
        graphic.on('ready', function () {
    
            // Make graphic fit into container bounds
            graphic.view.zoomToFit();
    
            // Enable zoom / pan with mouse
            graphic.view.enableMouse(false, false);
    
            // Set variable values
            /* graphic.setValue('Spawn', 30); */
    
            // Add event listeners
            /*
            graphic.element('animation').on('click', function(element, event) {
                console.log('event: ' + event.type + ', element: ' + element.id);
            });
            */
        });
        
        window.addEventListener('resize', function () {
            graphic.view.resize();
        }.bind(graphic));
    
        // Files could not be loaded, maybe due to security restrictions
        // Display error message
        graphic.on('error', function() {
            document.getElementById('error').style['display'] = 'block';
        })
        
        return graphic;
    }
    

});

function InitDistributionManager() {
  if (!window.DistributionShelf.dom_element && master_contract) {
      window.DistributionShelf.AsyncGenerateDOMElement().then(function(distribution_manager_dom) {
        $("#left_panel").append(distribution_manager_dom);
      });
  }

}

function InitPopups() {

  //IziModal test
  $("#modal-tos").iziModal({
    title: 'ToS',
    subtitle: 'Terms of Service',
    headerColor: '#495b70',
    background: null,
    theme: '',  // light
    icon: null,
    iconText: null,
    iconColor: '',
    rtl: false,
    width: 600,
    top: null,
    bottom: null,
    borderBottom: true,
    padding: 15,
    radius: 3,
    zindex: 999,
    overlayColor: 'rgba(0, 0, 0, 0.5)',
  });
  
  $("#modal-country").iziModal({
    title: "Are you a U.S. resident?",
    subtitle: "Your IP shows that you're coming from United States.",
    headerColor: '#b45f5f',
    background: null,
    theme: '',  // light
    icon: null,
    iconText: null,
    iconColor: '',
    rtl: false,
    width: 600,
    top: null,
    bottom: null,
    borderBottom: true,
    padding: 15,
    radius: 3,
    zindex: 999,
    overlayColor: 'rgba(0, 0, 0, 0.5)',
  });
  
  $("#modal-country-cr").iziModal({
    title: "Are you in Costa Rica?",
    subtitle: "Your IP shows that you're coming from Costa Rica.",
    headerColor: '#b45f5f',
    background: null,
    theme: '',  // light
    icon: null,
    iconText: null,
    iconColor: '',
    rtl: false,
    width: 600,
    top: null,
    bottom: null,
    borderBottom: true,
    padding: 15,
    radius: 3,
    zindex: 999,
    overlayColor: 'rgba(0, 0, 0, 0.5)',
  });
  
  $("#modal-custom").iziModal({
      overlayClose: false,
      overlayColor: 'rgba(0, 0, 0, 0.6)',
    headerColor: '#495b70',
    background: null,
    theme: '',  // light
    icon: null,
    iconText: null,
    iconColor: '',
    rtl: false,
    width: 600,
    top: null,
    bottom: null,
    borderBottom: true,
    padding: 15,
    radius: 3,
    zindex: 999,
  });



  $("#modal-custom").on('click', 'header a', function(event) {
      event.preventDefault();
      var index = $(this).index();
      $(this).addClass('active').siblings('a').removeClass('active');
      $(this).parents("div").find("section").eq(index).removeClass('hide').siblings('section').addClass('hide');

      if( $(this).index() === 0 ){
          $("#modal-custom .iziModal-content .icon-close").css('background', '#ddd');
      } else {
          $("#modal-custom .iziModal-content .icon-close").attr('style', '');
      }
  });

  $("#modal-custom").on('click', '.submit', function(event) {
      event.preventDefault();

      var fx = "wobble",  //wobble shake
          $modal = $(this).closest('.iziModal');

      if( !$modal.hasClass(fx) ){
          $modal.addClass(fx);
          setTimeout(function(){
              $modal.removeClass(fx);
          }, 1500);
      }
  }); 
  
  $("#pending_tx").hide();
}

function InitCharts() {
      
		var config = {
			type: 'pie',
			data: {
				datasets: []
			},
			options: {
				responsive: true,
				cutoutPercentage: 60
			}
		};
  
    var data1 = {
					data: [
						90,
						10
					],
					backgroundColor: [
						"#829db9",
						"#576d84",
						"#2a3b4d"
					],
					label: 'Dataset 1'
				};
  
		var config1 = {
			type: 'pie',
			data: {
				datasets: [data1],
				labels: [
					'ETH Refundable',
					'ETH Reserved'
				]
			},
			options: {
				responsive: true,
				cutoutPercentage: 60
			}
		};
		
		
		var data2 = {
					data: [
						90,
						8,
						2
					],
					backgroundColor: [
						"#576d84",
						"#394f66",
						"#2a3b4d"
					],
					label: 'Dataset 1'
				};
		
		var config2 = {
			type: 'pie',
			data: {
				datasets: [data2],
				labels: [
					'Distributed',
					'Foundation reserve',
					'Angel investors',
				]
			},
			options: {
				responsive: true,
				cutoutPercentage: 60
			}
		};
		
		
		var data3 = {
					data: [
						50,
						25,
						25,
					],
					backgroundColor: [
						"#2a3b4d",
						"#394f66",
						"#576d84",
						"#829db9"
					],
					label: 'Dataset 1'
				}
		
		var config3 = {
			type: 'pie',
			data: {
				datasets: [data3],
				labels: [
					'Development',
					'Marketing',
					'Buffer'
				]
			},
			options: {
				responsive: true,
				cutoutPercentage: 60
			}
		};
  
	

    var options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    }
    
    var charts_visibility_toggle = function(entries, observer) {

    	if (window.myPie) window.myPie.destroy();
    	if (window.myPie2) window.myPie2.destroy();
    	if (window.myPie3) window.myPie3.destroy();
    	var ctx = document.getElementById('chart1').getContext('2d');
    	var ctx2 = document.getElementById('chart2').getContext('2d');
    	var ctx3 = document.getElementById('chart3').getContext('2d');
    	window.myPie = new Chart(ctx, config1);
    	window.myPie2 = new Chart(ctx2, config2);
    	window.myPie3 = new Chart(ctx3, config3);
    };
    
    if ('IntersectionObserver' in window) {
      var charts_observer = new IntersectionObserver(charts_visibility_toggle, options);
      
      var charts_target = document.getElementById('charts');
        
      charts_observer.observe(charts_target);
    }
    else {
      charts_visibility_toggle();
    }
}

function EnablePurchaseButton() {
  var buy_button = $("#confirm_buy");
  buy_button.removeAttr("disabled");
}

function DisablePurchaseButton() {
  var buy_button = $("#confirm_buy");
  buy_button.attr("disabled", true);
}

function InitCheckboxes() {
  var checkbox_tos = $("#check_tos");
  var check_us = $("#check_us");
  var check_sec = $("#check_sec");
  
  checkbox_tos.change(function(event) {
      if (event.target.checked) {
          if (check_sec[0].checked && check_us[0].checked) EnablePurchaseButton();
      } else {
          DisablePurchaseButton();
      }
  });
  
  check_us.change(function(event) {
      if (event.target.checked) {
          if (check_sec[0].checked && checkbox_tos[0].checked) EnablePurchaseButton();
      } else {
          DisablePurchaseButton();
      }
  });
  
  check_sec.change(function(event) {
      if (event.target.checked) {
          if (check_us[0].checked && checkbox_tos[0].checked) EnablePurchaseButton();
      } else {
          DisablePurchaseButton();
      }
  });
}

function ShowTerms() {
  $("#modal-tos").iziModal('open');
}

function PlaceBuyOrder() {
  $.getJSON('//freegeoip.net/json/?callback=?', function(data) {
    if (data.country_code != "US") {
      $("#modal-custom").iziModal('open');
    }
    else {
      $("#modal-country").iziModal('open');
    }
    
    if (data.country_code != "CR") {
      $("#modal-custom").iziModal('open');
    }
    else {
      $("#modal-country-cr").iziModal('open');
    }
  });
  //$("#modal-custom").iziModal('open');
}

function ScrollUp() {
  $("#deposit_ether_amount")[0].value = (parseFloat($("#deposit_ether_amount")[0].value) + 0.01).toFixed(2);
}

function ScrollDown() {
  $("#deposit_ether_amount")[0].value = (parseFloat($("#deposit_ether_amount")[0].value) - 0.01).toFixed(2);
}

function ConfirmBuyOrder() {
  //At this point user agreed to ToS, is not a US citizen, not using VPS and does not consider GEN tokens securities.
  var ether_amount = window.Eth.toWei($("#deposit_ether_amount")[0].value, "ether");
  
  var ref = $("#deposit_referral")[0].value;
  
  if (!ref) ref=0;
  

  
  var place_order_abi =   {
    "constant": false,
    "inputs": [
      {
        "name": "_ref",
        "type": "bytes8"
      }
    ],
    "name": "PlaceOrder",
    "outputs": [],
    "payable": true,
    "type": "function"
  };
  var _data = ethAbi.encodeMethod(place_order_abi, [ref]);

  $("#pending_tx").text("Your transaction is pending... tx hash will appear here shortly.");
  $("#pending_tx").show();
  
  var txHash =  web3.eth.sendTransaction({from: web3.eth.defaultAccount, to:master_contract_addr, data: _data, value: ether_amount, gas: 210000}, function(err, transactionHash) {
    if (!err) {
      console.log(transactionHash);
      if(transactionHash == undefined) $("#pending_tx").hide();
      
      //TODO: add link to https://etherscan.io/tx/
      var tx_link = Str2DOM('<<a href=""></a>');
      $("#pending_tx").text("TX: " + transactionHash);
      
      //TODO: notify when done
      waitForTxToBeMined.then(function(result) {
        if (result != undefined) {
          console.info("success");
        }
        else {
          console.info("failed");
        }
      });
    }
    else {
      console.info(err);
      
    }
   });
}

function PlaceOrder(flag) {
  if (header_menu_state == HeaderMenuState.Default || flag) {
    
    InitDistributionManager();
    
    header_menu_state = HeaderMenuState.Order;
    $("#OrderButton").text("Go Back");
    $("#OrderButton").removeClass("green");
    $("#splash-container").css("background-position-x", "0%");
    $("#gallery").css("width", "0%");
    $("#left_panel").addClass("revealed");
    
    $.getJSON('//freegeoip.net/json/?callback=?', function(data) {
      if (data.country_code != "US") {
        
      }
      else {
        $("#modal-country").iziModal('open');
      }
      
      if (data.country_code != "CR") {
        
      }
      else {
        $("#modal-country-cr").iziModal('open');
      }
    });
  
    return;
  }
  if (header_menu_state == HeaderMenuState.Order || !flag) {
    header_menu_state = HeaderMenuState.Default;
    $("#OrderButton").text("Place Order");
    if (distribution_active) $("#OrderButton").addClass("green");
    $("#splash-container").css("background-position-x", "100%");
    $("#gallery").css("width", "100%");
    $("#left_panel").removeClass("revealed");
    return;
  }
  
}

function on_dot_click(event){
      clearTimeout(current_timeout);

      current_image_id = event.data.image_id;
    	current_image_id++;
      current_image_id = current_image_id % images.length;
      
      ChangeImage();
}

function InitImages() {
  var i = 0;
  for(i = 0; i < images.length; i++) {
    var element = $(document.getElementById(images[i]));
    
    element.click({image_id: i}, on_dot_click);
  }
}

function ChangeImage() {
    current_timeout = setTimeout(function () {
    	current_image_id = current_image_id % images.length;
      var element = document.getElementById(images[current_image_id]);
    	simulateClick(element);
      ChangeImage();
    }.bind(), 8000);
}
