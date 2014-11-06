function program(_v,_f)
{
	var v=gl.createShader(gl.VERTEX_SHADER);
	var vElement=document.getElementById(_v);
	gl.shaderSource(v,vElement.text);
	gl.compileShader(v);
	if(!gl.getShaderParameter(v,gl.COMPILE_STATUS)){alert(gl.getShaderInfoLog(v));return;}

	var f=gl.createShader(gl.FRAGMENT_SHADER);
	var fElement=document.getElementById(_f);
	gl.shaderSource(f,fElement.text);
	gl.compileShader(f);
	if(!gl.getShaderParameter(f,gl.COMPILE_STATUS)){alert(gl.getShaderInfoLog(f));return;}

	var p=gl.createProgram();
	gl.attachShader(p,v);
	gl.attachShader(p,f);
	gl.linkProgram(p);
	if(gl.getProgramParameter(p,gl.LINK_STATUS))
	{
		gl.useProgram(p);
		return p;
	}else{
		alert(gl.getProgramInfoLog(p));
	}
}

function create_vbo(_d)
{
	var vbo=gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(_d),gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);

	return vbo;
}

function create_ibo(_d)
{
	var ibo=gl.createBuffer();

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Int16Array(_d),gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

	ibo.length=_d.length;
	ibo.content=_d;
	return ibo;
}

function setAtt(_n,_v,_s)
{
	var loc=gl.getAttribLocation(prg,_n);
	var str=_s;

	var vbo=create_vbo(_v);

	gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
	gl.enableVertexAttribArray(loc);
	gl.vertexAttribPointer(loc,str,gl.FLOAT,false,0,0);
}

function setTex(_s,_n)
{
	var img=new Image();

	img.onload=function()
	{
		var t=gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D,t);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D,null);
		tex[_n]=t;
	};
	
	img.src=_s;
}

function create_framebuffer(_w,_h)
{
	var f=gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER,f);

	var d=gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER,d);
	gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,_w,_h);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,d);
	
	var t=gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,t);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,_w,_h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);
	
	gl.bindTexture(gl.TEXTURE_2D,null);
	gl.bindRenderbuffer(gl.RENDERBUFFER,null);
	gl.bindFramebuffer(gl.FRAMEBUFFER,null);
	
	return {f:f,d:d,t:t};
}