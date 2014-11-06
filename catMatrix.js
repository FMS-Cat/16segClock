var M=
{
	// vec3 vを単位ベクトル化（長さを1にする）して返す(vec3)
	unit:function(v)
	{
		var d=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
		return [v[0]/d,v[1]/d,v[2]/d];
	},

	// vec3 aとvec3 bの内積を返す(float)
	dot:function(a,b)
	{
		return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
	},

	// vec3 aとvec3 bの外積を返す(vec3)
	cross:function(a,b)
	{
		return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
	},

	// 単位行列を返す(mat4)
	identity:function()
	{
		return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
	},

	// 配列 aと配列 bの各項を足したものを返す(配列aと同じ長さの配列を返す)
	add:function(a,b)
	{
		var r=[];
		for(var c=0;c<a.length;c++)
		{
			r[c]=a[c]+b[c];
		}
		return r;
	},

	// 配列 aの各項をfloat s倍する(配列aと同じ長さの配列を返す)
	scalar:function(s,m)
	{
		var r=[];
		for(var c=0;c<m.length;c++)
		{
			r[c]=m[c]*s;
		}
		return r;
	},

	// vec3 vを移動量とする平行移動行列を返す(mat4)
	translate:function(v)
	{
		return [1,0,0,0,0,1,0,0,0,0,1,0,v[0],v[1],v[2],1];
	},

	// vec3 vを倍率とする拡大縮小行列を返す(mat4)
	scale:function(v)
	{
		return [v[0],0,0,0,0,v[1],0,0,0,0,v[2],0,0,0,0,1];
	},

	// vec3 vを軸、float t(rad)を回転角とする回転行列を返す(mat4)
	rotate:function(v,t)
	{
		var x=M.unit(v)[0],y=M.unit(v)[1],z=M.unit(v)[2];
		var m=[0,z,-y,0,-z,0,x,0,y,-x,0,0,0,0,0,0];
		return M.add(M.identity(),M.add(M.scalar(Math.sin(t),m),M.scalar((1-Math.cos(t)),M.multiply(m,m))));
	},

	// mat4 mの転置行列を返す(mat4)
	transpose:function(m)
	{
		var r=[];
		for(var c=0;c<16;c++)
		{
			r[c]=m[c%4*4+Math.floor(c/4)];
		}
		return r;
	},

	// mat4 mとvec3 vの積のxyz成分を返す（vのw成分には1が代入される）(vec3)
	vector:function(m,v)
	{
		v[3]=1;
		var r=[];
		for(var c=0;c<3;c++)
		{
			r[c]=0;
			for(var d=0;d<4;d++)
			{
				r[c]+=m[d*4+c]*v[d];
			}
		}
		return r;
	},

	// mat4 aとmat4 bの積を返す(mat4)
	multiply:function(a,b)
	{
		var r=[];
		for(var c=0;c<16;c++)
		{
			r[c]=0;
			for(var d=0;d<4;d++)
			{
				r[c]+=a[d*4+c%4]*b[d+Math.floor(c/4)*4];
			}
		}
		return r;
	},

	// vec3 eを目の位置、vec3 cを目標、vec3 uと天としたビュー変換行列を返す
	lookAt:function(e,c,u)
	{
		var z=M.unit([e[0]-c[0],e[1]-c[1],e[2]-c[2]]),
		x=M.unit(M.cross(z,M.unit(u))),
		y=M.cross(z,x);
		return M.multiply([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,0,0,0,1],M.translate([-e[0],-e[1],-e[2]]));
	},

	// float f(deg)を視野、float aをアスペクト比、float Nをニアクリップ、float Fをファークリップとした射影変換行列を返す
	perspective:function(f,a,N,F)
	{
		p=-1/Math.tan(f*Math.PI/360);
		return [p/a,0,0,0,0,p,0,0,0,0,F/(N-F),-1,0,0,N*F/(N-F),0];
	},
};