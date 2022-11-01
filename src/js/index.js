'use strict';

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

import {calchight, setCookie, getCookie, eraseCookie} from './functions.js';

class Socket{
	constructor(addr){
		this.botaddr = addr;
	}

	updatecryptokeys(cid, ck){
		this.cryptoid = cid;
		this.cryptokey = ck;
	}

	send(req, callback){
		
        if(true){
            bot.busy = true;

            req.c = bot.c;

            var url = "http://" + this.botaddr + "/botapi/?oko=" + JSON.stringify(req);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {

                if (this.readyState == 4 && this.status == 200) {
                    var ret = JSON.parse('{"message":"server error","requeststatus":"error"}');
                    try {
                        var ret = JSON.parse(this.responseText);
                    }
                    catch(e){
                        //todo
                        console.log("json parse exception");
                    }

                    callback(ret, req.act);
                    bot.c++;
                }
                else if(this.status > 300){
                    var ret = JSON.parse('{"message":"server error status'+ this.status +'","requeststatus":"error"}');
                    callback(ret, req.act);
                    bot.c++;
                }
                
            };

            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
        else{
            console.log("error busy");
        }
	}
}






class Bot {

    constructor(){

        this.logs = "";
		this.lastconsole = "";

		this.busy = false;

		this.cryptoid = "0-00000000000000";
        this.cryptokey = "";
		
		this.running = false;
		this.loged = false;
		this.timestamp = 0;
		this.c = 0;
		
		this.login = "null";
		this.server = "null";
		this.ssid = "null";
		
		this.status = 0;
		this.statusextra = 0;
		this.statustime = 0;

		this.quests = JSON.parse('[{"time":0,"exp":0,"silver":0},{"time":0,"exp":0,"silver":0},{"time":0,"exp":0,"silver":0}]');

		this.mount = 0;

		this.thirst = 0;
		this.beers = 0;
		this.timeglass = 0;

		this.lvl = 0;
		this.silver = 0;
		this.mush = 0;
		
		this.skiptype = 0;
		
		this.questprefer = "exp";

		this.f_console("Bot loaded.", "success");

        this.p = new Array(100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1);

    }

    f_Poll(){

		if(this.loged && this.runnig){
			var asdf = new Object;
			asdf.act = "Poll";
			asdf.server = this.server;
			asdf.login = this.login;
			asdf.ssid = this.ssid;
			asdf.cryptoid = this.cryptoid;
			asdf.cryptokey = this.cryptokey;
			
			var ret = socket.send(asdf, this.f_update);
		}
	}

    f_loop(){
		if(this.loged){


			if(this.running){

                $("#__button_start").addClass("disabled");
                $("#__button_stop").removeClass("disabled");

				if(this.status == 2 || this.status == 1){
                    $("#__button_abort").removeClass("disabled");
					if(this.statustime < this.timestamp){
						if(this.status == 2){
							this.f_PlayerAdventureFinished();
						}
						else if(this.status  == 1) {
							this.f_PlayerWorkFinished();
						}
					}
				}
				else if(this.status == 0){

                    $("#__button_abort").addClass("disabled");

					if(this.thirst > 0){
						this.f_PlayerAdventureStart();
					}
					else {
						this.running = false;
                        document.title = "Error: Not enough energy !";
						this.f_console("Error: Not enough energy !", "warning");
						this.f_alert("Error: Not enough energy !", "warning");
					}
				}

                
			}
            else{
                $("#__button_stop").addClass("disabled");
                $("#__button_start").removeClass("disabled");
            }

            this.f_updategui();

			this.timestamp ++;
            
		}
		else{

            if(getCookie("login") != null && getCookie("login") != ""){
                this.f_restore_session();
            }
            else{
                $("#__page_login").show();
                $("#__page_loading").hide();
            }

			this.running = false;
		}
	}

    f_update(ret, act){
        if(ret.requeststatus == "success"){
            switch(act){
                case "AccountLogin":

                    bot.login = ret.login;
                    bot.server = ret.server;
                    bot.loged = true;
                    bot.status = ret.status;
                    bot.statusextra = ret.statusextra;
                    bot.statustime = ret.statustime;

                    bot.thirst = ret.thirst;
                    bot.quests = ret.quests;
                    bot.mount = ret.mount;
                    bot.ssid = ret.ssid;
                    bot.timestamp = ret.timestamp;
                    bot.timeglass = ret.timeglass;
                    bot.lvl = ret.lvl;
                    bot.mush = ret.mush;
                    bot.silver = ret.silver;

                    bot.cryptoid = ret.cryptoid;
                    bot.cryptokey = ret.cryptokey;

                    $("#__page_login").hide();
                    $("#__page_user").show();
                    bot.f_console("Success login.", "success");

                    setCookie("server", ret.server, 1);
                    setCookie("login", ret.login, 1);
                    setCookie("pass", ret.password, 1);

                    $("#__page_loading").hide();
                    
                    bot.running = true;

                    bot.f_updategui();

                break;
                case "PlayerAdventureStart":

                    bot.status = 2;
                    bot.statusextra = ret.statusextra;
                    bot.statustime = ret.statustime;

                    bot.f_console("Success start quest", "success");

                break;
                case "PlayerAdventureFinished":

                    bot.status = 0;
                    bot.statusextra = 0;
                    bot.statustime = 0;

                    bot.thirst = ret.thirst;
                    bot.quests = ret.quests;
    
                    bot.lvl = ret.lvl;
                    bot.mush = ret.mush;
                    bot.silver = ret.silver;
                    bot.timeglass = ret.timeglass;
                    
                    var text = "Quest finished, rewards: " + ret.goldreward + ' GOLD | ' + ret.expreward + " EXP ";
                    
                    if(ret.mushreward > 0){
                        text = text + " | " + ret.mushreward + '<img src="images/icon_mush.png"/>';
                    }
    
                    bot.f_console(text, "secondary");

                break;

                case "PlayerBeerBuy":
                    bot.f_console("Success buy beer", "success");
                    bot.mush--;
                    bot.thirst+=1200;
                    bot.f_updategui();
                break;

                case "PlayerAdventureStop":
                case "PlayerWorkStop":
                    
                    bot.status=0;
                    bot.statusextra = 0;
                    bot.statustime = 0;
                    bot.runnig = false;

                    bot.f_console("Aborted...", "warning");
                break;

                case "PlayerWorkStart":

                    bot.status = ret.status;
                    bot.statustime = ret.statustime;
                    bot.statusextra = ret.statusextra;
                    var text = "Work Started: 10 hours";
                    bot.f_console(text, "secondary");

                break;
                case "PlayerWorkFinished":

                    bot.status = 0;
                    bot.statusextra = 0;
                    bot.statustime = 0;
                    bot.thirst = ret.thirst;
                    bot.quests = ret.quests;

                    bot.lvl = ret.lvl;
                    bot.mush = ret.mush;
                    bot.silver = ret.silver;
                    
                    var text = "Work finished: " + ret.workreward + '<img src="images/icon_gold.png"/>';
                    bot.f_console(text, "secondary");
                    
                break;

                case "Poll":
                    bot.timestamp = ret.timestamp;
                break;

            }
        }
        else if(ret.requeststatus == "error"){

			if(ret.message == "sessionid invalid"){
				bot.f_logout();
				bot.f_stop();
			}
			else{
				bot.f_alert(ret.message, "warning");
				bot.running = false;
			}
		}
		else{
			bot.f_alert("Server error", "error");
			bot.c = 0;
		}
    }

    f_restore_session(){

		this.f_console("Try restore session...", "info");

        let server = getCookie("server");
        let login = getCookie("login");
        let pass = getCookie("pass");

		if(server != null && login != null && pass != null){
			
			var asdf = new Object;
			asdf.act = "AccountLogin";
			asdf.server = server;
			asdf.login = login;
			asdf.pass = pass;
			
			var ret = socket.send(asdf, this.f_update);

		}
		else {

            //$("#__input_login").val(getCookie("login"));
            //$("#__input_pass").val(getCookie("pass"));
		    //$("#__input_server").val(getCookie("server"));

			this.f_alert("Session broken...", "warning");
            this.f_logout();
		}
	}

    f_AccountLogin(){

		var login = $("#__input_login").val();
		var pass = $("#__input_pass").val();
		var server = $("#__input_server").val();
		this.f_console("Try login...", "info");

		if(login !="" && pass !="" && server !=""){
			
			var asdf = new Object;
			asdf.act = "AccountLogin";
			asdf.server = server;
			asdf.login = login;
			asdf.pass = pass;
			
			var ret = socket.send(asdf, this.f_update);

		}
		else {
			this.f_alert("Login, Server, Pass required!", "warning");
		}
	}

    f_PlayerAdventureStart(){
		
		// random quest TODO ---------------------
		var questid = 1;
		
		if(this.questprefer == "gold"){
			questid = calchight(this.quests[0]['silver'], this.quests[1]['silver'], this.quests[2]['silver']);
		}
		else if(this.questprefer == "exp")
		{
			questid = calchight(this.quests[0]['exp'], this.quests[1]['exp'], this.quests[2]['exp']);
		}
		else if(this.questprefer == "time"){
			questid = calchight((this.quests[0]['time'] * -1), (this.quests[1]['time'] * -1), (this.quests[2]['time'] * -1));
		}
		
		if(this.thirst < this.quests[questid -1]['time']){

            questid = calchight((this.quests[0]['time'] * -1), (this.quests[1]['time'] * -1), (this.quests[2]['time'] * -1));
            
            if(this.thirst < this.quests[questid -1]['time']){
                this.running = false;
			    this.f_alert("Not enough energy", "warning"); 
			    document.title = "Error: Not enough energy !";
            }
			else{
                var asdf = new Object;
                asdf.act = "PlayerAdventureStart";
                asdf.server = this.server;
                asdf.questid = questid;
                asdf.cryptoid = this.cryptoid;
                asdf.cryptokey = this.cryptokey;
                asdf.ssid = this.ssid;
			
			    var ret = socket.send(asdf, this.f_update);
            }
		}
		else{
			var asdf = new Object;
			asdf.act = "PlayerAdventureStart";
			asdf.server = this.server;
			asdf.questid = questid;
			asdf.cryptoid = this.cryptoid;
			asdf.cryptokey = this.cryptokey;
			asdf.ssid = this.ssid;
			
			var ret = socket.send(asdf, this.f_update);
		}
	}
	
	f_PlayerAdventureFinished(skiptype = 0){

		if(this.status == 0 || this.status == 1){
			this.f_alert("You are not in quest.", "warning"); 
			return 0;
		}

		if(skiptype == 2){
			if(this.timeglass <= 0){
				this.f_alert("Not enough timeglass.", "warning"); 
				return 0;
			}
			this.timeglass--;
		}
		
		
		var asdf = new Object;
		asdf.act = "PlayerAdventureFinished";
		asdf.server = this.server;
		asdf.ssid = this.ssid;
		asdf.cryptoid = this.cryptoid;
		asdf.cryptokey = this.cryptokey;
		asdf.skiptype = skiptype;
		
		var ret = socket.send(asdf, this.f_update);
	}

    f_PlayerAdventureStop(){
		var asdf = new Object;
		asdf.act = "PlayerAdventureStop";
		asdf.server = this.server;
		asdf.login = this.login;
		asdf.ssid = this.ssid;
		asdf.cryptoid = this.cryptoid;
		asdf.cryptokey = this.cryptokey;
		
		var ret = socket.send(asdf, this.f_update);
	}

    f_PlayerBeerBuy(){

		if(this.mush <= 0){
			this.f_alert("Not enough mushrooms.", "warning"); 
			return 0;
		}

		var asdf = new Object;
		asdf.act = "PlayerBeerBuy";
		asdf.server = this.server;
		asdf.ssid = this.ssid;
		asdf.cryptoid = this.cryptoid;
		asdf.cryptokey = this.cryptokey;
		
		var ret = socket.send(asdf, this.f_update);
	}

    f_PlayerWorkStart(){
		var asdf = new Object;
		asdf.act = "PlayerWorkStart";
		asdf.server = this.server;
		asdf.login = this.login;
		asdf.ssid = this.ssid;
		asdf.hours = 10;
		asdf.cryptoid = this.cryptoid;
		asdf.cryptokey = this.cryptokey;
		
		var ret = socket.send(asdf, this.f_update);
	}

	f_PlayerWorkFinished(){
		var asdf = new Object;
		asdf.act = "PlayerWorkFinished";
		asdf.server = this.server;
		asdf.login = this.login;
		asdf.ssid = this.ssid;
		asdf.cryptoid = this.cryptoid;
		asdf.cryptokey = this.cryptokey;
		
		var ret = socket.send(asdf, this.f_update);
	}

    f_PlayerWorkStop(){
		var asdf = new Object;
		asdf.act = "PlayerWorkStop";
		asdf.server = this.server;
		asdf.login = this.login;
		asdf.ssid = this.ssid;
		asdf.cryptoid = this.cryptoid;
		asdf.cryptokey = this.cryptokey;
		
		var ret = socket.send(asdf, this.f_update);
	}

    f_start(){
		this.running = true;
		this.f_console("Starting...", "secondary");
	}

	f_stop(){
		this.running = false;
		this.f_console("Stoping...", "warning");
	}

	f_abort(){
		if(this.status == 2){
			this.f_PlayerAdventureStop();
		}
		else if(this.status == 1){
			this.f_PlayerWorkStop();
		}
		this.running = false;
        $("#__button_abort").addClass("disabled");
	}

	f_logout(){
		$("#__page_login").show();
		$("#__page_user").hide();
		this.f_clear();
        this.loged = false;
	}

    f_updategui(){
		$("#__text_mush").html(this.mush);
		$("#__text_gold").html(Math.round(this.silver));
		$("#__text_lvl").html(this.lvl);
		$("#__text_pet").html("-" + this.mount + "%");
		$("#__text_nick").html(this.login);
		$("#__text_timeglass").html(this.timeglass);

		if(this.status > 0){
			$("#__button_abort").removeClass("disabled");
		}

        var proc_thirst = Math.floor((this.thirst / 6000) * 100);
        $("#__progress_thirst").css("width", proc_thirst + "%");

        if(proc_thirst > 50){
            $("#__progress_thirst").removeClass("bg-warning");
            $("#__progress_thirst").removeClass("bg-danger");

            $("#__progress_thirst").addClass("bg-success");
        }
        else if(proc_thirst > 20){
            $("#__progress_thirst").removeClass("bg-success");
            $("#__progress_thirst").removeClass("bg-danger");

            $("#__progress_thirst").addClass("bg-warning");
        }
        else if(proc_thirst < 20){
            $("#__progress_thirst").removeClass("bg-success");
            $("#__progress_thirst").removeClass("bg-warning");

            $("#__progress_thirst").addClass("bg-danger");
        }

		if(this.status == 2){
			if(this.statustime >= this.timestamp){
				var proc = Math.floor(((this.statustime - this.timestamp) / this.quests[this.statusextra - 1].time) * 100);
				
				var min = Math.floor( (this.statustime - this.timestamp) / 60);
				var sec = (this.statustime - this.timestamp) - (min * 60);
				var mintext = "";
				if(min > 0){
					mintext = min + " min";
				}

				if(sec < 0){
					sec == 0;
				}
				var sectext = sec + " sec";

				$("#__progress_status").css("width", this.p[proc] + "%");

				document.title = this.login + " | " + mintext + " " + sectext;
				$("#__text_status_time").html(mintext + " " + sectext);

                $("#__text_status").html("Quest");
                $("#__text_status").addClass("quest");
                $("#__text_status").removeClass("work");
			}
			else{
				$("#__text_status_time").html("Done");
			}
		}
		else if(this.status == 1){
			if((this.statustime) >= this.timestamp){
				var proc = Math.floor(((this.statustime - this.timestamp) / (this.statusextra * 3600)) * 100);
				
				var godz = Math.floor((this.statustime - this.timestamp) / 3600);
				var min = Math.floor( ((this.statustime - this.timestamp) - (godz * 3600)) / 60);
				var sec = Math.floor((this.statustime - this.timestamp) - ((godz * 3600) + (min * 60)));
				var mintext = "";
				var godztext = "";

				if(godz > 0){
					godztext = godz + " godz";
				}
				if(min > 0){
					mintext = min + " min";
				}

				if(sec < 0){
					sec == 0;
				}
				var sectext = sec + " sec";

				$("#__progress_status").css("width", this.p[proc] + "%");
				document.title = this.login + " | " + godztext + " " + mintext + " " + sectext;
				$("#__text_status_time").html(godztext + " " + mintext + " " + sectext);

                $("#__text_status").html("Work");

				$("#__text_status").addClass("work");
				$("#__text_status").removeClass("quest");
			}
			else{
				$("#__text_status_time").html("Done");
			}
		}
		else if(this.status == 0){
			$("#__text_status").html("None");
			$("#__button_abort").addClass("disabled");
			$("#__text_status").removeClass("quest");
			$("#__text_status").removeClass("work");
			$("#__progress_status").css("width", "0%");
			$("#__text_status_time").html("");
		}


		if(this.status > 3){
			this.f_logout();
			this.f_alert("Fatal Error: Status too big. Please contact to administrator.", "error");
            $("#__black").hide();
		}
	}

    f_clear(){

        setCookie("server", "", 0);
        setCookie("login", "", 0);
        setCookie("pass", "", 0);

        eraseCookie("server");
        eraseCookie("login");
        eraseCookie("pass");

		$("#__box_alerts").html("");
		$("#__box_console").html("");

		$("#__text_mush").html("0");
		$("#__text_gold").html("0");
		$("#__text_lvl").html("0");
		$("#__text_thirst").html("0%");
		$("#__text_nick").html("null");
		$("#__text_timeglass").html("0");

		$("#__text_status").html("None");
		$("#__button_abort").addClass("disabled");
		$("#__text_status").removeClass("quest");
		$("#__text_status").removeClass("work");
		$("#__progress_status").css("width", "0%");
		$("#__text_status_time").html("00:00");

		this.c = 0;
		this.login = "null";
		this.server = "";
		this.status = 0;
		this.statusextra = 0;
		this.statustime = 0;

		this.thirst = 0;
		this.quests = JSON.parse('[{"time":0,"exp":0,"silver":0},{"time":0,"exp":0,"silver":0},{"time":0,"exp":0,"silver":0}]');
		this.ssid = "";
		this.timestamp = 0;
		this.lvl = 0;
		this.mush = 0;
		this.silver = 0;
		this.loged = false;
	}

	f_clearalerts(){
        $("#__box_alerts").html("");
    }

    f_alert(text, type){
        let data = '<div class="__box_alert '+ type +'">' + text + '</div>';
        $("#__box_alerts").html(data);

		setTimeout(function(){
			$("#__box_alerts").html("");
		}, 3000);

    }
	
	f_console(text, type){
		if(text != this.lastconsole && text != null){
			var time = (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds();
			let data = $("#__box_console").html();
			$("#__box_console").html('<div class="__console_item">['+ time + '] <label class="'+ type +'">' + text +'</label></div>' + data);
			this.lastconsole = text;

            var color = "silver";
            if(type == "success"){
                color = "limegreen";
            }
            else if(type == "warning"){
                color = "yellow";
            }
            else if(type == "error"){
                color = "red";
            }
            else if(type == "info"){
                color = "gray";
            }
            
            console.log('%c' + text, 'color: ' + color);
		}
	}
}


const socket = new Socket("192.168.8.2");
const bot = new Bot();


setInterval(function(){
    bot.f_loop();
}, 1000);

setInterval(function(){
    bot.f_Poll();
}, 5000);



$("#__button_login").on('click', function(){
    bot.f_AccountLogin();
});
$("#__button_logout").on('click', function(){
    bot.f_logout();
});
$("#__button_start").on('click', function(){
    bot.f_start();
    $("#__black").hide();
});
$("#__button_stop").on('click', function(){
    bot.f_stop();
});
$("#__button_skip_mush").on('click', function(){
    bot.f_PlayerAdventureFinished(1);
});
$("#__button_skip_timeglass").on('click', function(){
    bot.f_PlayerAdventureFinished(2);
});
$("#__button_buy_beer").on('click', function(){
    bot.f_PlayerBeerBuy();
});
$("#__button_abort").on('click', function(){
    bot.f_abort();
});
$(".__option_quest_prefer").on('click', function(){
    bot.questprefer = $(this).attr("value");
});
$("#__button_work_start").on('click', function(){
    bot.f_PlayerWorkStart();
});
$("#__button_theme").on('click', function(){

    var body = document.getElementsByTagName('body')[0];

    if($("#index").attr("bgid") == "dark"){
        body.style.backgroundImage = 'url("images/bg_light.jpg")';
        $("#index").attr("bgid", "light");
    }
    else if($("#index").attr("bgid") == "light"){
        body.style.backgroundImage = 'url("images/bg_dark.jpg")';
        $("#index").attr("bgid", "dark");
    }
});