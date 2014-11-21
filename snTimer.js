var haveEvents='GamepadEvent' in window;
var controllers={};
var controller={axes:[0,0,0,0,0,0],buttons:[0,0]};
var rAF=window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.requestAnimationFrame;

function connecthandler(e)
{
	addgamepad(e.gamepad);
}

function addgamepad(gamepad)
{
	controllers[gamepad.index]=gamepad;
	console.log(gamepad.buttons.length);
	console.log(gamepad.axes.length);
	rAF(updateStatus);
}

function disconnecthandler(e)
{
	removegamepad(e.gamepad);
}

function removegamepad(gamepad)
{
	delete controllers[gamepad.index];
}

function updateStatus()
{
	scangamepads();
	for (j in controllers)
	{
		controller=controllers[j];
	}
	rAF(updateStatus);
}

function scangamepads()
{
	var gamepads=navigator.getGamepads?navigator.getGamepads():(navigator.webkitGetGamepads?navigator.webkitGetGamepads():[]);
	for(var i=0;i<gamepads.length;i++)
	{
		if(gamepads[i])
		{
			if(!(gamepads[i].index in controllers))
			{
				addgamepad(gamepads[i]);
			}
			else
			{
				controllers[gamepads[i].index]=gamepads[i];
			}
		}
	}
}

if(haveEvents)
{
	window.addEventListener("gamepadconnected",connecthandler);
	window.addEventListener("gamepaddisconnected",disconnecthandler);
}
else
{
	setInterval(scangamepads,500);
}

var snTimer=
{
	slide:false,
	spin:false,
	push:false,
	isMove:false,
	mode:false,
	isChanged:true,
	startMillis:0,
	startTime:0,
	time:0,
	acc:0,

	do:function(_0,_2,_5)
	{
		if(_0<-.2)
		{
			if(!this.slide&&!this.isMove)
			{
				this.slide=true;
				this.time-=60;
				this.isChanged=true;
				this.mode=false;
			}
		}
		else if(.2<_0)
		{
			if(!this.slide&&!this.isMove)
			{
				this.slide=true;
				this.time+=60;
				this.isChanged=true;
				this.mode=false;
			}
		}
		else
		{
			this.slide=false;
		}

		if(_5<-.2)
		{
			if(!this.spin&&!this.isMove)
			{
				this.spin=true;
				this.time--;
				this.isChanged=true;
				this.mode=false;
			}
			this.acc-=.003-this.acc*.01;
		}
		else if(.2<_5)
		{
			if(!this.spin&&!this.isMove)
			{
				this.spin=true;
				this.time++;
				this.isChanged=true;
				this.mode=false;
			}
			this.acc+=.003+this.acc*.01;
		}
		else
		{
			this.spin=false;
			this.acc=0;
		}

		if(this.isMove)this.acc=0;
		this.time+=this.acc;

		if(this.time<0)this.time=0;

		if(.2<_2)
		{
			if(!this.push)
			{
				if(!this.isMove)
				{
					if(this.isChanged){this.startTime=Math.floor(this.time);}
					else{this.startTime=this.time;}
					this.startMillis=(+new Date());
					if(this.time<1)this.mode=true;
					this.isMove=true;
				}
				else
				{
					if(!this.mode)this.time=(this.startTime*1000-((+new Date())-this.startMillis))/1000;
					if(this.mode)this.time=(this.startTime*1000+((+new Date())-this.startMillis))/1000;
					this.isMove=false;
					this.isChanged=false;
				}
				this.push=true;
			}
		}
		else if(_2<-.2)
		{
			if(!this.push&&!this.isMove)
			{
				this.time=0;
				this.isChanged=true;
				this.push=true;
			}
		}
		else
		{
			this.push=false;
		}

		if(!this.isMove)
		{
			if(this.isChanged){return Math.floor(this.time);}
			else{return this.time;}
		}
		else
		{
			var t=0;
			if(!this.mode)t=(this.startTime*1000-((+new Date())-this.startMillis))/1000;
			if(this.mode)t=(this.startTime*1000+((+new Date())-this.startMillis))/1000;
			if(t<0)
			{
				t=0;
				this.time=0;
				this.isMove=false;

				var aud=document.getElementById("timeUp");
				aud.currentTime=0;
				aud.play();
			}
			return t;
		}
	}
}