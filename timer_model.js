
$('#secMeasure')
  .drawArc({
    groups: ['timer', 'timerPos'],
    layer:true,
    name: 'timeMngButton',
    start:5,
    end:357,
    radius:105,
    strokeWidth:50,
    strokeStyle:'white',
    })
  .drawArc({
    groups: ['timer', 'timerPos'],
    layer:true,
    draggable:false,
    name: 'timeMng',
    radius:260,
    data:{'click':false},
    mousemove:function(layer) {
      if(layer.data.click) TimerUI.setTimer(layer);
    },
    mousedown:function(layer) {
      layer.data.click = true;
    },
    mouseup:function(layer) {
      layer.data.click = false;
    },
    strokeStyle:'#D0E5FD',
  })
  .drawArc({
    groups: ['timer', 'timerPos'],
    dragGroups: ['timer'],
    name: 'centerStyle',
    radius:95,
    fillStyle: '#46C9D2',
  })
  .drawArc({
    groups: ['timer', 'timerCircleBorder'],
    name: 'border',
    dragGroups: ['timer'],
    radius: 90,
    strokeDash: [2, 2],
    opacity:0.6,
    strokeStyle:'white',
  })
  .drawArc({
    name: 'center',
    groups: ['timer', 'timerCircleBorder'],
    dragGroups: ['timer'],
    radius:90,
    start:0,
    end:2,
    strokeDash: [2, 2],
    strokeStyle:'white'
  })
  .drawText({
    groups: ['timer', 'timerMode'],
    dragGroups: ['timer'],
    name:'typeName',
    text:'simple',
    radius:130,
    fillStyle: 'black',
  })
  .drawText({
    groups: ['timer', 'timerMode'],
    dragGroups: ['timer'],
    name:'nextType',
    text:'type',
    fillStyle: 'white',
  })
  .drawArc({
    groups: ['timer', 'timerCtrl', 'timerMode'],
    dragGroups: ['timer'],
    name: 'timerType',
    data: {type:'countUpTimer',
           nameText:'typeName'
    },
    
    mousedown:function(el) {
      
      TimerUI.changeType(this, el);
    }
  })
  .drawPolygon({
    groups: ['timer', 'timerCtrl'],
    dragGroups: ['timer'],
    name:'start',
    opacity: 1,
    rotate: 90,
    x:170,
    y:200,
    sides: 3,
  })
  .drawArc({
    groups: ['timer'],
    name:'startRefuseButton',
    dragGroups: ['timer'],
    radius: 25,
    x: 170,
    y: 200,
    mousedown: function() {
      
      TimerUI.getStart(this);
      
      $(this).drawRect({
        groups: ['timer', 'pause'],
        dragGroups: ['timer'],
        name:'pause_twin_one',
        x: $(this).getLayer('start').x-7,
      })
      .drawRect({
        groups: ['timer', 'pause'],
        dragGroups: ['timer'],
        name:'pause_twin_sec',
        x: $(this).getLayer('start').x+7,
      })
      .setLayerGroup('pause', {
        y: $(this).getLayer('start').y,
        strokeStyle:'#FCF5F5',
        strokeWidth: 2,
        shadowColor: '#000',
        shadowBlur: 2,
        width: 7,
        height: 28,
      })
      .drawArc({
        groups: ['timer'],
        name:'pauseRefuseButton',
        dragGroups: ['timer'],
        radius: 25,
        x: $(this).getLayer('start').x,
        y: $(this).getLayer('start').y,
        mousedown: function() {
          
          TimerUI.getPause(this);
          
          $(this)
            .animateLayer('start', {
              opacity:1,
            }, 0)
            .removeLayer('pause_twin_one')
            .removeLayer('pause_twin_sec')
            .removeLayer('pauseRefuseButton');
        },
        })
        .animateLayer('start', {
          opacity:0,
      }, 150);
    },
  })
  .drawPolygon({
    groups: ['timer', 'timerCtrl'],
    dragGroups: ['timer'],
    name:'stop',
    x:230,
    y:200,
    sides: 4,
    mousedown: function() {

      TimerUI.getReset(this);
      
      $(this).animateLayer('stop', {
        scale:0.9
      }, 0)
      .animateLayer('stop', {
        scale:1
      }, 50);
   },
  })
  .drawText({
    name:'showMM',
    groups: ['timer', 'showTime'],
    dragGroups: ['timer'],
    text: '00',
    x: 140, y: 150
  })
  .drawText({
    name:'showSS',
    groups: ['timer', 'showTime'],
    dragGroups: ['timer'],
    text: '00',
    x: 190, y: 150
  })
  .drawText({
    name:'showMS',
    groups: ['timer', 'showTime'],
    dragGroups: ['timer'],
    text: '000',
    x: 250, y: 150
  })
  .drawText({
    groups: ['timer', 'showTime', 'textDev'],
    dragGroups: ['timer'],
    x: 165
  })
  .drawText({
    groups: ['timer', 'showTime', 'textDev'],
    dragGroups: ['timer'],
    x: 215
  })
  .setLayerGroup('timer', {
    layer:true,
  })
  .setLayerGroup('timerMode', {
    x:200,
    y:100,
    fontSize: '12pt',
    fontFamily: 'Ubuntu Condensed',
  })
  .setLayerGroup('timerPos', {
    x:200,
    y:150
  })
  .setLayerGroup('timerCtrl', {
    strokeStyle: '#FCF5F5',
    strokeWidth: 1,
    radius: 20,
  })
  .setLayerGroup('textDev', {
    text:':',
    y:148
  })
  .setLayerGroup('showTime', {
    fontSize: '32pt',
    fillStyle: 'white',
    fontFamily: 'Ubuntu Condensed',
  })
  .setLayerGroup('timerCircleBorder', {
    strokeWidth:10,
    x: 200,
    y: 150,
  });
