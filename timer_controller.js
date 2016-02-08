
function timerPrivateMethAndPropUI(){
    
  this._timerData = {
    
    'simple':{
      'defltVal':{
        start:'0',
        end:'2'
      },
      'val':{
        start:'+=1',
        end:'+=1'
      },
      'prop':{
        'center':{
          strokeStyle:'white'
          },
        'centerStyle':{
          fillStyle:'#46C9D2',
        },
        'timeMngButton':{
          strokeStyle:'white',
        },
      },
    },
    'countDownTimer':{
      'defltVal':{
          start:'0', 
          end:'360'
        },
        'val':{
          start:'0', 
          end:'360'
        },
        'prop':{
          'center':{
            strokeStyle: 'white'
          },
          'centerStyle':{
            fillStyle: '#46D288',
          },
          'timeMngButton':{
            strokeStyle:'#D0E5FD',
          },
        },
    },
    'countUpTimer':{
      'defltVal':{
          start:'0',
          end:'0'
        },
        'val':{
          start:'0', 
          end:'0'
        },
        'prop':{
          'center':{
            strokeStyle: 'white'
          },
          'centerStyle':{
            fillStyle: '#F9487D',
          },
          'timeMngButton':{
            strokeStyle:'#D0E5FD',
          },
        },
    },
  };
  
  this._timerType = Timer,
  this._timerTypeName = 'simple',
  this._initTime = 0,
  this._MIN_TIME_INIT = 0,
  this._tdDflt = this._timerData['simple']['defltVal'],
  this._td = this._timerData['simple']['val'],
  this._IN_DEGREE = Math.PI / 180,
  this._distanceTime = 0,
  this._distance = 0,
  this._prev_dst = 0,
  this._next_dst = 0,
  
  isStarted = false,
  isPaused = true,
  
  this._mainLayer = $('#secMeasure'),
  this._timeMngButtonLayer = 'timeMngButton';
  
  SENSTV_ROT_ANG = 200,
  MIN_DEGREE = 0,
  MAX_DEGREE = 450,
  RIGHT_ANG = 90,
  DFLT_TIMER_MNG_VAL = 0,
  MAX_TIME_IN_MS = 3599999,
  TIMER_SENSOR_VIEW = 10,
  TIMER_ROTATE_STEP = 10,
  TIMER_ROTETE_FIN_DEGREE = 80,
  MS_IN_SEC = 1000,
  
  cycleIndex = null,
  cycleIndexRotate = null;
  
  var timer = null;
  
  
  this._fnTimeRel = function(time){
    return ~~time*360/100;
  };
  
  this._revertTimer = function(el, refIsTimeReach){
    
    if (refIsTimeReach) refIsTimeReach.isTimeReach = false;
    isStarted = false;
    
    $(el)
      .removeLayer('pause_twin_one')
      .removeLayer('pause_twin_sec')
      .removeLayer('pauseRefuseButton')
      .animateLayer('start', {
        opacity:1,
      }, 0);
    };
    
  this._flushHash = [],
    
  this._getFlush = function (trig){
    
  var isTrue = false;
    
  this._flushHash.push(trig); 
    
    function isPositive(bool) {
      return bool === true;
    }

    if (this._flushHash.length === 2){
      isTrue = (this._flushHash.every(isPositive))?true:false;
      this._flushHash = [];
    }
    
   return isTrue;
    
  };
    
  this._getTimerInit = function (el){
    
   this.getReset(el);
   this._revertTimer(el);
   if (cycleIndex) clearTimeout(cycleIndex); 
  };
    
  this._timeTrigger = function(el, data){
    
    var timerType =  (!data.data.type)?'simple':data.data.type,
     timerProp = this._timerData[timerType].prop,
     elData = data;
      
     this._timerTypeName = timerType;  
     this._tdDflt = this._timerData[timerType].defltVal;
     this._td = this._timerData[timerType].val;
     this._timerType = this._timerData[timerType];
     this._timeMoveFreeze(el, false);
     
      switch (timerType){
        case 'countDownTimer':
          elData.data.type = 'simple';
          this._timerType = countDownTimer;
        break;
        case 'countUpTimer':
          elData.data.type = 'countDownTimer';
          this._timerType = countUpTimer;
        break;
        default:
          elData.data.type = 'countUpTimer';
          this._timerType = Timer;
     }
     
     this._getTimerInit(el);
     this._changeView(el, timerProp, elData);
     this._flushHash = [];
  };

  this._timeMoveFreeze = function(el, trig){
    
    $(el).setLayers({
      draggable:trig
    }, function(layer) {
      return (layer.draggable !== trig&& layer.name != 'timeMng' );
    });
  };
  
  this._changeView = function(el, timerProp, elData){
    
    $(el).removeLayer(elData.name).drawArc(elData);
        
    var val = 0,
      elPos = $(el).getLayer('center'),
      timeMoveFreeze = this._timeMoveFreeze,
      timerName = this._timerTypeName;

    $.when().done(function() {

    var cicleRotate = arguments.callee;
      cycleIndexRotate = setTimeout(function () {
        
        $(el).rotateCanvas({
          rotate: val+=TIMER_ROTATE_STEP,
          x:elPos.x,
          y:elPos.y
        }).drawLayers();
   
        if (val===TIMER_ROTETE_FIN_DEGREE) {
          $.when(timeMoveFreeze(el, true)).done(function(){
            for (var name in timerProp){
              $(el).animateLayer(name, timerProp[name]);
            }
              $(el).setLayer(elData.data.nameText, {text: timerName }); 
          });
          return;
        }
        cicleRotate();
        
      }, 20);
     
    });
  };

}

var timeMethodsUI = {
  
  changeType: function(el, data){
    this._timeTrigger(el, data);
  },
  
  setTimer: function(layer){
    
    if (!!isStarted|| this._timerTypeName==='simple') return;
     
    var x = layer.x,
     y = layer.y,
     mX = layer.eventX,
     mY = layer.eventY,
     posX = mX-x,
     posY = -(mY-y),
    
     prevDistance = this._distanceTime,
     posRound = DFLT_TIMER_MNG_VAL,
     
     time = this._timerType,
     
     ang = Math.atan2(posY, posX)/this._IN_DEGREE;
     ang = ~~((posX>=MIN_DEGREE)?Math.abs(ang-RIGHT_ANG):(posX<MIN_DEGREE&&posY>=MIN_DEGREE)?MAX_DEGREE-Math.abs(ang):Math.abs(ang)+RIGHT_ANG);
    
    $(this._mainLayer).setLayer(this._timeMngButtonLayer, {start: ang+TIMER_SENSOR_VIEW, end: ang});
 
    this._distanceTime = ang;
    
    posRound = this._distanceTime - prevDistance;
    
    if (posRound>MIN_DEGREE){
      
      this._distance +=  posRound;
      
      if (posRound>SENSTV_ROT_ANG) {
        this._prev_dst = posRound;
        this._distance = this._distance+this._next_dst;
      }
      
    }else if(posRound<MIN_DEGREE){
        
      if (posRound<-SENSTV_ROT_ANG) posRound = DFLT_TIMER_MNG_VAL;

        this._next_dst = this._prev_dst;
        this._prev_dst = posRound;
       
        posRound = Math.abs((Math.abs(this._next_dst) - Math.abs(this._prev_dst)));
       
        this._distance = this._distance-posRound;
        this._distance = (this._distance<=DFLT_TIMER_MNG_VAL)?DFLT_TIMER_MNG_VAL:this._distance;
    }
    this._initTime = this._distance*MS_IN_SEC;
    this._initTime = (MAX_TIME_IN_MS<this._initTime)?MAX_TIME_IN_MS:this._initTime;
    
    $(this._mainLayer)
      .setLayer('showMM',{ text: time.setInit(this._initTime).mm})
      .setLayer('showSS',{ text: time.setInit(this._initTime).ss})
      .setLayer('showMS',{ text: time.setInit(this._initTime).ms})
      .drawLayers();
  },
  
  getStart: function(el){
    
  var thatTimerType = this._timerType,
    timerTypeName = this._timerTypeName,
    val= this._initTime,
    td = this._td,
    fn = this._fnTimeRel,
    revertTimer = this._revertTimer;
    isStarted = true;
    isPaused = false;
    
   $.when(thatTimerType.start(val)).done(function() {
   
     var cicle = arguments.callee,
      time = thatTimerType.getFormatedTime();

      cycleIndex = setTimeout(function () {

       (timerTypeName!='simple')? 
        td['end'] = fn(time['percOfUse']): td = td;

        $(el)
          .setLayer('showMM', { text: time.mm})
          .setLayer('showSS', { text: time.ss})
          .setLayer('showMS', { text: time.ms})
          .setLayer('center', td)
          .drawLayers();

        if (!!thatTimerType.isTimeReach) {
          revertTimer(el, thatTimerType);
          return;
        }
        cicle();
      }, 50);
    });
  },
  
  getPause: function(){
    this._isPaused = true;
    this._getFlush(false);
    this._timerType.pause();
    clearTimeout(cycleIndex);
  },
  
  getReset: function(el){
    
    var time = this._timerType.setInit(this._initTime);
    
    this._timerType.reset();
    this._distance = DFLT_TIMER_MNG_VAL;
    this._timerType.isTimeReach = false;
    
    if(isPaused&&isStarted) isStarted = false;
    
    if (this._getFlush(true)) {
      this._timerType.flush();
      isStarted = false;
    }
    
    if (!isStarted){

    $(el)
      .setLayer('showMM', { text: '00'})
      .setLayer('showSS', { text: '00'})
      .setLayer('showMS', { text: '000'})
      .setLayer('center', this._tdDflt)
      .drawLayers(); 
      
    }else{ 

    $(el)
      .setLayer('showMM', { text: time.mm})
      .setLayer('showSS', { text: time.ss})
      .setLayer('showMS', { text: time.ms})
      .setLayer('center', this._tdDflt)
      .drawLayers();
    }
  } 
};

timerPrivateMethAndPropUI.prototype = timeMethodsUI;
var TimerUI = new timerPrivateMethAndPropUI();
