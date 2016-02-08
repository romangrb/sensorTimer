  "use strict";
  
  var timerMethods = {
    
    getTime:function () {
      return (!!this._isPaused)? 
        this._remain : new Date() - this._current;
    },
    getFormatedTime:function (ms) {      
      return this._getFormat(this.getTime(ms));
    },
    start:function () {
      
      if (this._isPaused) {
        this._isPaused = false;
        this._current = new Date() - this._remain;
      }else{
        this._current = new Date();
      }
    },
    reset: function () {
      this._current=new Date();
      this._remain = 0;
    },
    pause: function () {
      if (!this._isPaused) {
        this._remain = new Date() - this._current;
        this._current = this._remain;
        this._isPaused = true;
      }
    },
    setInit : function(ss){
      var init = new Date().setTime(ss);
      return this._getFormat(init);
    },
    flush : function () {
      this._init = 0;
    },
    
    isTimeReach: false
    
  };
  
  function FormatTime(time){
    
    var mm, ss, ms, 
      formTimeHash = {
      'mm':'00',
      'ss':'00',
      'ms':'000',
      'percOfUse':'100'
    };
    
    this._getFormat = function (time) {
      if (isNaN(time)) return formTimeHash;
        formTimeHash['mm'] = getMM(time);
        formTimeHash['ss'] = getSS(time);
        formTimeHash['ms'] = getMS(time);
        formTimeHash['percOfUse'] = getTimeUsage(time, this._init);
      return formTimeHash;
    };
    
    var getMM = function (time) {   
       mm = parseInt((time / (1000*60)) % 60);
      return (mm < 10) ? '0' + mm : mm;   
    },
     getSS = function (time) {   
       ss = parseInt((time / 1000)%60);      
      return (ss < 10) ? '0' + ss : ss;    
    },
     getMS = function (time) {
       ms = parseInt(time)%1000;
      return (ms < 10) ? '00' + ms : (ms < 100)?'0'+ms:ms;
    },
     getTimeUsage = function (time ,timeInit){
        if(timeInit) return ~~(time/timeInit*100);
    };
  }
  
  function timerPrivateMethAndProp(){
    this._remain = 0,
    this._isPaused = false,
    this._current = new Date(),
    this._init=0;
  }
  
  function CountDownTimer(){ 
    
    var time = 0;

    this.start = function(ms){
      
      if (this._isPaused) {
        this._isPaused = false;
        this._current = new Date() - this._remain;
      }else{
        this._current = new Date();
        this._init = new Date().setTime(ms);
      }      
    };
    
    this.getTime = function () {
      time = (!!this._isPaused)? 
        this._init - this._remain:
        this._init - (new Date() - this._current);
      return (time>0)? time: (this.isTimeReach = true, (0)); 
    };
  }
  
  function CountUpTimer(){
    
    var time = 0;
    
    this.getTime = function () {
      time = (!!this._isPaused)?
        this._remain: new Date() - this._current;
      return (time<=this._init)? time : (this.isTimeReach = true, (this._init));
    };
  }
  
  timerPrivateMethAndProp.prototype = timerMethods;
  var TimerFormatted = new timerPrivateMethAndProp();
  
  FormatTime.prototype = TimerFormatted;
  var Timer = new FormatTime();
  
  CountDownTimer.prototype = Timer;
  var countDownTimer = new CountDownTimer();
  
  CountUpTimer.prototype = countDownTimer;
  var countUpTimer = new CountUpTimer();
