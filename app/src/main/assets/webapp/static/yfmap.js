/**
 * 选用YFM作为本库的单全局变量
 */
var YFM = {};



/**
 * 双向链表, 可按位置访问
 */
function ArrayList()
{
	this.count = 0;
	this.head = new ArrayListNode(null);
	this.tail = new ArrayListNode(null);
	this.head.next = this.tail;
	this.tail.prev = this.head;

}
ArrayList.prototype = {
	constructor : ArrayList,

	getIter  : function(){
		return new ArrayListIter(this.head, this.tail);
	},

	size : function(){
		return this.count;
	},

	addHigh : function(value){
		var node = new ArrayListNode(value);

		node.prev = this.tail.prev;
		node.next = this.tail;

		this.tail.prev.next = node;
		this.tail.prev = node;
		this.count += 1;
	},

	addLow : function(value){
		var node = new ArrayListNode(value);

		node.prev = this.head;
		node.next = this.head.next;

		this.head.next.prev = node;
		this.head.next = node;
		this.count += 1;
	},

    clean : function(){
        this.count = 0;
        this.head = new ArrayListNode(null);
        this.tail = new ArrayListNode(null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    },

	remove : function(pos){
		var retval;
		var node, i;
		if(pos < -this.count  || pos > (this.count - 1)){
			retval = null;
		}else if(pos >= 0){
			for(i = 0,node = this.head.next; i < pos; i++){
				node = node.next;
			}
			retval = node.value;
			node.prev.next = node.next;
			node.next.prev = node.prev;
			this.count -= 1;
		}else if(pos < 0){
			for(i = pos,node = this.tail.prev; i < 0; i++){
				node = node.prev;
			}
			retval = node.value;
			node.prev.next = node.next;
			node.next.prev = node.prev;
			this.count -= 1;
		}

		return retval;
	},

	removeHigh : function(){
		var retval;
		if(this.count >= 1){
			retval = this.tail.prev.value;
			this.tail.prev.prev.next = this.tail;
			this.tail.prev = this.tail.prev.prev;
			this.count -= 1;
		}else{
			retval = null;
		}
		return retval;
	},

	removeLow : function(){
		var retval;
		if(this.count >= 1){
			retval = this.head.next.value;
			this.head.next.next.prev = this.head;
			this.head.next = this.head.next.next;
			this.count -= 1;
		}else{
			retval = null;
		}

		return retval;
	},

	get : function(pos){
		var retval;
		var node, i;
		if(pos < -this.count  || pos > (this.count - 1)){
			throw new Error("Access out of range");
		}else if(pos >= 0){
			for(i = 0,node = this.head.next; i < pos; i++){
				node = node.next;
			}
			retval = node.value;
		}else if(pos < 0){
			for(i = pos,node = this.tail.prev; i < 0; i++){
				node = node.prev;
			}
			retval = node.value;
		}

		return retval;
	},

	put : function(pos, value){
		var node, i;
		if(pos < -this.count  || pos > (this.count - 1)){
			throw new Error("Access out of range");
		}else if(pos >= 0){
			for(i = 0,node = this.head.next; i < pos; i++){
				node = node.next;
			}
			node.value = value;
		}else if(pos < 0){
			for(i = pos,node = this.tail.prev; i < 0; i++){
				node = node.prev;
			}
			node.value = value;
		}
	}
}


/**
 * 链表节点
 */
function ArrayListNode(value)
{
	this.next = null;
	this.prev = null;
	this.value= value;
}

/**
 * 链表正向枚举器
 */
function ArrayListIter(head, tail)
{
	this.head = head;
	this.tail = tail;
	this.cursor = head;
}
ArrayListIter.prototype = {
	constructor : ArrayListIter,

	hasNext : function(){
		return this.cursor.next != this.tail;
	},

	getNext : function(){
		var retval = this.cursor.next.value;
		this.cursor = this.cursor.next;
		return retval;
	}
}


/**
 * 索引优先队列
 */
function IndexMinPQ(size)
{

    this.size = size;
    this.count = 0;
    this.pq = new Array(size+1);
    this.qp = new Array(size+1);
    this.keys = new Array(size+1);


    for(var i = 0; i <= this.size; i++){
        this.qp[i] = -1;
        this.keys[i] = Number.MAX_VALUE;
    }
}
IndexMinPQ.prototype = {
	constructor : IndexMinPQ,


    clean : function(){

        this.count = 0;
        for(var i = 0; i <= this.size; i++){
            this.qp[i] = -1;
            this.keys[i] = Number.MAX_VALUE;
        }
    },

    setSize : function(size){
        var def, i;
        def = size - this.size;
        if(def < 0){
            for(i = def; i < 0; i++){
                this.pq.pop();
                this.qp.pop();
                this.keys.pop();
            }
        }else if(def > 0){
            for(i = 0; i < def; i++){
                this.pq.push(null);
                this.qp.push(null);
                this.keys.push(null);
            }
        }
        this.size = size;
        this.clean();
    },

	getSize : function(){
        return this.size;
	},
    getCount : function(){
        return this.count;
    },

    changeKey : function(i, key){

        if(i < 0 || i > this.size){
            throw new Error("IndexMinPQ.changeKey, out of range index:"+i);
        }
        if(!this.contains(i)){
            throw new Error("IndexMinPQ.changeKey, do not contains index:"+i);
        }

        this.keys[i] = key;
        this._swim(this.qp[i]);
        this._sink(this.qp[i]);
    },

    decreaseKey : function(i, key){
        if(i < 0 || i > this.size){
            throw new Error("IndexMinPQ.decreaseKey, out of range index:"+i);
        }
        if(!this.contains(i)){
            throw new Error("IndexMinPQ.decreaseKey, do not contains index:"+i);
        }
        if(this.keys[i] <= key){
            throw new Error("IndexMinPQ.decreaseKey, key[i] <= key");
        }   
        this.keys[i] = key;
        this._swim(this.qp[i]);
    },

    increaseKey : function(i, key){
        if(i < 0 || i > this.size){
            throw new Error("IndexMinPQ.increaseKey, out of range index:"+i);
        }
        if(!this.contains(i)){
            throw new Error("IndexMinPQ.increaseKey, do not contains index:"+i);
        }
        if(this.keys[i] >= key){
            throw new Error("IndexMinPQ.increaseKey, key[i] <= key");
        }   
        this.keys[i] = key;
        this._swim(this.qp[i]);
    },

    deleteMin : function(){

        if(this.count <= 0){
            throw new Error("IndexMinPQ.deleteMin, empty content");
        }

        var min;

        min = this.pq[1];
        this._exch(1, this.count);
        this.count -= 1;
        this._sink(1);
        this.qp[min] = -1;
        this.keys[this.pq[this.count+1]] = Number.MAX_VALUE;
        this.pq[this.count+1] = -1;
        return min;
    },

    delete : function(i){

        if(i < 0 || i > this.size){
            throw new Error("IndexMinPQ.delete, out of range index:"+i);
        }
        if(!this.contains(i)){
            throw new Error("IndexMinPQ.delete, do not contains index:"+i);
        }

        var index = qp[i];
        this._exch(index, this.count);
        this.count -= 1;
        this._swim(index);
        this._sink(index);
        this.keys[i] = Number.MAX_VALUE;
        this.qp[i] = -1;
    },


    contains : function(i){

        if(i < 0 || i > this.size){
            throw new Error("IndexMinPQ.countains, out of range index:"+i);
        }

        return -1 !== this.qp[i];
    },

    isEmpty : function(){

        return 0 === this.count;
    },

    keyOf : function(i){
        if(i < 0 || i > this.size){
            throw new Error("IndexMinPQ.keyOf, out of range index:"+i);
        }
        if(!this.contains(i)){
            throw new Error("IndexMinPQ.keyOf, do not contains index:"+i);
        }

        return this.keys[i];
    },

    minIndex : function(){

        if(this.count <= 0){
            throw new Error("IndexMinPQ.minIndex, empty content");
        }

        return this.pq[1];
    },

    minKey : function(){
        if(this.count <= 0){
            throw new Error("IndexMinPQ.minKey, empty content");
        }

        return this.keys[this.pq[1]];
    },

    indexAt : function(pos){

        if(pos < 0 || pos > this.count){
            throw new Error("IndexMinPQ.indexAt, out of range pos:"+pos);
        }
        return this.pq[pos+1];
    },

    insert : function(i, key){
        if(i < 0 || i > this.size){
            throw new Error("IndexMinPQ.insert, out of range index:"+i);
        }
        if(this.contains(i)){
            throw new Error("IndexMinPQ.insert, do contains index:"+i);
        }


        this.count += 1;
        this.qp[i] = this.count;
        this.pq[this.count] = i;
        this.keys[i] = key;
        this._swim(this.count);
    },

    _exch : function(i, j){

        if(i < 0 || i > this.size){
            throw new Error("IndexMinPQ._exch, out of range i:"+i);
        }
        if(j < 0 || j > this.size){
            throw new Error("IndexMinPQ._exch, out of range j:"+j);
        }

        var swap = this.pq[i];
        this.pq[i] = this.pq[j];
        this.pq[j] = swap;
        this.qp[this.pq[i]] = i;
        this.qp[this.pq[j]] = j;
    },
    
    _greater : function(i, j){
        if(i < 0 || i > this.size){
            throw new Error("IndexMinPQ._greater, out of range i:"+i);
        }
        if(j < 0 || j > this.size){
            throw new Error("IndexMinPQ._greater, out of range j:"+j);
        }

        //return this.keys[this.pq[i]] > this.keys[this.pq[j]];
        var ret =  this.keys[this.pq[i]] > this.keys[this.pq[j]];

        return ret;
    },
    
    _sink : function(k){
        var j;

        if(k < 0 || k > this.size){
            throw new Error("IndexMinPQ._sink, out of range k:"+k);
        }
        while(2*k <= this.count){
            j = 2*k;
            if(j < this.count && this._greater(j, j+1))j++;
            if(! this._greater(k, j)) break;
            this._exch(k, j);
            k = j;
        }
    },

    _swim : function(k){
        if(k < 0 || k > this.size){
            throw new Error("IndexMinPQ._swin, out of range k:"+k);
        }
        while(k > 1){
            var p = Math.round(k/2);
            if(!this._greater(p, k)){
                break;
            }
            this._exch(k, p);
            k = p;
        }
    }
}

/**
 * 选用YFM.Map作为本模块的名字空间
 */
YFM.Map = {};

/**
 * 地图的状态
 */
YFM.Map.STATUS_TOUCH = 0;
YFM.Map.STATUS_SENSOR =  1;
YFM.Map.STATUS_NAVIGATE = 2;
YFM.Map.STATUS_TRACE = 3;

YFM.Map.Navigate = {};
/**
 * 路径导航, 当前建议
 */
YFM.Map.Navigate.Suggestion = {
        NONE    : "none",
        FRONT   : "front",
        LEFT    : "left",
        BACKWARD: "backward",
        RIGHT   : "right"
};

/**
 * 路径导航, 下段建议
 */
YFM.Map.Navigate.NextSuggestion = {
        NONE    : "none",
        FRONT   : "front",
        LEFT    : "left",
        RIGHT   : "right",
        ARRIVE  : "arrive"
};


YFM.Math = function(){

    var MATH_FLT_ABS_ERROR = 1e-5;
    var MATH_FLT_REL_ERROR = 1e-8;
    var MATH_FLT_E_ERROR = 1e-20;

    /**
     * 将value 限制在[min, max]的区间内
     */
	var clamp = function(value, min, max){
		return Math.max(min, Math.min(max, value));
    };

    /**
     * 将istart <= value <= istop, 映射为
     *   ostart <= output<= ostop
     */
    var map = function(value, istart, istop, ostart, ostop){
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    };

    /**
     * 度转弧度
     */
    var deg2Radian = function(deg){
        return (deg * 2 * Math.PI)/360.0;
    };

    /**
     * 弧度转度
     */
    var radian2Deg = function(radian){
        return 360.0 * radian / (2 * Math.PI);
    };

    /**
     * 将函数参数表的类数组对象, 转换为数组
     */
    var argumentsToArray = function(args){
        return [].concat.apply( [], Array.prototype.slice.apply(args) );
    };
    
    /**
     * 判断浮点数相等
     */
    var floatEquals = function(x, y){
        if(Math.abs(x-y) <= MATH_FLT_ABS_ERROR){
            return true;
        }else {
            var r = Math.abs(x) > Math.abs(y) ? Math.abs((x-y) / x) : Math.abs((x-y) / y);
            return r <= MATH_FLT_REL_ERROR;
        }
    };

    /**
     * 判断浮点数非0
     */
    var floatNotZero = function(f){
        return Math.abs(f) > MATH_FLT_E_ERROR;
    };

    /**
     * 将数组展平, 有一些假定:
     * 数组要么是一维要么是二维, 数组中元素的维度和0号元素保持一致
     */
	var flatten = function(v, limit){

        var dim;
		var n = v.length;
    	var elemsAreArrays = false;

		if(Array.isArray(v[0])){
			elemsAreArrays = true;

            if(null == limit){
                n *= v[0].length;
                dim = v[0].length;
            }else{
                n *= limit;
                dim = limit;
            }
		}

        var floats = new Float32Array(n);

        if(elemsAreArrays){
            var idx = 0;
            for(var i = 0; i < v.length; ++i){
                for ( var j = 0; j < dim; ++j ) {
                    floats[idx++] = v[i][j];
                }
            }
        }else{

            for ( var i = 0; i < v.length; ++i ) {
                floats[i] = v[i];
            }
        }
		return floats;
	};

    var vf2str = function(vf, fix){
        var ret = "[ ";
        var cnt = vf.length;
        for(var i = 0; i < cnt; i++){
            ret += vf[i].toFixed(fix);
            ret += ", "
        }
        ret += "]";
        return ret;
    };

    var lerp = function(v1, v2, t){
        
        return v1 + (v2-v1) * t;
    };
    

	return {
        clamp : clamp,
        map : map,
        deg2Radian : deg2Radian,
        radian2Deg : radian2Deg,
        flatten : flatten,
        argumentsToArray : argumentsToArray,
        floatEquals : floatEquals,
        floatNotZero : floatNotZero,
        vf2str : vf2str,
        lerp : lerp
	};
}();

function DodecahedronMesh(gl, t)
{
    this._init(gl, t);
}

DodecahedronMesh.prototype = {
    constructor : DodecahedronMesh,

    getMeshVBO : function(){
        return this.meshVBO;
    },

    getMeshBufSize : function(){
        return this.meshBufSize;
    },
    
    _init : function(gl, t){

        this.mesh = [];

        this._dodecahedron(t);

        this.meshVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(this.mesh, 3), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.meshBufSize = this.mesh.length/2;

        this.mesh = null;
    },

    _dodecahedron : function(cnt){
        var t = ( 1 + Math.sqrt( 5 ) ) / 2;
        var r = 1/t;
        var v = [];

		//- 1, - 1, - 1,    
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1,    -1,     -1)));
        //- 1, - 1,  1,
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1,    -1,     1)));
		//- 1,  1, - 1,    
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1,    1,      -1)));
        //- 1,  1,  1,
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1,    1,      1)));
		//  1, - 1, - 1,     
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1,     -1,     -1)));
        //  1, - 1,  1,
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1,     -1,     1)));
		//  1,  1, - 1,     
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1,     1,      -1)));
        //  1,  1,  1,
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1,     1,      1)));

		//0, - r, - t,     
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0,     -r,     -t)));
        //0, - r,  t,
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0,     -r,     t)));
		//0,  r, - t,     
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0,     r,      -t)));
        //0,  r,  t,
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0,     r,      t)));

		//- r, - t,  0,    
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-r,    -t,     0)));
        //- r,  t,  0,
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-r,    t,      0)));
        //r, - t,  0,     
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(r,     -t,     0)));
        //r,  t,  0,
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(r,     t,      0)));

		//- t,  0, - r,     
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-t,    0,      -r)));
        //t,  0, - r,
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(t,     0,      -r)));
        //- t,  0,  r,     
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-t,    0,      r)));
        //t,  0,  r
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(t,     0,      r)));

        /*
		 3, 11,  7,      3,  7, 15,      3, 15, 13,
		 7, 19, 17,      7, 17,  6,      7,  6, 15,
		17,  4,  8,     17,  8, 10,     17, 10,  6,*/
        this._divideTriangle(v[3],  v[11],  v[7],   cnt);
        this._divideTriangle(v[3],  v[7],   v[15],   cnt);
        this._divideTriangle(v[3],  v[15],  v[13],   cnt);

        this._divideTriangle(v[7],  v[19],  v[17],   cnt);
        this._divideTriangle(v[7],  v[17],  v[6],   cnt);
        this._divideTriangle(v[7],  v[6],   v[15],   cnt);

        this._divideTriangle(v[17], v[4],   v[8],   cnt);
        this._divideTriangle(v[17], v[8],   v[10],   cnt);
        this._divideTriangle(v[17], v[10],  v[6],   cnt);


        /*
		 8,  0, 16,      8, 16,  2,      8,  2, 10,
		 0, 12,  1,      0,  1, 18,      0, 18, 16,
		 6, 10,  2,      6,  2, 13,      6, 13, 15,*/
        this._divideTriangle(v[8],  v[0],   v[16],   cnt);
        this._divideTriangle(v[8],  v[16],  v[2],    cnt);
        this._divideTriangle(v[8],  v[2],   v[10],   cnt);

        this._divideTriangle(v[0],  v[12],  v[1],    cnt);
        this._divideTriangle(v[0],  v[1],   v[18],    cnt);
        this._divideTriangle(v[0],  v[18],  v[16],    cnt);

        this._divideTriangle(v[6],  v[10],  v[2],    cnt);
        this._divideTriangle(v[6],  v[2],   v[13],    cnt);
        this._divideTriangle(v[6],  v[13],  v[15],    cnt);


        /*
	    2, 16, 18,      2, 18,  3,      2,  3, 13,
		18,  1,  9,     18,  9, 11,     18, 11,  3,
		 4, 14, 12,      4, 12,  0,      4,  0,  8,*/
        this._divideTriangle(v[2],  v[16],  v[18],    cnt);
        this._divideTriangle(v[2],  v[18],  v[3],    cnt);
        this._divideTriangle(v[2],  v[3],   v[13],    cnt);

        this._divideTriangle(v[18], v[1],   v[9],    cnt);
        this._divideTriangle(v[18], v[9],   v[11],    cnt);
        this._divideTriangle(v[18], v[11],  v[3],    cnt);

        this._divideTriangle(v[4],  v[14],  v[12],    cnt);
        this._divideTriangle(v[4],  v[12],  v[0],    cnt);
        this._divideTriangle(v[4],  v[0],   v[8],    cnt);


        /*
		11,  9,  5,     11,  5, 19,     11, 19,  7,
		19,  5, 14,     19, 14,  4,     19,  4, 17,
		 1, 12, 14,      1, 14,  5,      1,  5,  9*/
        this._divideTriangle(v[11],  v[9],   v[5],    cnt);
        this._divideTriangle(v[11],  v[5],   v[19],    cnt);
        this._divideTriangle(v[11],  v[19],  v[7],    cnt);

        this._divideTriangle(v[19],  v[5],   v[14],    cnt);
        this._divideTriangle(v[19],  v[14],  v[4],    cnt);
        this._divideTriangle(v[19],  v[4],   v[17],    cnt);

        this._divideTriangle(v[1],   v[12],  v[14],    cnt);
        this._divideTriangle(v[1],   v[14],  v[5],    cnt);
        this._divideTriangle(v[1],   v[5],   v[9],    cnt);
    },

    _divideTriangle : function(a, b, c, count){
        if(count > 0){

            var ab = YFM.Math.Vector.mix(a, b, 0.5);
            var ac = YFM.Math.Vector.mix(a, c, 0.5);
            var bc = YFM.Math.Vector.mix(b, c, 0.5);

            ab = YFM.Math.Vector.normalize(ab);
            ac = YFM.Math.Vector.normalize(ac);
            bc = YFM.Math.Vector.normalize(bc);

            this._divideTriangle(a, ab, ac, count - 1);
            this._divideTriangle(ab, b, bc, count - 1);
            this._divideTriangle(bc, c, ac, count - 1);
            this._divideTriangle(ab, bc, ac, count - 1);
        }else {
            this._triangle(a, b, c);
        }
    },

    _triangle : function(a, b, c){

        var t1 = YFM.Math.Vector.sub(b, a);
        var t2 = YFM.Math.Vector.sub(c, b);
        var n  = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(t1, t2));

        this.mesh.push(a);
        this.mesh.push(n);
        this.mesh.push(b);
        this.mesh.push(n);
        this.mesh.push(c);
        this.mesh.push(n);
    }
}


function HexahedronMesh(gl, t)
{
    this._init(gl, t);
}

HexahedronMesh.prototype = {
    constructor : HexahedronMesh,

    getMeshVBO : function(){
        return this.meshVBO;
    },

    getMeshBufSize : function(){
        return this.meshBufSize;
    },
    
    _init : function(gl, t){

        this.mesh = [];

        this._hexahedron(t);

        this.meshVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(this.mesh, 3), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.meshBufSize = this.mesh.length/2;

        this.mesh = null;
    },

    _hexahedron : function(cnt){
        var v = [];
        var a = Math.sqrt(2.0)/2.0;

        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0.0,     1.0,     -a)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1.0,     0.0,     -a)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0.0,     -1.0,    -a)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1.0,    0.0,     -a)));

        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0.0,     1.0,     a)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1.0,     0.0,     a)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0.0,     -1.0,    a)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1.0,    0.0,     a)));

        this._divideTriangle(v[0],  v[1],  v[3],   cnt);
        this._divideTriangle(v[3],  v[1],  v[2],   cnt);

        this._divideTriangle(v[4],  v[7],  v[5],   cnt);
        this._divideTriangle(v[5],  v[7],  v[6],   cnt);

        this._divideTriangle(v[7],  v[3],  v[6],   cnt);
        this._divideTriangle(v[6],  v[3],  v[2],   cnt);

        this._divideTriangle(v[6],  v[2],  v[5],   cnt);
        this._divideTriangle(v[5],  v[2],  v[1],   cnt);

        this._divideTriangle(v[4],  v[5],  v[0],   cnt);
        this._divideTriangle(v[0],  v[5],  v[1],   cnt);

        this._divideTriangle(v[7],  v[4],  v[0],   cnt);
        this._divideTriangle(v[0],  v[3],  v[7],   cnt);
    },

    _divideTriangle : function(a, b, c, count){
        if(count > 0){

            var ab = YFM.Math.Vector.mix(a, b, 0.5);
            var ac = YFM.Math.Vector.mix(a, c, 0.5);
            var bc = YFM.Math.Vector.mix(b, c, 0.5);

            ab = YFM.Math.Vector.normalize(ab);
            ac = YFM.Math.Vector.normalize(ac);
            bc = YFM.Math.Vector.normalize(bc);

            this._divideTriangle(a, ab, ac, count - 1);
            this._divideTriangle(ab, b, bc, count - 1);
            this._divideTriangle(bc, c, ac, count - 1);
            this._divideTriangle(ab, bc, ac, count - 1);
        }else {
            this._triangle(a, b, c);
        }
    },

    _triangle : function(a, b, c){

        var t1 = YFM.Math.Vector.sub(b, a);
        var t2 = YFM.Math.Vector.sub(c, b);
        var n  = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(t1, t2));

        this.mesh.push(a);
        this.mesh.push(n);
        this.mesh.push(b);
        this.mesh.push(n);
        this.mesh.push(c);
        this.mesh.push(n);
    }
}


function IcosahedronMesh(gl, t)
{
    this._init(gl, t);
}

IcosahedronMesh.prototype = {
    constructor : IcosahedronMesh,

    getMeshVBO : function(){
        return this.meshVBO;
    },

    getMeshBufSize : function(){
        return this.meshBufSize;
    },
    
    _init : function(gl, t){

        this.mesh = [];

        this._icosahedron(t);

        this.meshVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(this.mesh, 3), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.meshBufSize = this.mesh.length/2;

        this.mesh = null;
    },

    _icosahedron : function(cnt){
        var t = ( 1 + Math.sqrt( 5 ) ) / 2;
        var v = [];

        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1.0,    t,      0)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1.0,     t,      0)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1.0,    -t,     0)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1.0,     -t,     0)));

        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0.0,     -1.0,   t)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0.0,     1.0,    t)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0.0,     -1.0,   -t)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(0.0,     1.0,    -t)));

        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(t,       0.0,    -1)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(t,       0.0,    1)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-t,      0.0,    -1)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-t,      0.0,    1)));

        this._divideTriangle(v[0],  v[11],  v[5],   cnt);
        this._divideTriangle(v[0],  v[5],   v[1],   cnt);
        this._divideTriangle(v[0],  v[1],   v[7],   cnt);
        this._divideTriangle(v[0],  v[7],   v[10],  cnt);
        this._divideTriangle(v[0],  v[10],  v[11],  cnt);

        this._divideTriangle(v[1],  v[5],   v[9],   cnt);
        this._divideTriangle(v[5],  v[11],  v[4],   cnt);
        this._divideTriangle(v[11], v[10],  v[2],   cnt);
        this._divideTriangle(v[10], v[7],   v[6],   cnt);
        this._divideTriangle(v[7],  v[1],   v[8],   cnt);

        this._divideTriangle(v[3],  v[9],   v[4],   cnt);
        this._divideTriangle(v[3],  v[4],   v[2],   cnt);
        this._divideTriangle(v[3],  v[2],   v[6],   cnt);
        this._divideTriangle(v[3],  v[6],   v[8],   cnt);
        this._divideTriangle(v[3],  v[8],   v[9],   cnt);

        this._divideTriangle(v[4],  v[9],   v[5],   cnt);
        this._divideTriangle(v[2],  v[4],   v[11],  cnt);
        this._divideTriangle(v[6],  v[2],   v[10],  cnt);
        this._divideTriangle(v[8],  v[6],   v[7],   cnt);
        this._divideTriangle(v[9],  v[8],   v[1],   cnt);
    },

    _divideTriangle : function(a, b, c, count){
        if(count > 0){

            var ab = YFM.Math.Vector.mix(a, b, 0.5);
            var ac = YFM.Math.Vector.mix(a, c, 0.5);
            var bc = YFM.Math.Vector.mix(b, c, 0.5);

            ab = YFM.Math.Vector.normalize(ab);
            ac = YFM.Math.Vector.normalize(ac);
            bc = YFM.Math.Vector.normalize(bc);

            this._divideTriangle(a, ab, ac, count - 1);
            this._divideTriangle(ab, b, bc, count - 1);
            this._divideTriangle(bc, c, ac, count - 1);
            this._divideTriangle(ab, bc, ac, count - 1);
        }else {
            this._triangle(a, b, c);
        }
    },

    _triangle : function(a, b, c){

        var t1 = YFM.Math.Vector.sub(b, a);
        var t2 = YFM.Math.Vector.sub(c, b);
        var n  = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(t1, t2));

        this.mesh.push(a);
        this.mesh.push(n);
        this.mesh.push(b);
        this.mesh.push(n);
        this.mesh.push(c);
        this.mesh.push(n);
    }
}


/**
 * 选用YFM.Mesh作为本模块的名字空间
 */
YFM.Mesh = {};

YFM.Mesh.CATEGORY_TETRHEDRON = "tetrahedron";
YFM.Mesh.CATEGORY_HEXADEDRON = "hexahedron";
YFM.Mesh.CATEGORY_OCTAHEDRON = "octahedron";
YFM.Mesh.CATEGORY_DODECAHEDRON = "dodecahedron";
YFM.Mesh.CATEGORY_ICOSAHEDRON = "icosahedron";
YFM.Mesh.CATEGORY_SPHERE = "SPHERE";


/**
 * 封装一下Mesh的VBO
 */
function MeshBuffer(gl)
{
    this.gl = gl;
    this.attributes = {};
}

MeshBuffer.prototype = {
    constructor : MeshBuffer,

    addAttribute : function(name, array, size, normalized){
        var gl = this.gl;

        var f32Array = new Float32Array(array);
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, f32Array, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.attributes[name] = {
                                    vbo : vbo,
                                    size : size,
                                    length : array.length/size
        };
    },
    
    getAttribute : function(name){
        return this.attributes[name];
    }
}


function OctahedronMesh(gl, t)
{
    this._init(gl, t);
}

OctahedronMesh.prototype = {
    constructor : OctahedronMesh,

    getMeshVBO : function(){
        return this.meshVBO;
    },

    getMeshBufSize : function(){
        return this.meshBufSize;
    },
    
    _init : function(gl, t){

        this.mesh = [];

        this._octahedron(t);

        this.meshVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(this.mesh, 3), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.meshBufSize = this.mesh.length/2;

        this.mesh = null;
    },

    _octahedron : function(cnt){
        var v = [];

        v.push(YFM.Math.Vector.pos(1.0,     0.0,     0.0));
        v.push(YFM.Math.Vector.pos(-1.0,    0.0,     0.0));
        v.push(YFM.Math.Vector.pos(0.0,     1.0,     0.0));
        v.push(YFM.Math.Vector.pos(0.0,     -1.0,    0.0));
        v.push(YFM.Math.Vector.pos(0.0,     0.0,     1.0));
        v.push(YFM.Math.Vector.pos(0.0,     0.0,     -1.0));

        this._divideTriangle(v[0],  v[2],  v[4],   cnt);
        this._divideTriangle(v[0],  v[4],  v[3],   cnt);
        this._divideTriangle(v[0],  v[3],  v[5],   cnt);
        this._divideTriangle(v[0],  v[5],  v[2],   cnt);
        this._divideTriangle(v[1],  v[2],  v[5],   cnt);
        this._divideTriangle(v[1],  v[5],  v[3],   cnt);
        this._divideTriangle(v[1],  v[3],  v[4],   cnt);
        this._divideTriangle(v[1],  v[4],  v[2],   cnt);
    },

    _divideTriangle : function(a, b, c, count){
        if(count > 0){

            var ab = YFM.Math.Vector.mix(a, b, 0.5);
            var ac = YFM.Math.Vector.mix(a, c, 0.5);
            var bc = YFM.Math.Vector.mix(b, c, 0.5);

            ab = YFM.Math.Vector.normalize(ab);
            ac = YFM.Math.Vector.normalize(ac);
            bc = YFM.Math.Vector.normalize(bc);

            this._divideTriangle(a, ab, ac, count - 1);
            this._divideTriangle(ab, b, bc, count - 1);
            this._divideTriangle(bc, c, ac, count - 1);
            this._divideTriangle(ab, bc, ac, count - 1);
        }else {
            this._triangle(a, b, c);
        }
    },

    _triangle : function(a, b, c){

        var t1 = YFM.Math.Vector.sub(b, a);
        var t2 = YFM.Math.Vector.sub(c, b);
        var n  = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(t1, t2));

        this.mesh.push(a);
        this.mesh.push(n);
        this.mesh.push(b);
        this.mesh.push(n);
        this.mesh.push(c);
        this.mesh.push(n);
    }
}



function TetrahedronMesh(gl, t)
{
    this._init(gl, t);
}

TetrahedronMesh.prototype = {
    constructor : TetrahedronMesh,

    getMeshVBO : function(){
        return this.meshVBO;
    },

    getMeshBufSize : function(){
        return this.meshBufSize;
    },
    
    _init : function(gl, t){

        this.mesh = [];

        this._tetrahedron(t);

        this.meshVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(this.mesh, 3), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.meshBufSize = this.mesh.length/2;

        this.mesh = null;
    },

    _tetrahedron : function(cnt){
        var v = [];

        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1.0,     1.0,    1.0)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1.0,     -1.0,    1.0)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(-1.0,     1.0,    -1.0)));
        v.push(YFM.Math.Vector.normalize(YFM.Math.Vector.pos(1.0,     -1.0,    -1.0)));

        this._divideTriangle(v[2],  v[1],  v[0],   cnt);
        this._divideTriangle(v[0],  v[3],  v[2],   cnt);
        this._divideTriangle(v[1],  v[3],  v[0],   cnt);
        this._divideTriangle(v[2],  v[3],  v[1],   cnt);
    },

    _divideTriangle : function(a, b, c, count){
        if(count > 0){

            var ab = YFM.Math.Vector.mix(a, b, 0.5);
            var ac = YFM.Math.Vector.mix(a, c, 0.5);
            var bc = YFM.Math.Vector.mix(b, c, 0.5);

            ab = YFM.Math.Vector.normalize(ab);
            ac = YFM.Math.Vector.normalize(ac);
            bc = YFM.Math.Vector.normalize(bc);

            this._divideTriangle(a, ab, ac, count - 1);
            this._divideTriangle(ab, b, bc, count - 1);
            this._divideTriangle(bc, c, ac, count - 1);
            this._divideTriangle(ab, bc, ac, count - 1);
        }else {
            this._triangle(a, b, c);
        }
    },

    _triangle : function(a, b, c){

        var t1 = YFM.Math.Vector.sub(b, a);
        var t2 = YFM.Math.Vector.sub(c, b);
        var n  = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(t1, t2));

        this.mesh.push(a);
        this.mesh.push(n);
        this.mesh.push(b);
        this.mesh.push(n);
        this.mesh.push(c);
        this.mesh.push(n);
    }
}



/**
 * 朴素的Cube全景实现
 */
function RawPanorama(gl, region)
{
    this.gl = gl;
    this.region = region;

    this.cubeVBO = null;
    this.cubeSize = 0;

    this.cubeMap = null;

    this._initCube();

    this.modelMat = YFM.Math.Matrix.rotate3d(90, 1, 0, 0);
}

RawPanorama.prototype = {
	constructor : RawPanorama,

    render : function(shader, regionMat){

        if(null !== this.cubeMap){
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.frontFace(this.gl.CW);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);


            shader.setModelMatrix(YFM.Math.Matrix.mul(regionMat, this.modelMat));
            shader.bindTexture(this.cubeMap);
            shader.drawTriangles(this.cubeVBO, this.cubeSize);

            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.frontFace(this.gl.CCW);
            this.gl.disable(this.gl.CULL_FACE);
        }
    },

    setCubeTex : function(urlPosX, urlPosY, urlPosZ, urlNegX, urlNegY, urlNegZ){


        var texWrap = { imgList : new Array(6),
                        imgCount : 0};
        var ctx = this;

        texWrap.imgList[0] = new Image();
        texWrap.imgList[0].onload = function() { ctx._handleTextureLoaded(0, texWrap);}
        texWrap.imgList[0].src = urlPosX;

        texWrap.imgList[1] = new Image();
        texWrap.imgList[1].onload = function() { ctx._handleTextureLoaded(1, texWrap);}
        texWrap.imgList[1].src = urlPosY;

        texWrap.imgList[2] = new Image();
        texWrap.imgList[2].onload = function() { ctx._handleTextureLoaded(2, texWrap);}
        texWrap.imgList[2].src = urlPosZ;

        texWrap.imgList[3] = new Image();
        texWrap.imgList[3].onload = function() { ctx._handleTextureLoaded(3, texWrap);}
        texWrap.imgList[3].src = urlNegX;

        texWrap.imgList[4] = new Image();
        texWrap.imgList[4].onload = function() { ctx._handleTextureLoaded(4, texWrap);}
        texWrap.imgList[4].src = urlNegY;

        texWrap.imgList[5] = new Image();
        texWrap.imgList[5].onload = function() { ctx._handleTextureLoaded(5, texWrap);}
        texWrap.imgList[5].src = urlNegZ;
    },

    _initCube : function(){

        var gl = this.gl;
        var cubeVarray = [];

        var vertices = [
            YFM.Math.Vector.pos(-5000.0, -5000.0,  5000.0),
            YFM.Math.Vector.pos(-5000.0,  5000.0,  5000.0),
            YFM.Math.Vector.pos(5000.0,  5000.0,  5000.0),
            YFM.Math.Vector.pos(5000.0, -5000.0,  5000.0),
            YFM.Math.Vector.pos(-5000.0, -5000.0, -5000.0),
            YFM.Math.Vector.pos(-5000.0,  5000.0, -5000.0),
            YFM.Math.Vector.pos(5000.0,  5000.0, -5000.0),
            YFM.Math.Vector.pos(5000.0, -5000.0, -5000.0)
        ];

        this._quad(vertices, cubeVarray, 1, 0, 3, 2);
        this._quad(vertices, cubeVarray, 2, 3, 7, 6);
        this._quad(vertices, cubeVarray, 3, 0, 4, 7);
        this._quad(vertices, cubeVarray, 6, 5, 1, 2);
        this._quad(vertices, cubeVarray, 4, 5, 6, 7);
        this._quad(vertices, cubeVarray, 5, 4, 0, 1);

        this.cubeVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(cubeVarray, 3), gl.STATIC_DRAW);

        this.cubeSize = cubeVarray.length;
    },

    _quad : function(vertices, pointsArray, a, b, c, d) {
        pointsArray.push(vertices[a]);

        pointsArray.push(vertices[b]);

        pointsArray.push(vertices[c]);

        pointsArray.push(vertices[a]);

        pointsArray.push(vertices[c]);

        pointsArray.push(vertices[d]);
    },

    _makeCubeTex : function(posx, posy, posz, 
                            negx, negy, negz){

        var gl = this.gl;

        if(null !== this.cubeMap){
            gl.deleteTexture(this.cubeMap);
        }

        this.cubeMap = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeMap);


        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X ,0,gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, posx);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X ,0,gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, negx);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y ,0,gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, posy);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y ,0,gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, negy);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z ,0,gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, posz);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z ,0,gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, negz);

        
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    },

    _handleTextureLoaded : function(index, texWrap){
        texWrap.imgCount += 1;
        if(6 == texWrap.imgCount){
            this._makeCubeTex(
                texWrap.imgList[0], texWrap.imgList[1], texWrap.imgList[2], 
                texWrap.imgList[3], texWrap.imgList[4], texWrap.imgList[5]);
        }
    },


}



YFM.WebGL = function(){
	var makeFailHTML = function(msg) {
  		return '' +
		'<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
		'<td align="center">' +
		'<div style="display: table-cell; vertical-align: middle;">' +
		'<div style="">' + msg + '</div>' +
		'</div>' +
		'</td></tr></table>';
	};

	var GET_A_WEBGL_BROWSER = '' +
		'This page requires a browser that supports WebGL.<br/>' +
  		'<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

	var OTHER_PROBLEM = '' +
		"It doesn't appear your computer can support WebGL.<br/>" +
		'<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';
	var setupWebGL = function(canvas, opt_attribs) {
  		function showLink(str) {
            var container = canvas.parentNode;
   			if(container){
                container.innerHTML = makeFailHTML(str);
    	    }
  		};

		if(!window.WebGLRenderingContext){
			showLink(GET_A_WEBGL_BROWSER);
			return null;
  		}

  		var context = create3DContext(canvas, opt_attribs);
		if (!context) {
			showLink(OTHER_PROBLEM);
		}
  		return context;
	};

	var create3DContext = function(canvas, opt_attribs) {
  		var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  		var context = null;
  		for (var ii = 0; ii < names.length; ++ii) {
			try {
				context = canvas.getContext(names[ii], opt_attribs);
			}catch(e){}

			if (context) {
				break;
			}
  		}
		return context;
	}

	var makeShader  = function(gl, vertexShaderText, fragmentShaderText){
		var vertShdr;
	    	var fragShdr;

		vertShdr = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShdr, vertexShaderText);
		gl.compileShader(vertShdr);
		if(!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)){
			var msg = "Vertex shader failed to compile.  The error log is:"
				+ "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
			alert( msg );
			return -1;
		}

		fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
		gl.shaderSource(fragShdr, fragmentShaderText);
		gl.compileShader(fragShdr);
		if(!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)){
			var msg = "Fragment shader failed to compile.  The error log is:"
				+ "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
			alert( msg );
			return -1;
		}

		var program = gl.createProgram();
		gl.attachShader( program, vertShdr );
		gl.attachShader( program, fragShdr );
		gl.linkProgram( program );
	    
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
			var msg = "Shader program failed to link.  The error log is:"
				+ "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
			alert( msg );
			return -1;
	    	}

	    	return program;
	};

	return {
		create3DContext: create3DContext,
		setupWebGL: setupWebGL,
		makeShader: makeShader
	};
}();


YFM.WebGL.Color = function(){

    var hexColorRed = function(color){
        return ((color&0x00FF0000)>>16)/255.0;
    };
    var hexColorGreen = function(color){
        return ((color&0x0000FF00)>>8)/255.0;
    };
    var hexColorBlue = function(color){
        return (color&0x000000FF)/255.0;
    };
    var hexColorAlpha = function(color){
        //注意alpha要用无符号移位
        return ((color&0xFF000000)>>>24)/255.0;
    };

    var getRGBVec = function(hex){
        return YFM.Math.Vector.pos(hexColorRed(hex), hexColorGreen(hex), hexColorBlue(hex));
    };

    var randomHexRGB = function(){
        var c = 0xFF000000;
        var r = Math.floor(255.0*Math.random());
        var g = Math.floor(255.0*Math.random());
        var b = Math.floor(255.0*Math.random());
        return c | r << 16 | g << 8 | b ;
    };


	return {
        hexColorRed : hexColorRed,
    
        hexColorGreen : hexColorGreen,
    
        hexColorBlue : hexColorBlue,
    
        hexColorAlpha : hexColorAlpha,

        randomHexRGB : randomHexRGB,

        getRGBVec : getRGBVec
	};
}();

/*
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback, element) {
           window.setTimeout(callback, 1000/60);
         };
})();*/
window.requestAnimFrame = 
         function(callback, element) {
           window.setTimeout(callback, 1000/30);
         };



YFM.Map.DEFAULT_EXTRUDE_HEIGHT = 16.0;
YFM.Map.DEFAULT_QUICKPOLYGON_HEIGHT = YFM.Map.DEFAULT_EXTRUDE_HEIGHT + 2.0;

function Floor(gl, id, url, deflection, region, index, loadListener)
{
    this.loaded = false;

    this.gl = gl;
	this.id = id;
    if(null != deflection)
        this.deflection = deflection;
    else
        this.deflection = 0;
    this.region = region;
    this.index = index;
    this.loadListener = loadListener;
    this.mapWidth = 0;
    this.mapHeight = 0;

    this.regUnit = /^unit/;
    this.regIcon = /^icon/g;

    this.extrude = new FloorExtrude(gl, YFM.Map.DEFAULT_EXTRUDE_HEIGHT);
    this.quickPolygon = new FloorQuickPolygon(gl, YFM.Map.DEFAULT_QUICKPOLYGON_HEIGHT);

    this.quadTree = null;
    this.icons = null;
    this.models = null;
    this.markers = new FloorMarkers(this.gl, this.region, this);
    this.markersBase = new FloorMarkers(this.gl, this.region, this);
    this.quickIcons = new FloorQuickIcons(this.gl, this.region, this);
    this.dummyUnitList = [];
    this.BBCheck = -1;

    var floor = this;
    if(null === this.loadListener){
        floor._load_svg(floor, url);
    }else{
        //通过url, 获取svg
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload	= function(e){

            if(200 == this.status){
                console.log('-ajax request ok');
                floor._load_svg(floor, this.response);
                floor.loadListener.onLoadFinish(floor);
            }else{
                floor.loadListener.onLoadFailed(floor, this.status);
                console.log('-ajax error:%d', this.status);
            }

        };
        xhr.send();
    }
}


Floor.prototype = {
	constructor : Floor,

    getSize : function(){
        if(this.loaded){
            return this.mapSize;
        }else{
            return null;
        }
    },

    getAspect : function(){
        return {
                w : this.mapWidth,
                h : this.mapHeight};
    },

    isLoaded : function(){
        return this.loaded;
    },

    setVOffset : function(vPitch, i){
        var vOffset = vPitch * i;
        YFM.Math.Matrix.setTranslateZ(this.floorMat, vOffset);
        this.penddingVOffset = null;

        var pts = [];
        pts.push(YFM.Math.Vector.pos(0.0, 0.0, vOffset));
        pts.push(YFM.Math.Vector.pos(this.mapWidth, 0.0, vOffset));
        pts.push(YFM.Math.Vector.pos(this.mapWidth, this.mapHeight, vOffset));
        pts.push(YFM.Math.Vector.pos(0.0, this.mapHeight, vOffset));
        this.planePolygon = new PlanePolygon(pts);

        this.icons = new FloorIcons(this.gl, this.region, this);
        this.iconPlus = new FloorIconPlus(this.gl, this.region, this);

        this.quadTree = new FloorQuadTree(this, 100);
        this.models = new FloorModels(this.gl, this.region, this, vPitch/3.0);

        /*
        var dummyCnt = this.dummyUnitList.length;
        for(var i = 0; i < dummyCnt; i++){
            var unit = this.dummyUnitList[i];
            this.quadTree.insertObject({type:0, text:unit.text}, this.index, unit.x, unit.y, 10);
        }*/
    },

    insertUnit : function(unitObj, x, y){
        if(0 === unitObj.type){
            this.quadTree.insertObject(unitObj, this.index, x, y, 2);
        }else{
            this.icons.insertIcon(unitObj, x, y, 2);
        }
    },

    insertIconPlus : function(iconObj, x, y){
        this.iconPlus.insertIcon(iconObj, x, y, 2);
    },

    insertModel : function(model, azimuth, scale, x, y, height){
        model.setFloor(this);
        model.setModelMatrix(YFM.Math.Matrix.postTranslate(
                                YFM.Math.Matrix.postRotate3d(
                                    YFM.Math.Matrix.postRotate3d(
                                        YFM.Math.Matrix.scale(scale, 0, 0, 0),
                                        90, 1, 0, 0),
                                    azimuth, 0, 0, 1),
                                x, this.mapHeight - y, height));
        return this.models.insertModel(model);
    },

    removeModel : function(id){
        return this.models.removeModel(id);
    },

    searchModel : function(ray, once){

        var result = [];

        if(null != this.models){
            return this.models.rayCheck(ray, once);
        }else{
            return [];
        }
    },

    searchUnit : function(ray, distance, once){
        if(null != this.quadTree){
            return this.quadTree.rayCheck(ray, distance, once);
        }else{
            return [];
        }
    },

    searchIcon : function(ray, distance, once){
        if(null != this.icons){
            return this.icons.rayCheck(ray, distance, once);
        }else{
            return [];
        }
    },

    searchIconPlus : function(ray, once){
        if(null != this.iconPlus){
            return this.iconPlus.rayCheck(ray, once);
        }else{
            return [];
        }
    },

    intersectionLine : function(line){
        if(null == this.planePolygon){
            return 1024;
        }else{
            return this.planePolygon.intersectionLine(line, this.floorMat);
        }
    },

    floorPos2Region : function(x, y){

        var pos, out

        pos = YFM.Math.Vector.pos(x, this.mapHeight - y, 0);
        out = YFM.Math.Matrix.mulVec(this.floorMat, pos);

        return out;
    },

    getFloorMat : function(){
        return this.floorMat;
    },

    frustumCheck : function(frustum){
        if(null == this.quadTree){
            return -1;
        }else{
            return this.quadTree.frustumCheck(frustum);
        }
    },

    renderBase : function(shader, isTouch){
        if(this.loaded){
            shader.setMapHeight(this.mapHeight);
            shader.setFloorMatrix(this.floorMat);
            shader.setModelMatrix(YFM.Math.Matrix.mat());

            /**
             * 由于制图的原因, 底图上有大量重叠的图元, 开深度测试后 效果很差
             * 但可以在此处让深度测试全部通过, 只更新深度缓存, 再绘制标记时再启用深度测试,
             * 让标记可以被底图遮挡
             */
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.ALWAYS);

            shader.drawTriangles(this.trianglesVBO, this.trianglesSize);
            shader.drawLines(this.borderVBO, this.borderSize);

            this.gl.disable(this.gl.DEPTH_TEST);

            /*
            if(isTouch)
                shader.drawLines(this.dummyVBO, 8, 4);*/
        }
    },

    renderExtrude : function(shader, vrMat, light, drawSide){
        if(this.loaded){
            shader.setMapHeight(this.mapHeight);
            shader.setFloorMatrix(this.floorMat);

            /**
             * 当俯视不绘制侧边时, 把顶部的高度降低到贴近地面, 看起来像是正投影的
             */
            if(drawSide){
                shader.setModelMatrix(YFM.Math.Matrix.mat());
            }else{
                shader.setModelMatrix(YFM.Math.Matrix.translate(0, 0, -YFM.Map.DEFAULT_EXTRUDE_HEIGHT+1.0));
            }
            shader.setLightPos(light);

            var vrfMat = YFM.Math.Matrix.mul(vrMat, this.floorMat);
            var tvrfMat = YFM.Math.Matrix.transpose(vrfMat);
            var itvrfMat = YFM.Math.Matrix.invert(tvrfMat);
            shader.setNormalMatrix(itvrfMat);

            this.extrude.render(shader, drawSide);
            this.quickPolygon.render(shader);
        }
    },

    renderModels : function(frustum, shader, vrMat, light){

        this.models.renderModels(frustum, shader, vrMat, light);
    },

    renderIcons : function(frustum, shader){
        this.icons.renderIcons(frustum, shader);
        this.iconPlus.renderIcons(frustum, shader);
    },

    renderMarkers : function(frustum, texShader, geoShader, vrMat, pvrMat){
        this.markers.render(frustum, texShader, geoShader, vrMat, pvrMat);
    },

    renderMarkersBase : function(frustum, texShader, geoShader, vrMat, pvrMat){
        this.markersBase.render(frustum, texShader, geoShader, vrMat, pvrMat);
    },

    renderQuickIcons : function(shader){
        this.quickIcons.render(shader);
    },

    renderUnit : function(frustum, shader){
        if(this.loaded){
            //this.dummyShader = shader;

            if(this.region.drawAllUnit){
                this.quadTree.render(frustum, this._renderUnit, this, 1024);
            }else{
                var containLevel = this.quadTree.getContainLevel(frustum);
                this.quadTree.render(frustum, this._renderUnit, this, containLevel);
            }
            //this.region._drawText("draw check node:"+gDrawCheckNodeCount, 100, 300);
            //this.region._drawText("draw ever node:"+gDrawEverNodeCount, 100, 400);
            //this.region._drawText("containLevel:"+ containLevel, 100, 500);
        }
    },

    /*
    _renderDummy : function(node, color){
        this.dummyShader.drawLines(node.dummyLinesVBO, color, 0, node.dummyLinesSize);
    },*/

    _renderUnit : function(objWrap, cl){
        var sl = cl.region.regionPos2Screen(objWrap.pos);

        var l, t, r, b;

        if(!objWrap.obj.block){
            var ms = cl.region.ctx2d.measureText(objWrap.obj.text);
            objWrap.obj.block = {hw : (ms.width+4.0)/2.0,
                                 hh : cl.region.fontHeight/2.0};
        }

        l = sl[0] - objWrap.obj.block.hw; 
        t = sl[1] - objWrap.obj.block.hh;
        r = sl[0] + objWrap.obj.block.hw;
        b = sl[1] + objWrap.obj.block.hh;

        if(!cl.region.tqct.check(l, t, r, b)){
            cl.region._drawText(objWrap.obj.text, sl[0], sl[1]);
        }
    },

    _load_svg : function(floor, svgStr){
        var gl = floor.gl;
        var tarray = [];
        var barray = [];
        var parser = new DOMParser();
        var doc = parser.parseFromString(svgStr, 'image/svg+xml' );
        floor._read_svg(doc.documentElement, tarray, barray);

        floor.trianglesSize = tarray.length/2;
        floor.borderSize = barray.length/2;

        floor.trianglesVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, floor.trianglesVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(tarray, 3), gl.STATIC_DRAW);

        floor.borderVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, floor.borderVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(barray, 3), gl.STATIC_DRAW);


        floor.floorMat = YFM.Math.Matrix.translate(-floor.mapWidth/2.0, -floor.mapHeight/2.0, 0);

        /*
        if(0 == this.index){
            floor.floorMat = YFM.Math.Matrix.translate(-floor.mapWidth/2.0, -floor.mapHeight/2.0, 0);
        }else{
            floor.floorMat = YFM.Math.Matrix.translate(-floor.mapWidth/2.0-550, -floor.mapHeight/2.0-400, 0);
        }*/
        floor.floorMat = YFM.Math.Matrix.postRotate3d(floor.floorMat, -floor.deflection, 0, 0, 1.0);

        var darray = [];
        var hcolor = 0xFFFF8500;
        var dcolor = YFM.Math.Vector.pos(
            YFM.WebGL.Color.hexColorRed(hcolor), YFM.WebGL.Color.hexColorGreen(hcolor), YFM.WebGL.Color.hexColorBlue(hcolor));
        darray.push(YFM.Math.Vector.pos(0.0, 0.0, 0.0));
        darray.push(dcolor);

        darray.push(YFM.Math.Vector.pos(floor.mapWidth, 0.0, 0.0));
        darray.push(dcolor);

        darray.push(YFM.Math.Vector.pos(floor.mapWidth, 0.0, 0.0));
        darray.push(dcolor);

        darray.push(YFM.Math.Vector.pos(floor.mapWidth, floor.mapHeight, 0.0));
        darray.push(dcolor);

        darray.push(YFM.Math.Vector.pos(floor.mapWidth, floor.mapHeight, 0.0));
        darray.push(dcolor);

        darray.push(YFM.Math.Vector.pos(0.0, floor.mapHeight, 0.0));
        darray.push(dcolor);

        darray.push(YFM.Math.Vector.pos(0.0, floor.mapHeight, 0.0));
        darray.push(dcolor);

        darray.push(YFM.Math.Vector.pos(0.0, 0.0, 0.0));
        darray.push(dcolor);

        floor.dummyVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, floor.dummyVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(darray, 3), gl.STATIC_DRAW);

        floor.extrude.buildExtrude();

        floor.loaded = true;
    },

    _read_svg : function(svg, tarray, barray){
	    this.mapWidth = parseInt(svg.getAttribute("width"));
        this.mapHeight= parseInt(svg.getAttribute("height"));
        this.mapSize = Math.sqrt(this.mapWidth*this.mapWidth, this.mapHeight*this.mapHeight);
        console.log("Floor<%s> read svg width:%d, height:%d", this.id, this.mapWidth, this.mapHeight);

        for(var i=0; i < svg.childNodes.length; i++){
            var child = svg.childNodes.item(i);

            if("g" == child.nodeName){
                this._read_group(child, tarray, barray);
            }
        }
    },

    _read_group : function(group, tarray, barray, isunit){

        var id = group.getAttribute("id");
        var isUnit;

        if(this.regIcon.test(id)){
            return;
        }

        if(isunit){
            isUnit = true;
        }else{
            isUnit = this.regUnit.test(id);
        }

        for(var i=0; i < group.childNodes.length; i++){
            var child = group.childNodes.item(i);
            if(1 == child.nodeType){
                if("g" == child.nodeName)
                    this._read_group(child, tarray, barray, isUnit);
                else
                    this._read_obj(child, tarray, barray, isUnit);
            }
        }
    },

    _pos2 : function(x, y){
        var ret = [];
        ret.push(x);
        ret.push(y);
        ret.push(1.0);
        return ret;
    },

    _multVec3 : function(m, v){

        var ret = [];
        var a, b, c;
        a = v[0];
        b = v[1];
        c = v[2];

        ret.push(a*m[0] + b*m[3] + c*m[6]);
        ret.push(a*m[1] + b*m[4] + c*m[7]);
        ret.push(a*m[2] + b*m[5] + c*m[8]);

        return ret;
    },

    _read_obj : function(obj, tarray, barray, isunit){
        if("rect" == obj.nodeName){
            var fill  = obj.getAttribute("fill");
            var stroke = obj.getAttribute("stroke");
            var width = parseFloat(obj.getAttribute("width"));
            var height= parseFloat(obj.getAttribute("height"));
            var x= parseFloat(obj.getAttribute("x"));
            var y= parseFloat(obj.getAttribute("y"));
            var points = []
            var matrix = this._parseMatrix(obj.getAttribute("transform"));
            if(null != matrix){
                
                var p0 = this._multVec3(matrix, this._pos2(x,        y));
                var p1 = this._multVec3(matrix, this._pos2(x+width,  y));
                var p2 = this._multVec3(matrix, this._pos2(x+width,  y+height));
                var p3 = this._multVec3(matrix, this._pos2(x,        y+height));

                points.push(p0[0]);
                points.push(p0[1]);
                points.push(p1[0]);
                points.push(p1[1]);
                points.push(p2[0]);
                points.push(p2[1]);
                points.push(p3[0]);
                points.push(p3[1]);
            }else{
                points.push(x);
                points.push(y);
                points.push(x+width);
                points.push(y);
                points.push(x+width);
                points.push(y+height);
                points.push(x);
                points.push(y+height);
            }
            this._add_shape(points, fill, stroke, tarray, barray, isunit);
        }else if('polygon' == obj.nodeName){
            var fill  = obj.getAttribute("fill");
            var stroke = obj.getAttribute("stroke");
            var points = obj.getAttribute("points");
            this._add_shape(points, fill, stroke, tarray, barray, isunit);
        }
    },

    _add_shape : function(points, fill, stroke, tarray, barray, isunit){

        var is_stroke;
        var parray = new ArrayList();
        var pts = [];
        var borders = [];
        var r, g, b, hex, stroke_color;

        if(null == stroke){
            is_stroke = false;
        }else{
            is_stroke = 'none' != stroke;
        }
        if(is_stroke){
            stroke = stroke.replace('#','');
            hex = parseInt(stroke, 16);
            r = ( hex >> 16 & 255 ) / 255.0;
            g = ( hex >> 8 & 255 ) / 255.0;
            b = ( hex & 255 ) / 255.0;
            stroke_color = YFM.Math.Vector.vec(r, g, b);
        }

        if(!(points instanceof Array)){
            var tmp = [];
            var pointsArray = points.replace(/\s+/, " ").split(" ");
            for(var i=0; i < pointsArray.length; i++){
                var xy = pointsArray[i].split(",");
                var x = parseFloat(xy[0]);
                var y = parseFloat(xy[1]);
                if(isNaN(x) || isNaN(y))
                    continue;
                tmp.push(x);
                tmp.push(y);
            }
            points = tmp;
        }

        var len = points.length/2;
        var avgx = 0;
        var avgy = 0;
        for(var i = 0; i < len; i++){
            var x = points[i*2 + 0];
            var y = points[i*2 + 1];
            if(isunit){
                avgx += x;
                avgy += y;
            }
            var p = YFM.Math.Vector.vec(x, y, 0.0, 1.0);
            pts.push(p);
            parray.addHigh(p);
            
            if(is_stroke){
                var xn, yn;
                if(i == (len - 1)){
                    xn = points[0];
                    yn = points[1];
                }else{
                    xn = points[(i+1)*2 + 0];
                    yn = points[(i+1)*2 + 1];
                }
                if(isunit){
                    this.extrude.addBorder(YFM.Math.Vector.pos(x, y, 0), YFM.Math.Vector.pos(xn, yn, 0), stroke_color);
                }else{
                    barray.push(YFM.Math.Vector.vec(x, y, 0.0, 1.0));
                    barray.push(stroke_color);
                    barray.push(YFM.Math.Vector.vec(xn, yn, 0.0, 1.0));
                    barray.push(stroke_color);
                }
            }
        }

        /*
        if(isunit){
            avgx /= len;
            avgy /= len;
            this.dummyUnitList.push({text : "A-0"+this.dummyUnitList.length,
                                      x : avgx,
                                      y : avgy});
        }*/


        if(fill && 'none' !== fill){
            fill = fill.replace('#','');

            var hex = parseInt(fill, 16);
            r = ( hex >> 16 & 255 ) / 255.0;
            g = ( hex >> 8 & 255 ) / 255.0;
            b = ( hex & 255 ) / 255.0;
            this._triangulate_cut_ear(r, g, b, pts, parray, tarray, isunit);
        }
    },

    _parseMatrix : function(transform){
        if(null == transform){
            return null;
        }

        var numbers_string = transform.slice(7, -1).split(" ");
        if(numbers_string.length < 6){
            return null;
        }

        var numbers = [];
        for(var i = 0; i < numbers_string.length; i++){
            numbers.push(parseFloat(numbers_string[i]));
        }

        var ret = [];

        ret.push(numbers[0]);
        ret.push(numbers[1]);
        ret.push(0);

        ret.push(numbers[2]);
        ret.push(numbers[3]);
        ret.push(0);

        ret.push(numbers[4]);
        ret.push(numbers[5]);
        ret.push(1);
        
        return ret;
    },

    _clock_wise : function(pts){
        var sum = 0.0;
        var len = pts.length;
        for(var i = 0; i < len; i++){
            sum += (pts[(i+1)%len][0] - pts[i][0])*(pts[(i+1)%len][1] + pts[i][1]);
        }
                                                    
        return sum > 0;
    },

    _is_left_turn : function(p0, p1, p2){
        var cp = (p1[0] - p0[0]) * (p2[1] - p0[1]) -
                    (p2[0] - p0[0]) * (p1[1] - p0[1]);
        return cp > 0;
    },

    _is_right_turn : function(p0, p1, p2){
        var cp = (p1[0] - p0[0]) * (p2[1] - p0[1]) -
                    (p2[0] - p0[0]) * (p1[1] - p0[1]);
        return cp < 0;
    },

    _point_inside : function(a, b, c, p){
        
        var l1 = this._is_left_turn(a, b, p);
        var l2 = this._is_left_turn(b, c, p);
        var l3 = this._is_left_turn(c, a, p);

        if (l1 && l2 && l3) {
        return true;
        }

        var r1 = this._is_right_turn(a, b, p);
        var r2 = this._is_right_turn(b, c, p);
        var r3 = this._is_right_turn(c, a, p);

        if (r1 && r2 && r3) {
        return true;
        }

        return false;
    },

    _add_unit_extrude : function(color, pts, triangles){
    },

    _triangulate_cut_ear: function(r, g, b, pts, parray, varray, isunit){
    	var	  clockwise = this._clock_wise(pts);
        var	  color = YFM.Math.Vector.vec(r, g, b);
        var   triangles = [];
    	var l, v, r;
        
        while(parray.size() > 3){
            
		var li = -1;
		var isear;
		var tryings = 0;
		var cnt;
            
            do{
                tryings ++;
                cnt = parray.size();
                    
                if(tryings >= cnt) {
                    console.log("bad input.");
                    return false;
                }
                    
                li ++;
                l = parray.get(li % cnt);
                v = parray.get((li+1) % cnt);
                r = parray.get((li+2) % cnt);
                    
                isear = this._is_left_turn(l, v, r) ^ clockwise;
                    
                if (isear) {
                    var iter = parray.getIter();
                    while(iter.hasNext()){
                        var p = iter.getNext();
                        if(this._point_inside(l, v, r, p)){
                            isear = false;
                            break;
                        }
                    }
                }
                    
            }while(!isear);
            

            if(isunit){
                triangles.push(l);
                triangles.push(v);
                triangles.push(r);
            }else{
                varray.push(l);
                varray.push(color);
                varray.push(v);
                varray.push(color);
                varray.push(r);
                varray.push(color);
            }

            parray.remove((li+1) % cnt);
        }
        
        if(3 == parray.size()){

            if(isunit){
                triangles.push(parray.get(0));
                triangles.push(parray.get(1));
                triangles.push(parray.get(2));
            }else{
                varray.push(parray.get(0));
                varray.push(color);
                varray.push(parray.get(1));
                varray.push(color);
                varray.push(parray.get(2));
                varray.push(color);
            }
        }

        if(isunit){
            this.extrude.addExtrude(pts, triangles, color);
        }
        
	    return true;
    }
}



function FloorExtrude(gl, height, color)
{
    this.gl = gl;
    this.height = height || 10.0;
    this.color = color;
    this.extrudeTopVBO = null;
    this.extrudeTopSize = 0;
    this.extrudeTopVarray = [];

    this.extrudeSideVBO = null;
    this.extrudeSideSize = 0;
    this.extrudeSideVarray = [];

    this.borderVBO = null;
    this.borderSize = 0;
    this.borderVarray = [];

    this.borderNormal = YFM.Math.Vector.vec(0, 0, 1);

    this.loaded = false;
}

FloorExtrude.prototype = {
	constructor : FloorExtrude,

    render : function(shader, drawSide){

        if(!this.loaded){
            return;
        }

        if(null != this.extrudeTopVBO){
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            

            shader.setLighting(1);

            /**
             * 在竖直观察时, 侧边锯齿比较严重
             * 此时不绘制侧边效果还比较好
             */
            if(drawSide){
                shader.drawTriangles(this.extrudeSideVBO, this.extrudeSideSize);
            }
            shader.drawTriangles(this.extrudeTopVBO, this.extrudeTopSize);


            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.disable(this.gl.CULL_FACE);
        }
        if(null != this.borderVBO){
            if(this.borderSize !== 0){
                shader.setLighting(0);//描边时关闭光照计算
                this.gl.lineWidth(2.0);
                shader.drawLines(this.borderVBO, this.borderSize);
                this.gl.lineWidth(1.0);
            }
        }
    },

    addBorder : function(p0, p1, color){
        p0[2] += this.height;
        p1[2] += this.height;
        this.borderVarray.push(p0);
        this.borderVarray.push(color);
        this.borderVarray.push(this.borderNormal);
        this.borderVarray.push(p1);
        this.borderVarray.push(color);
        this.borderVarray.push(this.borderNormal);
    },
    
    addExtrude : function(pts, triangles, color){

        var i, j, p0, p1;
        var triCnt = triangles.length/3;
        var ptsCnt = pts.length;
        var normal = YFM.Math.Vector.vec(0.0, 0.0, 1.0);

        for(i = 0; i < triCnt; i++){

            var tri = [];
            tri.push(triangles[i*3+0]);
            tri.push(triangles[i*3+1]);
            tri.push(triangles[i*3+2]);

            if(this._clock_wise_tri(tri)){
                this.extrudeTopVarray.push(YFM.Math.Vector.pos(tri[0][0], tri[0][1], tri[0][2]+this.height));
                this.extrudeTopVarray.push(color);
                this.extrudeTopVarray.push(normal);
                this.extrudeTopVarray.push(YFM.Math.Vector.pos(tri[1][0], tri[1][1], tri[1][2]+this.height));
                this.extrudeTopVarray.push(color);
                this.extrudeTopVarray.push(normal);
                this.extrudeTopVarray.push(YFM.Math.Vector.pos(tri[2][0], tri[2][1], tri[2][2]+this.height));
                this.extrudeTopVarray.push(color);
                this.extrudeTopVarray.push(normal);
            }else{
                
                this.extrudeTopVarray.push(YFM.Math.Vector.pos(tri[0][0], tri[0][1], tri[0][2]+this.height));
                this.extrudeTopVarray.push(color);
                this.extrudeTopVarray.push(normal);
                this.extrudeTopVarray.push(YFM.Math.Vector.pos(tri[2][0], tri[2][1], tri[2][2]+this.height));
                this.extrudeTopVarray.push(color);
                this.extrudeTopVarray.push(normal);
                this.extrudeTopVarray.push(YFM.Math.Vector.pos(tri[1][0], tri[1][1], tri[1][2]+this.height));
                this.extrudeTopVarray.push(color);
                this.extrudeTopVarray.push(normal);
            }
        }

        //周围的环带, 根据本身多边形pts的卷绕而决定构造侧边时的卷绕
        if(!this._clock_wise_pts(pts)){
            for(j = 0; j < ptsCnt-1; j++){
                p0 = pts[j];
                p1 = pts[j+1];
                this._putSideQuad(p0, p1, color);
            }
            p0 = pts[j];
            p1 = pts[0];
            this._putSideQuad(p0, p1, color);
        }else{
            for(j = 0; j < ptsCnt-1; j++){
                p0 = pts[j];
                p1 = pts[j+1];
                this._putSideQuad(p1, p0, color);
            }
            p0 = pts[j];
            p1 = pts[0];
            this._putSideQuad(p1, p0, color);
        }
    },

    buildExtrude : function(){
        this.extrudeTopVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.extrudeTopVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, YFM.Math.flatten(this.extrudeTopVarray, 3), this.gl.STATIC_DRAW);
        this.extrudeTopSize = this.extrudeTopVarray.length/3;
        this.extrudeTopVarray = [];

        this.extrudeSideVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.extrudeSideVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, YFM.Math.flatten(this.extrudeSideVarray, 3), this.gl.STATIC_DRAW);
        this.extrudeSideSize = this.extrudeSideVarray.length/3;
        this.extrudeSideVarray = [];

        this.borderVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.borderVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, YFM.Math.flatten(this.borderVarray, 3), this.gl.STATIC_DRAW);
        this.borderSize = this.borderVarray.length/3;
        this.borderVarray = [];

        if(0 !== this.extrudeTopSize ||
            0 !== this.extrudeSideSize ||
            0 !== this.borderSize){
            this.loaded = true;
        }else{
            this.loaded = false;
        }
    }, 

    _clock_wise_tri : function(pts){
        var sum = 0.0;
        sum += (pts[1][0] - pts[0][0])*(pts[1][1] + pts[0][1]);
        sum += (pts[2][0] - pts[1][0])*(pts[2][1] + pts[1][1]);
        sum += (pts[0][0] - pts[2][0])*(pts[0][1] + pts[2][1]);
        return sum > 0;
    },

    _clock_wise_pts : function(pts){
        var sum = 0.0;
        var len = pts.length;
        for(var i = 0; i < len; i++){
            sum += (pts[(i+1)%len][0] - pts[i][0])*(pts[(i+1)%len][1] + pts[i][1]);
        }
                                                    
        return sum > 0;
    },

    _putSideQuad : function(p0, p1, color){

        var q0, q1, q2, q3;
        var normal;
        var tri0 = [];
        var tri1 = [];

        q0 = YFM.Math.Vector.pos(p0[0], p0[1], p0[2]);
        q1 = YFM.Math.Vector.pos(p1[0], p1[1], p1[2]);
        q2 = YFM.Math.Vector.pos(p1[0], p1[1], p1[2]+this.height);
        q3 = YFM.Math.Vector.pos(p0[0], p0[1], p0[2]+this.height);

        tri0.push(q0);
        tri0.push(q2);
        tri0.push(q1);

        tri1.push(q0);
        tri1.push(q3);
        tri1.push(q2);


        /**
         * 计算侧面法向量
         */
        normal = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(YFM.Math.Vector.sub(q1, q0), YFM.Math.Vector.sub(q2, q1)));

        this.extrudeSideVarray.push(tri0[0]);
        this.extrudeSideVarray.push(color);
        this.extrudeSideVarray.push(normal);
        this.extrudeSideVarray.push(tri0[1]);
        this.extrudeSideVarray.push(color);
        this.extrudeSideVarray.push(normal);
        this.extrudeSideVarray.push(tri0[2]);
        this.extrudeSideVarray.push(color);
        this.extrudeSideVarray.push(normal);


        this.extrudeSideVarray.push(tri1[0]);
        this.extrudeSideVarray.push(color);
        this.extrudeSideVarray.push(normal);
        this.extrudeSideVarray.push(tri1[1]);
        this.extrudeSideVarray.push(color);
        this.extrudeSideVarray.push(normal);
        this.extrudeSideVarray.push(tri1[2]);
        this.extrudeSideVarray.push(color);
        this.extrudeSideVarray.push(normal);
    }
}



/*
 * 楼层的IconPlus数据源
 */
function FloorIconPlus(gl, region, floor)
{
    this.gl = gl;
    this.region = region;
    this.floor = floor;
    //this.quadTree = new FloorQuadTree(floor, 100);
    this.icons = [];

    this._makeVBO();
}

FloorIconPlus.prototype = {
	constructor : FloorIconPlus,
    
    insertIcon : function(unitObj, x, y, z){
        //this.quadTree.insertObject(unitObj, this.floor.index, x, y, z);
        var pos = this.floor.floorPos2Region(x, y);
        pos[2] += z;
        var objWrap = { 
                        obj : unitObj, 
                        pos : pos
                        };
        this.icons.push(objWrap);
    },
    rayCheck : function(ray, once){
        return this.quadTree.rayCheck(ray, 0, once);
    },

    renderIcons : function(frustum, shader){
        //this.shader = shader;

        //this.quadTree.render(frustum, this._renderIcon, this, 1024);
        var tex;
        var objWrap;
        var rate;
        var w;
        var h;
        for(var i = 0, cnt = this.icons.length; i < cnt; i++){

            objWrap = this.icons[i];
            tex = this.region.getTexture(objWrap.obj.tex);
            if(tex){
                shader.bindTexture(tex.tex);

                if(!objWrap.quadVBO){
                    rate = objWrap.obj.rate || 1.0;
                    w = tex.w/2.0
                    h = tex.h/2.0;
                    objWrap.quadVBO = this._makeVBO(rate*w, rate*h);
                    objWrap.radiusSQ = w*w + h*h;
                }
                shader.setModelMatrix(YFM.Math.Matrix.translate(objWrap.pos[0], objWrap.pos[1], objWrap.pos[2]));
                shader.drawTriangles(objWrap.quadVBO, 6, 0);
            }
        }
    },

    _renderIcon : function(objWrap, cl){

        var tex = cl.region.getTexture(objWrap.obj.tex);
        if(tex){
            cl.shader.bindTexture(tex.tex);


            if(!objWrap.quadVBO){
                var rate = objWrap.obj.rate || 1.0;
                var w = tex.w/2.0
                var h = tex.h/2.0;
                objWrap.quadVBO = cl._makeVBO(rate*w, rate*h);
                objWrap.radiusSQ = w*w + h*h;
            }
            cl.shader.setModelMatrix(YFM.Math.Matrix.translate(objWrap.pos[0], objWrap.pos[1], objWrap.pos[2]));
            cl.shader.drawTriangles(objWrap.quadVBO, 6, 0);
        }
    },

    _makeVBO : function(w, h){

        var pts = [];
        pts.push(YFM.Math.Vector.pos(-h,    -w,     0));
        pts.push(YFM.Math.Vector.pos(h,     -w,     0));
        pts.push(YFM.Math.Vector.pos(h,     w,      0));
        pts.push(YFM.Math.Vector.pos(-h,    w,      0));

        var texCoords = [];
        texCoords.push(YFM.Math.Vector.vec(0.0, 0.0));
        texCoords.push(YFM.Math.Vector.vec(0.0, 1.0));
        texCoords.push(YFM.Math.Vector.vec(1.0, 1.0));
        texCoords.push(YFM.Math.Vector.vec(1.0, 0.0));

        var quadVarray = [];
        quadVarray.push(pts[0]);
        quadVarray.push(texCoords[0]);
        quadVarray.push(pts[1]);
        quadVarray.push(texCoords[1]);
        quadVarray.push(pts[2]);
        quadVarray.push(texCoords[2]);

        quadVarray.push(pts[0]);
        quadVarray.push(texCoords[0]);
        quadVarray.push(pts[2]);
        quadVarray.push(texCoords[2]);
        quadVarray.push(pts[3]);
        quadVarray.push(texCoords[3]);

        var quadVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quadVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, YFM.Math.flatten(quadVarray, 3), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        return quadVBO;
    }
}



/*
 * 楼层的Icon数据源
 */
function FloorIcons(gl, region, floor)
{
    this.gl = gl;
    this.region = region;
    this.floor = floor;
    this.quadTree = new FloorQuadTree(floor, 100);
    this.iconTex = null;

    var pts = [];
    pts.push(YFM.Math.Vector.pos(-4.0, -4.0, 0));
    pts.push(YFM.Math.Vector.pos(4.0, -4.0, 0));
    pts.push(YFM.Math.Vector.pos(4.0, 4.0, 0));
    pts.push(YFM.Math.Vector.pos(-4.0, 4.0, 0));


    var quadVarray = [];
    var type;
    for(type = 0; type < 16; type++){
        this._calcTexCoords(quadVarray, pts, type);
    }

    this.quadVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadVBO);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, YFM.Math.flatten(quadVarray, 3), this.gl.STATIC_DRAW);
    this.quadBufferSize = quadVarray.length/2;
}

FloorIcons.prototype = {
	constructor : FloorIcons,
    
    insertIcon : function(unitObj, x, y, z){
        this.quadTree.insertObject(unitObj, this.floor.index, x, y, z);
    },
    rayCheck : function(ray, distance, once){
        return this.quadTree.rayCheck(ray, distance, once);
    },

    renderIcons : function(frustum, shader){
        this.shader = shader;

        if(null === this.iconTex){
            var tex = this.region.getTexture("pubIcons");
            if(null != tex){
                this.iconTex = tex.tex;
            }
        }
        if(null !== this.iconTex){
            this.shader.bindTexture(this.iconTex);
            this.quadTree.render(frustum, this._renderIcon, this, 1024);
        }
    },

    _renderIcon : function(objWrap, cl){
        if(null !== cl.iconTex){
            cl.shader.setModelMatrix(YFM.Math.Matrix.translate(objWrap.pos[0], objWrap.pos[1], objWrap.pos[2]));
            cl.shader.drawTriangles(cl.quadVBO, 6, objWrap.obj.type*6);
        }
    },

    _calcTexCoords : function(quadVarray, pts, type){

        var row, col;
        row = Math.floor((type-1) / 8);
        col = (type-1) % 8;

        var texCoords = [];
        texCoords.push(YFM.Math.Vector.pos((1.0/8.0) * (col), (1.0/8.0) * (row)));
        texCoords.push(YFM.Math.Vector.pos((1.0/8.0) * (col), (1.0/8.0) * (row+1)));
        texCoords.push(YFM.Math.Vector.pos((1.0/8.0) * (col+1), (1.0/8.0) * (row+1)));
        texCoords.push(YFM.Math.Vector.pos((1.0/8.0) * (col+1), (1.0/8.0) * (row)));

        quadVarray.push(pts[0]);
        quadVarray.push(texCoords[0]);
        quadVarray.push(pts[1]);
        quadVarray.push(texCoords[1]);
        quadVarray.push(pts[2]);
        quadVarray.push(texCoords[2]);

        quadVarray.push(pts[0]);
        quadVarray.push(texCoords[0]);
        quadVarray.push(pts[2]);
        quadVarray.push(texCoords[2]);
        quadVarray.push(pts[3]);
        quadVarray.push(texCoords[3]);
    }
}


/**
 * 楼层的Marker数据集合
 * 数量少, 变动频繁, 故不用空间树来维护, 直接用一个数组
 * 以后有需求再扩展成空间树实现
 */
function FloorMarkers(gl, region, floor)
{
    this.gl = gl;
    this.region = region;
    this.floor = floor;

    this.markerArray = [];
    this.markerIMinPQ = new IndexMinPQ(32);
    this.markerSorted = [];


    this.light = YFM.Math.Vector.vec(0.5, 0.5, 1.0);
    this.orgPos = YFM.Math.Vector.pos(0, 0, 0);

    if(null === FloorMarkers.prototype.quadVBO){
        this._initQuad(gl);
    }
}

FloorMarkers.prototype = {
	constructor : FloorMarkers,

    quadVBO : null,

    cursor : 0,

    shift : 10000,
    

    /**
     * 效率不高, 但Marker规模很小, 用空间树太浪费
     */
    removeMarker : function(id){
        var marker = null;
        var found = false;
        var tmpArray = [];
        for(var i = 0; i < this.markerArray.length; i++){
            if(id === this.markerArray[i].id){
                found = true;
                marker = this.markerArray[i];
            }else{
                tmpArray.push(this.markerArray[i]);
            }
        }

        if(found){
            this.markerArray = tmpArray;
        }

        return marker;
    },

    /**
     * 用于楼层间移动Marker
     */
    insertMarker : function(marker, x, y){

        var id = FloorMarkers.prototype.cursor * FloorMarkers.prototype.shift + this.floor.index;

        var pos = this.floor.floorPos2Region(x, y);
        pos[2] += marker.height;

        marker.id = id;
        marker.pos = pos;
        this.markerArray.push(marker);
        FloorMarkers.prototype.cursor++;
        return id;
    },

    insertTextureMarker : function(name, x, y, height, offsetX, offsetY, scale){

        var s = scale || 1.0;
        var pos = this.floor.floorPos2Region(x, y);
        pos[2] += height;


        var id = FloorMarkers.prototype.cursor * FloorMarkers.prototype.shift + this.floor.index;
        var marker = {
                        type : 1,
                        id : id,
                        texName : name,
                        tex : null,
                        scale : s,
                        texSize : YFM.Math.Vector.vec(10, 10),
                        envelop : YFM.Math.Vector.vec(0),
                        pos : pos,
                        distSQ : 0,
                        height : height,
                        offsetX : offsetX,
                        offsetY : offsetY
                        };
        this.markerArray.push(marker);
        FloorMarkers.prototype.cursor++;
        return id;
    },

    insertGeometryMarker : function(category, faceColor, size, x, y, height){

        var mesh;

        if(category === YFM.Mesh.CATEGORY_TETRHEDRON){

            mesh = new TetrahedronMesh(this.gl, 0);
        }else if(category === YFM.Mesh.CATEGORY_HEXADEDRON){

            mesh = new HexahedronMesh(this.gl, 0);
        }else if(category === YFM.Mesh.CATEGORY_OCTAHEDRON){
            
            mesh = new OctahedronMesh(this.gl, 0);
        }else if(category === YFM.Mesh.CATEGORY_DODECAHEDRON){

            mesh = new DodecahedronMesh(this.gl, 0);
        }else if(category === YFM.Mesh.CATEGORY_ICOSAHEDRON){

            mesh = new IcosahedronMesh(this.gl, 0);
        }else if(category === YFM.Mesh.CATEGORY_SPHERE){

            /**
             * 用四级曲面细分的正20面体当作球体, 视觉效果比较好
             */
            mesh = new IcosahedronMesh(this.gl, 4);
        }else{
            return null;
        }

        var color = YFM.Math.Vector.pos(YFM.WebGL.Color.hexColorRed(faceColor),
                                YFM.WebGL.Color.hexColorGreen(faceColor),
                                YFM.WebGL.Color.hexColorBlue(faceColor));


        var pos = this.floor.floorPos2Region(x, y);
        pos[2] += height;

        var id = FloorMarkers.prototype.cursor * FloorMarkers.prototype.shift + this.floor.index;
        var marker = {  type : 0,
                        id : id,
                        mesh : mesh,
                        angle : 0.0,
                        bounce :0.0,
                        bstep :size/20.0,
                        size : size,
                        color : color,
                        height : height,
                        pos : pos};
        this.markerArray.push(marker);
        FloorMarkers.prototype.cursor++;
        return id;
    },
    

    render : function(frustum, texShader, geoShader, vrMat, pvrMat){
        var alwaysList = [];
        var m, i, index, distSQ, len;
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        var tvrMat = YFM.Math.Matrix.transpose(vrMat);
        var itvrMat = YFM.Math.Matrix.invert(tvrMat);
        geoShader.setLightPos(this.light);
        geoShader.setNormalMatrix(itvrMat);

        var ivrMat = YFM.Math.Matrix.invert(vrMat);
        var eyePos = YFM.Math.Matrix.mulVec(ivrMat, this.orgPos);


        var iminpqSize = this.markerIMinPQ.getSize();
        if(this.markerArray.length > iminpqSize){
            this.markerIMinPQ.setSize(Math.floor(this.markerArray.length * 1.5));
        }else if(this.markerArray.length < iminpqSize/2){
            this.markerIMinPQ.setSize(this.markerArray.length);
        }else{
            this.markerIMinPQ.clean();
        }

        for(i = 0 ; i < this.markerArray.length; i++){
            m = this.markerArray[i];
            if(frustum.containCheckPoint(m.pos)){
                /**
                 * 几何标记不参与排序, 因为使用zbuff机制, 保证了遮挡
                 */
                if(0 === m.type){
                    this._renderMesh(geoShader, m);
                }else if(1 === m.type){
                    /**
                     * 贴图标记采用画家算法, 在屏幕空间渲染, 需要排序
                     */
                    distSQ = YFM.Math.Vector.distanceSQ(m.pos, eyePos);
                    m.distSQ = distSQ;
                    this.markerIMinPQ.insert(i, distSQ);
                }
            }else{
                if(1 === m.type){
                }
            }
        }


        this.markerSorted = [];
        len = this.markerIMinPQ.getCount();
        for(i = 0; i < len; i++){
            this.markerSorted.push(this.markerIMinPQ.deleteMin());
        }

        for(i = len-1; i >= 0; i--){
            m = this.markerArray[this.markerSorted[i]];
            if(1 === m.type){
                this._renderTex(pvrMat, texShader, m);
            }
        }

        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);
    },

    findMarker : function(screenX, screenY){
        
        var i, index, m, distSQ;

        for(var i = 0; i < this.markerSorted.length; i++){
            m = this.markerArray[this.markerSorted[i]];

            if(this._envelopCheck(m.envelop, screenX, screenY)){
                return {id : m.id,
                        dist : m.distSQ};
            }
        }
        
        return null;
    },

    _envelopCheck : function(envelop, x, y){

        if(x >= envelop[0] && 
                x <= envelop[2] &&
                y >= envelop[1] &&
                y <= envelop[3])
            return true;
        else
            return false;
    },

    _renderMesh : function(shader, marker){

        shader.useProgram();
        var sm = YFM.Math.Matrix.scale(marker.size, 0, 0, 0);
        sm = YFM.Math.Matrix.postRotateXY(sm, marker.angle, 0, 0);
        var modelMat = YFM.Math.Matrix.postTranslate(sm , marker.pos[0], marker.pos[1], marker.pos[2]+marker.bounce);
        shader.setModelMatrix(modelMat);
        shader.setColor(marker.color);

        var meshVBO = marker.mesh.getMeshVBO();
        var meshBufSize = marker.mesh.getMeshBufSize();

        shader.drawTriangles(meshVBO, meshBufSize, 0);

        marker.angle+=1.0;
        marker.bounce += marker.bstep;
        if(marker.bounce > marker.size || marker.bounce < 0){
            marker.bstep = - marker.bstep;
        }
    },

    _renderTex : function(pvrMat, shader, marker){
        /**
         * 如果名字还没有和贴图匹配, 就去贴图池里尝试加载
         */
        if(null === marker.tex){
            var tex = this.region.getTexture(marker.texName);

            if(null !== tex){
                marker.tex = tex.tex;
                marker.texSize[0] = marker.scale*tex.w/2.0;
                marker.texSize[1] = marker.scale*tex.h/2.0;
            }
        }

        if(null !== marker.tex){

            var screenPos = YFM.Math.Matrix.mulVec(pvrMat, marker.pos);
            var hw, hh;

            hw = YFM.gRegion.glCanvas.width/2.0;
            hh = YFM.gRegion.glCanvas.height/2.0;

            screenPos[0] /= screenPos[3];
            screenPos[1] /= screenPos[3];
            screenPos[2] /= screenPos[3];
            screenPos[3] /= screenPos[3];

            screenPos[0] *= hw;
            screenPos[1] *= hh;

            shader.useProgram();
            shader.bindTexture(marker.tex);

            /**
             * 用向量envelop来容纳left, top, right, bottom的范围
             * 这里是每帧绘制时更新evelop, 供点击检测用的
             */
            marker.envelop[0] = hw + screenPos[0] - marker.offsetX - marker.texSize[0];
            marker.envelop[1] = hh - (screenPos[1] + marker.offsetY + marker.texSize[1]);
            marker.envelop[2] = hw + screenPos[0] + marker.offsetX + marker.texSize[0];
            marker.envelop[3] = hh - (screenPos[1] + marker.offsetY - marker.texSize[1]);



            var m = YFM.Math.Matrix.postRotateXY(YFM.Math.Matrix.postTranslate(YFM.Math.Matrix.scaleXYZ(marker.texSize, 0, 0, 0),
                                                                               screenPos[0]-marker.offsetX, 
                                                                               screenPos[1]+marker.offsetY,
                                                                               0),

                                                  this.region.camera.getRoll(),
                                                  screenPos[0],
                                                  screenPos[1]);
                                                                               
            shader.setModelMatrix(m);
            this.gl.depthMask(false);
            shader.drawTriangles(FloorMarkers.prototype.quadVBO, 6, 0);
            this.gl.depthMask(true);
        }
    },

    _initQuad : function(gl){

        var quadVarray = [];
        var pts = [];
        var texCoords = [];
        texCoords.push(YFM.Math.Vector.vec(0.0, 1.0));
        texCoords.push(YFM.Math.Vector.vec(1.0, 1.0));
        texCoords.push(YFM.Math.Vector.vec(1.0, 0.0));
        texCoords.push(YFM.Math.Vector.vec(0.0, 0.0));

        pts.push(YFM.Math.Vector.pos(-1.0, -1.0, 0));
        pts.push(YFM.Math.Vector.pos(1.0, -1.0, 0));
        pts.push(YFM.Math.Vector.pos(1.0, 1.0, 0));
        pts.push(YFM.Math.Vector.pos(-1.0, 1.0, 0));

        quadVarray.push(pts[0]);
        quadVarray.push(texCoords[0]);
        quadVarray.push(pts[1]);
        quadVarray.push(texCoords[1]);
        quadVarray.push(pts[2]);
        quadVarray.push(texCoords[2]);

        quadVarray.push(pts[0]);
        quadVarray.push(texCoords[0]);
        quadVarray.push(pts[2]);
        quadVarray.push(texCoords[2]);
        quadVarray.push(pts[3]);
        quadVarray.push(texCoords[3]);

        FloorMarkers.prototype.quadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, FloorMarkers.prototype.quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(quadVarray, 3), gl.STATIC_DRAW);
    }
}




/*
 * 楼层的Model数据源
 */
function FloorModels(gl, region, floor, vPitch)
{
    this.gl = gl;
    this.region = region;
    this.floor = floor;
    this.vPitch = vPitch;
    this.quadTree = new FloorQuadTree(floor, vPitch);
}

FloorModels.prototype = {
	constructor : FloorModels,

    removeModel : function(id){
        return this.quadTree.removeObject(id);
    },
    
    insertModel : function(model){
        return this.quadTree.insertObjectOBB(model, model.obb);
    },

    rayCheck : function(ray, once){
        return this.quadTree.rayCheckOBB(ray, once);
    },

    renderModels : function(frustum, shader, vrMat, light){
        this.shader = shader;
        this.vrfMat = YFM.Math.Matrix.mul(vrMat, this.floor.getFloorMat());

        shader.setFloorMatrix(this.floor.getFloorMat());
        shader.setLightPos(light);

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);


        this.quadTree.render(frustum, this._renderModel, this, 1024);


        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);
    },

    /*
    _renderDummy : function(cl, node, color){
        cl.shader.setFloorMatrix(YFM.Math.Matrix.mat());
        cl.shader.setModelMatrix(YFM.Math.Matrix.mat());
        cl.shader.drawLines(node.dummyLinesVBO, color, 0, node.dummyLinesSize);
        cl.shader.setFloorMatrix(cl.floor.getFloorMat());
    },*/

    _renderModel : function(objWrap, cl){
        objWrap.obj.render(cl.shader, cl.vrfMat);
    }
}



function FloorQuickIcons(gl, region, floor, height)
{
    this.gl = gl;
    this.region = region;
    this.floor = floor;
    this.height = height || 10.0;

    this.tex = null;
    this.texName = null;

    this.pointsVBO = null;
    this.pointsSize = 0;
    this.pointsVarray = [];
}

FloorQuickIcons.prototype = {
	constructor : FloorQuickIcons,

    render : function(shader){

        if(null != this.pointsVBO){
            /**
             * 如果名字还没有和贴图匹配, 就去贴图池里尝试加载
             */
            if(null === this.tex){
                var tex = this.region.getTexture(this.texName);
                if(null !== tex){
                    this.tex = tex.tex;
                }
            }

            if(null !== this.tex){
                shader.bindTexture(this.tex);
                shader.drawPoints(this.pointsVBO, this.pointsSize);
            }
        }
    },

    setTex : function(texName){
        this.tex = null;
        this.texName = texName;
    },
    
    addPoint : function(x, y){
        var pos = this.floor.floorPos2Region(x, y);
        pos[2] += this.height;
        this.pointsVarray.push(pos);
    },

    clean : function(){

        if(null !== this.pointsVBO){
            this.gl.deleteBuffer(this.pointsVBO);
        }
        this.pointsVBO = null;
        this.pointsSize = 0;
        this.pointsVarray = [];
    },

    buildPoints : function(){

        if(null !== this.pointsVBO){
            this.gl.deleteBuffer(this.pointsVBO);
        }

        this.pointsVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, YFM.Math.flatten(this.pointsVarray, 3), this.gl.STATIC_DRAW);
        this.pointsSize = this.pointsVarray.length;
        this.pointsVarray = [];
    }
}



function FloorQuickPolygon(gl, height)
{
    this.gl = gl;
    this.height = height || 12.0;
    this.quickPolygonVBO = null;
    this.quickPolygonSize = 0;
    this.quickPolygonVarray = [];
    this.loaded = false;
}

FloorQuickPolygon.prototype = {
	constructor : FloorQuickPolygon,

    render : function(shader){

        if(this.loaded){
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            

            shader.setLighting(1);
            shader.drawTriangles(this.quickPolygonVBO, this.quickPolygonSize);


            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.disable(this.gl.CULL_FACE);
        }
    },

    addQuickPolygon : function(pts, colorValue){

        var i, j, p0, p1;
        var ptsCnt = pts.length;
        var normal = YFM.Math.Vector.vec(0.0, 0.0, 1.0);
        var parray = new ArrayList();
        var color = YFM.WebGL.Color.getRGBVec(colorValue);

        for(i = 0; i < ptsCnt; i++){
            parray.addHigh(pts[i]);
        }
        var triangles = this._triangulate_cut_ear(pts, parray);
        if(null === triangles)
            return;
        var triCnt = triangles.length/3;

        for(i = 0; i < triCnt; i++){

            var tri = [];
            tri.push(triangles[i*3+0]);
            tri.push(triangles[i*3+1]);
            tri.push(triangles[i*3+2]);

            if(this._clock_wise_tri(tri)){
                this.quickPolygonVarray.push(YFM.Math.Vector.pos(tri[0][0], tri[0][1], tri[0][2]+this.height));
                this.quickPolygonVarray.push(color);
                this.quickPolygonVarray.push(normal);
                this.quickPolygonVarray.push(YFM.Math.Vector.pos(tri[1][0], tri[1][1], tri[1][2]+this.height));
                this.quickPolygonVarray.push(color);
                this.quickPolygonVarray.push(normal);
                this.quickPolygonVarray.push(YFM.Math.Vector.pos(tri[2][0], tri[2][1], tri[2][2]+this.height));
                this.quickPolygonVarray.push(color);
                this.quickPolygonVarray.push(normal);
            }else{
                this.quickPolygonVarray.push(YFM.Math.Vector.pos(tri[0][0], tri[0][1], tri[0][2]+this.height));
                this.quickPolygonVarray.push(color);
                this.quickPolygonVarray.push(normal);
                this.quickPolygonVarray.push(YFM.Math.Vector.pos(tri[2][0], tri[2][1], tri[2][2]+this.height));
                this.quickPolygonVarray.push(color);
                this.quickPolygonVarray.push(normal);
                this.quickPolygonVarray.push(YFM.Math.Vector.pos(tri[1][0], tri[1][1], tri[1][2]+this.height));
                this.quickPolygonVarray.push(color);
                this.quickPolygonVarray.push(normal);
            }
        }
    },

    buildQuickPolygon : function(){
        if(this.quickPolygonVarray.length <= 0){
            return;
        }
        this.cleanQuickPolygon();
        this.quickPolygonVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quickPolygonVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, YFM.Math.flatten(this.quickPolygonVarray, 3), this.gl.STATIC_DRAW);
        this.quickPolygonSize = this.quickPolygonVarray.length/3;
        this.quickPolygonVarray = [];
        this.loaded = true;
    }, 

    cleanQuickPolygon : function(){
        if(null !== this.quickPolygonVBO){
            var pending = this.quickPolygonVBO;
            var gl = this.gl;
            this.quickPolygonVBO = null;
            this.loaded = false;
            setTimeout(function(){
                gl.deleteBuffer(pending); 
            }, 2000);
        }
    },

    _clock_wise_tri : function(pts){
        var sum = 0.0;
        sum += (pts[1][0] - pts[0][0])*(pts[1][1] + pts[0][1]);
        sum += (pts[2][0] - pts[1][0])*(pts[2][1] + pts[1][1]);
        sum += (pts[0][0] - pts[2][0])*(pts[0][1] + pts[2][1]);
        return sum > 0;
    },

    _clock_wise_pts : function(pts){
        var sum = 0.0;
        var len = pts.length;
        for(var i = 0; i < len; i++){
            sum += (pts[(i+1)%len][0] - pts[i][0])*(pts[(i+1)%len][1] + pts[i][1]);
        }
                                                    
        return sum > 0;
    },

    _is_left_turn : function(p0, p1, p2){
        var cp = (p1[0] - p0[0]) * (p2[1] - p0[1]) -
                    (p2[0] - p0[0]) * (p1[1] - p0[1]);
        return cp > 0;
    },

    _is_right_turn : function(p0, p1, p2){
        var cp = (p1[0] - p0[0]) * (p2[1] - p0[1]) -
                    (p2[0] - p0[0]) * (p1[1] - p0[1]);
        return cp < 0;
    },

    _point_inside : function(a, b, c, p){
        
        var l1 = this._is_left_turn(a, b, p);
        var l2 = this._is_left_turn(b, c, p);
        var l3 = this._is_left_turn(c, a, p);

        if (l1 && l2 && l3) {
        return true;
        }

        var r1 = this._is_right_turn(a, b, p);
        var r2 = this._is_right_turn(b, c, p);
        var r3 = this._is_right_turn(c, a, p);

        if (r1 && r2 && r3) {
        return true;
        }

        return false;
    },

    _triangulate_cut_ear: function(pts, parray){
    	var	  clockwise = this._clock_wise_pts(pts);
        var   triangles = [];
    	var l, v, r;
        
        while(parray.size() > 3){
            
		var li = -1;
		var isear;
		var tryings = 0;
		var cnt;
            
            do{
                tryings ++;
                cnt = parray.size();
                    
                if(tryings >= cnt) {
                    console.log("bad input.");
                    return null;
                }
                    
                li ++;
                l = parray.get(li % cnt);
                v = parray.get((li+1) % cnt);
                r = parray.get((li+2) % cnt);
                    
                isear = this._is_left_turn(l, v, r) ^ clockwise;
                    
                if (isear) {
                    var iter = parray.getIter();
                    while(iter.hasNext()){
                        var p = iter.getNext();
                        if(this._point_inside(l, v, r, p)){
                            isear = false;
                            break;
                        }
                    }
                }
                    
            }while(!isear);
            

            triangles.push(l);
            triangles.push(v);
            triangles.push(r);

            parray.remove((li+1) % cnt);
        }
        
        if(3 == parray.size()){

            triangles.push(parray.get(0));
            triangles.push(parray.get(1));
            triangles.push(parray.get(2));
        }
        
	    return triangles;
    }
}



function FloorTexturePolygon(gl, height)
{
    this.gl = gl;
    this.height = height || 12.0;
    this.quickPolygonVBO = null;
    this.quickPolygonSize = 0;
    this.quickPolygonVarray = [];
    this.loaded = false;
}

FloorTexturePolygon.prototype = {
	constructor : FloorTexturePolygon,

    render : function(shader){

        if(this.loaded){
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            

            shader.setLighting(1);
            shader.drawTriangles(this.quickPolygonVBO, this.quickPolygonSize);


            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.disable(this.gl.CULL_FACE);
        }
    },

    addTexturePolygon : function(pts, uv, colorValue){

        var i, j, p0, p1;
        var ptsCnt = pts.length;
        var normal = YFM.Math.Vector.vec(0.0, 0.0, 1.0);
        var parray = new ArrayList();
        var color = YFM.WebGL.Color.getRGBVec(colorValue);

        for(i = 0; i < ptsCnt; i++){
            parray.addHigh({pos : pts[i],
                            uv : uv[i]});
        }
        var triangles = this._triangulate_cut_ear(pts, parray);
        if(null === triangles)
            return;
        var triCnt = triangles.length/3;
        var vArrray = [];

        for(i = 0; i < triCnt; i++){

            var tri = [];
            tri.push(triangles[i*3+0]);
            tri.push(triangles[i*3+1]);
            tri.push(triangles[i*3+2]);

            if(this._clock_wise_tri(tri)){
                vArrray.push(YFM.Math.Vector.pos(tri[0][0], tri[0][1], tri[0][2]+this.height));
                vArrray.push(color);
                vArrray.push(YFM.Math.Vector.pos(tri[1][0], tri[1][1], tri[1][2]+this.height));
                vArrray.push(color);
                vArrray.push(YFM.Math.Vector.pos(tri[2][0], tri[2][1], tri[2][2]+this.height));
                vArrray.push(color);
            }else{
                vArrray.push(YFM.Math.Vector.pos(tri[0][0], tri[0][1], tri[0][2]+this.height));
                vArrray.push(color);
                vArrray.push(YFM.Math.Vector.pos(tri[2][0], tri[2][1], tri[2][2]+this.height));
                vArrray.push(color);
                vArrray.push(YFM.Math.Vector.pos(tri[1][0], tri[1][1], tri[1][2]+this.height));
                vArrray.push(color);
            }
        }
    },

    buildQuickPolygon : function(){
        if(this.quickPolygonVarray.length <= 0){
            return;
        }
        this.cleanQuickPolygon();
        this.quickPolygonVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quickPolygonVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, YFM.Math.flatten(this.quickPolygonVarray, 3), this.gl.STATIC_DRAW);
        this.quickPolygonSize = this.quickPolygonVarray.length/3;
        this.quickPolygonVarray = [];
        this.loaded = true;
    }, 

    cleanQuickPolygon : function(){
        if(null !== this.quickPolygonVBO){
            var pending = this.quickPolygonVBO;
            var gl = this.gl;
            this.quickPolygonVBO = null;
            this.loaded = false;
            setTimeout(function(){
                gl.deleteBuffer(pending); 
            }, 2000);
        }
    },

    _clock_wise_tri : function(pts){
        var sum = 0.0;
        sum += (pts[1].pos[0] - pts[0].pos[0])*(pts[1].pos[1] + pts[0].pos[1]);
        sum += (pts[2].pos[0] - pts[1].pos[0])*(pts[2].pos[1] + pts[1].pos[1]);
        sum += (pts[0].pos[0] - pts[2].pos[0])*(pts[0].pos[1] + pts[2].pos[1]);
        return sum > 0;
    },

    _clock_wise_pts : function(pts){
        var sum = 0.0;
        var len = pts.length;
        for(var i = 0; i < len; i++){
            sum += (pts[(i+1)%len][0] - pts[i][0])*(pts[(i+1)%len][1] + pts[i][1]);
        }
                                                    
        return sum > 0;
    },

    _is_left_turn : function(p0, p1, p2){
        var cp = (p1[0] - p0[0]) * (p2[1] - p0[1]) -
                    (p2[0] - p0[0]) * (p1[1] - p0[1]);
        return cp > 0;
    },

    _is_right_turn : function(p0, p1, p2){
        var cp = (p1[0] - p0[0]) * (p2[1] - p0[1]) -
                    (p2[0] - p0[0]) * (p1[1] - p0[1]);
        return cp < 0;
    },

    _point_inside : function(a, b, c, p){
        
        var l1 = this._is_left_turn(a, b, p);
        var l2 = this._is_left_turn(b, c, p);
        var l3 = this._is_left_turn(c, a, p);

        if (l1 && l2 && l3) {
        return true;
        }

        var r1 = this._is_right_turn(a, b, p);
        var r2 = this._is_right_turn(b, c, p);
        var r3 = this._is_right_turn(c, a, p);

        if (r1 && r2 && r3) {
        return true;
        }

        return false;
    },

    _triangulate_cut_ear: function(pts, parray){
    	var	  clockwise = this._clock_wise_pts(pts);
        var   triangles = [];
    	var l, v, r;
        
        while(parray.size() > 3){
            
		var li = -1;
		var isear;
		var tryings = 0;
		var cnt;
            
            do{
                tryings ++;
                cnt = parray.size();
                    
                if(tryings >= cnt) {
                    console.log("bad input.");
                    return null;
                }
                    
                li ++;
                l = parray.get(li % cnt);
                v = parray.get((li+1) % cnt);
                r = parray.get((li+2) % cnt);
                    
                isear = this._is_left_turn(l.pos, v.pos, r.pos) ^ clockwise;
                    
                if (isear) {
                    var iter = parray.getIter();
                    while(iter.hasNext()){
                        var p = iter.getNext();
                        if(this._point_inside(l.pos, v.pos, r.pos, p.pos)){
                            isear = false;
                            break;
                        }
                    }
                }
                    
            }while(!isear);
            

            triangles.push(l);
            triangles.push(v);
            triangles.push(r);

            parray.remove((li+1) % cnt);
        }
        
        if(3 == parray.size()){

            triangles.push(parray.get(0));
            triangles.push(parray.get(1));
            triangles.push(parray.get(2));
        }
        
	    return triangles;
    }
}


/**
 * 动画管理类
 */
YFM.Map.ANIM_TYPE_PITCH = 0;
YFM.Map.ANIM_TYPE_LOOKAT = 1;
YFM.Map.ANIM_TYPE_LOOKDISTANCE = 2;
YFM.Map.ANIM_TYPE_LOOKAZIMUTH = 3;
YFM.Map.ANIM_TYPE_ROTATE_MAP = 4;
YFM.Map.ANIM_DEFAULT_FRAME = 12;

function AnimationMgr(region, camera, touchMgr, listener)
{
    this.region = region;
    this.camera = camera;
    this.touchMgr = touchMgr;
    this.listener = listener;
    this.seq = new ArrayList();
    this.mover = new Mover();
    this.mover.setMaxForce(16);
    this.mover.setMaxSpeed(16);
    this.current = null;
}


AnimationMgr.prototype = {
	constructor : AnimationMgr,

    update : function(){
        if(null === this.current){
            this.current = this.seq.removeHigh();

            if(null !== this.current){
                this.touchMgr.setEnable(false);
                this.listener.onAnimStart(this.current);
            }
        }

        if(null !== this.current){


            var t = this.current.step/this.current.frame;
            var lerp = YFM.Math.lerp;

            this.current.step += 1;
            switch(this.current.type){
                
            case YFM.Map.ANIM_TYPE_PITCH:
                var pitch;
                if(this.current.step == this.current.frame){
                    pitch = this.current.to;
                }else{
                    pitch = lerp(this.current.from, this.current.to, t);
                }

                this.camera.setPitch(pitch);

                if(this.current.overlook){
                    if(0 !== pitch){
                        this.region._onOverlook(false);
                        this.current.overlook = false;
                        this.touchMgr._setOverlook(false);
                    }
                }else{
                    if(0 === pitch){
                        this.region._onOverlook(true);
                        this.current.overlook = true;
                        this.touchMgr._setOverlook(true);
                    }
                }
                break;

            case YFM.Map.ANIM_TYPE_LOOKDISTANCE:
                var offset;
                if(this.current.step == this.current.frame){
                    offset = this.current.to;
                }else{
                    offset = lerp(this.current.from, this.current.to, t);
                }
                this.camera.setLookOffset(0, 0, offset);
                /**
                 * 同步触摸偏移和相机偏移
                 */
                this.camera.resetLookOffsetTan();

                break;

            case YFM.Map.ANIM_TYPE_LOOKAZIMUTH:
                var azimuth;
                if(this.current.step == this.current.frame){
                    azimuth = this.current.to;
                }else{
                    azimuth = lerp(this.current.from, this.current.to, t);
                }
                this.camera.setAzimuth(azimuth);
                break;

            case YFM.Map.ANIM_TYPE_ROTATE_MAP:
                var rotate = this.current.to/this.current.frame;
                this.region.postRotate(rotate);
                break;

            case YFM.Map.ANIM_TYPE_LOOKAT:
                if(1 == this.current.step){
                    this.mover.setLocation(
                        this.current.from[0],
                        this.current.from[1],
                        this.current.from[2]);
                    /**
                     * 为避免触摸操作把镜头对歪了, 重置一下切向偏移
                     */
                    this.camera.resetLookOffsetTan();
                }

                if(this.mover.arrive(this.current.to, 2.0)){
                    this.current.step = this.current.frame;
                    this.mover.setLocation(
                        this.current.to[0],
                        this.current.to[1],
                        this.current.to[2]);
                }else{
                    this.mover.update();
                }
                var curLoc = this.mover.getLocation();
                this.camera.setLookAt(curLoc[0], curLoc[1], curLoc[2]);
                break;

            case YFM.Map.ANIM_TYPE_MERGE:

                if(this.current.pitch){
                    var pitch;
                    if(this.current.step == this.current.frame){
                        pitch = this.current.pitch.to;
                    }else{
                        pitch = lerp(this.current.pitch.from, this.current.pitch.to, t);
                    }
                    this.camera.setPitch(pitch);
                    if(this.current.overlook){
                        if(0 !== pitch){
                            this.region._onOverlook(false);
                            this.current.overlook = false;
                            this.touchMgr._setOverlook(false);
                        }
                    }else{
                        if(0 === pitch){
                            this.region._onOverlook(true);
                            this.current.overlook = true;
                            this.touchMgr._setOverlook(true);
                        }
                    }
                }

                if(this.current.distance){
                    var offset;
                    if(this.current.step == this.current.frame){
                        offset = this.current.distance.to;
                    }else{
                        offset = lerp(this.current.distance.from, this.current.distance.to, t);
                    }
                    this.camera.setLookOffset(0, 0, offset);
                    /**
                     * 同步触摸偏移和相机偏移
                     */
                    this.camera.resetLookOffsetTan();
                }

                if(this.current.azimuth){
                    var azimuth;
                    if(this.current.step == this.current.frame){
                        azimuth = this.current.azimuth.to;
                    }else{
                        azimuth = lerp(this.current.azimuth.from, this.current.azimuth.to, t);
                    }
                    this.camera.setAzimuth(azimuth);
                }

                if(this.current.lookAt){
                    var curLoc;
                    if(this.current.step == this.current.frame){
                        curLoc = this.current.lookAt.to;
                    }else{
                        var Vector = YFM.Math.Vector;
                        curLoc = Vector.add(this.current.lookAt.from, 
                            Vector.scale(this.current.lookAt.direction, this.current.step*this.current.lookAt.interval));
                    }
                    this.camera.setLookAt(curLoc[0], curLoc[1], curLoc[2]);
                }
                break;

                ///
            }

            if(this.current.step >= this.current.frame){
                this.listener.onAnimFinish(this.current);
                this.current = null;
                this.touchMgr.setEnable(true);
            }
        }
    },

    /**
     * 动画调整俯仰
     * 有效范围0-45
     */
    animPitch : function(pitch, tag, frame, exclusive){
        var p = YFM.Math.clamp(pitch, 0, 45);
        var t = tag || null;
        var f = frame || YFM.Map.ANIM_DEFAULT_FRAME;
        var e = exclusive || false;

        /**
         * 如果标志为独占, 先清动画序列, 和当前的动画
         */
        if(e){
            this.seq.clean();
            if(null !== this.current){
                this.listener.onAnimCancel(this.current);
            }
            this.current = null;
        }

        var anim = new Animation(t, YFM.Map.ANIM_TYPE_PITCH, f);

        anim.from = this.camera.getPitch();
        /**
         * 对内相机模型其实用的是负的俯仰角, 对外部隐藏这种不必要的细节
         */
        anim.to = -p;
        anim.overlook = anim.from === 0;

        this.seq.addLow(anim);
    },

    animLookDistance : function(distance, tag, frame, exclusive){

        /*
        var d = YFM.Math.clamp(distance, 
            this.touchMgr.getViewOffsetMin(),
            this.touchMgr.getViewOffsetMax());
            */
        var d = distance;
        var t = tag || null;
        var f = frame || YFM.Map.ANIM_DEFAULT_FRAME;
        var e = exclusive || false;

        /**
         * 如果标志为独占, 先清动画序列, 和当前的动画
         */
        if(e){
            this.seq.clean();
            if(null !== this.current){
                this.listener.onAnimCancel(this.current);
            }
            this.current = null;
        }

        var anim = new Animation(t, YFM.Map.ANIM_TYPE_LOOKDISTANCE, f);

        anim.from = this.camera.getLookOffsetNormal();
        /**
         * 对内相机模型其实用的是负的法向偏移, 对外部隐藏这种不必要的细节
         */
        anim.to = -d;

        this.seq.addLow(anim);
    },

    animLookAzimuth : function(deg, tag, absolute, frame, exclusive){

        var d = YFM.Math.deg2Radian(deg);
        var t = tag || null;
        var a = absolute || false;
        var f = frame || YFM.Map.ANIM_DEFAULT_FRAME;
        var e = exclusive || false;

        /**
         * 如果标志为独占, 先清动画序列, 和当前的动画
         */
        if(e){
            this.seq.clean();
            if(null !== this.current){
                this.listener.onAnimCancel(this.current);
            }
            this.current = null;
        }

        var anim = new Animation(t, YFM.Map.ANIM_TYPE_LOOKAZIMUTH, f);

        anim.from = this.camera.getAzimuth();

        if(a){
            anim.to = -d;
        }else{
            anim.to = anim.from-d;
        }

        this.seq.addLow(anim);
    },

    animRotateMap : function(deg, tag, exclusive){
        var t = tag || null;
        var e = exclusive || false;

        /**
         * 如果标志为独占, 先清动画序列, 和当前的动画
         */
        if(e){
            this.seq.clean();
            if(null !== this.current){
                this.listener.onAnimCancel(this.current);
            }
            this.current = null;
        }

        var anim = new Animation(t, YFM.Map.ANIM_TYPE_ROTATE_MAP, 24);

        anim.from = 0;
        anim.to = deg;


        this.seq.addLow(anim);
    },

    /**
     * 动画移动观察位置
     */
    animLookAt : function(worldLoc, tag, exclusive){
        var t = tag || null;
        var e = exclusive || false;

        /**
         * 如果标志为独占, 先清动画序列, 和当前的动画
         */
        if(e){
            this.seq.clean();
            if(null !== this.current){
                this.listener.onAnimCancel(this.current);
            }
            this.current = null;
        }

        var anim = new Animation(t, YFM.Map.ANIM_TYPE_LOOKAT, 1024);

        anim.from = this.camera.getLookAt();
        anim.to = worldLoc;

        this.seq.addLow(anim);
    },

    animMerge : function(animMerge, tag, frame, exclusive){

        var t = tag || null;
        var f = frame || 24;
        var e = exclusive || false;

        /**
         * 如果标志为独占, 先清动画序列, 和当前的动画
         */
        if(e){
            this.seq.clean();
            if(null !== this.current){
                this.listener.onAnimCancel(this.current);
            }
            this.current = null;
        }

        var anim = new Animation(t, YFM.Map.ANIM_TYPE_MERGE, f);

        if(animMerge.pitch){
            anim.pitch = {};
            anim.pitch.from = this.camera.getPitch();
            anim.pitch.to = -YFM.Math.clamp(animMerge.pitch, 0, 45);
            anim.pitch.overlook = anim.from === 0;
        }

        if(animMerge.distance){
            anim.distance = {};
            anim.distance.from = this.camera.getLookOffsetNormal();
            anim.distance.to = -animMerge.distance;
        }

        if(animMerge.azimuth){
            anim.azimuth = {};
            anim.azimuth.from = this.camera.getAzimuth();
            if(anim.abs){
                anim.azimuth.to = - YFM.Math.deg2Radian(animMerge.azimuth);
            }else{
                anim.azimuth.to = anim.azimuth.from - YFM.Math.deg2Radian(animMerge.azimuth);
            }
        }

        if(animMerge.lookAt){
            var Vector = YFM.Math.Vector;
            anim.lookAt = {};
            anim.lookAt.from = this.camera.getLookAt();
            anim.lookAt.to = animMerge.lookAt;
            anim.lookAt.direction = Vector.normalize(Vector.sub(anim.lookAt.to, anim.lookAt.from));
            anim.lookAt.interval = Vector.distance(anim.lookAt.from, anim.lookAt.to)/f;
            /**
             * 为避免触摸操作把镜头对歪了, 重置一下切向偏移
             */
            this.camera.resetLookOffsetTan();
        }

        this.seq.addLow(anim);
    },


}


function Animation(tag, type, frame){
    this.tag = tag;
    this.type = type;
    this.frame= frame;
    this.step = 0;
}




/**
 * 代表3D场景, 是本库渲染的主体
 */
function Region(id, glCanvas, txtCanvas, listener, routeSize)
{

	this.id = id;

    this.matRegion = YFM.Math.Matrix.mat();

    this.glCanvas = glCanvas;
    this.gl = YFM.WebGL.setupWebGL(glCanvas);
    this.gl.viewport( 0, 0, glCanvas.width, glCanvas.height );
    this.gl.clearColor(0.9, 0.9, 0.9, 1.0 );

    
    /**
     * 本库单实例时用于调试输出的全局变量
     */
    YFM.gGL = this.gl;

    this.hh = glCanvas.height/2.0;
    this.hw = glCanvas.width/2.0;
    this.tqct = new TextBlockQuickCheckTree(txtCanvas.width, txtCanvas.height);

    this.txtCanvas = txtCanvas;
    this.ctx2d = txtCanvas.getContext("2d");
    //this.ctx2d.font = "24px Arial";
    this.ctx2d.font = "24px Microsoft YaHei";
    this.ctx2d.fillStyle = '#FF0000';
    this.ctx2d.textAlign = "center";
    this.ctx2d.textBaseline = "middle";
    this.fontHeight = this._determineFontHeight("font: " + this.ctx2d.font + ";");

    this.camera = new DeviceOrientationCamera();
    this.camera.setPerspective(60, glCanvas.width/glCanvas.height, 60, 20000);
    this.camera.setLookOffset(0, 0, -400);
    this.orthMat = YFM.Math.Matrix.orthographic(-glCanvas.width/2.0, glCanvas.width/2.0, -glCanvas.height/2.0, glCanvas.height/2.0, -1, 1);

    this.renderParam = {
                        projMat : null,
                        viewMat : null,
                        vrMat : null,
                        bivrMat : null,
                        pvrMat : null};


    this.listener = listener;
    this.routeSize = routeSize | 10.0;
    this.floors = []
    this.baseColorShader = new BaseColorProgram(this.gl);
    this.basePhongShader = new BasePhongProgram(this.gl);
    this.selectColorShader = new SelectColorProgram(this.gl);
    this.regionPhongShader = new RegionPhongProgram(this.gl);
    this.billboardIconShader = new BillboardIconProgram(this.gl);
    this.marker2DShader = new Marker2DProgram(this.gl);
    this.color2DShader = new Color2DProgram(this.gl);
    this.pointSpiritShader = new PointSpiritProgram(this.gl);
    this.panoramaShader = new RawPanoramaProgram(this.gl);
    this.modelPhongShader = new ModelPhongProgram(this.gl);
    this.ssrShader = new SSRProgram(this.gl, this);
    this.maxSize = 0;
    this.vPitch = 0;
    this.displayFloorIndex = -1;
    this.azimuth = 0;

    var self = this;
    this.touchMgr = new RegionTouchMgr(this.camera, txtCanvas, this.ctx2d, this, { 
        onClick : function(x, y){
            if(self.listener && self.listener.onClick){
                self.listener.onClick(x, y);
            }
        },

        onDClick : function(x, y){
            if(self.listener && self.listener.onDClick){
                self.listener.onDClick(x, y);
            }
        },

        on2FClick : function(x, y){
            if(self.listener && self.listener.on2FClick){
                self.listener.on2FClick(x, y);
            }
        },

        onLongPressUp : function(x, y){
            if(self.listener && self.listener.onLongPressUp){
                self.listener.onLongPressUp(x, y);
            }
        },

        onScroll : function(x, y){
            if(self.listener && self.listener.onScroll){
                self.listener.onScroll(x, y);
            }
        }
    });
    this.animMgr = new AnimationMgr(this, this.camera, this.touchMgr, {
            onAnimStart : function(anim){
                if(self.listener)
                    self.listener.onAnimStart(anim);
            },

            onAnimFinish : function(anim){
                if(self.listener)
                    self.listener.onAnimFinish(anim);

                if("SetStatusNavigate" === anim.tag){
                    self.status = YFM.Map.STATUS_NAVIGATE;
                    self.camera.resetLookOffsetTan();
                    self.locMarker.updateLocation(true);

                    var ns = self.getNaviStatus();
                    var rz = YFM.Math.Matrix.eulerParamExtractZ(self.matRegion);
                    self.preTraceAzimuth = ns.azimuth + rz;
                }
            },

            onAnimCancle : function(anim){
                if(self.listener)
                    self.listener.onAnimCancel(anim);
            }
    });
    this.panorama = new RawPanorama(this.gl, this);
    this.locMarker = new RegionLocMarker(this.gl, 20, 0x8052A629, 0xEE000000, this);
    //this.route = new RegionRoute(this.gl, this.routeSize, 0xFF00BAFF, 0xFF00BAFF, this);
    this.route = new SSRoute(this);
    this.frustum = new FrustumWorldSpace();


    this.texturePool = new TexturePool(this.gl);

    this.extrudeLightNormal = YFM.Math.Vector.normalize(YFM.Math.Vector.vec(0.5, 0.5, 1.0));
    this.extrudeLightOver = YFM.Math.Vector.normalize(YFM.Math.Vector.vec(0.0, 1.0, 1.0));
    this.extrudeLight = this.extrudeLightNormal;
    this.modelLight = YFM.Math.Vector.normalize(YFM.Math.Vector.vec(-1.0, -1.0, 1.0));

    this.overlook = false;
    this.drawUnitTextAlways = false;

    this.drawAllUnit = false;
    this.preTraceAzimuth = 0.0;


    this.status = YFM.Map.STATUS_TOUCH;
    if(this.listener){
        this.listener.onStatusChange(this.status);
    }
}

Region.prototype = {
	constructor : Region, 

    /**
     * 设置清屏色0xRRGGBB
     */
    setClearColor : function(hex){
        this.clearColor = YFM.WebGL.Color.getRGBVec(hex);
    },

    /**
     * 设置方位角(度)
     */
    setAzimuth : function(value){
        this.azimuth = value;
    },

    setZoomConstraint : function(min, max){
        this.touchMgr.setZoomMin(min);
        this.touchMgr.setZoomMax(max);
    },

    setDrawAllUnit : function(value){
        this.drawAllUnit = value;
    },

    setTouchEnable : function(value){
        this.touchMgr.setEnable(value);
    },

    /**
     * 发动雷达波
     */
    locateLaunch : function(){
        this.locMarker.locateLaunch();
    },

    /**
     * 设置定位标记的参数
     * texName          定位标记贴图名
     * waveColor        雷达波颜色ARBG十六进制格式
     * waveMax          雷达波最大半径
     * waveMin          雷达波最小半径
     */
    setLocMarkerParam : function(texName, waveColor, waveMax, waveMin){
        this.locMarker.set2DMarkerParam(texName, waveColor, waveMax, waveMin);
    },

    setAlwaysDrawUnit : function(value){
        this.drawUnitTextAlways = value;
    },

    setUIScaleRate : function(rate){

        this.touchMgr.setUIScaleRate(rate);
    },

    /**
     * 获取Region Id
     */
	getId : function(){
		return this.id;
	},

    /**
     * 开始渲染, 此后进入渲染循环
     */
    startRender : function(){
        YFM.gRegion = this;
        YFM.gRegion._grender();
    },

    /**
     * 设置显示某楼, 会把观察目标设为该楼地图中心
     * 只会渲染此楼地图
     */
    displayFloor : function(index){
        if(index >= 0 || index < this.floors.length){
            this.displayFloorIndex = index;
            var aspect = this.floors[index].getAspect();
            this.lookAtMapLoc(index, aspect.w/2.0, aspect.h/2.0);
        }else{
            throw new Error("Rgeion.js [displayFloor] Floor index out of range:"+index);
        }
    },

    /**
     * 设置渲染所有可见楼层
     */
    displayRegion : function(){
        this.displayFloorIndex = -1;
    },


    /**
     *  fontStr 为"24px Microsoft YaHei"这样的格式
     */
    setFontType : function(fontStr){
        this.ctx2d.font = fontStr;
        this.fontHeight = this._determineFontHeight("font: " + this.ctx2d.font + ";");
    },

    /**
     * colorStr 为'#FF0000'这样的格式
     */
    setFontColor : function(colorStr){
        this.ctx2d.fillStyle = colorStr;
    },

    /**
     * 设置Region的状态
     */
    setStatus : function(s){
        
        /**
         * 和现在状态一样的忽略
         */
        if(s === this.status){
            return;
        }

        switch(s){
        case YFM.Map.STATUS_TOUCH:

            if(YFM.Map.STATUS_SENSOR === this.status){
                this.camera.disconnect();
            }
            if(YFM.Map.STATUS_NAVIGATE === this.status){
                this.traceAnimFlag = false;
            }
            this.status = s;
            break;

        case YFM.Map.STATUS_SENSOR:
            if(YFM.Map.STATUS_SENSOR !== this.status){
                this.camera.connect();
            }
            if(YFM.Map.STATUS_NAVIGATE === this.status){
                this.traceAnimFlag = false;
            }
            this.status = s;
            this.camera.resetLookOffsetTan();
            this.locMarker.updateLocation();
            break;

        case YFM.Map.STATUS_TRACE:
            if(YFM.Map.STATUS_SENSOR === this.status){
                this.camera.disconnect();
            }
            if(YFM.Map.STATUS_NAVIGATE === this.status){
                this.traceAnimFlag = false;
            }
            this.status = s;
            this.camera.resetLookOffsetTan();
            this.locMarker.updateLocation();
            break;

        case YFM.Map.STATUS_NAVIGATE:
            var fl = this.getFloorLoc();
            var ns = this.getNaviStatus();
            if(fl.floor >= 0 && ns.validate){

                if(YFM.Map.STATUS_SENSOR === this.status){
                    this.camera.disconnect();
                }

                var floor = this.floors[0];
                var rl = floor.floorPos2Region(fl.x, fl.y);
                var wl = YFM.Math.Matrix.mulVec(this.matRegion, rl);
                var lookAzimuth = this.camera.getAzimuth();
                var rz = YFM.Math.Matrix.eulerParamExtractZ(this.matRegion);
                var lastAngle = -ns.azimuth-rz+lookAzimuth;

                this.animMgr.animMerge({
                                azimuth : YFM.Math.radian2Deg(this._clampMinorArc(lastAngle)),
                                lookAt : wl,
                                },
                                "SetStatusNavigate",
                                32
                                );

                                /*
                this.status = s;
                this.camera.resetLookOffsetTan();
                this.locMarker.updateLocation();*/
            }
            break;
        }

        if(this.listener){
            this.listener.onStatusChange(this.status);
        }
    },

    /**
     * 获取现在的状态
     */
    getStatus : function(){
        return this.status;
    },


    /**
     * floorList是{id, url, deflection}
     * 的数组
     */
    addFloorsURL : function(floorList){
        var floor, cnt, i;
        var self = this;
        var loadListener = {
            onLoadFinish : function(floor){
                var allLoaded = true;
                for(var i = 0; i < self.floors.length; i++){
                    if(!self.floors[i].isLoaded()){
                        allLoaded = false;
                        break;
                    }
                }

                if(self.listener){
                    self.listener.onLoadFinish(floor.id, floor.index);    

                    if(allLoaded){
                        self._restructure();
                        self.listener.onAllFloorLoadFinish();
                    }
                }

                if(allLoaded){
                    self.touchMgr.onRegionLoadFinish();
                }
            },

            onLoadFailed : function(floor){

                if(this.listener){
                    this.listener.onLoadFailed(floor.id, floor.index);
                }
            }
        };

        cnt = floorList.length;
        for(i = 0; i < cnt; i++){
            floor = floorList[i];
            this.floors.push(new Floor(this.gl, floor.id, floor.url, floor.deflection, this, i, loadListener));
        }
    },

    /**
     * floorList是{id, svg, deflection}
     * 的数组
     */
    addFloorsSVG : function(floorList){
        var floor, cnt, i;

        cnt = floorList.length;
        for(i = 0; i < cnt; i++){
            floor = floorList[i];
            this.floors.push(new Floor(this.gl, floor.id, floor.svg, floor.deflection, this, i, null));
        }
        this._restructure();
        this.listener.onAllFloorLoadFinish();
        this.touchMgr.onRegionLoadFinish();
    },

    /**
     * 添加贴图到贴图池
     */
    addTexture : function(name, url){
        this.texturePool.addTexture(name, url);
    },

    addTextureMip : function(name, url){
        this.texturePool.addTextureMip(name, url);
    },

    /**
     * 从贴图迟获取贴图
     * 返回null代表, 贴图池中无对应的贴图, 或还未加载完成
     * 否则返回{tex : texObj, w : width, h : height}
     */
    getTexture : function(name){
        return this.texturePool.getTexture(name);
    },

    /**
     * 获取Region的楼层数
     */
    getFloorCount : function(){
        return this.floors.length;
    },


    /**
     * 获取楼层地图尺寸
     */
    getFloorAspect : function(floorIndex){
        return this.floors[floorIndex].getAspect(); 
    },

    /**
     * 获取位置标记关于楼层的距离
     * { floor : -1, x : 0, y : 0};
     */
    getFloorLoc : function(){
        return this.locMarker.getFloorLoc();
    },
    
    /**
     * 获取位置标记关于Region的3D位置
     * 为一3D齐次坐标向量
     */
    getRegionLoc : function(){
        return this.locMarker.getRegionLoc();
    },


    /**
     * 设置是否进行导航投影
     */
    setNavigateProj : function(value){
        this.route.setUpdateNSFlag(value);
    },

    /**
     * 获取导航状态
     * {
     *   validate : false,                               //导航状态是否有效, 一切后续数据有效的先决条件
     *   projDist : 0.0,                                 //真实位置到投影位置的距离
     *   goalDist : 0.0,                                 //投影位置到终点的线上距离
     *   serialDist : 0.0,                               //前方合并的连续线上直行距离
     *   nextSerialDist : 0.0,                           //拐弯后下一段合并的连续线上直行距离
     *   azimuth : 0.0,                                  //当前段方向
     *   sug : YFM.Map.Navigate.Suggestion.NONE,         //根据当前位置和设备方向作出的建议
     *   nextSug : YFM.MAP.Navigate.NextSuggestion.NONE  //根据当前连续直行段和下段连续直行段的空间关系作出的建议
     *   }
     */
    updateNaviStatus : function(floorLoc, regionLoc){
        this.route.updateNaviStatus(floorLoc, regionLoc);
    },

    /**
     * 清除定位标记的位置
     */
    cleanLocation :function(){
        this.locMarker.cleanLocation();
    },

    /**
     * 设置定位标记的位置, 无动画
     */
    setLocation : function(floorIndex, x, y){
        this.locMarker.setLocation(floorIndex, x, y);
    },

    postTranslate : function(x, y){
        this.touchMgr.postTranslate(x, y);
    },

    postRotate : function(deg){
        this.touchMgr.postRotate(deg);
    },

    /**
     * 设置定位标记的位置, 动画
     */
    animTo : function(floorIndex, x, y){
        this.locMarker.animTo(floorIndex, x, y);
    },
    
    /**
     * 看向某地图位置
     */
    lookAtMapLoc : function(floor, x, y){
        var pos = this.floors[floor].floorPos2Region(x, y);
        
        this.lookAtRegionLoc(pos[0], pos[1], pos[2]);
    },

    /**
     * 看向某世界坐标位置
     */
    lookAtWorldLoc : function(x, y, z){
        this.camera.resetLookOffsetTan();
        this.camera.setLookAt(x, y, z);
    },

    /**
     * 看向某Region坐标位置
     */
    lookAtRegionLoc : function(x, y, z){
        var rl = YFM.Math.Vector.pos(x, y, z);
        var wl = YFM.Math.Matrix.mulVec(this.matRegion, rl);

        this.camera.resetLookOffsetTan();
        this.camera.setLookAt(wl[0], wl[1], wl[2]);
    },

    animRotateMap : function(deg){
        this.animMgr.animRotateMap(deg);
    },

    /**
     * 镜头动画: 看向某位置
     * tag, 为可选参数, 将在动画通知回调中传给监听者
     */
    animLookAt : function(floor, x, y, tag){
        var rl = this.floors[floor].floorPos2Region(x, y);
        var wl = YFM.Math.Matrix.mulVec(this.matRegion, rl);
        this.animMgr.animLookAt(wl, tag);
    },

    /**
     * 镜头动画: 看向某位置(世界坐标)
     * tag, 为可选参数, 将在动画通知回调中传给监听者
     */
    animLookAtWorld : function(wl, tag){
        this.animMgr.animLookAt(wl, tag);
    },

    /**
     * 镜头动画: 改变观察距离
     * tag, 为可选参数, 将在动画通知回调中传给监听者
     */
    animLookDistance : function(distance, tag){

        this.animMgr.animLookDistance(distance, tag);
    },

    /**
     * 获取摄像机离观察点的距离
     */
    getLookDistance : function(){
        return -this.camera.getLookOffsetNormal();
    },

    /**
     * 镜头动画: 改变方向角度
     * tag, 为可选参数, 将在动画通知回调中传给监听者
     */
    animLookAzimuth : function(deg, tag){

        this.animMgr.animLookAzimuth(deg, tag);
    },

    /**
     * 镜头动画: 改变俯仰角度
     * pitch的范围为:
     * 0----竖直往下看
     * 45----斜看
     * tag, 为可选参数, 将在动画通知回调中传给监听者
     */
    animPitch : function(pitch, tag){
        this.animMgr.animPitch(pitch, tag);
    },

    /**
     * 复位地图
     */
    overlookMap : function(floorIndex, distance){


        var floor = this.floors[floorIndex];
        var rl = floor.floorPos2Region(floor.mapWidth/2.0, floor.mapHeight/2.0);
        var wl = YFM.Math.Matrix.mulVec(this.matRegion, rl);
        var lookAzimuth = this.camera.getAzimuth();
        var rz = YFM.Math.Matrix.eulerParamExtractZ(this.matRegion);
        var lastAngle = -rz+lookAzimuth+YFM.Math.deg2Radian(floor.deflection);
        var len = distance || (floor.mapWidth > floor.mapHeight ? floor.mapWidth : floor.mapHeight);


        /*
        this.animMgr.animLookAt(wl, "overlookMap");
        //this.animMgr.animLookAzimuth(YFM.Math.radian2Deg(this._clampMinorArc(lastAngle)), "overlookMap");
        this.animMgr.animLookDistance(len, "overlookMap");
        this.animMgr.animRotateMap(YFM.Math.radian2Deg(this._clampMinorArc(lastAngle)));*/

            this.animMgr.animMerge({
                            distance : len,
                            azimuth : YFM.Math.radian2Deg(this._clampMinorArc(lastAngle)),
                            lookAt : wl,
                            },
                            null,
                            48
                            );
    },

    /**
     * 获取地图旋转角度
     */
    getFloorAngle : function(floorIndex){

        var floor = this.floors[floorIndex];
        var lookAzimuth = this.camera.getAzimuth();
        var rz = YFM.Math.Matrix.eulerParamExtractZ(this.matRegion);
        var lastAngle = -rz+lookAzimuth+YFM.Math.deg2Radian(floor.deflection);
        return YFM.Math.radian2Deg(this._clampMinorArc(lastAngle));
    },

    getFloorDeflection : function(floorIndex){
        var floor = this.floors[floorIndex];
        return floor.deflection;
    },

    /**
     * 设置导航线
     * routeData为一对象数组
     * 内含楼层内索引和楼层内地图坐标
     * {
     *  floor : int,
     *  x : float,
     *  y : floor
     * }
     */
    setRoute : function(routeData){
        this.route.setRoute(routeData);
    },

    cleanRoute : function(){
        this.route.cleanRoute();
    },

    /**
     * 设置导航限制
     */
    setNavigateLimitIndex : function(limitIndex){
        this.route.setNavigateLimitIndex(limitIndex);
    },


    /**
     * 重置导航限制
     */
    resetNavigateLimitIndex : function(){
        this.route.resetNavigateLimitIndex();
    },

    /**
     * 全览导航线
     */
    overlookRoute : function(){
        var center = this.route.getRouteCenter(this.displayFloorIndex);

        if(null !== center){
            var wl = YFM.Math.Matrix.mulVec(this.matRegion, center);

            //var rAxis = this.route.getRouteRAxis();
            //var rz = YFM.Math.Matrix.eulerParamExtractZ(this.matRegion);
            //var lookAzimuth = this.camera.getAzimuth();
            //var azimuth = this._makeAzimuth(rAxis);
            //var lastAngle = -rz+lookAzimuth+azimuth+Math.PI/2.0;
            this.animMgr.animMerge({
                            distance : 1.8*this.route.getRouteOBBLength(this.displayFloorIndex),
                            //azimuth : YFM.Math.radian2Deg(this._clampMinorArc(lastAngle)),
                            lookAt : wl,
                            },
                            null,
                            48
                            );

        }
    },

    /**
     * 获取导航状态
     */
    getNaviStatus : function(){
        return this.route.getNaviStatus();
    },

    /**
     * 插入Unit
     * unitObj为一个对象
     * {type : int,     //unit的类别
     *  text : str      //当unit的类别为0时, 会以此字段渲染文本
     *  }
     *
     */
    insertUnit : function(unitObj, floor, x, y){
        this.floors[floor].insertUnit(unitObj, x, y);
    },


    /**
     * 插入IconPlus
     *
     * iconObj为一个对象
     * {
     *  tex : 纹理名称字符串
     *  rate : 纹理缩放比
     *  ...其余部分可自定义, 用于回调时识别
     * }
     */
    insertIconPlus : function(iconObj, floor, x, y){
        this.floors[floor].insertIconPlus(iconObj, x, y);
    },
    
    /**
     * 插入模型
     * floor 模型所在楼层
     * model 模型对象
     * azimuth 模型方向调整
     * scale 模型缩放调整
     * x, y 模型楼层坐标
     * height 模型原点相对楼层的高度调整
     */
    insertModel : function(floor, model, azimuth, scale, x, y, height){
        return this.floors[floor].insertModel(model, azimuth, scale, x, y, height);
    },

    /**
     * 移除模型
     */
    removeModel : function(id){
        var floor = this._calcModelFloor(id);
        return this.floors[floor].removeModel(id);
    },

    /**
     * 设置快速图标覆盖层使用的图标
     * (做空车位指引用)
     * 为达到好的显示效果, 最好用高宽相等, 24*24像素左右的图标
     */
    setQuickIconTexture : function(texName){
        for(var i = 0; i < this.floors.length; i++){
            this.floors[i].quickIcons.setTex(texName);
        }
    },

    /**
     * floor是楼层索引
     * pts是YFM.Math.Vec.pos(x, y)构建的元素的数组
     * color是0xFFFFFF样式的颜色, 没有透明度
     */
    addQuickPolygon : function(floor, pts, color){
        this.floors[floor].quickPolygon.addQuickPolygon(pts, color);
    },

    buildQuickPolygonAll : function(){
        for(var i = 0; i < this.floors.length; i++){
            this.floors[i].quickPolygon.buildQuickPolygon();
        }
    },
    buildQuickPolygonFloor : function(floor){
        this.floors[floor].quickPolygon.buildQuickPolygon();
    },

    cleanQuickPolygonAll : function(){
        for(var i = 0; i < this.floors.length; i++){
            this.floors[i].quickPolygon.cleanQuickPolygon();
        }
    },
    cleanQuickPolygonFloor : function(floor){
        this.floors[floor].quickPolygon.cleanQuickPolygon();
    },

    /**
     * 添加快速图标
     * 一次可以添加多层的
     */
    addQuickIcon : function(floor, x, y){
        this.floors[floor].quickIcons.addPoint(x, y);
    },

    /**
     * 构建快速图标
     * 一次构建一层
     */
    buildQuickIcon : function(floor){
        this.floors[floor].quickIcons.buildPoints();
    },

    /**
     * 清除快速图标
     */
    cleanQuickIcon : function(floor){
        this.floors[floor].quickIcons.clean();
    },


    /**
     * 插入几何Marker, 不支持点击
     * category 支持的类型有:
     *   YFM.Mesh.CATEGORY_TETRHEDRON = "tetrahedron";      正四面体
     *   YFM.Mesh.CATEGORY_HEXADEDRON = "hexahedron";       正六面体
     *   YFM.Mesh.CATEGORY_OCTAHEDRON = "octahedron";       正八面体
     *   YFM.Mesh.CATEGORY_DODECAHEDRON = "dodecahedron";   正十二面体
     *   YFM.Mesh.CATEGORY_ICOSAHEDRON = "icosahedron";     正二十面体
     *   YFM.Mesh.CATEGORY_SPHERE = "SPHERE";               球体
     *
     *   返回唯一id
     */
    insertGeometryMarker : function(category, color, size, floor, x, y, height){

        return this.floors[floor].markers.insertGeometryMarker(category, color, size, x, y, height);
    },

    /**
     * 插入2D贴图标记
     *
     * 返回唯一id
     */
    insertTextureMarker : function(name, floor, x, y, height, offsetX, offsetY, scale){

        return this.floors[floor].markers.insertTextureMarker(name, x, y, height, offsetX, offsetY, scale);
    },
    insertTextureMarkerBase : function(name, floor, x, y, height, offsetX, offsetY, scale){

        return this.floors[floor].markersBase.insertTextureMarker(name, x, y, height, offsetX, offsetY, scale);
    },

    /**
     * 移除标记
     */
    removeMarker : function(id){
        var floor = this._calcMarkerFloor(id);
        var marker = this.floors[floor].markers.removeMarker(id);
        
        return null !== marker;
    },
    removeMarkerBase : function(id){
        var floor = this._calcMarkerFloor(id);
        var marker = this.floors[floor].markersBase.removeMarker(id);
        
        return null !== marker;
    },

    /**
     * 更新标记的位置
     * 注意, 位置更新后id必变化, 需要同步数据
     * 返回唯一id
     * 如更新失败返回-1
     */
    updateMarkerLocation : function(id, floor, x, y){

        var retval = -1;
        var orgFloor = this._calcMarkerFloor(id);
        var marker = this.floors[orgFloor].markers.removeMarker(id);
        if(null !== marker){
             
            retval = this.floors[floor].markers.insertMarker(marker, x, y);
        }

        return retval;
    },
    updateMarkerLocationBase : function(id, floor, x, y){

        var retval = -1;
        var orgFloor = this._calcMarkerFloor(id);
        var marker = this.floors[orgFloor].markersBase.removeMarker(id);
        if(null !== marker){
             
            retval = this.floors[floor].markersBase.insertMarker(marker, x, y);
        }

        return retval;
    },

    searchModel : function(screenX, screenY){
        var floorIndex = this.touchMgr.getFocusFloorIndex();

        if(-1 != floorIndex){
            var ray = this.touchMgr.getTouchRayPlus(screenX, screenY);
            return this.floors[floorIndex].searchModel(ray, false);
        }else{
            return [];
        }
    },

    /**
     * 以屏幕坐标, 搜索文本Unit
     * 返回数组, 可能有多个结果
     */
    searchUnit : function(screenX, screenY){
        var floorIndex = this.touchMgr.getFocusFloorIndex();

        if(-1 != floorIndex){
            var ray = this.touchMgr.getTouchRayPlus(screenX, screenY);
            return this.floors[floorIndex].searchUnit(ray, 20, false);
        }else{
            return [];
        }
    },

    /**
     * 以屏幕坐标, 搜索图标Unit
     * 返回数组, 可能有多个结果
     */
    searchIcon : function(screenX, screenY){
        var floorIndex = this.touchMgr.getFocusFloorIndex();

        if(-1 != floorIndex){
            var ray = this.touchMgr.getTouchRayPlus(screenX, screenY);
            return this.floors[floorIndex].searchIcon(ray, 80, false);
        }else{
            return [];
        }
    },

    /**
     * 以屏幕坐标, 搜索iconPlus
     * 返回数组, 可能有多个结果
     */
    searchIconPlus : function(screenX, screenY){
        var floorIndex = this.touchMgr.getFocusFloorIndex();
        if(-1 != floorIndex){
            var ray = this.touchMgr.getTouchRayPlus(screenX, screenY);
            return this.floors[floorIndex].searchIconPlus(ray, false);
        }else{
            return [];
        }
    },

    /**
     * 以屏幕坐标, 搜索2D标记
     * 只返回最上面的结果
     */
    searchMarker : function(screenX, screenY){

        var retlist = [];
        var nearest = null;
        var min = Number.MAX_VALUE;

        for(var i = 0; i < this.floors.length; i++){
            if(-1 !== this.floors[i].BBCheck){
                var ret = this.floors[i].markers.findMarker(screenX, screenY);
                /**
                 * 楼层间的距离排序不太对, 先用着, 再优化
                 */
                if(null !== ret && min > ret.dist){
                    nearest = ret;
                    min = ret.dist;
                }
            }
        }

        if(null !== nearest){
            return nearest.id;
        }else{
            return -1;
        }
    },
    searchMarkerBase : function(screenX, screenY){

        var retlist = [];
        var nearest = null;
        var min = Number.MAX_VALUE;

        for(var i = 0; i < this.floors.length; i++){
            if(-1 !== this.floors[i].BBCheck){
                var ret = this.floors[i].markersBase.findMarker(screenX, screenY);
                /**
                 * 楼层间的距离排序不太对, 先用着, 再优化
                 */
                if(null !== ret && min > ret.dist){
                    nearest = ret;
                    min = ret.dist;
                }
            }
        }

        if(null !== nearest){
            return nearest.id;
        }else{
            return -1;
        }
    },

    /**
     * 获取屏幕位置的地图位置
     * {floor : int,
     *  x : float,
     *  y : float
     *  }
     *
     *  注意此接口为什么要有Touch字样, 而不是 Screen2MapLoc
     *  是因为屏幕位置对应的地图位置可能不止一个解
     *
     *  本接口只返回考虑遮挡的情况下能摸到那个解
     */
    getTouchPosMapLoc : function(x, y){
        return this.touchMgr._screen_to_map(x, y);
    },

    /**
     * 获取屏幕位置的地图位置对应的世界坐标
     */
    getTouchPosWorldLoc : function(x, y){
        return this.touchMgr._pos_in_world_space(x, y);
    },
    
    /**
     * Region坐标转屏幕坐标
     */
    regionPos2Screen : function(regionLoc){

        var m = YFM.Math.Matrix.mul(this.camera.getPVMat(), this.matRegion );
        var out = YFM.Math.Matrix.mulVec(m, regionLoc);
        out[0] /= out[3];
        out[1] /= out[3];
        out[2] /= out[3];
        out[3] /= out[3];

        out[0] = out[0]*this.hw + this.hw;
        out[1] = - out[1]*this.hh + this.hh;
        return out;
    },

    /**
     * 楼层坐标转屏幕坐标
     */
    floorPos2RegionPos : function(floorIndex, x, y){

        if(floorIndex < 0 || floorIndex >= this.floors.length){
            throw new Error("floor index out of bounds");
        }
        
        return this.floors[floorIndex].floorPos2Region(x, y);
    },


   
    _onOverlook : function(over){
        this.overlook = over;
        if(over){
            this.extrudeLight = this.extrudeLightOver;
        }else{
            this.extrudeLight = this.extrudeLightNormal;
        }
    },

    _getRegionMat : function(){
        return this.matRegion;
    },


    _setRegionMat : function(mat){
        this.matRegion = mat;
    },


    _traceLoc : function(x, y, z){
        var rl = YFM.Math.Vector.pos(x, y, z);
        var wl = YFM.Math.Matrix.mulVec(this.matRegion, rl);

        if(YFM.Map.STATUS_NAVIGATE === this.status){
            var azimuth = 0.0;
            var ns = this.getNaviStatus();
            if(ns.validate){
                var rz = YFM.Math.Matrix.eulerParamExtractZ(this.matRegion);
                azimuth = ns.azimuth + rz;

                if(azimuth !== this.preTraceAzimuth){
                    this.traceAnimFlag = true;
                    this.traceAnimDelta = this._clampMinorArc(azimuth - this.preTraceAzimuth);

                    this.traceAnimStep = this.traceAnimCount = 8;
                }
                this.preTraceAzimuth = azimuth;
            }

            if(this.traceAnimFlag){
                this.camera.setLookAtAzimuth(azimuth-(this.traceAnimStep*this.traceAnimDelta/this.traceAnimCount), wl[0], wl[1], wl[2]);
                this.traceAnimStep -= 1;
                if(this.traceAnimStep <= 0){
                    this.traceAnimFlag = false;
                }
            }else{
                this.camera.setLookAtAzimuth(azimuth, wl[0], wl[1], wl[2]);
            }
        }else{
            this.camera.setLookAt(wl[0], wl[1], wl[2]);
        }
    },

    _getFloorMat : function(floorIndex){

        if(floorIndex < 0 || floorIndex >= this.floors.length){
            throw new Error("floor index out of bounds");
        }
        return this.floors[floorIndex].getFloorMat();
    },


    _intersectionLine : function(line){
        var retval = [];
        var cnt, i;
        cnt = this.floors.length;

        for(i = 0; i < cnt; i++){
            retval.push(this.floors[i].intersectionLine(line));
        }

        return retval;
    },



    _render : function(){
            var cnt, i;
            cnt = this.floors.length;

            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            if(this.clearColor){
                this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], 1.0);
            }

            this.animMgr.update();

            this._cleanText();
            this.tqct.reset();

            this.renderParam.projMat = this.camera.getProjectionMat();
            this.renderParam.viewMat = this.camera.getViewMat();
            this.renderParam.vrMat = YFM.Math.Matrix.mul(this.renderParam.viewMat, this.matRegion);
            this.renderParam.pvrMat = YFM.Math.Matrix.mul(this.camera.getPVMat(), this.matRegion);

            /**
             * 计算公告牌校正矩阵
             */
            var vr = YFM.Math.Matrix.matClone(this.renderParam.vrMat);
            vr[12] = 0.0;
            vr[13] = 0.0;
            vr[14] = 0.0;
            var ivr = YFM.Math.Matrix.invert(vr);
            var m = YFM.Math.Matrix.scale(15, 0, 0, 0);
            /**
             * 这里的-90度是实际使用时发现的一个固定的角度差
             */
            m = YFM.Math.Matrix.postRotate3d(m, this.camera.getRoll()-90, 0, 0, 1.0);
            this.renderParam.bivrMat = YFM.Math.Matrix.mul(ivr, m);

            /**
             * 因为我们的v和r矩阵每帧都可能改变
             * 每次都需要从pvr矩阵更新视锥
             */
            this.frustum.update(this.renderParam.pvrMat);

            this.panoramaShader.useProgram();
            this.panoramaShader.setProjectionMatrix(this.renderParam.projMat);
            this.panoramaShader.setViewMatrix(this.renderParam.viewMat);
            this.panorama.render(this.panoramaShader, this.matRegion);



            /**
             * 渲染多楼层时, 计算处于观察中心的楼层, 此楼才渲染unit文本
             */
            var floorBBCheckList = [];
            if(-1 === this.displayFloorIndex){
                var focusFloorIndex = this.touchMgr.getFocusFloorIndex();
                for(i = 0; i < cnt; i++){
                    var floorBBCheck = this.floors[i].frustumCheck(this.frustum);
                    /**
                     * 顺手将结果缓存用于查找Marker
                     */
                    this.floors[i].BBCheck = floorBBCheck;
                    this._renderFloor(i, floorBBCheck, focusFloorIndex);
                    floorBBCheckList.push(floorBBCheck);
                }
            }else{
                for(i = 0; i < cnt; i++){
                    /**
                     * 单层可见的也需要更新一下楼层可见性
                     */
                    this.floors[i].BBCheck = -1;
                }
                this.floors[this.displayFloorIndex].BBCheck = 1;
                this._renderFloor(this.displayFloorIndex, floorBBCheck, this.displayFloorIndex);
            }

            if(-1 === this.displayFloorIndex){
                var focusFloorIndex = this.touchMgr.getFocusFloorIndex();
                for(i = 0; i < cnt; i++){
                    if(-1 !== floorBBCheckList[i])
                        this._renderFloor2DMarkerBase(i);
                }
            }else{
                this._renderFloor2DMarkerBase(this.displayFloorIndex);
            }
            
            this.regionPhongShader.useProgram();
            this.regionPhongShader.setProjectionMatrix(this.renderParam.projMat);
            this.regionPhongShader.setViewMatrix(this.renderParam.viewMat);
            this.regionPhongShader.setRegionMatrix(this.matRegion);
            this.route.render(this.regionPhongShader, this.renderParam.vrMat, this.displayFloorIndex);

            /**
             * 根据定位标记的可见性决定是否渲染它
             */
            var drawLocMarker = this.frustum.containCheckPoint(this.locMarker.getRegionLoc());


            /**
             * 应用端觉得3D视角下的四棱锥不好看, 现统一弄成2d的样式
             */
            if(drawLocMarker){
                this.marker2DShader.useProgram();
                this.marker2DShader.setProjectionMatrix(this.orthMat);
                this.color2DShader.useProgram();
                this.color2DShader.setProjectionMatrix(this.orthMat);
            }
            this.locMarker.render(this.color2DShader, this.marker2DShader, drawLocMarker, this.renderParam.pvrMat);
            /**
             * 为了使得位置标记即使在屏幕外也能在位置动画时更新
             * 位置标记的渲染, 放在判断以外, 而把视见判断的结果传入
             * 以决定是更新动画并渲染, 还是只更新动画
             *
            if(this.overlook){
                if(drawLocMarker){
                    this.color2DShader.useProgram();
                    this.color2DShader.setProjectionMatrix(this.orthMat);
                }
                this.locMarker.render(this.color2DShader, drawLocMarker, this.overlook, this.renderParam.pvrMat);
            }else{
                if(drawLocMarker){
                    this.selectColorShader.useProgram();
                    this.selectColorShader.setProjectionMatrix(this.renderParam.projMat);
                    this.selectColorShader.setViewMatrix(this.renderParam.viewMat);
                    this.selectColorShader.setRegionMatrix(this.matRegion);
                }
                this.locMarker.render(this.selectColorShader, drawLocMarker, this.overlook, this.renderParam.pvrMat);
            }*/


            if(-1 === this.displayFloorIndex){
                var focusFloorIndex = this.touchMgr.getFocusFloorIndex();
                for(i = 0; i < cnt; i++){
                    if(-1 !== floorBBCheckList[i])
                        this._renderFloor2DMarker(i);
                }
            }else{
                this._renderFloor2DMarker(this.displayFloorIndex);
            }

    },



    _getFloorVOffset : function(i){
        return i * this.vPitch;
    },

    _renderFloor2DMarker : function(i, floorBBCheck){

        this.marker2DShader.useProgram();
        this.marker2DShader.setProjectionMatrix(this.orthMat);
        this.regionPhongShader.useProgram();
        this.regionPhongShader.setProjectionMatrix(this.renderParam.projMat);
        this.regionPhongShader.setViewMatrix(this.renderParam.viewMat);
        this.regionPhongShader.setRegionMatrix(this.matRegion);
        this.floors[i].renderMarkers(this.frustum, this.marker2DShader, this.regionPhongShader, 
            this.renderParam.vrMat, this.renderParam.pvrMat);
    },

    _renderFloor2DMarkerBase : function(i, floorBBCheck){

        this.marker2DShader.useProgram();
        this.marker2DShader.setProjectionMatrix(this.orthMat);
        this.regionPhongShader.useProgram();
        this.regionPhongShader.setProjectionMatrix(this.renderParam.projMat);
        this.regionPhongShader.setViewMatrix(this.renderParam.viewMat);
        this.regionPhongShader.setRegionMatrix(this.matRegion);
        this.floors[i].renderMarkersBase(this.frustum, this.marker2DShader, this.regionPhongShader, 
            this.renderParam.vrMat, this.renderParam.pvrMat);
    },


    _renderFloor : function(i, floorBBCheck, focusFloorIndex){

        //this._drawText("floor["+i+"] bb:"+floorBBCheck, 100, 200+i*50);

        if(-1 != floorBBCheck){
            this.baseColorShader.useProgram();
            this.baseColorShader.setProjectionMatrix(this.renderParam.projMat);
            this.baseColorShader.setViewMatrix(this.renderParam.viewMat);
            this.baseColorShader.setRegionMatrix(this.matRegion);
            this.floors[i].renderBase(this.baseColorShader, this.touchMgr.getTouchFloor() == i);

            var drawUnitText = this.overlook;
            if(YFM.Map.STATUS_SENSOR === this.status){
                drawUnitText = false;
            }

            var drawSide = !this.overlook;
            if(YFM.Map.STATUS_SENSOR === this.status){
                drawSide = true;
            }


            this.basePhongShader.useProgram();
            this.basePhongShader.setProjectionMatrix(this.renderParam.projMat);
            this.basePhongShader.setViewMatrix(this.renderParam.viewMat);
            this.basePhongShader.setRegionMatrix(this.matRegion);
            this.floors[i].renderExtrude(this.basePhongShader, this.renderParam.vrMat, this.extrudeLight, drawSide);

            if(drawUnitText && i == focusFloorIndex){
                /*
                 * 调试用渲染空间树节点
                this.selectColorShader.useProgram();
                this.selectColorShader.setProjectionMatrix(this.renderParam.projMat);
                this.selectColorShader.setViewMatrix(this.renderParam.viewMat);
                this.selectColorShader.setRegionMatrix(this.matRegion);
                this.selectColorShader.setModelMatrix(YFM.Math.Matrix.mat());*/
                this.floors[i].renderUnit(this.frustum, this.selectColorShader);
            }else if(this.drawUnitTextAlways){
                this.floors[i].renderUnit(this.frustum, this.selectColorShader);
            }

            this.pointSpiritShader.useProgram();
            this.pointSpiritShader.setProjectionMatrix(this.renderParam.projMat);
            this.pointSpiritShader.setViewMatrix(this.renderParam.viewMat);
            this.pointSpiritShader.setRegionMatrix(this.matRegion);
            this.floors[i].renderQuickIcons(this.pointSpiritShader);
        
            this.billboardIconShader.useProgram();
            this.billboardIconShader.setProjectionMatrix(this.renderParam.projMat);
            this.billboardIconShader.setViewMatrix(this.renderParam.viewMat);
            this.billboardIconShader.setRegionMatrix(this.matRegion);
            this.billboardIconShader.setIViewMatrix(this.renderParam.bivrMat);
            this.floors[i].renderIcons(this.frustum, this.billboardIconShader);

            this.modelPhongShader.useProgram();
            this.modelPhongShader.setProjectionMatrix(this.renderParam.projMat);
            this.modelPhongShader.setViewMatrix(this.renderParam.viewMat);
            this.modelPhongShader.setRegionMatrix(this.matRegion);
            this.floors[i].renderModels(this.frustum, this.modelPhongShader, this.renderParam.vrMat, this.modelLight);
        }
    },

    _restructure : function(){

        var size, maxsize, voffset, i, cnt;

        maxsize = 0;
        cnt = this.floors.length;

        for(i = 0; i < cnt ; i ++){
            size = this.floors[i].getSize();
            if(null != size && size > maxsize){
                maxsize = size;
            }
        }

        this.maxSize = maxsize;
        this.vPitch = maxsize;
        //this.vPitch = 32;

        for(i = 0; i < cnt ; i ++){
            this.floors[i].setVOffset(this.vPitch, i);
        }

        var height = cnt * this.vPitch;
        var cubeSize= Math.sqrt(height*height + maxsize*maxsize);
        this.touchMgr.setZoomMax(cubeSize);
    },
    _grender : function(){
        YFM.gRegion._render();
        requestAnimFrame(YFM.gRegion._grender);
    },

    /**
     * 根据向量计算方向
     */
    _makeAzimuth : function(vec){
        
        var north = YFM.Math.Vector.vec(0, 1, 0);
        var normalVec = YFM.Math.Vector.normalize(vec);
        var cosTheta = YFM.Math.Vector.dot3(normalVec, north);
        var angle = Math.acos(cosTheta);
        return angle;
    },

    /**
     * 约束为劣弧
     */
    _clampMinorArc : function(angle){
        var twoPi = Math.PI*2.0;
        var mAngle = angle % (twoPi);

        if(mAngle > 0 && mAngle > Math.PI){
            mAngle -= twoPi;
        }else if(mAngle < 0 && mAngle < -Math.PI){
            mAngle += twoPi;
        }

        return mAngle;
    },

    /**
     * 根据规则计算marker id 暗含的楼层索引
     */
    _calcMarkerFloor : function(id){
        return id%FloorMarkers.prototype.shift;
    },

    /**
     * 根据规则计算model id 暗含的楼层索引
     */
    _calcModelFloor : function(id){
        return id%FloorQuadTree.prototype.shift;
    },

    /**
     * 在2d canvas上输出文本
     */
    _drawText : function(text, x, y){
        this.ctx2d.fillText(text, x, y);
    },

    /**
     * 清除2d canvas上的文本
     */
    _cleanText : function(){
        this.ctx2d.clearRect(0, 0, this.txtCanvas.width, this.txtCanvas.height);
    },

    _determineFontHeight : function(fontStyle) {
        var body = document.getElementsByTagName("body")[0];
        var dummy = document.createElement("div");
        var dummyText = document.createTextNode("M");
        dummy.appendChild(dummyText);
        dummy.setAttribute("style", fontStyle);
        body.appendChild(dummy);
        var result = dummy.offsetHeight;
        body.removeChild(dummy);
        return result;
    }
}


function RegionLocMarker(gl, size, faceColor, lineColor, region)
{
    var Vector = YFM.Math.Vector;
    var Color = YFM.WebGL.Color;
    this.gl = gl;
    this.size = size;
    this.faceColor = Vector.vec(Color.hexColorRed(faceColor),
                                Color.hexColorGreen(faceColor),
                                Color.hexColorBlue(faceColor),
                                Color.hexColorAlpha(faceColor));
    this.lineColor = Vector.vec(Color.hexColorRed(lineColor),
                                Color.hexColorGreen(lineColor),
                                Color.hexColorBlue(lineColor),
                                Color.hexColorAlpha(lineColor));
    this.region = region;
    this.waveRadius = Vector.vec(12.0, 12.0);
    this.waveMax = 32.0;
    this.waveMin = 12.0;
    this.waveStep = (this.waveMax - this.waveMin)/56.0;
    this.locMarkerTexName = null;
    this.locMarker = null;


    this.angle = 0;
    this.regionLoc = YFM.Math.Vector.pos(0, 0, 0);
    this.floorLoc = { floor : -1,
                      x : 0,
                      y : 0};
    this.anim = {
        floor : 0,
        dist : 0.1,
        flag : false,
        mover : new Mover(0, 0, 0),
        target : null,
    }

    this._init(gl, size);
}

RegionLocMarker.prototype = {
	constructor : RegionLocMarker,

    locateLaunch : function(){

        this.waveRadius[0] = this.waveMax;
        this.waveRadius[1] = this.waveMax;
    },

    set2DMarkerParam : function(texName, waveColor, waveMax, waveMin){
        var Vector = YFM.Math.Vector;
        var Color = YFM.WebGL.Color;
        this.locMarkerTexName = texName;
        this.locMarker = null;
        this.waveColor = Vector.vec(Color.hexColorRed(waveColor),
                                    Color.hexColorGreen(waveColor),
                                    Color.hexColorBlue(waveColor),
                                    Color.hexColorAlpha(waveColor));
        this.waveMax = waveMax;
        this.waveMin = waveMin;
        this.waveStep = (this.waveMax - this.waveMin)/56.0;
    },

	getRegionLoc : function(){
        return YFM.Math.Vector.vecClone(this.regionLoc);
	},

    getFloorLoc : function(){
        return {floor : this.floorLoc.floor,
                x : this.floorLoc.x,
                y : this.floorLoc.y};
    },

    getSize : function(){
        return this.size;
    },

    /**
     * 在状态发生变化时, 如果当前位置有效, 触发一下位置相关的东西
     */
    updateLocation : function(first){

        if(-1 !== this.floorLoc.floor){
            this.regionLoc = this.region.floorPos2RegionPos(this.floorLoc.floor, 
                                                            this.floorLoc.x, 
                                                            this.floorLoc.y);

            if(!first && YFM.Map.STATUS_TOUCH !== this.region.getStatus()){
                this.region._traceLoc(this.regionLoc[0], this.regionLoc[1], this.regionLoc[2]);
            }

            this.region.updateNaviStatus(this.floorLoc, this.regionLoc);
        }
    },

    cleanLocation :function(){
        this.floorLoc.floor = -1;
        this.floorLoc.x = 0;
        this.floorLoc.y = 0;
    },

    setLocation : function(floorIndex, x, y){
        this.floorLoc.floor = floorIndex;
        this.floorLoc.x = x;
        this.floorLoc.y = y;

        this.regionLoc = this.region.floorPos2RegionPos(floorIndex, x, y);

        if(YFM.Map.STATUS_TOUCH != this.region.getStatus()){
            this.region._traceLoc(this.regionLoc[0], this.regionLoc[1], this.regionLoc[2]);
        }

        this.region.updateNaviStatus(this.floorLoc, this.regionLoc);
    },

    animTo : function(floorIndex, x, y){
        if(floorIndex != this.floorLoc.floor){
            this.anim.flag = false;
            this.setLocation(floorIndex, x, y);
        }else{
            this.anim.floor = floorIndex;
            this.anim.flag = true;
            this.anim.target = YFM.Math.Vector.pos(x, y, 0);
            this.anim.mover.setLocation(this.floorLoc.x, this.floorLoc.y, 0);
        }
    },

    render : function(colorShader, texShader, draw, pvrMat){

        //即使定位标记被视锥剔除而不绘制, 也需要更新动画, 否则会出现视线外不能移动的情况
        this._updateAnim();

        if(!draw)
            return;

        if(this.floorLoc.floor < 0)
            return;

        if(!this.locMarker && this.locMarkerTexName){
            var t = this.region.getTexture(this.locMarkerTexName);
            if(null !== t){
                this.locMarker = {  tex : t.tex,
                                    texSize : YFM.Math.Vector.vec(t.w/2.0, t.h/2.0)
                                };
            }
        }

        if(!this.locMarker)
            return;
        
        
        var m, modelMat;
        var screenPos = YFM.Math.Matrix.mulVec(pvrMat, this.regionLoc);
        var hw, hh;
        hw = this.region.glCanvas.width/2.0;
        hh = this.region.glCanvas.height/2.0;
        screenPos[0] /= screenPos[3];
        screenPos[1] /= screenPos[3];
        screenPos[2] /= screenPos[3];
        screenPos[3] /= screenPos[3];
        screenPos[0] *= hw;
        screenPos[1] *= hh;

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        m    = YFM.Math.Matrix.scaleXYZ(this.waveRadius, 0, 0, 0);
        modelMat = YFM.Math.Matrix.postTranslate(m, screenPos[0], screenPos[1], 0);
        colorShader.setModelMatrix(modelMat);
        colorShader.drawTriangles(this.circleVBO, this.waveColor, 0, this.circleSize);
        if(this.waveRadius[0] > this.waveMin){
            this.waveRadius[0] -= this.waveStep;
            this.waveRadius[1] -= this.waveStep;
        }else{
            this.waveRadius[0] = this.waveMin;
            this.waveRadius[1] = this.waveMin;
        }

        texShader.useProgram();
        texShader.bindTexture(this.locMarker.tex);

        /**
         * 转动的总角度(指示器marker的角度+地图转动角度) - 地图与正北方向的偏角
         *
         * 这里是转指示器, 注意和跟随模式转地图的方向相反
         * 所以相当于
         * 地图与正北方向的偏角 - 转动的总角度(指示器marker的角度+地图转动角度)
         */
        var azimuth = this.region.getFloorDeflection(this.floorLoc.floor) - 
        (this.region.azimuth + this.region.getFloorAngle(this.floorLoc.floor));

        m = YFM.Math.Matrix.scaleXYZ(this.locMarker.texSize, 0, 0, 0);
        m = YFM.Math.Matrix.postTranslate(YFM.Math.Matrix.postRotateXY(m, azimuth, 0, 0),
                                            screenPos[0], screenPos[1], 0);
                                                                           
        texShader.setModelMatrix(m);
        texShader.drawTriangles(this.quadVBO, 6, 0);

        this.gl.disable(this.gl.BLEND);
    },

    _updateAnim : function(){
        if(this.anim.flag){
            if(this.anim.mover.arrive(this.anim.target, this.anim.dist)){
                this.anim.flag = false;
                this.setLocation(this.anim.floor, this.anim.target[0], this.anim.target[1]);
            }else{
                this.anim.mover.update();
                var loc = this.anim.mover.getLocation();
                this.setLocation(this.anim.floor, loc[0], loc[1]);
            }
        }
    },

    _init : function(gl, size){

        var Vector = YFM.Math.Vector;
        var height = 2.5*size;
        var vertex = [];

        //顶点0 四角锥顶
        vertex.push(Vector.pos(0, 0, 0));

        //顶点1 底面顶点1
        vertex.push(Vector.pos(0, size, height));

        //顶点2 底面顶点2
        vertex.push(Vector.pos(size, 0, height));

        //顶点3 底面顶点3
        vertex.push(Vector.pos(0, -size, height));

        //顶点4 底面顶点4
        vertex.push(Vector.pos(-size, 0, height));

        var triangles = [];
        triangles.push(vertex[4]);
        triangles.push(vertex[2]);
        triangles.push(vertex[1]);

        triangles.push(vertex[2]);
        triangles.push(vertex[4]);
        triangles.push(vertex[3]);

        triangles.push(vertex[0]);
        triangles.push(vertex[4]);
        triangles.push(vertex[1]);

        triangles.push(vertex[0]);
        triangles.push(vertex[1]);
        triangles.push(vertex[2]);

        triangles.push(vertex[0]);
        triangles.push(vertex[2]);
        triangles.push(vertex[3]);

        triangles.push(vertex[0]);
        triangles.push(vertex[3]);
        triangles.push(vertex[4]);

        triangles.push(vertex[0]);
        triangles.push(vertex[1]);

        triangles.push(vertex[0]);
        triangles.push(vertex[2]);

        triangles.push(vertex[0]);
        triangles.push(vertex[3]);

        triangles.push(vertex[0]);
        triangles.push(vertex[4]);

        triangles.push(vertex[1]);
        triangles.push(vertex[2]);

        triangles.push(vertex[2]);
        triangles.push(vertex[3]);

        triangles.push(vertex[3]);
        triangles.push(vertex[4]);

        triangles.push(vertex[4]);
        triangles.push(vertex[1]);


        this.trianglesVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(triangles, 3), gl.STATIC_DRAW);

        var circlePts = [];
        var PI2 = Math.PI*2.0;
        circlePts.push(Vector.pos(0, 0, 15));
        for(var theta = 0; theta < PI2; theta+=0.1){
            circlePts.push(Vector.pos(Math.cos(theta), Math.sin(theta), 15));
        }

        var circleVArray = [];
        var i, cnt;
        for(i = 1, cnt = circlePts.length-1; i < cnt; i ++){
            circleVArray.push(circlePts[i]);
            circleVArray.push(circlePts[0]);
            circleVArray.push(circlePts[i+1]);
        }
            circleVArray.push(circlePts[i]);
            circleVArray.push(circlePts[0]);
            circleVArray.push(circlePts[1]);

        this.circleVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.circleVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(circleVArray, 3), gl.STATIC_DRAW);
        this.circleSize = circleVArray.length;


        var quadVarray = [];
        var pts = [];
        var texCoords = [];
        texCoords.push(YFM.Math.Vector.vec(0.0, 1.0));
        texCoords.push(YFM.Math.Vector.vec(1.0, 1.0));
        texCoords.push(YFM.Math.Vector.vec(1.0, 0.0));
        texCoords.push(YFM.Math.Vector.vec(0.0, 0.0));

        pts.push(YFM.Math.Vector.pos(-1.0, -1.0, 0));
        pts.push(YFM.Math.Vector.pos(1.0, -1.0, 0));
        pts.push(YFM.Math.Vector.pos(1.0, 1.0, 0));
        pts.push(YFM.Math.Vector.pos(-1.0, 1.0, 0));

        quadVarray.push(pts[0]);
        quadVarray.push(texCoords[0]);
        quadVarray.push(pts[1]);
        quadVarray.push(texCoords[1]);
        quadVarray.push(pts[2]);
        quadVarray.push(texCoords[2]);

        quadVarray.push(pts[0]);
        quadVarray.push(texCoords[0]);
        quadVarray.push(pts[2]);
        quadVarray.push(texCoords[2]);
        quadVarray.push(pts[3]);
        quadVarray.push(texCoords[3]);

        this.quadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER, YFM.Math.flatten(quadVarray, 3), gl.STATIC_DRAW);
    }
}


function RegionRoute(gl, size, routeColor, tailColor, region)
{
    this.gl = gl;
    this.size = size;
    this.routeColor = YFM.Math.Vector.pos(YFM.WebGL.Color.hexColorRed(routeColor),
                                YFM.WebGL.Color.hexColorGreen(routeColor),
                                YFM.WebGL.Color.hexColorBlue(routeColor));
    this.tailColor = YFM.Math.Vector.pos(YFM.WebGL.Color.hexColorRed(tailColor),
                                YFM.WebGL.Color.hexColorGreen(tailColor),
                                YFM.WebGL.Color.hexColorBlue(tailColor));
    this.region = region;

    this.limitIndex = -1;

    this.routeVBO = null;
    this.routeBufferSize = 0;
    this.routeVarray = [];

    this.light = YFM.Math.Vector.vec(0.0, 0.0, 1.0);

    this.floorRouteList = null;
    this.globalSegList = null;

    this.obb = null;

    this._initTail();
    this._initRouteShape();

    this.tailSize = 3.2;
    this.updateNSFlag = true;



    this.naviStatus = {
        startInstance : 0,
        endInstance : 0,
        projection : null,
        validate : false,                               //导航状态是否有效, 一切后续数据有效的先决条件
        projDist : 0.0,                                 //真实位置到投影位置的距离
        goalDist : 0.0,                                 //投影位置到终点的线上距离
        globalDist : 0.0,                               //到总的终点的线上距离
        serialDist : 0.0,                               //前方合并的连续线上直行距离
        nextSerialDist : 0.0,                           //拐弯后下一段合并的连续线上直行距离
        azimuth : 0.0,                                  //当前段方向
        sug : YFM.Map.Navigate.Suggestion.NONE,         //根据当前位置和设备方向作出的建议
        nextSug : YFM.Map.Navigate.NextSuggestion.NONE  //根据当前连续直行段和下段连续直行段的空间关系作出的建议
    };
}


RegionRoute.prototype = {
	constructor : RegionRoute,

    /**
     * 设置导航限制
     */
    setNavigateLimitIndex : function(limitIndex){
        this.limitIndex = limitIndex;
    },

    resetNavigateLimitIndex : function(){
        this.limitIndex = -1;
    },


    getRouteCenter : function(floorIndex){
        if(floorIndex >= 0){
            if(this.floorRouteList[floorIndex].box){
                return YFM.Math.Vector.vecClone(this.floorRouteList[floorIndex].box.center);
            }else{
                return null;
            }
        }else{

            if(null !== this.obb){
                return YFM.Math.Vector.vecClone(this.obb.center);
            }else{
                return null;
            }
        }
    },

    getRouteRAxis : function(floorIndex){
        if(floorIndex >= 0){
            if(this.floorRouteList[floorIndex].box){
                return YFM.Math.Vector.vecClone(this.floorRouteList[floorIndex].box.r);
            }else{
                return null;
            }
        }else{
            if(null !== this.obb){
                return YFM.Math.Vector.vecClone(this.obb.r);
            }else{
                return null;
            }
        }
    },

    getRouteOBBLength : function(floorIndex){
        
        if(floorIndex >= 0){
            if(this.floorRouteList[floorIndex].box){
                var hr = this.floorRouteList[floorIndex].box.hr;
                var hs = this.floorRouteList[floorIndex].box.hs;

                return Math.sqrt(hr*hr + hs*hs)*2.0;
            }else{
                return 0.0;
            }
        }else{
            if(null !== this.obb){
                var hr = this.obb.hr;
                var hs = this.obb.hs;
                var ht = this.obb.ht;

                return Math.sqrt(hr*hr + hs*hs + ht*ht)*2.0;
            }else{
                return 0.0;
            }
        }
    },

    getNaviStatus : function(){

        /**
         * 如果导航状态有效, 将导航状态的拷贝返回, 如果无效, 只复制validate字段
         */
        if(this.naviStatus.validate){
            return {
                validate : this.naviStatus.validate,
                projDist : this.naviStatus.projDist,
                goalDist : this.naviStatus.goalDist,
                globalDist : this.naviStatus.globalDist,
                serialDist : this.naviStatus.serialDist,
                nextSerialDist : this.naviStatus.nextSerialDist,
                azimuth : this.naviStatus.azimuth,
                sug : this.naviStatus.sug,
                nextSug : this.naviStatus.nextSug
            };
        }else{
            return {validate : false};
        }
    },

    setUpdateNSFlag : function(value){
        var enable = !this.updateNSFlag && value;
        var disable = this.updateNSFlag && !value;

        if(enable){
            this.updateNSFlag = true;
            var floorLoc = this.region.getFloorLoc();
            if(-1 != floorLoc.floor){
                var regionLoc = this.region.getRegionLoc();
                this.updateNaviStatus(floorLoc, regionLoc);
            }
        }else if(disable){
            this.updateNSFlag = false;
            this.naviStatus.validate = false;
        }
    },

    /**
     * 从位置更新导航状态
     */
    updateNaviStatus : function(floorLoc, regionLoc){
        if(!this.updateNSFlag)
            return;
        /**
         * 没有设置导航线的情况
         */
        if(null == this.floorRouteList){
            this.naviStatus.validate = false;
        }
        /**
         * 没设置位置的情况
         */
        else if(-1 == floorLoc.floor){
            this.naviStatus.validate = false;
        }else{
            /**
             * 内部接口, 越界不检查直接崩出来看
             */
            var deflection = this.region.getFloorDeflection(floorLoc.floor);
            this.floorRouteList[floorLoc.floor].makeNaviStatus(this.naviStatus, regionLoc, this.limitIndex, deflection);
        }
    },

    /**
     * routeData为一对象数组
     * 内含楼层内索引和楼层内地图坐标
     * {
     *  floor : int,
     *  x : float,
     *  y : floor
     * }
     */
    setRoute : function(routeData){

        this.cleanRoute();

        var floorLoc, regionLoc;
        var pos, node, next, floorCnt, nodeCnt, segCnt, followLen, i, currentFloor;
        var posList = [];
        
        floorCnt = this.region.getFloorCount();
        this.floorRouteList = [];
        this.globalSegList = [];
        for(i = 0; i < floorCnt; i++){
            this.floorRouteList.push(new FloorRoute(this.size, i, this.region, this));
        }

        nodeCnt = routeData.length;
        for(i = 0; i < nodeCnt; i++){
            node = routeData[i];
            pos = this.region.floorPos2RegionPos(node.floor, node.x, node.y);
            pos[2] += 5.0;
            posList.push(pos);
        }

        this.obb = new OBB(posList);

        /**
         * 再遍历一遍, 按楼层插入导航段
         */
        currentFloor = routeData[0].floor;
        for(i = 0; i < nodeCnt-1; i++){
            node = routeData[i];
            next = routeData[i+1];

            if(next.floor == currentFloor){
                this.floorRouteList[currentFloor].addSeg(posList[i], posList[i+1]);
            }else{
                currentFloor = next.floor;
            }
        }

        /**
         * 做每层楼的obbBox
         */
        for(i = 0; i < floorCnt; ++i){
            this.floorRouteList[i].makeBox();
        }

        /**
         * 反向遍历全局段列表, 更新它们的后续距离
         */

        followLen = 0;
        segCnt = this.globalSegList.length;
        var seg;
        for(i = segCnt - 1; i >= 0; --i){
            seg = this.globalSegList[i];
            seg.updateFolowLen(followLen);
            followLen += seg.len;
        }

        this._makeRouteVBO();

        /**
         * 如果有设置位置, 就计算相应的导航状态
         * 注意, 由于跳过的instance是在_makeRouteVBO里算的, 所以这里要保证顺序
         */
        floorLoc = this.region.getFloorLoc();
        if(-1 != floorLoc.floor){
            regionLoc = this.region.getRegionLoc();
            this.updateNaviStatus(floorLoc, regionLoc);
        }

    },

    cleanRoute : function(){
        this.floorRouteList = null;
        this.globalSegList = null;

        if(null != this.routeVBO){
            this.routeVBO = null;
            this.gl.deleteBuffer(this.routeVBO);
        }
    },

    addGlobalSeg : function(seg, needPop){
        if(needPop){
            this.globalSegList.pop();
        }

        this.globalSegList.push(seg);
    },

    render : function(shader, vrMat, displayFloorIndex){
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);


        var tvrMat = YFM.Math.Matrix.transpose(vrMat);
        var itvrMat = YFM.Math.Matrix.invert(tvrMat);
        shader.setLightPos(this.light);
        shader.setNormalMatrix(itvrMat);


        if(null != this.routeVBO){
            shader.setModelMatrix(YFM.Math.Matrix.mat());
            shader.setColor(this.routeColor);

            if(this.naviStatus.validate){
                //shader.drawTriangles(this.routeVBO, this.routeBufferSize, 60*this.naviStatus.startInstance);
                shader.drawTrianglesPlus(this.routeVBO, 60*this.naviStatus.startInstance, 60*this.naviStatus.endInstance);
                this._renderTail(shader);
            }else if(displayFloorIndex >= 0){
                var floorRoute = this.floorRouteList[displayFloorIndex];
                var startInstance = floorRoute.getFloorRouteStartInstance();
                var endInstance = floorRoute.getFloorRouteEndInstance();
                shader.drawTrianglesPlus(this.routeVBO, 60*startInstance, 60*endInstance);
            }else{
                shader.drawTriangles(this.routeVBO, this.routeBufferSize, 0);
            }
        }


        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);

    },

    _renderTail : function(shader){
        var sMat, pos, start, direct, max, step, len;
        start = this.naviStatus.projection;
        direct = YFM.Math.Vector.normalize(YFM.Math.Vector.sub(this.region.getRegionLoc(), this.naviStatus.projection));
        max = this.naviStatus.projDist;
        step = this.tailSize * 4;
        len = 0.0;
        
        sMat = YFM.Math.Matrix.scale(this.tailSize, 0.0, 0.0, 0.0);

        while(len <= max){
            pos = YFM.Math.Vector.add(start, YFM.Math.Vector.scale(direct, len));
            shader.setModelMatrix(YFM.Math.Matrix.postTranslate(sMat, 
                    pos[0],
                    pos[1],
                    pos[2]+this.tailSize));
            shader.drawTriangles(this.tailMesh.getMeshVBO(), this.tailMesh.getMeshBufSize(), 0);
            len += step;
        }
    },



    _makeRouteVBO : function(){

        var segLen, dx, dy, dz, t, tPos;
        var floorCnt, segCnt, arrowCnt, i, j, k, seg, nodeIndex, azimuth, lastAzimuth, avg, angle, delta;

        nodeIndex = 0;
        lastAzimuth = 0.0;
        azimuth = 0.0;
        floorCnt = this.region.getFloorCount();
        for(i = 0; i < floorCnt; i++){
            
            segCnt = this.floorRouteList[i].getLength();

            
            for(j = 0; j < segCnt; j++){
                seg = this.floorRouteList[i].getSeg(j);

                /**
                 * 为了节约计算量, 段起始位置的节点实例偏移在这里取得
                 */
                seg.startInstance = nodeIndex;
                segLen = seg.len;
                lastAzimuth = azimuth;
                azimuth = seg.azimuth;
                arrowCnt = Math.ceil(segLen/(this.size*2.0));

                /**
                 * 为了节约计算量, 段结束位置的节点实例偏移在这里取得
                 */
                seg.endInstance = seg.startInstance + arrowCnt;

                k = (0 == j) ? 1 : 0;
                for(; k < arrowCnt; k++){

                    t = k / arrowCnt;
                    tPos = seg.getPoint(t);

                    /**
                     * 段的最后一格箭头, 且后续有段时, 检查一下距离, 如果太近就不插了免得箭头叠在一起
                     */
                    if(k == arrowCnt-1 && j < segCnt-1){
                        dx = seg.end[0] - tPos[0];
                        dy = seg.end[1] - tPos[1];
                        dz = seg.end[2] - tPos[2];
                        /*
                         * xoozi---测试靠右构建路径的修改
                         * if(dx*dx + dy*dy + dz*dz <= (this.size*this.size/2.0)){
                            break;
                        }*/
                    }

                    /**
                     * 段的第一格箭头, 且前续有段时, 其方位角要算平均角
                     * xoozi---测试靠右构建路径的修改
                    if(0 == k && j > 0){
                        delta = azimuth - lastAzimuth;
                        avg = (azimuth + lastAzimuth) / 2.0;
                        angle = avg;
                        //计算平均角度时, 需要保证方向, 要从劣弧那面平均
                        if(delta > Math.PI || delta < -Math.PI){
                            angle += Math.PI;
                        }
                    }else{
                        angle = azimuth;
                    }*/
                        angle = azimuth;

                    this._makeShapeXY(this.routeVarray, tPos[0], tPos[1], tPos[2], this.size, angle);
                    nodeIndex ++;
                }
            }

        }

        this.routeVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.routeVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, YFM.Math.flatten(this.routeVarray, 3), this.gl.STATIC_DRAW);
        this.routeBufferSize = this.routeVarray.length/2;
        this.routeVarray = [];
    },

    /**
     * 初始化渲染导航线尾的球面
     */
    _initTail : function(){

        /**
         * 从正20面体出发顶点细分构造球体, 比较好看
         */
        this.tailMesh = new IcosahedronMesh(this.gl, 4);

    },

    /**
     * 初始化导航线一个shape段的模板
     */
    _initRouteShape : function(){

        var v = [];
        var faces = [];
        var normals = [];
        var normal;
        
        /**
         * 12个顶点
         */
        v.push(YFM.Math.Vector.pos(0.0,   1.0,    0.0));
        v.push(YFM.Math.Vector.pos(-1.0,  0.0,    0.0));
        v.push(YFM.Math.Vector.pos(-1.0,  -1.0,   0.0));

        v.push(YFM.Math.Vector.pos(0.0,   0.0,    0.0));
        v.push(YFM.Math.Vector.pos(1.0,   -1.0,   0.0));
        v.push(YFM.Math.Vector.pos(1.0,   0.0,    0.0));

        v.push(YFM.Math.Vector.pos(0.0,   1.0,    0.32));
        v.push(YFM.Math.Vector.pos(-1.0,  0.0,    0.32));
        v.push(YFM.Math.Vector.pos(-1.0,  -1.0,   0.32));

        v.push(YFM.Math.Vector.pos(0.0,   0.0,    0.32));
        v.push(YFM.Math.Vector.pos(1.0,   -1.0,   0.32));
        v.push(YFM.Math.Vector.pos(1.0,   0.0,    0.32));
        
        /**
         * 20个面
         */
        /**
         * 底面四个三角形, 共享一个法向量
         */
        normal = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(YFM.Math.Vector.sub(v[3], v[0]), YFM.Math.Vector.sub(v[1], v[3])));
        normals.push(normal);
        faces.push({v0:0, v1:3, v2:1, n:0});
        faces.push({v0:1, v1:3, v2:2, n:0});
        faces.push({v0:0, v1:5, v2:3, n:0});
        faces.push({v0:3, v1:5, v2:4, n:0});

        /**
         * 顶面四个三角形, 共享一个法向量
         */
        normal = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(YFM.Math.Vector.sub(v[6], v[9]), YFM.Math.Vector.sub(v[7], v[6])));
        normals.push(normal);
        faces.push({v0:9, v1:6, v2:7, n:1});
        faces.push({v0:7, v1:8, v2:9, n:1});
        faces.push({v0:9, v1:11, v2:6, n:1});
        faces.push({v0:9, v1:10, v2:11, n:1});

        /**
         * 内部左侧面两个三角形, 共享一个法向量
         */
        normal = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(YFM.Math.Vector.sub(v[3], v[2]), YFM.Math.Vector.sub(v[9], v[3])));
        normals.push(normal);
        faces.push({v0:2, v1:3, v2:9, n:2});
        faces.push({v0:9, v1:8, v2:2, n:2});

        /**
         * 内部右侧面两个三角形, 共享一个法向量
         */
        normal = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(YFM.Math.Vector.sub(v[4], v[3]), YFM.Math.Vector.sub(v[10], v[4])));
        normals.push(normal);
        faces.push({v0:3, v1:4, v2:10, n:3});
        faces.push({v0:10, v1:9, v2:3, n:3});

        /**
         * 外部右侧两个三角形, 共享一个法向量
         */
        normal = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(YFM.Math.Vector.sub(v[5], v[4]), YFM.Math.Vector.sub(v[11], v[5])));
        normals.push(normal);
        faces.push({v0:4, v1:5, v2:11, n:4});
        faces.push({v0:11, v1:10, v2:4, n:4});


        /**
         * 外部右上侧两个三角形, 共享一个法向量
         */ 
        normal = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(YFM.Math.Vector.sub(v[6], v[0]), YFM.Math.Vector.sub(v[11], v[6])));
        normals.push(normal);
        faces.push({v0:0, v1:6, v2:11, n:5});
        faces.push({v0:11, v1:5, v2:0, n:5});

        /**
         * 外部左上侧两个三角形, 共享一个法向量
         */
        normal = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(YFM.Math.Vector.sub(v[1], v[0]), YFM.Math.Vector.sub(v[7], v[1])));
        normals.push(normal);
        faces.push({v0:0, v1:1, v2:7, n:6});
        faces.push({v0:7, v1:6, v2:0, n:6});

        /**
         * 外部左侧两个三角形, 共享一个法向量
         */
        normal = YFM.Math.Vector.normalize(YFM.Math.Vector.cross(YFM.Math.Vector.sub(v[2], v[1]), YFM.Math.Vector.sub(v[8], v[2])));
        normals.push(normal);
        faces.push({v0:1, v1:2, v2:8, n:7});
        faces.push({v0:8, v1:7, v2:1, n:7});

        this.routeModel = { v : v, f : faces, n : normals};
    },

    /**
     * 第一步, 从基本的route shape模板构建, 一个空间中的route 节点
     */
    _makeShapeXY : function(outputVarray, x, y, z, size, angle){
        var m = YFM.Math.Matrix.rotate3d(angle, 0, 0, 1.0, true);
        m = YFM.Math.Matrix.postScale(m, size, 0, 0, 0);
        m = YFM.Math.Matrix.postTranslate(m, x, y, z);
        var im = YFM.Math.Matrix.invert(m);
        var tim = YFM.Math.Matrix.transpose(im);

        var tv = [];
        var tn = [];
        var vcnt, fcnt, ncnt, i, face;
        vcnt = this.routeModel.v.length;
        fcnt = this.routeModel.f.length;
        ncnt = this.routeModel.n.length;

        for(i = 0; i < vcnt; i++){
            tv.push(YFM.Math.Matrix.mulVec(m, this.routeModel.v[i]));
        }
        for(i = 0; i < ncnt; i++){
            tn.push(YFM.Math.Matrix.mulVec(tim, this.routeModel.n[i]));
        }
        for(i = 0; i < fcnt; i++){
            face = this.routeModel.f[i];
            outputVarray.push(tv[face.v0]);
            outputVarray.push(tn[face.n]);
            outputVarray.push(tv[face.v1]);
            outputVarray.push(tn[face.n]);
            outputVarray.push(tv[face.v2]);
            outputVarray.push(tn[face.n]);
        }
    },

}


/**
 * 导航段
 */
function RouteSeg(size, start, end, prevSeg)
{
    
    var Vector = YFM.Math.Vector;
    this.segVec = Vector.sub(end, start);
    this.lenSQ = Vector.dot3(this.segVec, this.segVec);
    this.len = Math.sqrt(this.lenSQ);

    /**
     * xoozi---测试靠右构造路径
     * this.start = start;
     * this.end = end;
     */
    var normalSegVec = Vector.normalize(this.segVec);
    var orthNormalSegVec = Vector.vec(normalSegVec[1], -normalSegVec[0]);
    Vector.scaleTo(orthNormalSegVec, size*1.2);
    this.start = Vector.add(start, orthNormalSegVec);
    this.end = Vector.add(end, orthNormalSegVec);

    /**
     * 如果有前序seg
     */
    if(prevSeg){
        var Line = YFM.Math.Line;
        var pL = Line.linePP(prevSeg.start, prevSeg.end);
        var cL = Line.linePP(this.start, this.end);
        var ret = Line.distanceLinesRaw(pL, cL);
        //console.log("calc prevSeg x curSeg:%o", ret);

        if(!ret.parallel){
            var tp = ret.t[0]
            var tc = ret.t[1];
            var deltaDist;
            var delta = tp - 1.0;
            deltaDist = Math.abs(delta*prevSeg.len);
            /*
            if(Math.abs(delta) > 0.1){
                delta = 0.1*delta/Math.abs(delta);
                tp = 1.0+delta;
            }*/
            if(deltaDist > 20){
                delta = (20*(delta/Math.abs(delta)))/prevSeg.len;
                tp = 1.0 + delta;
            }
            //console.log("tp delta:%f, deltaDist:%f, adj tp:%f", delta, deltaDist, tp);

            prevSeg.end = Line.getPoint(pL, tp);
            prevSeg.segVec = Vector.sub(prevSeg.end, prevSeg.start);
            prevSeg.lenSQ = Vector.dot3(prevSeg.segVec, prevSeg.segVec);
            prevSeg.len = Math.sqrt(prevSeg.lenSQ);

            delta = tc - 0.0; 
            deltaDist = Math.abs(delta*this.len);
            if(deltaDist > 20){
                delta = (20*(delta/Math.abs(delta)))/this.len;
                tc = 0.0 + delta;
            }
            /*
            if(Math.abs(delta) > 0.1){
                delta = 0.1*delta/Math.abs(delta);
                tc = 0.0+delta;
            }*/
            //console.log("tc delta:%f, deltaDist:%f, adj tc:%f", delta, deltaDist, tc);
            this.start = Line.getPoint(cL, tc);
            this.segVec = Vector.sub(this.end, this.start);

        }
    }

    this.lenSQ = Vector.dot3(this.segVec, this.segVec);
    this.len = Math.sqrt(this.lenSQ);
    this.azimuth = this._makeAzimuth();
    this.startInstance = 0;
    this.endInstance = 0;
    this.followLen = 0;
}
RouteSeg.prototype = {
	constructor : RouteSeg,

    updateFolowLen : function(followLen){
        this.followLen = followLen;
    },

    /**
     * 连续直行 Append的情况
     */
    updateEnd : function(end){
        this.end = end;
        this.segVec = YFM.Math.Vector.sub(this.end, this.start);
        this.lenSQ = YFM.Math.Vector.dot3(this.segVec, this.segVec);
        this.len = Math.sqrt(this.lenSQ);
        this.azimuth = this._makeAzimuth();
    },
    
    /**
     * 根据参数取线段上的点
     */
    getPoint : function(t){
        return YFM.Math.Vector.add(this.start, YFM.Math.Vector.scale(this.segVec, t));
    },


    /**
     * 从线段外一点尽可能向线段做正交投影
     * 返回投影点的参数
     */
    projection : function(position){
        var ps= YFM.Math.Vector.sub(position, this.start);
    
        var t = YFM.Math.Vector.dot3(ps, this.segVec) / this.lenSQ;
        
        if(t <= 0.0){
            return 0.0;
        }else if(t >= 1.0){
            return 1.0;
        }else{
            return t;
        }
    },

    /**
     * 计算段的方向角
     */
    _makeAzimuth : function(){
        
        var north = YFM.Math.Vector.vec(0, 1, 0);
        var segVec = YFM.Math.Vector.normalize(this.segVec);
        var cosTheta = YFM.Math.Vector.dot3(segVec, north);
        var angle = Math.acos(cosTheta);
        if(segVec[0] > 0){
            angle = 2 * Math.PI - angle;
        }
        return angle;
    }
};


/**
 * 楼层导航线
 */
function FloorRoute(size, floor, region, route)
{
    this.size = size;
    this.floor = floor;
    this.region = region;
    this.route = route;
    this.segList = [];
    this.posList = [];
    this.lastPos = null;
    this.box = null;

    this.lastSegVec = null;

    /**
     * 一个隐含的约束
     * 以参数记录在导航线上的最大历史路程
     */
    this.implicitRec = {
        maxT : 0.0,
        maxPos : null
    };
}
FloorRoute.prototype = {
	constructor : FloorRoute,

    getFloorRouteStartInstance : function(){
        return this.segList[0].startInstance;
    },

    getFloorRouteEndInstance : function(){
        var cnt = this.segList.length;
        return this.segList[cnt-1].endInstance;
    },

    makeBox : function(){
        if(this.lastPos){
            this.posList.push(this.lastPos);
            this.box = new OBB(this.posList);
        }
    },
    
    addSeg : function(pos0, pos1){

        this.posList.push(pos0);
        this.lastPos = pos1;

        var prevSeg = null;
        if(this.segList.length > 0){
            prevSeg = this.segList[this.segList.length - 1];
        }
        var curSeg = new RouteSeg(this.size, pos0, pos1, prevSeg);
        var curVec = YFM.Math.Vector.normalize(curSeg.segVec);
        var dot, lastSeg;

        /**
         * 有前序段时, 检查新段的方向是否和前序段一致
         * 如一致, 弹出前序段, 将其end修改为新段的end
         * 如不一致, 插入新段
         */
        if(null != this.lastSegVec){
            dot = YFM.Math.Vector.dot3(curVec, this.lastSegVec);
            //有些许误差也认为是方向一致
            if(Math.abs(dot - 1.0) < 0.00001){
                lastSeg = this.segList.pop();
                lastSeg.updateEnd(pos1);
                this.segList.push(lastSeg);
                this.route.addGlobalSeg(lastSeg, true);
            }else{
                this.segList.push(curSeg);
                this.route.addGlobalSeg(curSeg, false);
            }
        }else{
            this.segList.push(curSeg);
            this.route.addGlobalSeg(curSeg, false);
        }
        this.lastSegVec = curVec;
    },

    makeNaviStatus : function(naviStatus, regionLoc, limitIndex, deflection){
        var segCnt = this.segList.length;
        var t, projT, projPos, miniProjPos, distSQ, miniDistSQ, i, projIndex;
        var spDist, delta;

        if(segCnt <= 0){
            naviStatus.validate = false;
        }else{
            naviStatus.validate = true;

            miniDistSQ = Number.MAX_VALUE;

            var cnt = segCnt;
            if(-1 !== limitIndex){
                if(limitIndex < cnt){
                    cnt = limitIndex;
                }
            }
            if(cnt <= 0){
                naviStatus.validate = false;
                return;
            }
            
            for(i = 0; i < cnt; i++){
                t = this.segList[i].projection(regionLoc);
                projPos = this.segList[i].getPoint(t);
                distSQ = YFM.Math.Vector.distanceSQ(regionLoc, projPos);
                if(distSQ <= miniDistSQ){
                    miniDistSQ = distSQ;
                    miniProjPos = projPos;
                    projIndex = i;
                    projT = t;
                }
            }

            /**
             * 参数方式记录最大里程
             * 作为隐含的判断条件
             */
            t = projIndex + projT;
            /**
             * 如果还没有最大里程位置记录
             * 或者与真实位置距离超出10米
             * 就使用真实位置代替最大里程位置, 同时用真实位置的参数更新最大里程参数
             *
            if(t > this.implicitRec.maxT || null == this.implicitRec.maxPos || 
                YFM.Math.Vector.distanceSQ(this.implicitRec.maxPos, miniProjPos) > 10000){
                this.implicitRec.maxT = t;
                this.implicitRec.maxPos = YFM.Math.Vector.vecClone(miniProjPos);
                naviStatus.projection = miniProjPos;
            }else{

                
                //否则使用最大里程记录的位置 
                naviStatus.projection = YFM.Math.Vector.vecClone(this.implicitRec.maxPos);
            }*/
                naviStatus.projection = miniProjPos;

            /**
             * 约束后的投影点, 相对于投影所在段开始处的距离
             */
            spDist = YFM.Math.Vector.distance(naviStatus.projection, this.segList[projIndex].start);


            /**
             * 根据投影位置计算渲染路径结点时需要跳过的实例数
             */
            naviStatus.startInstance = this.segList[projIndex].startInstance + Math.ceil(spDist/(this.size*2.0));
            naviStatus.endInstance = this.segList[segCnt - 1].endInstance;

            /**
             * 由于规格的关系, errorDist已经没有意义, 可以完全被投影到位置的距离取代
             */
            naviStatus.projDist = YFM.Math.Vector.distance(naviStatus.projection, regionLoc);

            /**
             * 由于导航线已经预处理过, 连续直行距离就是投影位置到当前段末的距离
             */
            naviStatus.serialDist = YFM.Math.Vector.distance(naviStatus.projection, this.segList[projIndex].end);

            /**
             * 下一段连续直行距离和建议
             */
            if((projIndex + 1) < segCnt){
                naviStatus.nextSerialDist = this.segList[projIndex+1].len;

                delta = this.segList[projIndex+1].azimuth - this.segList[projIndex].azimuth;
                if(delta < 0.0){
                    delta += Math.PI*2.0;
                }

                /**
                 * ±10度的范围视作前向
                 */
                if(delta <= 0.175 || delta >= 6.11) {
                    naviStatus.nextSug = YFM.Map.Navigate.NextSuggestion.FRONT;
                }else if(delta < Math.PI){
                    naviStatus.nextSug = YFM.Map.Navigate.NextSuggestion.LEFT;
                }else{
                    naviStatus.nextSug = YFM.Map.Navigate.NextSuggestion.RIGHT;
                }
            }else{
                naviStatus.nextSerialDist = 0.0;
                naviStatus.nextSug = YFM.Map.Navigate.NextSuggestion.ARRIVE;
            }


            naviStatus.goalDist = naviStatus.serialDist;
            for(i = projIndex+1; i < segCnt; i++){
                naviStatus.goalDist += this.segList[i].len;
            }

            naviStatus.globalDist = naviStatus.goalDist + this.segList[segCnt-1].followLen;

            /**
             * 目前JS不处理方向, 所以sug只填NONE
             */
            naviStatus.azimuth = this.segList[projIndex].azimuth;

            naviStatus.sug = this.makeCurrentSug(this.region.azimuth, naviStatus.azimuth);
        }
    },

    makeCurrentSug : function(devAzimuth, segAzimuth){

        var delta, sug;

        delta = segAzimuth - devAzimuth;

        if(delta< 0){
            delta = 360.0 + delta;
        }
        if((delta > 337.5  && delta <= 0) || 
           (delta > 0      && delta <= 22.5)){
            sug = YFM.Map.Navigate.Suggestion.FRONT;
        }else if(delta > 22.5 && delta <= 67.5){
            sug = YFM.Map.Navigate.Suggestion.FRONT;
        }else if(delta > 67.5 && delta <= 112.5){
            sug = YFM.Map.Navigate.Suggestion.RIGHT;
        }else if(delta > 112.5 && delta <= 157.5){
            sug = YFM.Map.Navigate.Suggestion.BACKWARD;
        }else if(delta > 157.5 && delta <= 202.5){
            sug = YFM.Map.Navigate.Suggestion.BACKWARD;
        }else if(delta > 202.5 && delta <= 247.5){
            sug = YFM.Map.Navigate.Suggestion.BACKWARD;
        }else if(delta > 247.5 && delta <= 292.5){
            sug = YFM.Map.Navigate.Suggestion.LEFT;
        }else{
            sug = YFM.Map.Navigate.Suggestion.FRONT;
        }
        return sug;
    },

    getLength : function(){
        return this.segList.length;
    }, 
    getSeg : function(i){
        return this.segList[i];
    }
}



function RegionTouchMgr(camera, canvas, ctx2d, region, listener)
{
    this.hangUp = false;
    this.camera = camera;
    this.canvas = canvas;
    this.ctx2d = ctx2d;
    this.region = region;
    this.listener = listener;
    this.touchFloorIndex = -1;
    this.focusFloorDirty = true;
    this.enable = true;
    this.isMobile = this._isMobileBrowser();
    this.uiScaleRate = 1.0;
    this.overlook = false;

    this.longPressFlag = false;

    this.touchRec = {
        savedmat : YFM.Math.Matrix.matClone(region._getRegionMat()),
        pitchCnt : 0,
        degree : 0,
        screenSpacing: 0,
        viewSpacing: 0,
        radius0x : 0,
        radius0y : 0,
        layer0x : 0,
        layer0y : 0,
        layer1x : 0,
        layer1y : 0,
        dy0 : 0,
        dy1 : 0,
        start0x : 0,
        start0y : 0,
        start1x : 0,
        start1y : 0,
        pre0y : 0,
        pre1y : 0,
        midX : 0,
        midY : 0
    };

    this.planeRec = {
        planeHeight : 0,
        midpos : null,
        start0 : null,
        start1 : null,
        prev : null,
        translateX : 0,
        translateY : 0,
        firstAngle : 0
    };

    /**
     * pos和offset这里不需要维护一份了, 这数据其实在相机那有一份, 
     * 这里再维护, 一来冗余, 而来浪费同步调用
     */
    this.viewZoom = {
        max : 3000,
        min : 150
    };


    var mgr = this;

    this.strategy_desktop = {
        timeStampPrev : 0,
        timeStampCur : 0,
        clickFlag : false,
        pitchLock : false,
        rotateLock : false,
        zoomLock : false,
        zoomTarget : null,
        deltaPitch : 0.0,
        deltaAngle : 0.0,
        mousePressed : false,

        mouseDown : function(event){
            this.timeStampPrev = this.timeStampCur;
            this.timeStampCur = new Date().getTime();
            mgr.planeRec.planeHeight = mgr._touch_plane_height(
                mgr.touchRec.layer0x,
                mgr.touchRec.layer0y);

            mgr.touchRec.savedmat = YFM.Math.Matrix.matClone(mgr.region._getRegionMat());

            mgr.planeRec.start0 = mgr._pos_in_world_space(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
            mgr.planeRec.translateX = 0.0;
            mgr.planeRec.translateY = 0.0;
            this.mousePressed = true;
            this.rotateLock = false;
            this.pitchLock = false;
            this.zoomLock = false;
        },

        mouseUp : function(event){

            var timeStamp = new Date().getTime();
            var tx = mgr.planeRec.translateX;
            var ty = mgr.planeRec.translateY;

            if(this.rotateLock || this.pitchLock || this.zoomLock)
                return;

            /**
             * click标志为false时, 进入Click判断
             */
            if(!this.clickFlag){
                var clickElapse = timeStamp - this.timeStampCur;
                if((tx*tx + ty*ty) < 100){//允许指针有少许移动
                    if(clickElapse < 100){//100毫秒内视为Click
                        this.clickFlag = true;//click标志设为true
                        var ctx = this;

                        /**
                         * 延时200毫秒等待双击的判断
                         * 如果没有检查到双击, click标志仍然是true, 就触发一个稍有延迟的click
                         */
                        setTimeout(function(){
                            if(ctx.clickFlag){
                                ctx.clickFlag = false;
                                mgr._onClick(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
                            }
                        }, 200);

                    }else if(clickElapse > 800){
                        /**
                         * 在click标志false时检查长按
                         */
                        mgr._onLongPressUp(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
                    }
                }

            }else{
                /**
                 * 如果已经是click标志为true了, 就检查双击
                 */
                var dclickElapse = timeStamp - this.timeStampPrev;
                if((tx*tx + ty*ty) < 100){
                    if(dclickElapse < 200){//第一次抬起两百毫秒内再次抬起视为双击
                        mgr._onDClick(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
                    }
                }
                /**
                 * 只要进行了双击检定, 不论是否满足双击, 都清掉click标志
                 */
                this.clickFlag = false;
            }

            this.mousePressed = false;
            this.deltaAngle = 0.0;
            this.deltaPitch = 0.0;
        },
        mouseLeave : function(event){
            this.mousePressed = false;
            this.deltaAngle = 0.0;
            this.deltaPitch = 0.0;
        },


        mouseMove : function(event){
            if(!mgr.enable){
                return ;
            }


            /**
             * 发生拖动时, 如果不是触摸态, 就切到触摸态
             */
            if(this.mousePressed && YFM.Map.STATUS_TOUCH !== mgr.region.getStatus()){
                mgr.region.setStatus(YFM.Map.STATUS_TOUCH);
            }

            /**
             * NORMAL_TOUCH状态才支持平移
             */
            if(this.mousePressed && !this.pitchLock && !this.rotateLock && !this.zoomLock){
                var cur = mgr._pos_in_world_space(mgr.touchRec.layer0x, mgr.touchRec.layer0y);

                mgr.planeRec.translateX = (cur[0] - mgr.planeRec.start0[0]);
                mgr.planeRec.translateY = (cur[1] - mgr.planeRec.start0[1]);


                var mat = YFM.Math.Matrix.postTranslate(mgr.touchRec.savedmat, 
                                    mgr.planeRec.translateX, mgr.planeRec.translateY, 0);
                //不检查这个条件就可以推广到全楼层
                if(mgr.region.displayFloorIndex === mgr.touchFloorIndex){


                    if(mgr._mapConstraint(mgr.camera.getPVMat(), mat)){
                        return;
                    }
                }
                mgr.region._setRegionMat(mat);
                mgr._onScroll(mgr.planeRec.translateX, mgr.planeRec.translateY);
                mgr.focusFloorDirty = true;
            }
        },

        mouseWheel : function(event){
            if(!mgr.enable){
                return ;
            }
            if(!this.zoomLock){
                this.zoomLock = true;
            }

            if(this.zoomLock){
                var delta = -event.wheelDelta/2.0;

                mgr.planeRec.planeHeight = mgr._touch_plane_height(
                    mgr.touchRec.layer0x,
                    mgr.touchRec.layer0y);

                var zoomTarget = mgr._world_to_view(mgr._pos_in_world_space(mgr.touchRec.layer0x, mgr.touchRec.layer0y));
                var orgViewSpace = YFM.Math.Vector.pos(0, 0, 0);
                var deltaVectorRaw = YFM.Math.Vector.sub(orgViewSpace, zoomTarget);
                var deltaVector = YFM.Math.Vector.normalize(deltaVectorRaw);
                var viewPos = mgr.camera.getLookOffset();

                /**
                 * 简单约束一下
                 */
                if(delta > 0.0){
                    var viewPosNorm = YFM.Math.Vector.norm3(viewPos);
                    if(viewPosNorm >= mgr.viewZoom.max){
                        delta = 0.0;
                    }
                }else if(delta < 0.0 && (0 === mgr.touchFloorIndex || mgr.region.displayFloorIndex === mgr.touchFloorIndex)){
                    var deltaRawNorm = YFM.Math.Vector.norm3(deltaVectorRaw);
                    if(deltaRawNorm <= mgr.viewZoom.min){
                        delta = 0.0;
                    }
                }

                YFM.Math.Vector.scaleTo(deltaVector, delta);
                YFM.Math.Vector.subTo(viewPos, viewPos, deltaVector);
                mgr.camera.setLookOffset(viewPos[0], viewPos[1], viewPos[2]);
                mgr.focusFloorDirty = true;
            }
        },

        keyPress : function(event){
            if(!mgr.enable){
                return ;
            }

            if(this.mousePressed){

                var rotateFlag = false;
                var pitchFlag = false;
                if('a' === event.key){
                    this.deltaAngle += 1.0;
                    rotateFlag = true;
                }else if('d' === event.key){
                    this.deltaAngle -= 1.0;
                    rotateFlag = true;
                }else if('w' == event.key){
                    this.deltaPitch = -1.0;        
                    pitchFlag = true;
                }else if('s' == event.key){
                    this.deltaPitch = 1.0;
                    pitchFlag = true;
                }

                if(!this.rotateLock && rotateFlag){
                    this.rotateLock = true;
                    mgr.touchRec.savedmat = YFM.Math.Matrix.matClone(mgr.region._getRegionMat());
                    mgr.planeRec.start0 = mgr._pos_in_world_space(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
                    //这里每次要把deltaAngle重置
                    this.deltaAngle = 0.0;
                }
                
                if(this.rotateLock){
                    
                    var mat = YFM.Math.Matrix.postRotateXY(mgr.touchRec.savedmat, this.deltaAngle,
                                                            mgr.planeRec.start0[0],
                                                            mgr.planeRec.start0[1]);
                    if(mgr._mapConstraint(mgr.camera.getPVMat(), mat)){
                        return;
                    }
                    mgr.region._setRegionMat(mat);
                    mgr.focusFloorDirty = true;
                }

                if(!this.pitchLock && pitchFlag){
                    var cur = mgr.planeRec.start0 = mgr._pos_in_world_space(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
                    mgr.camera.resetLookOffsetTan();
                    mgr.region.lookAtWorldLoc(
                        cur[0],
                        cur[1],
                        cur[2]);
                    this.pitchLock = true;
                }


                if(this.pitchLock){
                    var pitch = mgr.camera.getPitch();
                    pitch += this.deltaPitch;
                    if(pitch <= -45.0 && this.deltaPitch < 0.0){
                        pitch = -45.0;
                    }else if(pitch  >= 0.0 && this.deltaPitch > 0.0){
                        pitch = 0.0;
                        if(!mgr.overlook){
                            mgr.region._onOverlook(true);
                            mgr.overlook = true;
                        }
                    }else if(pitch <= 0.0 && this.deltaPitch < 0.0){
                        if(mgr.overlook){
                            mgr.region._onOverlook(false);
                            mgr.overlook = false;
                        }
                    }

                    mgr.camera.setPitch(pitch);
                    mgr.focusFloorDirty = true;
                }

            }
        }
    };
    this.strategy_none = {
        name : "none",
        timeStampPrev : 0,
        timeStampCur : 0,
        clickFlag : false,
        twoFingerClickFlag : false,
        timeStampTwoFinger : 0,

        mouseDown : function(event){
            mgr._onMouseDown(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
        },

        touchDown : function(event){
            this.timeStampPrev = this.timeStampCur;
            this.timeStampCur = new Date().getTime();
            mgr.longPressFlag = false;

            if(1 == event.touches.length){
                
                /**
                 * 这个属性很重要, 要在第一次触摸时就决定
                 */
                mgr.planeRec.planeHeight = mgr._touch_plane_height(
                    mgr.touchRec.layer0x,
                    mgr.touchRec.layer0y);


                mgr.hangUp = false;
                mgr.touchRec.savedmat = YFM.Math.Matrix.matClone(mgr.region._getRegionMat());
                mgr.touchRec.start0x = mgr.touchRec.layer0x;
                mgr.touchRec.start0y = mgr.touchRec.layer0y;
                mgr.touchRec.radius0x = event.touches[0].radiusX;
                mgr.touchRec.radius0y = event.touches[0].radiusY;
                

                mgr.planeRec.prev = mgr.planeRec.start0 = mgr._pos_in_world_space(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
                mgr.planeRec.translateX = 0.0;
                mgr.planeRec.translateY = 0.0;

            }else if(event.touches.length > 1){
                if(!mgr.enable){
                    return ;
                }

                /**
                 * 这里实际是把touchDown 在单指时做的重新做了一遍
                 * 略有浪费, 但是是必要的, 原来没有这块, 在Chrome上表现不错
                 * 但在safari上双指手势总有点不对, 原因就是这里, safari中, 双指同时按下只会进来一次
                 * touches.length=2, 之前手势效果不对是因为, 这种时候, 实际上start0x,之类的数据是上次的
                 * 当然会出现问题
                 */
                {
                    this.startTime = event.timeStamp;
                    
                    /**
                     * 这个属性很重要, 要在第一次触摸时就决定
                     */
                    mgr.planeRec.planeHeight = mgr._touch_plane_height(
                        mgr.touchRec.layer0x,
                        mgr.touchRec.layer0y);


                    mgr.hangUp = false;
                    mgr.touchRec.savedmat = YFM.Math.Matrix.matClone(mgr.region._getRegionMat());
                    mgr.touchRec.start0x = mgr.touchRec.layer0x;
                    mgr.touchRec.start0y = mgr.touchRec.layer0y;
                    mgr.touchRec.radius0x = event.touches[0].radiusX;
                    mgr.touchRec.radius0y = event.touches[0].radiusY;
                    

                    mgr.planeRec.prev = mgr.planeRec.start0 = mgr._pos_in_world_space(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
                    mgr.planeRec.translateX = 0.0;
                    mgr.planeRec.translateY = 0.0;
                }




                mgr.touchRec.start1x = mgr.touchRec.layer1x;
                mgr.touchRec.start1y = mgr.touchRec.layer1y;
                mgr.planeRec.start1 = mgr._pos_in_world_space(mgr.touchRec.layer1x, mgr.touchRec.layer1y);

                mgr.touchRec.screenSpacing = mgr._spacingScreenSpace(
                    mgr.touchRec.start0x, mgr.touchRec.start0y,
                    mgr.touchRec.start1x, mgr.touchRec.start1y);
                mgr.touchRec.viewSpacing = mgr._spacingViewSpace(
                    mgr.touchRec.start0x, mgr.touchRec.start0y,
                    mgr.touchRec.start1x, mgr.touchRec.start1y).spacing;

                mgr.planeRec.midpos = mgr._midpoint(
                    mgr.touchRec.layer0x, mgr.touchRec.layer0y,
                    mgr.touchRec.layer1x, mgr.touchRec.layer1y);


                mgr.planeRec.firstAngle = mgr._calc_angle(event);

                mgr.strategy = mgr.strategy_multi;
                //debug.log("none touchdown to multi");
            }
        },
        touchMove : function(event){
            if(!mgr.enable){
                return ;
            }
            var dx, dy
            dx = mgr.touchRec.layer0x - mgr.touchRec.start0x;
            dy = mgr.touchRec.layer0y - mgr.touchRec.start0y;


            if(1 == event.touches.length && (dx*dx + dy*dy) > 100){
                mgr.strategy = mgr.strategy_scroll;
            }
        },
        touchUp : function(event){
            var timeStamp = new Date().getTime();
            /**
             * click标志为false时, 进入Click判断
             */
            if(!this.clickFlag){
                var clickElapse = timeStamp - this.timeStampCur;
                if(clickElapse < 100){//100毫秒内视为Click
                    this.clickFlag = true;//click标志设为true
                    var ctx = this;

                    /**
                     * 注意, 经测试, 手势的双击等待时间最好比鼠标的长点从200->300是个较好的选择
                     * 延时300毫秒等待双击的判断
                     * 如果没有检查到双击, click标志仍然是true, 就触发一个稍有延迟的click
                     */
                    setTimeout(function(){
                        if(ctx.clickFlag){
                            ctx.clickFlag = false;

                            /**
                             * click除了要被后续的dclick吞噬
                             * 还会被它之前的twoFingerClick吞噬
                             */
                            if(ctx.twoFingerClickFlag){
                                ctx.twoFingerClickFlag = false;
                            }else{
                                mgr._onClick(mgr.touchRec.start0x, mgr.touchRec.start0y);
                            }
                        }
                    }, 300);

                }else if(clickElapse > 800){
                    /**
                     * 在click标志false时检查长按
                     */
                    if(!mgr.longPressFlag)
                        mgr._onLongPressUp(mgr.touchRec.start0x, mgr.touchRec.start0y);
                }

            }else{
                /**
                 * 如果已经是click标志为true了, 就检查双击
                 */
                var dclickElapse = timeStamp - this.timeStampPrev;
                if(dclickElapse < 300){//第一次抬起三百毫秒内再次抬起视为双击
                    mgr._onDClick(mgr.touchRec.start0x, mgr.touchRec.start0y);
                }
                /**
                 * 只要进行了双击检定, 不论是否满足双击, 都清掉click标志
                 */
                this.clickFlag = false;
            }

            if(0 == event.touches.length){
                mgr.hangUp = false;
                //mgr.touchFloorIndex = -2;
            }
        },
        touchCancel : function(event){
            mgr.hangUp = false;
            //mgr.touchFloorIndex = -1;
        }
    };

    this.strategy_multi = {
        name : "multi",
        mouseDown : function(event){
            mgr._onMouseDown(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
        },
        touchDown : function(event){

        },
        touchMove : function(event){

            mgr.touchRec.pitchCnt = 0;
            mgr.strategy = mgr.strategy_rotate;

        },
        touchUp : function(event){

            mgr.hangUp = false;
            var timeStamp = new Date().getTime();
            var clickElapse = timeStamp - mgr.strategy_none.timeStampCur;
            if(clickElapse < 100){//100毫秒内为双指单击

                /**
                 * 如果双指间距大于250不再视为双指单击
                 */
                if(mgr.touchRec.screenSpacing < 300){
                    mgr._on2FClick(mgr.touchRec.start0x, mgr.touchRec.start0y);
                }
                mgr.strategy_none.twoFingerClickFlag = true;
            }
            mgr.strategy = mgr.strategy_none;
        },
        touchCancel : function(event){
            mgr.strategy = mgr.strategy_none;
            mgr.hangUp = false;
        }
    };
    this.strategy_scroll = {
        name : "scroll",
        mouseDown : function(event){
            mgr._onMouseDown(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
        },
        touchDown : function(event){

            if(event.touches.length > 1){

                mgr.touchRec.savedmat = YFM.Math.Matrix.matClone(mgr.region._getRegionMat());
                mgr.touchRec.start0x = mgr.touchRec.layer0x;
                mgr.touchRec.start0y = mgr.touchRec.layer0y;

                mgr.touchRec.start1x = mgr.touchRec.layer1x;
                mgr.touchRec.start1y = mgr.touchRec.layer1y;

                    mgr.touchRec.screenSpacing = mgr._spacingScreenSpace(
                        mgr.touchRec.layer0x, mgr.touchRec.layer0y,
                        mgr.touchRec.layer1x, mgr.touchRec.layer1y);
                    mgr.touchRec.viewSpacing = mgr._spacingViewSpace(
                        mgr.touchRec.layer0x, mgr.touchRec.layer0y,
                        mgr.touchRec.layer1x, mgr.touchRec.layer1y).spacing;

                mgr.planeRec.midpos = mgr._midpoint(
                    mgr.touchRec.layer0x, mgr.touchRec.layer0y,
                    mgr.touchRec.layer1x, mgr.touchRec.layer1y);


                mgr.planeRec.firstAngle = mgr._calc_angle(event);
                mgr.strategy = mgr.strategy_multi;
            }
        },
        touchMove : function(event){

            /**
             * 发生拖动时, 如果不是触摸态, 就切到触摸态
             */
            if(YFM.Map.STATUS_TOUCH !== mgr.region.getStatus()){
                mgr.region.setStatus(YFM.Map.STATUS_TOUCH);
            }

            /**
             * NORMAL_TOUCH状态才支持平移
             */
            {
                var cur = mgr._pos_in_world_space(mgr.touchRec.layer0x, mgr.touchRec.layer0y);

                mgr.planeRec.translateX = (cur[0] - mgr.planeRec.start0[0]);
                mgr.planeRec.translateY = (cur[1] - mgr.planeRec.start0[1]);

                mgr.planeRec.prev = cur;

                var mat = YFM.Math.Matrix.postTranslate(mgr.touchRec.savedmat, 
                                    mgr.planeRec.translateX, mgr.planeRec.translateY, 0);
                //不检查这个条件就可以推导到全楼层
                if(mgr.region.displayFloorIndex === mgr.touchFloorIndex){
                    var Matrix = YFM.Math.Matrix;
                    var Vector = YFM.Math.Vector;
                    var near_ndc, far_ndc, near_world, far_world;
                    var pvrm, ipvrm;
                    var ray0, ray1;

                    near_ndc = Vector.pos(0, 0, -1.0);
                    far_ndc = Vector.pos(0, 0, 1.0);

                    pvrm = Matrix.mul(mgr.camera.getPVMat(), mgr.region.matRegion);
                    ipvrm = Matrix.invert(pvrm);
                    near_world = Matrix.mulVec(ipvrm, near_ndc);
                    far_world = Matrix.mulVec(ipvrm, far_ndc);
                    near_world[0] /= near_world[3];
                    near_world[1] /= near_world[3];
                    near_world[2] /= near_world[3];
                    near_world[3] /= near_world[3];
                    far_world[0] /= far_world[3];
                    far_world[1] /= far_world[3];
                    far_world[2] /= far_world[3];
                    far_world[3] /= far_world[3];
                    ray0 = YFM.Math.Line.linePP(near_world, far_world);

                    pvrm = Matrix.mul(mgr.camera.getPVMat(), mat);
                    ipvrm = Matrix.invert(pvrm);
                    near_world = Matrix.mulVec(ipvrm, near_ndc);
                    far_world = Matrix.mulVec(ipvrm, far_ndc);
                    near_world[0] /= near_world[3];
                    near_world[1] /= near_world[3];
                    near_world[2] /= near_world[3];
                    near_world[3] /= near_world[3];
                    far_world[0] /= far_world[3];
                    far_world[1] /= far_world[3];
                    far_world[2] /= far_world[3];
                    far_world[3] /= far_world[3];
                    ray1 = YFM.Math.Line.linePP(near_world, far_world);

                    var floor = mgr.region.floors[mgr.touchFloorIndex];
                    var dist0 = floor.intersectionLine(ray0);
                    var dist1 = floor.intersectionLine(ray1);

                    if(dist1 < dist0){
                        return;
                    }
                }
                mgr.region._setRegionMat(mat);
                mgr._onScroll(mgr.planeRec.translateX, mgr.planeRec.translateY);
                mgr.focusFloorDirty = true;
            }
        },
        touchUp : function(event){

            var timeStamp = new Date().getTime();
            var clickElapse = timeStamp - mgr.strategy_none.timeStampCur;
            if(clickElapse < 100){//100毫秒内为双指单击
                //debug.log("scroll -- double finger click");
            }else{
                //debug.log("scroll -- double finger check faild elapse:"+clickElapse);
            }

            mgr.hangUp = false;
            mgr.strategy = mgr.strategy_none;
            if(0 == event.touches.length){
                //mgr.touchFloorIndex = -1;
            }
        },
        touchCancel : function(event){

            mgr.hangUp = false;
            mgr.strategy = mgr.strategy_none;
            //mgr.touchFloorIndex = -1;
        }
    };
    this.strategy_rotate = {
        name : "rotate",
        mouseDown : function(event){
        },
        touchDown : function(event){

        },
        touchMove : function(event){

            var prePitch;
            var prePV = mgr.camera.getPVMat();

            if(mgr.hangUp || event.touches.length < 2){
                return;
            }
            /**
             * 触摸模式以外, 只支持拉近拉远
             */
            if(YFM.Map.STATUS_TOUCH !== mgr.region.getStatus()){
                var newScreenSpacing = mgr._spacingScreenSpace(
                        mgr.touchRec.layer0x, mgr.touchRec.layer0y, 
                        mgr.touchRec.layer1x, mgr.touchRec.layer1y);
                var delta = mgr.touchRec.screenSpacing - newScreenSpacing;

                var offset = -mgr.camera.getLookOffsetNormal();
                offset += delta/20.0;
                if(offset > mgr.viewZoom.max){
                    offset = mgr.viewZoom.max;
                }else if(offset < mgr.viewZoom.min){
                    offset = mgr.viewZoom.min;
                }
                mgr.camera.setLookOffset(0, 0, -offset);
                return;
            }

            /**
             * 检查是否需要调整俯仰, 双指同时往上或往下滑动时调整俯仰
             * 杜甫草堂不需要触摸调整俯仰
            {
                var dy0 = mgr.touchRec.layer0y - mgr.touchRec.start0y;
                var dy1 = mgr.touchRec.layer1y - mgr.touchRec.start1y;
                if((dy0 * dy1) > 0){
                    var delta = dy0/256.0;

                    var pitch = mgr.camera.getPitch();

                    pitch += delta;
                    if(pitch <= -45.0 && delta < 0.0){
                        pitch = -45.0;
                    }else if(pitch  >= 0.0 && delta > 0.0){
                        pitch = 0.0;
                        if(!mgr.overlook){
                            mgr.region._onOverlook(true);
                            mgr.overlook = true;
                        }
                    }else if(pitch <= 0.0 && delta < 0.0){
                        if(mgr.overlook){
                            mgr.region._onOverlook(false);
                            mgr.overlook = false;
                        }
                    }
                    prePitch = mgr.camera.getPitch();
                    mgr.camera.setPitch(pitch);
                    //mgr.focusFloorDirty = true;//由于后面可能会中途返回, 这个标志先设一下
                }
            }*/
            ///////

            /**
             * 后面用拉镜头模拟缩放, 以及处理旋转
             */
            var newScreenSpacing = mgr._spacingScreenSpace(
                    mgr.touchRec.layer0x, mgr.touchRec.layer0y, 
                    mgr.touchRec.layer1x, mgr.touchRec.layer1y);
            if(newScreenSpacing < 200){
                return;
            }else{

                var newViewSpacing = mgr._spacingViewSpace(
                    mgr.touchRec.layer0x, mgr.touchRec.layer0y, 
                    mgr.touchRec.layer1x, mgr.touchRec.layer1y);

                var angle = mgr._calc_angle(event);
                var deltaAngle = angle - mgr.planeRec.firstAngle;
                var mat = YFM.Math.Matrix.postRotateXY(mgr.touchRec.savedmat, deltaAngle, mgr.planeRec.midpos[0], mgr.planeRec.midpos[1], true);

                
                /**
                 * 因为我们计算手势spacing是使用的视空间中的两个位置,
                 * 如果视空间中触摸点的z比较小, 这时的缩放效果会出现异常
                 * 最典型的情景就是多层地图, 触摸高层手势拉近, 当视空间原点离触摸的楼层很近时
                 * 这个spacing的值是很小的, 而人手触摸的信号有一些自然噪声, 导致spacing在0附近不断变动
                 * 此时还通过spacing来计算拉近的deltaZoom, 会出现一些震荡的效果, 
                 * 我们检测到z比较小, 又处于拉近时, 产生一个较大的deltaZoom直接跨过这段区域, 效果不错
                 */
                var deltaZoom = (mgr.touchRec.viewSpacing - newViewSpacing.spacing)/2.0;
                if(deltaZoom < 0 && newViewSpacing.z < 0.0 && newViewSpacing.z > -20.0){
                    deltaZoom = -30;
                }



                var midposViewSpace = mgr._world_to_view(mgr.planeRec.midpos);
                var orgViewSpace = YFM.Math.Vector.pos(0, 0, 0);
                var deltaRaw = YFM.Math.Vector.sub(orgViewSpace, midposViewSpace);
                var delta = YFM.Math.Vector.normalize(deltaRaw);


                var viewPos = mgr.camera.getLookOffset();

                /**
                 * 简单约束一下
                 */
                if(deltaZoom > 0.0){
                    var viewPosNorm = YFM.Math.Vector.norm3(viewPos);
                    if(viewPosNorm >= mgr.viewZoom.max){
                        deltaZoom = 0.0;
                    }
                }else if(deltaZoom < 0.0 && (0 === mgr.touchFloorIndex || mgr.region.displayFloorIndex === mgr.touchFloorIndex)){
                    var deltaRawNorm = YFM.Math.Vector.norm3(deltaRaw);
                    if(deltaRawNorm <= mgr.viewZoom.min){
                        deltaZoom = 0.0;
                    }
                }


                YFM.Math.Vector.scaleTo(delta, deltaZoom);

                var newPos = YFM.Math.Vector.sub(viewPos, delta);
                mgr.camera.setLookOffset(newPos[0], newPos[1], newPos[2]);

                /*
                if(mgr._mapConstraint(prePV, mat)){
                    mgr.camera.setLookOffset(viewPos[0], viewPos[1], viewPos[2]);
                    if(prePitch)
                        mgr.camera.setPitch(prePitch);
                    return;
                }else{
                    mgr.region._setRegionMat(mat);
                }*/
                    mgr.region._setRegionMat(mat);
            }
            mgr.focusFloorDirty = true;
        },
        touchUp : function(event){


            if(event.touches.length>1){
                mgr.hangUp = true;
            }else if(event.touches.length>=0){
                mgr.hangUp = false;
                mgr.strategy = mgr.strategy_none;
                mgr.longPressFlag = true;//这是为了兼容安卓和ios的双指状态放开的微小差异
                mgr.touchRec.savedmat = YFM.Math.Matrix.matClone(mgr.region._getRegionMat());
                mgr.touchRec.start0x = mgr.touchRec.layer0x;
                mgr.touchRec.start0y = mgr.touchRec.layer0y;
                

                mgr.planeRec.prev = mgr.planeRec.start0 = mgr._pos_in_world_space(mgr.touchRec.layer0x, mgr.touchRec.layer0y);
                mgr.planeRec.translateX = 0.0;
                mgr.planeRec.translateY = 0.0;
                
                /**
                 * 这里有蹊跷, safari 双指触摸touchend时touches长度为0, 而chrome为1
                 * 先两个都视为停止楼层触摸
                 */
                //mgr.touchFloorIndex = -1;
                //
                var timeStamp = new Date().getTime();
                var clickElapse = timeStamp - mgr.strategy_none.timeStampCur;
                if(clickElapse < 100){//100毫秒内为双指单击

                    /**
                     * 如果双指间距大于300不再视为双指单击
                     */
                    if(mgr.touchRec.screenSpacing < 300){
                        mgr._on2FClick(mgr.touchRec.start0x, mgr.touchRec.start0y);
                    }
                    mgr.strategy_none.twoFingerClickFlag = true;
                }
            }else{
                mgr.strategy = mgr.strategy_none;
                //mgr.touchFloorIndex = -1;
            }
        },
        touchCancel : function(event){
            mgr.hangUp = false;
            mgr.strategy = mgr.strategy_none;
            //mgr.touchFloorIndex = -1;
        }
    };

    this.strategy = this.strategy_none;

    function onTouch(event){

        /**
         * 如果触摸被禁用, 这里就忽略后面的东西了
         */
        if(!mgr.enable){
            return;
        }
        event.preventDefault();
                
        /**
         * 计算得到与控件位置/滚动条 无关的事件位置
         */
        mgr._updateEventLayerPos(event);


        switch(event.type){
            case "touchstart":{
                mgr.strategy.touchDown(event);
                break;
            }

            case "touchmove":{
                mgr.strategy.touchMove(event);
                break;
            }

            case "touchend":{
                mgr.strategy.touchUp(event);
                break;
            }
            case "touchcancel":{
                mgr.strategy.touchCancel(event);
                break;
            }
        }
    };

    function onMouseKeyboard(event){


        /**
         * 如果触摸被禁用, 这里就忽略后面的东西了
         */
        if(!mgr.enable){
            return;
        }
        event.preventDefault();
                
        /**
         * 计算得到与控件位置/滚动条 无关的事件位置
         */


        switch(event.type){

            case "mousedown":{
                mgr._updateEventLayerPos(event);
                mgr.strategy_desktop.mouseDown(event);
                break;
            }
            case "mouseup":{
                mgr._updateEventLayerPos(event);
                mgr.strategy_desktop.mouseUp(event);
                break;
            }
            case "mouseleave":{
                mgr._updateEventLayerPos(event);
                mgr.strategy_desktop.mouseLeave(event);
            }
            case "mousemove":{
                mgr._updateEventLayerPos(event);
                mgr.strategy_desktop.mouseMove(event);
                break;
            }
            case "mousewheel":{
                mgr._updateEventLayerPos(event);
                mgr.strategy_desktop.mouseWheel(event);
                break;
            }
            case "keypress":{
                mgr.strategy_desktop.keyPress(event);
                break;
            }
        }
    };

    if(this.isMobile){
        canvas.addEventListener("touchstart", onTouch, false);
        canvas.addEventListener("touchmove", onTouch, false);
        canvas.addEventListener("touchend", onTouch, false);
        canvas.addEventListener("touchcancel", onTouch, false);
    }else{
        document.onkeypress = onMouseKeyboard;

        canvas.addEventListener("mousedown", onMouseKeyboard, false);
        canvas.addEventListener("mouseup", onMouseKeyboard, false);
        canvas.addEventListener("mousemove", onMouseKeyboard, false);
        canvas.addEventListener("mouseleave", onMouseKeyboard, false);
        canvas.addEventListener("mousewheel", onMouseKeyboard, false);
    }

}

RegionTouchMgr.prototype = {
	constructor : RegionTouchMgr,

    setUIScaleRate : function(rate){
        this.uiScaleRate = rate;
    },

    getViewOffsetMax : function(){
        return this.viewZoom.max;
    },

    getViewOffsetMin : function(){
        return this.viewZoom.min;
    },

    setEnable : function(enable){
        this.enable = enable;
    },

    onRegionLoadFinish : function(){
        this.focusFloorDirty = true;
    },

    getTouchFloor : function(){
        return this.touchFloorIndex;
    },
    getFocusFloorIndex : function(){
        if(!this.focusFloorDirty){
            return this.focusFloorIndex;
        }


        var ret, cnt, max, i, last_0_index, max_index;
        var floor_index = -1;

        /**
         * 检查视野中心
         */
        ret = this._floors_collision(this.canvas.width/2.0, this.canvas.height/2.0);
        max = -100000000.0;
        max_index = -1;
        last_0_index = -1;
        cnt = ret.length;
        for(i = 0; i < cnt; i++){
            if(ret[i] < 0 && ret[i] > max){
                max = ret[i];
                max_index = i;
            }

            if(0 == ret[i]){
                last_0_index = i;
            }
        }

        /**
         * 如果有楼层在视野中心, 选择最高那层
         */
        if(last_0_index >= 0){
            floor_index = last_0_index;
        }else if(max_index >= 0){
        /**
         * 如果没有楼层在视野中心, 选择离楼层范围最近那层
         */

            floor_index = max_index;
        }

        this.focusFloorIndex = floor_index;
        this.focusFloorDirty = false;
        return this.focusFloorIndex;
    },
    
    setZoomMax : function(max){
        this.viewZoom.max = max;
    },

    setZoomMin : function(min){
        this.viewZoom.min = min;
    },

    postTranslate : function(x, y){

        var savedmat = YFM.Math.Matrix.matClone(this.region._getRegionMat());
        var mat = YFM.Math.Matrix.postTranslate(savedmat, x, y, 0);
        if(this._mapConstraint(this.camera.getPVMat(), mat)){
            return;
        }
        this.region._setRegionMat(mat);
        this._onScroll(x, y);
        this.focusFloorDirty = true;
    },

    postRotate : function(deg){
        
        var mid = this._pos_in_world_space(this.region.hw, this.region.hh);
        var savedmat = YFM.Math.Matrix.matClone(this.region._getRegionMat());
        var mat = YFM.Math.Matrix.postRotateXY(savedmat, deg,  mid[0], mid[1]);
        if(this._mapConstraint(this.camera.getPVMat(), mat)){
            return;
        }
        this.region._setRegionMat(mat);
        this.focusFloorDirty = true;
    },


    getTouchRayPlus: function(screenX, screenY){
        var t;                          //交点参数
        var normalized_x, normalized_y; //中点对应的归一化屏幕坐标
        var near_ndc;                   //中点对应的视见体近平面上的归一化设备坐标
        var far_ndc;                    //中点对应的视见体远平面上的归一化设备坐标
        var near_world;                 //中点对应的视见体近平面上的世界坐标
        var far_world;                  //中点对应的视见体远平面上的世界坐标
        var pvrm;
        var ipvrm;
        var plane;
        var ray;
        var pos;

        /**
         * 把中点屏幕坐标转换为归一化屏幕坐标
         * 注意y方向和触摸的y是反的
         */
        normalized_x = (screenX / this.canvas.width) * 2.0 - 1.0;
        normalized_y = -((screenY / this.canvas.height) * 2.0 - 1.0);

        /**
         * 我们的视见体是一个正的四棱锥台
         * 在屏幕上的2维点, 对应视见体中一条射线, 起点为近平面上, 方向指向远平面上对应点
         */
        near_ndc = YFM.Math.Vector.pos(normalized_x, normalized_y, -1.0);
        far_ndc = YFM.Math.Vector.pos(normalized_x, normalized_y, 1.0);


        /**
         * 欲将ndc坐标转换为世界坐标, 用pvr矩阵的逆ipvr
         */
        pvrm = YFM.Math.Matrix.mul(this.camera.getPVMat(), this.region.matRegion);
        ipvrm = YFM.Math.Matrix.invert(pvrm);

        /**
         * 转换到世界坐标
         */
        near_world = YFM.Math.Matrix.mulVec(ipvrm, near_ndc);
        far_world = YFM.Math.Matrix.mulVec(ipvrm, far_ndc);

        /**
         * 反透视除法
         */
        near_world[0] /= near_world[3];
        near_world[1] /= near_world[3];
        near_world[2] /= near_world[3];
        near_world[3] /= near_world[3];
        far_world[0] /= far_world[3];
        far_world[1] /= far_world[3];
        far_world[2] /= far_world[3];
        far_world[3] /= far_world[3];


        /**
         * 构建这射线
         */
        return YFM.Math.Line.linePP(near_world, far_world);
    },

    _onMouseDown : function(x, y){

        /*
        var result = this.region.searchIcon(x, y);
        if(result.length > 0){
            console.log("get icon type:%d", result[0].type);
            this.region.insertTetrMarker(20, 0xEE0000, result[0].floor, result[0].x, result[0].y, 30);
        }else{
            console.log("wtf");
        }*/

    },

    _onScroll : function(x, y){
        if(null !== this.listener){
            this.listener.onScroll(x, y);
        }
    },

    _onClick : function(x, y){
        if(null !== this.listener){
            this.listener.onClick(x, y);
        }
    },

    _onDClick : function(x, y){
        if(null !== this.listener){
            this.listener.onDClick(x, y);
        }
    },

    _on2FClick : function(x, y){
        if(null !== this.listener){
            this.listener.on2FClick(x, y);
        }
    },

    _onLongPressUp : function(x, y){
        if(null !== this.listener){
            this.listener.onLongPressUp(x, y);
        }
    },

    _spacingScreenSpace : function(x0, y0, x1, y1){

        var dx = x1 - x0;
        var dy = y1 - y0;
        return Math.sqrt(dx*dx + dy*dy);
    },

    _spacingViewSpace : function(x0, y0, x1, y1){
        /**
         * 获得视坐标系中的位置
         */
        var pos0 = this._pos_in_view_space(x0, y0);
        var pos1 = this._pos_in_view_space(x1, y1);


        var dx = pos1[0] - pos0[0];
        var dy = pos1[1] - pos0[1];
        return { 
                z : (pos0[2] + pos1[2])/2.0,
                spacing : Math.sqrt(dx*dx + dy*dy)};
    },

    _midpoint : function(x0, y0, x1, y1){
        var midX, midY;
        midX = (x0 + x1)/2.0;
        midY = (y0 + y1)/2.0;

        /**
         * 放到第一次触摸时决定了, 免得和视觉直观不符
         */
        //this.planeRec.planeHeight = this._touch_plane_height(midX, midY);

        this.touchRec.midX = midX;
        this.touchRec.midY = midY;
        this.touchRec.dy0  = y0 - midY;
        this.touchRec.dy1  = y1 - midY;

        return this._pos_in_world_space(midX, midY);
    },

    _calc_angle : function(event){
        var pos0 = this._pos_in_world_space(this.touchRec.layer0x, this.touchRec.layer0y);
        var pos1 = this._pos_in_world_space(this.touchRec.layer1x, this.touchRec.layer1y);
        return Math.atan2(pos1[1] - pos0[1], pos1[0] - pos0[0]);
    },

    _pitch_calc : function(vm){

        /**
         * 采用欧拉角分解, 更简洁
         */
        return YFM.Math.radian2Deg(YFM.Math.Matrix.eulerParamExtractX(vm));
    },

    _pitch_detect_continue : function(event){

        if(event.touches.length < 2){
            return false;
        }
        var dy0, dy1;
        dy0 = this.touchRec.layer0y - this.touchRec.start0y;
        dy1 = this.touchRec.layer1y - this.touchRec.start1y;

        if(dy0*dy1 > 0.0){
            this.touchRec.pitchCnt ++;
        }else{
            this.touchRec.pitchCnt --;
        }

        return this.touchRec.pitchCnt > 36;
    },


    _touch_plane_height : function(sx, sy){

        /**
         * 如果指定了显示楼层就不需要判断了
         */
        if(-1 !== this.region.displayFloorIndex){
            this.touchFloorIndex = this.region.displayFloorIndex;
            return this.region._getFloorVOffset(this.region.displayFloorIndex);
        }
        var ret, cnt, max, i, last_0_index, max_index;
        var floor_index = -1;

        ret = this._floors_collision(sx, sy);
        max = -100000000.0;
        max_index = -1;
        last_0_index = -1;
        cnt = ret.length;
        for(i = 0; i < cnt; i++){
            if(ret[i] < 0 && ret[i] > max){
                max = ret[i];
                max_index = i;
            }

            if(0 == ret[i]){
                last_0_index = i;
            }
        }

        /**
         * 如果有楼层被点中, 选择最高那层
         */
        if(last_0_index >= 0){
            floor_index = last_0_index;
        }else if(max_index >= 0){
        /**
         * 如果没有楼层被点中, 选择离楼层范围最近那层
         */

            floor_index = max_index;
        }

        this.touchFloorIndex = floor_index;

        return this.region._getFloorVOffset(floor_index);
    },

    _floors_collision : function(screenX, screenY){

        var ray = this.getTouchRayPlus(screenX, screenY);

        return this.region._intersectionLine(ray);
    },

    _pitch_detect_first : function(event){
        if(event.touches.length < 2){
            return false;
        }
        var retval, dy0, dy1;

        dy0 = (mgr.touchRec.layer0y - this.touchRec.midY) - this.touchRec.dy0;
        dy1 = (mgr.touchRec.layer1y - this.touchRec.midY) - this.touchRec.dy1;

        this.touchRec.pitchCnt = 0;

        retval = false;

        if(dy0*dy1 > 0.0)
            retval = true;

        return retval;
    },

    /**
     * 将屏幕空间的2D坐标转换为3D世界坐标系坐标
     * 与视见体射线求交的平面以楼层点击检测时决定的楼层--对应的高度决定
     */
    _pos_in_world_space : function(screenX, screenY){
        var t;                          //交点参数
        var normalized_x, normalized_y; //中点对应的归一化屏幕坐标
        var near_ndc;                   //中点对应的视见体近平面上的归一化设备坐标
        var far_ndc;                    //中点对应的视见体远平面上的归一化设备坐标
        var near_world;                 //中点对应的视见体近平面上的世界坐标
        var far_world;                  //中点对应的视见体远平面上的世界坐标
        var ipvm;
        var plane;
        var ray;
        var pos;

        /**
         * 把中点屏幕坐标转换为归一化屏幕坐标
         * 注意y方向和触摸的y是反的
         */
        normalized_x = (screenX / this.canvas.width) * 2.0 - 1.0;
        normalized_y = -((screenY / this.canvas.height) * 2.0 - 1.0);

        /**
         * 我们的视见体是一个正的四棱锥台
         * 在屏幕上的2维点, 对应视见体中一条射线, 起点为近平面上, 方向指向远平面上对应点
         */
        near_ndc = YFM.Math.Vector.pos(normalized_x, normalized_y, -1.0);
        far_ndc = YFM.Math.Vector.pos(normalized_x, normalized_y, 1.0);

        /**
         * 欲将ndc坐标转换为世界坐标, 用pv矩阵的逆ipv
         */
        ipvm = this.camera.getIPVMat();

        /**
         * 转换到世界坐标
         */
        near_world = YFM.Math.Matrix.mulVec(ipvm, near_ndc);
        far_world = YFM.Math.Matrix.mulVec(ipvm, far_ndc);

        /**
         * 反透视除法
         */
        near_world[0] /= near_world[3];
        near_world[1] /= near_world[3];
        near_world[2] /= near_world[3];
        near_world[3] /= near_world[3];
        far_world[0] /= far_world[3];
        far_world[1] /= far_world[3];
        far_world[2] /= far_world[3];
        far_world[3] /= far_world[3];


        /**
         * 构建这射线
         */
        ray = YFM.Math.Line.linePP(near_world, far_world);

        plane = YFM.Math.Plane.plane(0.0, 0.0, this.planeRec.planeHeight,
                            0.0, 0.0, 1.0);

        /**
         * 求交, 因为会限制俯仰角范围, 故不考虑射线和平面平行的情况
         */
        t = YFM.Math.Plane.intersectionLine(plane, ray);
        

        pos = YFM.Math.Line.getPoint(ray,t);


        return pos;
    },

    _pos_in_view_space : function(screenX, screenY){

        var worldPos = this._pos_in_world_space(screenX, screenY);
        var viewPos = this._world_to_view(worldPos);

        return viewPos;
    },

    _world_to_view : function(worldPos){
        
        return YFM.Math.Matrix.mulVec(this.camera.getViewMat(), worldPos);
    },

    _setOverlook : function(over){
        this.overlook = over;
    },

    /**
     * 将屏幕空间的2D坐标转换为楼层地图2D坐标系坐标
     * 楼层点击检测时决定的楼层
     */
    _screen_to_map : function(screenX, screenY){
        
        if(this.touchFloorIndex >= 0){
            /**
             * 获得世界坐标系中的位置
             */
            var pos = this._pos_in_world_space(screenX, screenY);

            /**
             * 转换到对应楼层的坐标系
             */
            var floorMat = this.region._getFloorMat(this.touchFloorIndex);
            var regionMat = this.region._getRegionMat();
            var mmm = YFM.Math.Matrix.mul(regionMat, floorMat);
            var immm = YFM.Math.Matrix.invert(mmm);
            var mappos = YFM.Math.Matrix.mulVec(immm, pos);
            return {
                      floor : this.touchFloorIndex,
                      x : mappos[0],
                      y : this.region.getFloorAspect(this.touchFloorIndex).h - mappos[1]};
        }else{
            return null;
        }
    },


    /**
     * 为了消除滚动条, 和本地图控件top/left位置设置的影响
     * 在处理触摸/鼠标事件时需要用layerX, layerY这样的位置
     * 由于touchs中并无layerX和layerY
     * 故在event中预先计算合同pageX, pageY的差, 然后从里面反算
     */
    _updateEventLayerPos : function(event){

        var offsetX, offsetY;
        /**
         * chrome的触摸事件没有这几项
         * 只好用target的位置代替
         */
        if(event.layerX && event.pageX){
            offsetX = event.layerX - event.pageX;
            offsetY = event.layerY - event.pageY;
        }else{
            offsetX = -event.target.offsetLeft; 
            offsetY = -event.target.offsetTop; 
        }

        /**
         * 触摸事件需要分别算两个指头
         */
        if(event.touches && event.touches.length >= 1){
            this.touchRec.layer0x = (event.touches[0].pageX + offsetX)/this.uiScaleRate;
            this.touchRec.layer0y = (event.touches[0].pageY + offsetY)/this.uiScaleRate;

            if(event.touches.length >= 2){
                this.touchRec.layer1x = (event.touches[1].pageX + offsetX)/this.uiScaleRate;
                this.touchRec.layer1y = (event.touches[1].pageY + offsetY)/this.uiScaleRate;
            }else{
                this.touchRec.layer1x = 0;
                this.touchRec.layer1y = 0;
            }
        }else{
            /**
             * 鼠标事件, 就直接
             */
            this.touchRec.layer0x = event.layerX/this.uiScaleRate;
            this.touchRec.layer0y = event.layerY/this.uiScaleRate;
        }
    },

    _mapConstraint : function(prePV, mat){

        var Matrix = YFM.Math.Matrix;
        var Vector = YFM.Math.Vector;
        var near_ndc, far_ndc, near_world, far_world;
        var pvrm, ipvrm;
        var ray0, ray1;

        near_ndc = Vector.pos(0, 0, -1.0);
        far_ndc = Vector.pos(0, 0, 1.0);

        pvrm = Matrix.mul(prePV, this.region.matRegion);
        ipvrm = Matrix.invert(pvrm);
        near_world = Matrix.mulVec(ipvrm, near_ndc);
        far_world = Matrix.mulVec(ipvrm, far_ndc);
        near_world[0] /= near_world[3];
        near_world[1] /= near_world[3];
        near_world[2] /= near_world[3];
        near_world[3] /= near_world[3];
        far_world[0] /= far_world[3];
        far_world[1] /= far_world[3];
        far_world[2] /= far_world[3];
        far_world[3] /= far_world[3];
        ray0 = YFM.Math.Line.linePP(near_world, far_world);

        pvrm = Matrix.mul(this.camera.getPVMat(), mat);
        ipvrm = Matrix.invert(pvrm);
        near_world = Matrix.mulVec(ipvrm, near_ndc);
        far_world = Matrix.mulVec(ipvrm, far_ndc);
        near_world[0] /= near_world[3];
        near_world[1] /= near_world[3];
        near_world[2] /= near_world[3];
        near_world[3] /= near_world[3];
        far_world[0] /= far_world[3];
        far_world[1] /= far_world[3];
        far_world[2] /= far_world[3];
        far_world[3] /= far_world[3];
        ray1 = YFM.Math.Line.linePP(near_world, far_world);

        var fi;
        if(this.touchFloorIndex < 0){
            fi = this.region.displayFloorIndex;
        }else{
            fi = this.touchFloorIndex;
        }
        var floor = this.region.floors[fi];
        var dist0 = floor.intersectionLine(ray0);
        var dist1 = floor.intersectionLine(ray1);

        return dist1 < dist0;
    },

    /**
     * 检查是否移动浏览器
     */
    _isMobileBrowser : function() {
        var userAgent = navigator.userAgent.toLowerCase();
        var isIPad = userAgent.match(/ipad/i) == "ipad";
        var isIphone = userAgent.match(/iphone os/i) == "iphone os";
        var isMidp = userAgent.match(/midp/i) == "midp";
        var isUc7 = userAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var isUc = userAgent.match(/ucweb/i) == "ucweb";
        var isAndroid = userAgent.match(/android/i) == "android";
        var isCE = userAgent.match(/windows ce/i) == "windows ce";
        var isWM = userAgent.match(/windows mobile/i) == "windows mobile";
        return isIPad || isIphone || isMidp || isUc7 || isUc || isAndroid || isCE || isWM;
    }
}




/**
 * 测试用导航线
 * 在屏幕空间渲染
 * Screen Space Route
 */
function SSRoute(region){

    this.region = region;
    this.time = 0.0;

    this.width = 8.0;
    this.stepLen = 128.0;

    this.dataLoad = false;

    this.rotateLeft = YFM.Math.Matrix.rotateXY(90, 0, 0);
    this.rotateRight = YFM.Math.Matrix.rotateXY(-90, 0, 0);

    this.routeHeight = 30.0;
    this.displayFloor = -1;

    this.polylineZ = null;
    this.handledPts = null;
    this.routeData = null;
    this.light = YFM.Math.Vector.vec(0.0, 0.0, 1.0);
    this.tailSize = this.width;
    this.tailColor = YFM.Math.Vector.pos(YFM.WebGL.Color.hexColorRed(0x00bb35),
                                YFM.WebGL.Color.hexColorGreen(0x00bb35),
                                YFM.WebGL.Color.hexColorBlue(0x00bb35));

    this.updateNSFlag = true;
    this.naviStatus = {
        projection : null,
        miniOffset : 0,
        validate : false,                               //导航状态是否有效, 一切后续数据有效的先决条件
        projDist : 0.0,                                 //真实位置到投影位置的距离
        goalDist : 0.0,                                 //投影位置到终点的线上距离
        globalDist : 0.0,                               //到总的终点的线上距离
        serialDist : 0.0,                               //前方合并的连续线上直行距离
        nextSerialDist : 0.0,                           //拐弯后下一段合并的连续线上直行距离
        azimuth : 0.0,                                  //当前段方向
        sug : YFM.Map.Navigate.Suggestion.NONE,         //根据当前位置和设备方向作出的建议
        nextSug : YFM.Map.Navigate.NextSuggestion.NONE  //根据当前连续直行段和下段连续直行段的空间关系作出的建议
    };

    this._initTail();
}

SSRoute.prototype = {
    constructor : SSRoute,

    setDisplayFloor : function(index){
        this.displayFloor = index;
        if(this.dataLoad){
            this._buildVBOFromSeglist();
        }
    },

    /**
     * ok
     */
    getNaviStatus : function(){

        /**
         * 如果导航状态有效, 将导航状态的拷贝返回, 如果无效, 只复制validate字段
         */
        if(this.naviStatus.validate){
            return {
                validate : this.naviStatus.validate,
                projDist : this.naviStatus.projDist,
                goalDist : this.naviStatus.goalDist,
                globalDist : this.naviStatus.globalDist,
                serialDist : this.naviStatus.serialDist,
                nextSerialDist : this.naviStatus.nextSerialDist,
                azimuth : this.naviStatus.azimuth,
                sug : this.naviStatus.sug,
                nextSug : this.naviStatus.nextSug
            };
        }else{
            return {validate : false};
        }
    },

    /**
     * ok
     */
    getRouteCenter : function(floorIndex){
        if(floorIndex >= 0){
            if(this.floorRouteList[floorIndex].box){
                return YFM.Math.Vector.vecClone(this.floorRouteList[floorIndex].box.center);
            }else{
                return null;
            }
        }else{

            if(this.obb){
                return YFM.Math.Vector.vecClone(this.obb.center);
            }else{
                return null;
            }
        }
    },

    getRouteRAxis : function(floorIndex){
        if(floorIndex >= 0){
            if(this.floorRouteList[floorIndex].box){
                return YFM.Math.Vector.vecClone(this.floorRouteList[floorIndex].box.r);
            }else{
                return null;
            }
        }else{
            if(this.obb){
                return YFM.Math.Vector.vecClone(this.obb.r);
            }else{
                return null;
            }
        }
    },

    /**
     * ok
     */
    getRouteOBBLength : function(floorIndex){
        
        if(floorIndex >= 0){
            if(this.floorRouteList[floorIndex].box){
                var hr = this.floorRouteList[floorIndex].box.hr;
                var hs = this.floorRouteList[floorIndex].box.hs;

                return Math.sqrt(hr*hr + hs*hs)*2.0;
            }else{
                return 0.0;
            }
        }else{
            if(this.obb){
                var hr = this.obb.hr;
                var hs = this.obb.hs;
                var ht = this.obb.ht;

                return Math.sqrt(hr*hr + hs*hs + ht*ht)*2.0;
            }else{
                return 0.0;
            }
        }
    },

    /**
     * ok
     * routeData为一对象数组
     * 内含楼层内索引和楼层内地图坐标
     * {
     *  floor : int,
     *  x : float,
     *  y : floor
     * }
     */
    setRoute : function(routeData){

        this.routeData = routeData;

        this.cleanRoute();

        var floorLoc, regionLoc;
        var pos, node, next, floorCnt, nodeCnt, segCnt, followLen, i, currentFloor;
        var posList = [];
        
        floorCnt = this.region.getFloorCount();
        this.floorRouteList = [];
        this.globalSegList = [];
        for(i = 0; i < floorCnt; i++){
            this.floorRouteList.push(new FloorRoute(i, this.region, this));
        }

        nodeCnt = routeData.length;
        for(i = 0; i < nodeCnt; i++){
            node = routeData[i];
            pos = this.region.floorPos2RegionPos(node.floor, node.x, node.y);
            pos[2] += this.routeHeight;
            posList.push(pos);
        }

        this.obb = new OBB(posList);

        /**
         * 再遍历一遍, 按楼层插入导航段
         */
        currentFloor = routeData[0].floor;
        for(i = 0; i < nodeCnt-1; i++){
            node = routeData[i];
            next = routeData[i+1];

            if(next.floor === currentFloor){
                this.floorRouteList[currentFloor].addSeg(posList[i], posList[i+1]);
            }else{
                currentFloor = next.floor;
            }
        }

        /**
         * 做每层楼的obbBox
         */
        for(i = 0; i < floorCnt; ++i){
            this.floorRouteList[i].makeBox();
        }

        /**
         * 反向遍历全局段列表, 更新它们的后续距离
         */
        followLen = 0;
        segCnt = this.globalSegList.length;
        var seg;
        for(i = segCnt - 1; i >= 0; --i){
            seg = this.globalSegList[i];
            seg.updateFolowLen(followLen);
            followLen += seg.len;
        }

        this._buildVBOFromSeglist();

        /**
         * 如果有设置位置, 就计算相应的导航状态
         * 注意, 由于跳过的instance是在_makeRouteVBO里算的, 所以这里要保证顺序
         */
        floorLoc = this.region.getFloorLoc();
        if(-1 != floorLoc.floor){
            regionLoc = this.region.getRegionLoc();
            this.updateNaviStatus(floorLoc, regionLoc);
        }

        this.dataLoad = true;
    },


    /**
     * ok
     */
    cleanRoute : function(){
        this.floorRouteList = null;
        this.globalSegList = null;

        this._clean();
        this.dataLoad = false;
    },

    addGlobalSeg : function(seg, needPop){
        if(needPop){
            this.globalSegList.pop();
        }

        this.globalSegList.push(seg);
    },

    /**
     * ok
     */
    setUpdateNSFlag : function(value){
        var enable = !this.updateNSFlag && value;
        var disable = this.updateNSFlag && !value;

        if(enable){
            this.updateNSFlag = true;
            var floorLoc = this.region.getFloorLoc();
            if(-1 !== floorLoc.floor){
                var regionLoc = this.region.getRegionLoc();
                this.updateNaviStatus(floorLoc, regionLoc);
            }
        }else if(disable){
            this.updateNSFlag = false;
            this.naviStatus.validate = false;
        }
    },

    /**
     * pendding
     * 从位置更新导航状态
     */
    updateNaviStatus : function(floorLoc, regionLoc){
        if(!this.updateNSFlag)
            return;
        /**
         * 没有设置导航线的情况
         */
        if(!this.floorRouteList){
            this.naviStatus.validate = false;
        }
        /**
         * 没设置位置的情况
         */
        else if(-1 === floorLoc.floor){
            this.naviStatus.validate = false;
        }else{
            /**
             * 内部接口, 越界不检查直接崩出来看
             */
            this.floorRouteList[floorLoc.floor].makeNaviStatus(this.naviStatus, regionLoc);

        }
    },


    render : function(){


        if(this.polylineZ){

            this._update();

            var gl = this.region.gl;
            var shader = this.region.ssrShader;
            var texturePool = this.region.texturePool;

            shader.useProgram();
            shader.setTime(this.time);


            var offset = 0;
            var tex = texturePool.getTexture("route_tex");
            var displayLocation = true;
            if(null != tex){
                shader.bindTexture(tex.tex); 

                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

                if(-1 !== this.displayFloor && this.displayFloor !== this.region.getFloorLoc().floor){
                    displayLocation = false;
                }

                if(this.naviStatus.validate && this.updateNSFlag && displayLocation){
                    offset = this.naviStatus.miniOffset*6;
                }

                shader.setTranFlag(1);
                shader.drawTriangleStrip(this.polylineZ, offset);

                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                shader.setTranFlag(0);
                shader.drawTriangleStrip(this.polylineZ, offset);


                if(this.naviStatus.validate && displayLocation){
                    this._renderTail();
                }

                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.BLEND);

                this.time -= 0.01;
            }
        }
    },
    /**
     * 初始化渲染导航线尾的球面
     */
    _initTail : function(){

        /**
         * 从正20面体出发顶点细分构造球体, 比较好看
         */
        this.tailMesh = new IcosahedronMesh(this.region.gl, 4);
    },

    _renderTail : function(){
        var shader = this.region.regionPhongShader;
        shader.useProgram();
        shader.setProjectionMatrix(this.region.renderParam.projMat);
        shader.setViewMatrix(this.region.renderParam.viewMat);
        shader.setRegionMatrix(this.region.matRegion);
        shader.setColor(this.tailColor);

        var tvrMat = YFM.Math.Matrix.transpose(this.region.renderParam.vrMat);
        var itvrMat = YFM.Math.Matrix.invert(tvrMat);
        shader.setLightPos(this.light);
        shader.setNormalMatrix(itvrMat);

        var sMat, pos, start, direct, max, step, len;
        start = this.naviStatus.projection;
        direct = YFM.Math.Vector.normalize(YFM.Math.Vector.sub(this.region.getRegionLoc(), start));
        max = this.naviStatus.projDist;
        step = this.tailSize * 4;
        len = 0.0;
        
        sMat = YFM.Math.Matrix.scale(this.tailSize, 0.0, 0.0, 0.0);

        while(len < max){
            pos = YFM.Math.Vector.add(start, YFM.Math.Vector.scale(direct, len));
            shader.setModelMatrix(YFM.Math.Matrix.postTranslate(sMat, 
                    pos[0],
                    pos[1],
                    pos[2]+this.tailSize));
            shader.drawTriangles(this.tailMesh.getMeshVBO(), this.tailMesh.getMeshBufSize(), 0);
            len += step;
        }
    },

    _buildVBOFromSeglist : function(){

        var seg, next, segCnt;
        var pts = [];

        /**
         * 没有楼层限制时
         * 正向遍历全局段列表, 生成合并后的路点列表
         */
        if(-1 === this.displayFloor){


            segCnt = this.globalSegList.length;
            currentFloor = this.globalSegList[0].floor;
            for(i = 0; i < segCnt; i++){

                seg = this.globalSegList[i];
                

                if(i < (segCnt - 1)){
                    next = this.globalSegList[i+1];
                    if(next.floor === currentFloor){
                        pts.push(seg.start);
                    }else{
                        currentFloor = next.floor;
                        pts.push(seg.start);
                        pts.push(seg.end);
                    }
                }else{
                    pts.push(seg.start);
                    pts.push(seg.end);
                }
            }

            this._build(pts);
        }else{
            /**
             * 有楼层限制时
             */

            var floorSegList = this.floorRouteList[this.displayFloor].segList;

            /**
             * 如果限制的那层没有导航段, 就清vbo
             */
            if(floorSegList.length <= 0){
                this._clean();
            }else{


                segCnt = floorSegList.length;
                for(i = 0; i < segCnt; i++){

                    seg = floorSegList[i];

                    if(i < (segCnt - 1)){
                        pts.push(seg.start);
                    }else{
                        pts.push(seg.start);
                        pts.push(seg.end);
                    }
                }

                this._build(pts);
            }
        }
    },

    _build : function(pts){

        if(pts.length >= 2){
            var output = [];
            for(i = 0, cnt = pts.length; i < cnt; i++){
                this._radiusPointPlus(pts, output, i);
            }
            this.handledPts = output;
        }else{
            return;
        }



        if(this.polylineZ){
            this.polylineZ.recycle();
            this.polylineZ = null;
        }


        var Matrix = YFM.Math.Matrix;
        var Vector = YFM.Math.Vector;
        this.vArrayL = [];
        this.tArrayL = [];
        this.vArrayR = [];
        this.tArrayR = [];
        this.vArrayZ = [];
        this.tArrayZ = [];
        var start = Vector.pos(0);
        var mid = Vector.pos(0);
        var vmid = Vector.pos(0);
        var end = Vector.pos(0);
        var vec = Vector.vec(0);
        var vl = Vector.vec(0);
        var vr  = Vector.vec(0);
        var dist, len;
        var i, cnt;
        var uv_v_s, uv_v_m, uv_v_e;

        var pvm = this.region.renderParam.pvrMat;

        dist = 0;
        lineDist = 0;
        for(i = 0, cnt = this.handledPts.length; i < cnt-1; i++){
            this._pos2ScreenTo(start, this.handledPts[i], pvm, this.region.hw, this.region.hh);
            this._pos2ScreenTo(end, this.handledPts[i+1], pvm, this.region.hw, this.region.hh);
            Vector.midTo(mid, start, end);
            Vector.subTo(vec, end, start);
            len = Vector.norm3(vec);
            Vector.normalizeTo(vec);

            Matrix.mulVecTo(this.rotateLeft, vec, vl);
            Vector.scaleTo(vl, this.width);

            Matrix.mulVecTo(this.rotateRight, vec, vr);
            Vector.scaleTo(vr, this.width);

            
            uv_v_s = dist/this.stepLen;
            uv_v_m = (dist + len/2.0)/this.stepLen;
            uv_v_e = (dist + len)/this.stepLen;
            dist += len;


            this.vArrayL.push(Vector.add(start, vl));
            this.tArrayL.push(Vector.pos(0.0, uv_v_s));
            this.vArrayR.push(Vector.add(start, vr));
            this.tArrayR.push(Vector.pos(1.0, uv_v_s));


            this.vArrayL.push(Vector.add(mid, vl));
            this.tArrayL.push(Vector.pos(0.0, uv_v_m));
            this.vArrayR.push(Vector.add(mid, vr));
            this.tArrayR.push(Vector.pos(1.0, uv_v_m));


            this.vArrayL.push(Vector.add(end, vl));
            this.tArrayL.push(Vector.pos(0.0, uv_v_e));
            this.vArrayR.push(Vector.add(end, vr));
            this.tArrayR.push(Vector.pos(1.0, uv_v_e));
        }

        cnt = this.vArrayL.length;
        for(i = 0; i < cnt; i++){
            this.vArrayZ.push(this.vArrayR[i]);
            this.tArrayZ.push(this.tArrayR[i]);

            this.vArrayZ.push(this.vArrayL[i]);
            this.tArrayZ.push(this.tArrayL[i]);
        }

        this.polylineZ = new VAttribs(this.region.gl);
        this.polylineZ.addAttribute("position", this.vArrayZ, 3, false);
        this.polylineZ.addAttribute("uv", this.tArrayZ, 2, false);
    },

    _projection : function(position, start, end, output){
        var ps = YFM.Math.Vector.sub(position, start);
        var vec = YFM.Math.Vector.sub(end, start);
        var lenSQ = YFM.Math.Vector.dot3(vec, vec);
        var t = YFM.Math.Vector.dot3(ps, vec) / lenSQ;
        
        if(t <= 0.0){
            t = 0.0;
        }else if(t >= 1.0){
            t = 1.0;
        }

        output.pos = YFM.Math.Vector.add(start, YFM.Math.Vector.scale(vec, t));
        output.t = t;
    },

    _update : function(){

        var Matrix = YFM.Math.Matrix;
        var Vector = YFM.Math.Vector;
        var start = Vector.pos(0);
        var mid = Vector.pos(0);
        var end = Vector.pos(0);
        var vec = Vector.vec(0);
        var vl = Vector.vec(0);
        var vr  = Vector.vec(0);
        var dist, len;
        var i, cnt;
        var uv_v_s, uv_v_m, uv_v_e;
        var uv_t_s, uv_t_m, uv_t_e;

        var pvm = this.region.renderParam.pvrMat;
        var regionLoc = this.region.getRegionLoc();
        var distSQ, miniDistSQ, miniProjPos;
        var proj = {pos : null,
                    t : 0.0};

        miniDistSQ = Number.MAX_VALUE;
        dist = 0;

        var displayLocation = true;
        if(-1 !== this.displayFloor && this.displayFloor !== this.region.getFloorLoc().floor){
            displayLocation = false;
        }
        if(this.naviStatus.validate && displayLocation){
            for(i = 0, cnt = this.handledPts.length; i < cnt-1; i++){

                this._projection(regionLoc, this.handledPts[i], this.handledPts[i+1], proj);
                distSQ = YFM.Math.Vector.distanceSQ(regionLoc, proj.pos);

                if(distSQ <= miniDistSQ){
                    miniDistSQ = distSQ;
                    miniProjPos = proj.pos;
                    this.naviStatus.miniOffset = i;
                }
            }
        }else{
            this.naviStatus.miniOffset = 0;
        }

        for(i = this.naviStatus.miniOffset, cnt = this.handledPts.length; i < cnt-1; i++){

            if(this.naviStatus.validate && i == this.naviStatus.miniOffset && displayLocation){
                this._pos2ScreenTo(start, miniProjPos, pvm, this.region.hw, this.region.hh);
            }else{
                this._pos2ScreenTo(start, this.handledPts[i], pvm, this.region.hw, this.region.hh);
            }

            this._pos2ScreenTo(end, this.handledPts[i+1], pvm, this.region.hw, this.region.hh);
            Vector.midTo(mid, start, end);
            Vector.subTo(vec, end, start);
            len = Vector.norm3(vec);
            Vector.normalizeTo(vec);

            Matrix.mulVecTo(this.rotateLeft, vec, vl);
            Vector.scaleTo(vl, this.width);

            Matrix.mulVecTo(this.rotateRight, vec, vr);
            Vector.scaleTo(vr, this.width);

            
            uv_v_s = dist/this.stepLen;
            uv_v_m = (dist + len/2.0)/this.stepLen;
            uv_v_e = (dist + len)/this.stepLen;

            dist += len;

            Vector.addTo(this.vArrayL[i*3+0], start, vl);
            this.tArrayL[i*3+0][1] = uv_v_s;
            Vector.addTo(this.vArrayR[i*3+0], start, vr);
            this.tArrayR[i*3+0][1] = uv_v_s;

            Vector.addTo(this.vArrayL[i*3+1], mid, vl);
            this.tArrayL[i*3+1][1] = uv_v_m;
            Vector.addTo(this.vArrayR[i*3+1], mid, vr);
            this.tArrayR[i*3+1][1] = uv_v_m;

            Vector.addTo(this.vArrayL[i*3+2], end, vl);
            this.tArrayL[i*3+2][1] = uv_v_e;
            Vector.addTo(this.vArrayR[i*3+2], end, vr);
            this.tArrayR[i*3+2][1] = uv_v_e;
        }

        this.polylineZ.updateAttribute("position", this.vArrayZ);
        this.polylineZ.updateAttribute("uv", this.tArrayZ);
    },


    _clean : function(){
        
        if(this.polylineZ){
            this.polylineZ.recycle();
            this.polylineZ = null;
        }

        this.handledPts = null;
    },

    _pos2Screen : function(pos, pvm, hw, hh){

        var out = YFM.Math.Matrix.mulVec(pvm, pos);
        out[0] /= out[3];
        out[1] /= out[3];
        out[2] /= out[3];
        out[3] /= out[3];

        out[0] = out[0]*hw;
        out[1] = out[1]*hh;
        return out;
    },

    _pos2ScreenTo : function(out, pos, pvm, hw, hh){

        YFM.Math.Matrix.mulVecTo(pvm, pos, out);

        /**
         * 解决点在近平面之后的问题
         */
        if(out[3] > 0.0){  
            out[0] /= out[3];
            out[1] /= out[3];
            out[2] /= out[3];
            out[3] /= out[3];
        }else if(out[3] < 0.0){

            out[0] /= -out[3];
            out[1] /= -out[3];
            out[2] /= -out[3];
            out[3] /= -out[3];
        }


        out[0] = out[0]*hw;
        out[1] = out[1]*hh;
    },

    _radiusPointPlus : function(pts, output, index){

        var cnt = pts.length;

        if(index <= 0 || index >= (cnt - 1)){
            output.push(pts[index]);
            return;
        }

        var Matrix = YFM.Math.Matrix;
        var Vector = YFM.Math.Vector;
        var vertex, next, prev;
        var v1, v2, vm, vr, v01, v12;
        var alpha, beta, len, dist, cross_v012;
        var center;
        var i;
        var uv_v;
        var prevOut = output[output.length - 1];

        prev = pts[index-1];
        vertex = pts[index];
        next = pts[index+1];

        /**
         * 简单处理一下跨楼层的情况
         */
        if(Math.abs(vertex[2] - prev[2]) > 1.0 || Math.abs(vertex[2] - next[2]) > 1.0){
            output.push(vertex);
            return;
        }

        v1 = Vector.normalize(Vector.sub(prev, vertex));
        v2 = Vector.normalize(Vector.sub(next, vertex));
        vm = Vector.normalize(Vector.add(v1, v2));
        vr = Vector.scale(vm, -1*this.width);
        v01 = Vector.sub(vertex, prev);
        v12 = Vector.sub(next, vertex);
        cross_v012 = Vector.cross(v01, v12);
        alpha = Math.acos(Vector.dot3(vm, v2));
        beta = 3.1416926/2.0 - alpha;
        len = this.width/Math.sin(alpha);
        dist = this.width/Math.tan(alpha)
        center = Vector.add(vertex, Vector.scale(vm, len));


        var appendPts = [];
        var rm = Matrix.rotateXY(-beta, center[0], center[1], true);
        var step = beta/3.0;
        var drm = Matrix.rotateXY(step, center[0], center[1], true);

        //0
        vr = Matrix.mulVec(rm, vr);
        appendPts.push(Vector.add(vertex, Vector.scale(v1, dist)));

        //1
        vr = Matrix.mulVec(drm, vr);
        appendPts.push(Vector.add(center, vr));
        //2
        vr = Matrix.mulVec(drm, vr);
        appendPts.push(Vector.add(center, vr));
        //3
        vr = Matrix.mulVec(drm, vr);
        appendPts.push(Vector.add(center, vr));
        //4
        vr = Matrix.mulVec(drm, vr);
        appendPts.push(Vector.add(center, vr));
        //5
        vr = Matrix.mulVec(drm, vr);
        appendPts.push(Vector.add(center, vr));
        //6
        vr = Matrix.mulVec(drm, vr);
        appendPts.push(Vector.add(vertex, Vector.scale(v2, dist)));

        if(cross_v012[2] > 0){
            output.push(appendPts[0]);
            output.push(appendPts[1]);
            output.push(appendPts[2]);
            output.push(appendPts[3]);
            output.push(appendPts[4]);
            output.push(appendPts[5]);
            output.push(appendPts[6]);
        }else{
            output.push(appendPts[0]);
            output.push(appendPts[5]);
            output.push(appendPts[4]);
            output.push(appendPts[3]);
            output.push(appendPts[2]);
            output.push(appendPts[1]);
            output.push(appendPts[6]);
        }
    }
}

/**
 * 导航段
 */
function RouteSeg(start, end, floor)
{
    this.start = start;
    this.end = end;
    this.floor = floor;
    this.segVec = YFM.Math.Vector.sub(this.end, this.start);
    this.lenSQ = YFM.Math.Vector.dot3(this.segVec, this.segVec);
    this.len = Math.sqrt(this.lenSQ);
    this.azimuth = this._makeAzimuth();
    this.followLen = 0;
}
RouteSeg.prototype = {
	constructor : RouteSeg,

    updateFolowLen : function(followLen){
        this.followLen = followLen;
    },

    /**
     * 连续直行 Append的情况
     */
    updateEnd : function(end){
        this.end = end;
        this.segVec = YFM.Math.Vector.sub(this.end, this.start);
        this.lenSQ = YFM.Math.Vector.dot3(this.segVec, this.segVec);
        this.len = Math.sqrt(this.lenSQ);
        this.azimuth = this._makeAzimuth();
    },
    
    /**
     * 根据参数取线段上的点
     */
    getPoint : function(t){
        return YFM.Math.Vector.add(this.start, YFM.Math.Vector.scale(this.segVec, t));
    },


    /**
     * 从线段外一点尽可能向线段做正交投影
     * 返回投影点的参数
     */
    projection : function(position){
        var ps= YFM.Math.Vector.sub(position, this.start);
    
        var t = YFM.Math.Vector.dot3(ps, this.segVec) / this.lenSQ;
        
        if(t <= 0.0){
            return 0.0;
        }else if(t >= 1.0){
            return 1.0;
        }else{
            return t;
        }
    },

    /**
     * 计算段的方向角
     */
    _makeAzimuth : function(){
        
        var north = YFM.Math.Vector.vec(0, 1, 0);
        var segVec = YFM.Math.Vector.normalize(this.segVec);
        var cosTheta = YFM.Math.Vector.dot3(segVec, north);
        var angle = Math.acos(cosTheta);
        if(segVec[0] > 0){
            angle = 2 * Math.PI - angle;
        }
        return angle;
    }
};

/**
 * 楼层导航线
 */
function FloorRoute(floor, region, route){
    this.floor = floor;
    this.region = region;
    this.route = route;
    this.segList = [];
    this.posList = [];
    this.lastPos = null;
    this.box = null;

    this.lastSegVec = null;
}
FloorRoute.prototype = {
	constructor : FloorRoute,

    makeBox : function(){
        if(this.lastPos){
            this.posList.push(this.lastPos);
            this.box = new OBB(this.posList);
        }
    },
    
    addSeg : function(pos0, pos1){

        this.posList.push(pos0);
        this.lastPos = pos1;

        var curSeg = new RouteSeg(pos0, pos1, this.floor);
        var curVec = YFM.Math.Vector.normalize(curSeg.segVec);
        var dot, lastSeg;

        /**
         * 有前序段时, 检查新段的方向是否和前序段一致
         * 如一致, 弹出前序段, 将其end修改为新段的end
         * 如不一致, 插入新段
         */
        if(null != this.lastSegVec){
            dot = YFM.Math.Vector.dot3(curVec, this.lastSegVec);
            //有些许误差也认为是方向一致
            if(Math.abs(dot - 1.0) < 0.00001){
                lastSeg = this.segList.pop();
                lastSeg.updateEnd(pos1);
                this.segList.push(lastSeg);
                this.route.addGlobalSeg(lastSeg, true);
            }else{
                this.segList.push(curSeg);
                this.route.addGlobalSeg(curSeg, false);
            }
        }else{
            this.segList.push(curSeg);
            this.route.addGlobalSeg(curSeg, false);
        }
        this.lastSegVec = curVec;
    },

    makeNaviStatus : function(naviStatus, regionLoc){
        var segCnt = this.segList.length;
        var t, projT, projPos, miniProjPos, distSQ, miniDistSQ, i, projIndex;
        var spDist, delta;

        if(segCnt <= 0){
            naviStatus.validate = false;
        }else{
            naviStatus.validate = true;

            miniDistSQ = Number.MAX_VALUE;

            var cnt = segCnt;
            if(cnt <= 0){
                naviStatus.validate = false;
                return;
            }
            
            for(i = 0; i < cnt; i++){
                t = this.segList[i].projection(regionLoc);
                projPos = this.segList[i].getPoint(t);
                distSQ = YFM.Math.Vector.distanceSQ(regionLoc, projPos);
                if(distSQ <= miniDistSQ){
                    miniDistSQ = distSQ;
                    miniProjPos = projPos;
                    projIndex = i;
                    projT = t;
                }
            }

            naviStatus.projection = miniProjPos;

            /**
             * 约束后的投影点, 相对于投影所在段开始处的距离
             */
            spDist = YFM.Math.Vector.distance(naviStatus.projection, this.segList[projIndex].start);


            /**
             * 由于规格的关系, errorDist已经没有意义, 可以完全被投影到位置的距离取代
             */
            naviStatus.projDist = YFM.Math.Vector.distance(naviStatus.projection, regionLoc);

            /**
             * 由于导航线已经预处理过, 连续直行距离就是投影位置到当前段末的距离
             */
            naviStatus.serialDist = YFM.Math.Vector.distance(naviStatus.projection, this.segList[projIndex].end);

            /**
             * 下一段连续直行距离和建议
             */
            if((projIndex + 1) < segCnt){
                naviStatus.nextSerialDist = this.segList[projIndex+1].len;

                delta = this.segList[projIndex+1].azimuth - this.segList[projIndex].azimuth;
                if(delta < 0.0){
                    delta += Math.PI*2.0;
                }

                /**
                 * ±10度的范围视作前向
                 */
                if(delta <= 0.175 || delta >= 6.11) {
                    naviStatus.nextSug = YFM.Map.Navigate.NextSuggestion.FRONT;
                }else if(delta < Math.PI){
                    naviStatus.nextSug = YFM.Map.Navigate.NextSuggestion.LEFT;
                }else{
                    naviStatus.nextSug = YFM.Map.Navigate.NextSuggestion.RIGHT;
                }
            }else{
                naviStatus.nextSerialDist = 0.0;
                naviStatus.nextSug = YFM.Map.Navigate.NextSuggestion.ARRIVE;
            }


            naviStatus.goalDist = naviStatus.serialDist;
            for(i = projIndex+1; i < segCnt; i++){
                naviStatus.goalDist += this.segList[i].len;
            }

            naviStatus.globalDist = naviStatus.goalDist + this.segList[segCnt-1].followLen;

            /**
             * 目前JS不处理方向, 所以sug只填NONE
             */
            naviStatus.azimuth = this.segList[projIndex].azimuth;

            naviStatus.sug = this.makeCurrentSug(this.region.azimuth, naviStatus.azimuth);
        }
    },

    makeCurrentSug : function(devAzimuth, segAzimuth){
        var delta, sug;
        delta = segAzimuth - devAzimuth;

        if(delta< 0){
            delta = 360.0 + delta;
        }

        if((delta > 337.5  && delta <= 0) || 
            (delta > 0      && delta <= 22.5)){
            sug = YFM.Map.Navigate.Suggestion.FRONT;
        }else if(delta > 22.5 && delta <= 67.5){
            sug = YFM.Map.Navigate.Suggestion.FRONT;
        }else if(delta > 67.5 && delta <= 112.5){
            sug = YFM.Map.Navigate.Suggestion.RIGHT;
        }else if(delta > 112.5 && delta <= 157.5){
            sug = YFM.Map.Navigate.Suggestion.BACKWARD;
        }else if(delta > 157.5 && delta <= 202.5){
            sug = YFM.Map.Navigate.Suggestion.BACKWARD;
        }else if(delta > 202.5 && delta <= 247.5){
            sug = YFM.Map.Navigate.Suggestion.BACKWARD;
        }else if(delta > 247.5 && delta <= 292.5){
            sug = YFM.Map.Navigate.Suggestion.LEFT;
        }else{
            sug = YFM.Map.Navigate.Suggestion.FRONT;
        }

        return sug;
    },

    getLength : function(){
        return this.segList.length;
    }, 
    getSeg : function(i){
        return this.segList[i];
    }
}


/**
 * 参考自three.js的欧拉参数包装类
 */
function Euler( x, y, z, order ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.order = order || Euler.DefaultOrder;

}
Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

Euler.DefaultOrder = 'ZXY';

Euler.prototype = {
    constructor : Euler,

	setFromMatrix : function(m, order, update){

        var clamp = YFM.Math.clamp;

		var m11 = m[0], m12 = m[4], m13 = m[8];
		var m21 = m[1], m22 = m[5], m23 = m[9];
		var m31 = m[2], m32 = m[6], m33 = m[10];

		order = order || this.order;

		if(order === 'XYZ') {

			this.y = Math.asin(clamp(m13, -1, 1));

			if(Math.abs(m13) < 0.99999){

				this.x = Math.atan2(-m23, m33);
				this.z = Math.atan2(-m12, m11);
			}else{
				this.x = Math.atan2(m32, m22);
				this.z = 0;
			}

		}else if(order === 'YXZ'){

			this.x = Math.asin(-clamp(m23, -1, 1 ));

			if(Math.abs(m23) < 0.99999){
				this.y = Math.atan2(m13, m33);
				this.z = Math.atan2(m21, m22);
			}else{
				this.y = Math.atan2(-m31, m11);
				this.z = 0;
			}
		}else if(order === 'ZXY'){

			this.x = Math.asin(clamp(m32, -1, 1));

			if(Math.abs(m32) < 0.99999){
				this.y = Math.atan2(-m31, m33);
				this.z = Math.atan2(-m12, m22);
			}else{
				this.y = 0;
				this.z = Math.atan2(m21, m11);
			}

		}else if(order === 'ZYX'){

			this.y = Math.asin(-clamp(m31, -1, 1));

			if(Math.abs(m31) < 0.99999){
				this.x = Math.atan2(m32, m33);
				this.z = Math.atan2(m21, m11);
			} else {
				this.x = 0;
				this.z = Math.atan2(-m12, m22);
			}

		}else if(order === 'YZX'){

			this.z = Math.asin(clamp(m21, -1, 1));

			if(Math.abs(m21) < 0.99999){
				this.x = Math.atan2(-m23, m22);
				this.y = Math.atan2(-m31, m11);
			}else{
				this.x = 0;
				this.y = Math.atan2(m13, m33);
			}

		}else if(order === 'XZY'){

			this.z = Math.asin(-clamp(m12, -1, 1));

			if(Math.abs(m12) < 0.99999){
				this.x = Math.atan2(m32, m22);
				this.y = Math.atan2(m13, m11);
			}else{
				this.x = Math.atan2(-m23, m33);
				this.y = 0;
			}

		} else {
			console.warn( 'setFromRotationMatrix() given unsupported order: ' + order );
		}

		this.order = order;

		return this;

	},
}


/**
 * Low Discrepancy Sequence
 * 高效的生成在高维空间分布均匀的随机数是在计算机程序中非常常见的组成部分.
 * 对于一切需要采样的算法来说，分布均匀的随机数就意味着更加优秀的样本分布.
 * 光线传递的模拟（渲染）这个过程中采样无处不在，所以好的样本分布直接影响积分过程的收敛速度.
 * 与常见的伪随机数对比，低差异序列（Low Discrepancy Sequence）非常广泛的被用在图形，甚至于金融领域.
 * 它们除了在高维空间中的分布更加均匀以外还有许多其他的性质更利于渲染程序的执行
 *
 * 作者：文刀秋二
 * 链接：https://zhuanlan.zhihu.com/p/20197323
 */
LDS = function(){

    var radicalInverse = function(base, i){
        var digit, radical, inverse;
        digit = radical = 1.0 / base;
        inverse = 0.0;

        while(i > 0){
            //i余base求出i在"base"进制下的最低位的数
            // 乘以digit将这个数镜像到小数点右边
            inverse += digit * (i % base);
            digit *= radical;

            // i除以base即可求右一位的数
            i = Math.floor(i/base);
        }
        return inverse;
    };

    var primes = [  2, 3, 5, 7, 11, 
                    13, 17, 19, 23, 
                    29, 31, 37, 41, 
                    43, 57];

    var nthPrimeNumber = function(n){
        if(n < 0 || n > primes.length){
            throw new Error("nthPrimeNumber index out of range");
        }else{
            return primes[n];
        }

    };

    var halton = function(dimension, index){
        // 直接用第dimension个质数作为底数调用radicalInverse即可
        return radicalInverse(nthPrimeNumber(dimension), index);    
    };

	return {
        halton : halton
    };
}();



YFM.Math.Line = function(){

    var line = function(sx, sy, sz, vx, vy, vz){

        var l = [];

        l.push(sx);
        l.push(sy);
        l.push(sz);
        l.push(1.0);

        l.push(vx);
        l.push(vy);
        l.push(vz);
        l.push(0.0);

        return l;
    };

    var lineSV = function(s, v){

        var l = [];

        l.push(s[0]);
        l.push(s[1]);
        l.push(s[2]);
        l.push(1.0);

        l.push(v[0]);
        l.push(v[1]);
        l.push(v[2]);
        l.push(0.0);

        return l;
    };

    var linePP = function(s, e){

        var l = [];

        l.push(s[0]);
        l.push(s[1]);
        l.push(s[2]);
        l.push(1.0);

        l.push(e[0] - s[0]);
        l.push(e[1] - s[1]);
        l.push(e[2] - s[2]);
        l.push(0.0);

        return l;
    };

    var getPoint = function(line, t){

        return YFM.Math.Vector.pos( 
                    line[0] + line[4]*t, 
                    line[1] + line[5]*t,
                    line[2] + line[6]*t);
    };

    var projection = function(line, position){
        var a = YFM.Math.Vector.pos(line[0], line[1], line[2]); 
        var ab= YFM.Math.Vector.vec(line[4], line[5], line[6]);
        var ap= YFM.Math.Vector.sub(position, a);
    
        var t = YFM.Math.Vector.dot3(ap, ab) / YFM.Math.Vector.dot3(ab, ab);
        
        if(t <= 0){
            return a;
        }else if(t >= 1){
            return YFM.Math.Vector.add(a, ab);
        }else{
            return YFM.Math.Vector.pos( 
                    line[0] + line[4]*t, 
                    line[1] + line[5]*t,
                    line[2] + line[6]*t);
        }
    };

    var distancePointSQ = function(line, x, y, z){
        var v, q, qs, qs_sq, qsv_sq, v_sq;

        /**
         * 根据公式
         * d**2 = ||Q-S||**2 - ((Q-S) dotprod V)**2/||V||**2
         * 计算
         */
        q = YFM.Math.Vector.pos(x, y, z)
        qs = YFM.Math.Vector.sub(q, line);

        v = YFM.Math.Vector.vec(line[4], line[5], line[6]);
        qsv_sq = YFM.Math.Vector.dot3(qs, v);
        qsv_sq *= qsv_sq;

        qs_sq = YFM.Math.Vector.norm3SQ(qs);
        v_sq = YFM.Math.Vector.norm3SQ(v);

        return qs_sq - qsv_sq/v_sq;
    };

    var distancePoint = function(line, x, y, z){
        return Math.sqrt(distancePointSQ(line, x, y, z));
    };

    var distanceLinesRaw = function(line1, line2){

        var parallel;
        var distance, delta, v1v2dotp, s2s1_v1_dotp, s2s1_v2_dotp, norm_sq_v1, norm_sq_v2;
        var s2s1, v1, v2;
        var mat = [];
        var vv = [];
        var t = [];

        v1 = YFM.Math.Vector.vec(line1[4], line1[5], line1[6]);
        v2 = YFM.Math.Vector.vec(line2[4], line2[5], line2[6]);
        v1v2dotp = YFM.Math.Vector.dot3(v1, v2);
        norm_sq_v1 = YFM.Math.Vector.norm3SQ(v1);
        norm_sq_v2 = YFM.Math.Vector.norm3SQ(v2);

        delta = v1v2dotp * v1v2dotp - norm_sq_v1 * norm_sq_v2;

        parallel = YFM.Math.floatEquals(delta, 0.0); 

        if(false == parallel){
            /**
             * 非平行的情况可以用下面的公式解出两条直线最短距离的两点的参数
             * ┌  ┐                             ┌              ┐┌          ┐
             * │t1│               1             │-V2**2   V1·V2││(S2-S1)·V1│
             * │  │ = ───────────────────────── │              ││          │
             * │t2│   (V1·V2)**2 - V1**2*V2**2  │-V1·V2   V1**2││(S2-S1)·V2│
             * └  ┘                             └              ┘└          ┘
             */

            s2s1 = YFM.Math.Vector.sub(line2, line1);
            s2s1_v1_dotp = YFM.Math.Vector.dot3(s2s1, v1);
            s2s1_v2_dotp = YFM.Math.Vector.dot3(s2s1, v2);
            
            vv.push(s2s1_v1_dotp);
            vv.push(s2s1_v2_dotp);
            mat.push(-YFM.Math.Vector.norm3SQ(v2));
            mat.push(-v1v2dotp);
            mat.push(v1v2dotp);
            mat.push(YFM.Math.Vector.norm3SQ(v1));

            t.push(vv[0]*mat[0] + vv[1]*mat[2]);
            t.push(vv[0]*mat[1] + vv[1]*mat[3]);

            t[0] /= delta;
            t[1] /= delta;
        }

        return {
                parallel : parallel,
                t : t
        };

    };

    var distanceLines = function(line1, line2){

        var distance, parallel;
        var result;
        var pt1, pt2;

        result = distanceLinesRaw(line1, line2);

        /**
         * 如果平行, 两直线的距离相当于某直线上任一点到另一条直线的距离
         */
        if(result.parallel){
            distance = distancePoint(line1, line2[0], line2[1], line2[2]);
        }else{
            pt1 = getPoint(line1, result.t[0]);
            pt2 = getPoint(line2, result.t[1]);
            distance = YFM.Math.Vector.distance(pt1, pt2);
        }

        return {
                parallel : parallel,
                distance : distance};
    };

	return {
        line : line,
        lineSV : lineSV, 
        linePP : linePP, 
        getPoint : getPoint, 
        projection : projection,
        distancePointSQ : distancePointSQ, 
        distancePoint : distancePoint, 
        distanceLinesRaw : distanceLinesRaw, 
        distanceLines : distanceLines
    };
}();



YFM.Math.Matrix = function(){

    /**
     * 矩阵目前只用4维的,其他的懒得实现了, 可以用四维代替
     * 本库的矩阵是主列的
     */
    var mat = function(){
        var retval = [];
        retval.push(1.0);
        retval.push(0.0);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(1.0);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(0.0);
        retval.push(1.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(0.0);
        retval.push(0.0);
        retval.push(1.0);

        return retval;
    };

    /**
     * 复制矩阵
     */
    var matClone = function(mat){
        return mat.slice(0);
    };

    /**
     * 用x, y, z上的旋转分量来定义3d旋转
     */
    var rotate3d = function(angle, x, y, z, isRadian){
        var rm = mat();
        var radian, c, s;
        if(isRadian){
            radian = angle;
        }else{
            radian = YFM.Math.deg2Radian(angle);
        }
    
        c = Math.cos(radian);
        s = Math.sin(radian);

        rm[3] = 0;
        rm[7] = 0;
        rm[11]= 0;
        rm[12]= 0;
        rm[13]= 0;
        rm[14]= 0;
        rm[15]= 1;

        if(1.0 == x && 0.0 == y && 0.0 == z) {
            rm[5] = c;   rm[10]= c;
            rm[6] = s;   rm[9] = -s;
            rm[1] = 0;   rm[2] = 0;
            rm[4] = 0;   rm[8] = 0;
            rm[0] = 1;
        }else if (0.0 == x && 1.0 == y && 0.0 == z) {
            rm[0] = c;   rm[10]= c;
            rm[8] = s;   rm[2] = -s;
            rm[1] = 0;   rm[4] = 0;
            rm[6] = 0;   rm[9] = 0;
            rm[5] = 1;
        }else if (0.0 == x && 0.0 == y && 1.0 == z) {
            rm[0] = c;   rm[5] = c;
            rm[1] = s;   rm[4] = -s;
            rm[2] = 0;   rm[6] = 0;
            rm[8] = 0;   rm[9] = 0;
            rm[10]= 1;
        }else{
            var len = Math.sqrt(x*x + y*y + z*z);
            if (1.0 != len) {
                var recipLen = 1.0 / len;
                x *= recipLen;
                y *= recipLen;
                z *= recipLen;
            }
            var nc = 1.0 - c;
            var xy = x * y;
            var yz = y * z;
            var zx = z * x;
            var xs = x * s;
            var ys = y * s;
            var zs = z * s;
            rm[ 0] = x*x*nc +  c;
            rm[ 4] =  xy*nc - zs;
            rm[ 8] =  zx*nc + ys;
            rm[ 1] =  xy*nc + zs;
            rm[ 5] = y*y*nc +  c;
            rm[ 9] =  yz*nc - xs;
            rm[ 2] =  zx*nc - ys;
            rm[ 6] =  yz*nc + xs;
            rm[10] = z*z*nc +  c;
        }

        return rm;
    }

    /**
     * 构建XY平面上 的旋转矩阵
     */
    var rotateXY = function(angle, px, py, isRadian){
        var retval = [];
        var radian, c, s;
        if(isRadian){
            radian = angle;
        }else{
            radian = YFM.Math.deg2Radian(angle);
        }
    
        c = Math.cos(radian);
        s = Math.sin(radian);
        
        retval.push(c);
        retval.push(s);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(-s);
        retval.push(c);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(0.0);
        retval.push(1.0);
        retval.push(0.0);

        retval.push(px*(1.0-c) + py*s);
        retval.push(py*(1.0-c) - px*s);
        retval.push(0.0);
        retval.push(1.0);

        return retval;
    };

    /**
     * 创建绕指定轴的旋转矩阵
     */
    var rotateAxis = function(angle, axis, isRadian){
        var retval = [];
        var radian, co, si, k;
        var a, b, c;

        if(isRadian){
            radian = angle;
        }else{
            radian = YFM.Math.deg2Radian(angle);
        }
    
        co = Math.cos(radian);
        si = Math.sin(radian);
        k = 1.0 - co;

        retval.push(a*a*k + co);
        retval.push(a*b*k + c*si);
        retval.push(a*c*k - b*si);
        retval.push(0.0);

        retval.push(a*b*k - c*si);
        retval.push(b*b*k + co);
        retval.push(b*c*k + a*si);
        retval.push(0.0);

        retval.push(a*c*k + b*si);
        retval.push(b*c*k - a*si);
        retval.push(c*c*k + co);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(0.0);
        retval.push(0.0);
        retval.push(1.0);

        return retval;
    };

    /**
     * 创建平移矩阵
     */
    var translate = function(x, y, z){
        var retval = [];
        
        retval.push(1.0);
        retval.push(0.0);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(1.0);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(0.0);
        retval.push(1.0);
        retval.push(0.0);

        retval.push(x);
        retval.push(y);
        retval.push(z);
        retval.push(1.0);

        return retval;
    };

    var setTranslateZ = function(m, z){
        m[14] = z;
    };


    /**
     * 创建缩放矩阵
     */
    var scale = function(rate, px, py, pz){
        var retval = [];
        
        retval.push(rate);
        retval.push(0.0);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(rate);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(0.0);
        retval.push(rate);
        retval.push(0.0);

        retval.push(px*(1.0 - rate));
        retval.push(py*(1.0 - rate));
        retval.push(pz*(1.0 - rate));
        retval.push(1.0);

        return retval;
    };

    var scaleXYZ = function(rate, px, py, pz){
        var retval = [];
        
        retval.push(rate[0]);
        retval.push(0.0);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(rate[1]);
        retval.push(0.0);
        retval.push(0.0);

        retval.push(0.0);
        retval.push(0.0);
        retval.push(rate[2]);
        retval.push(0.0);

        retval.push(px*(1.0 - rate[0]));
        retval.push(py*(1.0 - rate[1]));
        retval.push(pz*(1.0 - rate[2]));
        retval.push(1.0);

        return retval;
    };

    var mul = function(left, right){
        var retval = [];
        var a, b, c, d;
        var col;
        var ltmp, rtmp;

        ltmp = left.slice(0);
        rtmp = right.slice(0);

        for(col = 0; col < 4; col++){
            a = rtmp[col*4+0];
            b = rtmp[col*4+1];
            c = rtmp[col*4+2];
            d = rtmp[col*4+3];

            retval.push(a*ltmp[0] + b*ltmp[4] + c*ltmp[8] + d*ltmp[12]);
            retval.push(a*ltmp[1] + b*ltmp[5] + c*ltmp[9] + d*ltmp[13]);
            retval.push(a*ltmp[2] + b*ltmp[6] + c*ltmp[10]+ d*ltmp[14]);
            retval.push(a*ltmp[3] + b*ltmp[7] + c*ltmp[11]+ d*ltmp[15]);
        }

        return retval;
    };

    var mulVec = function(m, v){
        var retval = [];
        var a, b, c, d;

        a = v[0];
        b = v[1];
        c = v[2];
        d = v[3];

        retval.push(a*m[0] + b*m[4] + c*m[8] + d*m[12]);
        retval.push(a*m[1] + b*m[5] + c*m[9] + d*m[13]);
        retval.push(a*m[2] + b*m[6] + c*m[10]+ d*m[14]);
        retval.push(a*m[3] + b*m[7] + c*m[11]+ d*m[15]);

        return retval;
    };

    var mulVecTo = function(m, v, out){

        out[0] = v[0]*m[0] + v[1]*m[4] + v[2]*m[8] + v[3]*m[12];
        out[1] = v[0]*m[1] + v[1]*m[5] + v[2]*m[9] + v[3]*m[13];
        out[2] = v[0]*m[2] + v[1]*m[6] + v[2]*m[10]+ v[3]*m[14];
        out[3] = v[0]*m[3] + v[1]*m[7] + v[2]*m[11]+ v[3]*m[15];
    };


    var postTranslate = function(m , tx, ty, tz){
        var mt = translate(tx, ty, tz);
        return mul(mt, m);
    };

    var postRotateXY = function(m, angle, px, py, isRadian){
        var mr = rotateXY(angle, px, py, isRadian);
        return mul(mr, m);
    };

    var postRotate3d = function(m, angle, x, y, z, isRadian){
        var mr = rotate3d(angle, x, y, z, isRadian);
        return mul(mr, m);
    };

    var postScale = function(m, rate, px, py, pz){
        var ms = scale(rate, px, py, pz);
        return mul(ms, m);
    };

    var preTranslate = function(m , tx, ty, tz){
        var mt = translate(tx, ty, tz);
        return mul(m, mt);
    };

    var preRotateXY = function(m, angle, px, py, isRadian){
        var mr = rotateXY(angle, px, py, isRadian);
        return mul(m, mr);
    };

    var preRotate3d = function(m, angle, x, y, z, isRadian){
        var mr = rotate3d(angle, x, y, z, isRadian);
        return mul(m, mr);
    };

    var preScale = function(m, rate, px, py, pz){
        var ms = scale(rate, px, py, pz);
        return mul(m, ms);
    };

    var transpose = function(src){

        var dst = [];
        dst.push(src[0]);
        dst.push(src[4]);
        dst.push(src[8]);
        dst.push(src[12]);

        dst.push(src[1]);
        dst.push(src[5]);
        dst.push(src[9]);
        dst.push(src[13]);

        dst.push(src[2]);
        dst.push(src[6]);
        dst.push(src[10]);
        dst.push(src[14]);

        dst.push(src[3]);
        dst.push(src[7]);
        dst.push(src[11]);
        dst.push(src[15]);

        return dst;
    };

    var invert = function(src){
        var 
            a00 = src[0], a01 = src[1], a02 = src[2],  a03 = src[3],
            a10 = src[4], a11 = src[5], a12 = src[6],  a13 = src[7],
            a20 = src[8], a21 = src[9], a22 = src[10], a23 = src[11],
            a30 = src[12],a31 = src[13],a32 = src[14], a33 = src[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;


        //这里不能用行列式和0.0相差一个极小值来判断不可逆, 因为渲染用的有些矩阵比较病态, 确实det非常接近0但是还是可逆的
        if(0.0 != det){
            var retval = [];
            retval.push((a11 * b11 - a12 * b10 + a13 * b09) / det);
            retval.push((a02 * b10 - a01 * b11 - a03 * b09) / det);
            retval.push((a31 * b05 - a32 * b04 + a33 * b03) / det);
            retval.push((a22 * b04 - a21 * b05 - a23 * b03) / det);

            retval.push((a12 * b08 - a10 * b11 - a13 * b07) / det);
            retval.push((a00 * b11 - a02 * b08 + a03 * b07) / det);
            retval.push((a32 * b02 - a30 * b05 - a33 * b01) / det);
            retval.push((a20 * b05 - a22 * b02 + a23 * b01) / det);

            retval.push((a10 * b10 - a11 * b08 + a13 * b06) / det);
            retval.push((a01 * b08 - a00 * b10 - a03 * b06) / det);
            retval.push((a30 * b04 - a31 * b02 + a33 * b00) / det);
            retval.push((a21 * b02 - a20 * b04 - a23 * b00) / det);

            retval.push((a11 * b07 - a10 * b09 - a12 * b06) / det);
            retval.push((a00 * b09 - a01 * b07 + a02 * b06) / det);
            retval.push((a31 * b01 - a30 * b03 - a32 * b00) / det);
            retval.push((a20 * b03 - a21 * b01 + a22 * b00) / det);

            return retval;
        }else{
            return null;
        }
    };

    var orthographic = function(left, right, bottom, top, near, far){

        var m = mat();
        var r_width  = 1.0 / (right - left);
        var r_height = 1.0 / (top - bottom);
        var r_depth  = 1.0 / (far - near);
        var x =  2.0 * (r_width);
        var y =  2.0 * (r_height);
        var z = -2.0 * (r_depth);
        var tx = -(right + left) * r_width;
        var ty = -(top + bottom) * r_height;
        var tz = -(far + near) * r_depth;

        m[ 0] = x;
        m[ 5] = y;
        m[10] = z;
        m[12] = tx;
        m[13] = ty;
        m[14] = tz;
        m[15] = 1.0;
        m[ 1] = 0.0;
        m[ 2] = 0.0;
        m[ 3] = 0.0;
        m[ 4] = 0.0;
        m[ 6] = 0.0;
        m[ 7] = 0.0;
        m[ 8] = 0.0;
        m[ 9] = 0.0;
        m[11] = 0.0;

        return m;
    };

    var perspective = function(fovy, aspect, znear, zfar){
        var m = [];
        var f = 1.0 / Math.tan(fovy * (Math.PI / 360.0));
        var range_reciprocal = 1.0 / (znear - zfar);

        m.push(f / aspect);
        m.push(0.0);
        m.push(0.0);
        m.push(0.0);

        m.push(0.0);
        m.push(f);
        m.push(0.0);
        m.push(0.0);

        m.push(0.0);
        m.push(0.0);
        m.push((zfar + znear) * range_reciprocal);
        m.push(-1.0);

        m.push(0.0);
        m.push(0.0);
        m.push(2.0 * zfar * znear * range_reciprocal);
        m.push(0.0);

        return m;
    };


    /**
     * 计算3d点集的协方差矩阵
     * 注意输出的是3X3矩阵, 和本库中其他方法不通用
     */
    var covariance3x3 = function(pts){

        var x, y, z, mx, my, mz, i, cnt;
        var c00, c11, c22, c0110, c0220, c1221;
        var cm = [];

        cnt = pts.length;

        mx = 0, my = 0, mz = 0;
        for(i = 0; i < cnt; i++){
            mx += pts[i][0];
            my += pts[i][1];
            mz += pts[i][2];
        }
        mx /= cnt;
        my /= cnt;
        mz /= cnt;

        c00 = 0, c11 = 0, c22 = 0, c0110 = 0, c0220 = 0, c1221 = 0;
        for(i = 0; i < cnt; i++){
            x = pts[i][0];
            y = pts[i][1];
            z = pts[i][2];

            c00 += (x - mx)*(x - mx);
            c11 += (y - my)*(y - my);
            c22 += (z - mz)*(z - mz);
            c0110 += (x - mx)*(y - my);
            c0220 += (x - mx)*(z - mz);
            c1221 += (y - my)*(z - mz);
        }
        c00 /= cnt;
        c11 /= cnt;
        c22 /= cnt;
        c0110 /=cnt;
        c0220 /=cnt;
        c1221 /=cnt;

        cm.push(c00);
        cm.push(c0110);
        cm.push(c0220);
        cm.push(c0110);
        cm.push(c11);
        cm.push(c1221);
        cm.push(c0220);
        cm.push(c1221);
        cm.push(c22);

        return cm;
    };


    /**
     * 三对角化
     */
    var _tred2 = function(n, d, e, v){
       //  This is derived from the Algol procedures tred2 by
       //  Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
       //  Auto. Comp., vol.ii-Linear Algebra, and the corresponding
       //  Fortran subroutine in EISPACK.
       var i, j, k;

        for(j = 0; j < n; j++) {
            d[j] = v[n-1][j];
        }

        // Householder reduction to tridiagonal form.
        for (i = n-1; i > 0; i--) {
       
            // Scale to avoid under/overflow.
           
            var scale = 0.0;
            var h = 0.0;
            for (k = 0; k < i; k++) {
                scale = scale + Math.abs(d[k]);
            }
            if (scale == 0.0) {
                e[i] = d[i-1];
                for (j = 0; j < i; j++) {
                    d[j] = v[i-1][j];
                    v[i][j] = 0.0;
                    v[j][i] = 0.0;
                }
            } else {
           
                // Generate Householder vector.
                for (k = 0; k < i; k++) {
                    d[k] /= scale;
                    h += d[k] * d[k];
                }
                var f = d[i-1];
                var g = Math.sqrt(h);
                if (f > 0) {
                    g = -g;
                }
                e[i] = scale * g;
                h = h - f * g;
                d[i-1] = f - g;
                for (j = 0; j < i; j++) {
                    e[j] = 0.0;
                }
           
                // Apply similarity transformation to remaining columns.
                for (j = 0; j < i; j++) {
                    f = d[j];
                    v[j][i] = f;
                    g = e[j] + v[j][j] * f;

                    for (k = j+1; k <= i-1; k++) {
                        g += v[k][j] * d[k];
                        e[k] += v[k][j] * f;
                    }
                    e[j] = g;
                }
                f = 0.0;
                for (j = 0; j < i; j++) {
                    e[j] /= h;
                    f += e[j] * d[j];
                }
                var hh = f / (h + h);
                for (j = 0; j < i; j++) {
                    e[j] -= hh * d[j];
                }
                for (j = 0; j < i; j++) {
                    f = d[j];
                    g = e[j];
                    for (k = j; k <= i-1; k++) {
                        v[k][j] -= (f * e[k] + g * d[k]);
                    }
                    d[j] = v[i-1][j];
                    v[i][j] = 0.0;
                }
            }
            d[i] = h;
        }
       
      // Accumulate transformations.
      for (i = 0; i < n-1; i++) {
         v[n-1][i] = v[i][i];
         v[i][i] = 1.0;
         var h = d[i+1];
         if (h != 0.0) {
            for (k = 0; k <= i; k++) {
               d[k] = v[k][i+1] / h;
            }
            for (j = 0; j <= i; j++) {
               var g = 0.0;
               for (k = 0; k <= i; k++) {
                  g += v[k][i+1] * v[k][j];
               }
               for (k = 0; k <= i; k++) {
                  v[k][j] -= g * d[k];
               }
            }
         }
         for (k = 0; k <= i; k++) {
            v[k][i+1] = 0.0;
         }
      }
      for (j = 0; j < n; j++) {
         d[j] = v[n-1][j];
         v[n-1][j] = 0.0;
      }
      v[n-1][n-1] = 1.0;
      e[0] = 0.0;

    };

    /**
     * QL分解
     */
    var _trql2 = function(n, d, e, v){

        //  This is derived from the Algol procedures tql2, by
        //  Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
        //  Auto. Comp., vol.ii-Linear Algebra, and the corresponding
        //  Fortran subroutine in EISPACK.
        var i, j, k, l, m, iter;

       
        for(i = 1; i < n; i++){
         e[i-1] = e[i];
        }
        e[n-1] = 0.0;
       
        var f = 0.0;
        var tst1 = 0.0;
        var eps = Math.pow(2.0,-52.0);


        for(l = 0; l < n; l++){

            // Find small subdiagonal element
            tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
            m = l;

            while(m < n){
                if (Math.abs(e[m]) <= eps*tst1) {
                    break;
                }
                m++;
            }
       
            // If m == l, d[l] is an eigenvalue,
            // otherwise, iterate.
            if (m > l) {

                iter = 0;

                do {
                    iter = iter + 1;  // (Could check iteration count here.)

                    /**
                     * 在c下跑起来和Java下有点区别
                     * do while的退出条件没法出发
                     * 迭代太多次就nan了
                     * 现在尝试在迭代到第七次时退出
                     */
                    if(iter >= 7){
                        break;
                    }

                    // Compute implicit shift
                    var g = d[l];
                    var p = (d[l+1] - g) / (2.0 * e[l]);
                    var r = Math.hypot(p,1.0);

                    if (p < 0) {
                      r = -r;
                    }

                    d[l] = e[l] / (p + r);
                    d[l+1] = e[l] * (p + r);
                    var dl1 = d[l+1];
                    var h = g - d[l];
                    for (i = l+2; i < n; i++) {
                      d[i] -= h;
                    }
                    f = f + h;

                    // Implicit QL transformation.
                    p = d[m];
                    var c = 1.0;
                    var c2 = c;
                    var c3 = c;
                    var el1 = e[l+1];
                    var s = 0.0;
                    var s2 = 0.0;

                    for(i = m-1; i >= l; i--){
                        c3 = c2;
                        c2 = c;
                        s2 = s;
                        g = c * e[i];
                        h = c * p;
                        r = Math.hypot(p,e[i]);
                        e[i+1] = s * r;
                        s = e[i] / r;
                        c = p / r;
                        p = c * d[i] - s * g;
                        d[i+1] = h + s * (c * g + s * d[i]);

                        // Accumulate transformation.
                        for (k = 0; k < n; k++) {
                            h = v[k][i+1];
                            v[k][i+1] = s * v[k][i] + c * h;
                            v[k][i] = c * v[k][i] - s * h;
                        }
                    }
                    p = -s * s2 * c3 * el1 * e[l] / dl1;
                    e[l] = s * p;
                    d[l] = c * p;
           
                    // Check for convergence.
                } while (Math.abs(e[l]) > eps*tst1);
             }
             d[l] = d[l] + f;
             e[l] = 0.0;
          }

         
        // Sort eigenvalues and corresponding vectors.
        for (i = 0; i < n-1; i++) {
            k = i;
            var p = d[i];
            for (j = i+1; j < n; j++) {
                if (d[j] < p) {
                    k = j;
                    p = d[j];
                }
            }
            if (k != i) {
                d[k] = d[i];
                d[i] = p;
                for (j = 0; j < n; j++) {
                    p = v[j][i];
                    v[j][i] = v[j][k];
                    v[j][k] = p;
                }
            }
        }

    };



    /**
     * 3x3对称矩阵的特征值分解
     */
    var eig3x3 = function(m){
        var v, d, e;
        var eigvalue = [];
        var eigvec = [];

        /**
         * 为确保有实特征值, 要求矩阵是对称的
         */
        if(m[3] != m[1] || m[6] != m[2] || m[7] != m[5]){
            throw new Error("matrix is not symmetric");
        }

        
        v = [];
        v.push(new Array(m[0], m[3], m[6]));
        v.push(new Array(m[1], m[4], m[7]));
        v.push(new Array(m[2], m[5], m[8]));

        d = new Array(0, 0, 0);
        e = new Array(0, 0, 0);

        //三对角化
        _tred2(3, d, e, v);

        //QL分解
        _trql2(3, d, e, v);

        eigvalue.push(d[0]);
        eigvalue.push(d[1]);
        eigvalue.push(d[2]);

        eigvec.push(v[0][0]);
        eigvec.push(v[1][0]);
        eigvec.push(v[2][0]);
        eigvec.push(v[0][1]);
        eigvec.push(v[1][1]);
        eigvec.push(v[2][1]);
        eigvec.push(v[0][2]);
        eigvec.push(v[1][2]);
        eigvec.push(v[2][2]);

        return { value : eigvalue,
                vec : eigvec}; 
    };

    /**
     * 导出矩阵的欧拉参数
     * 绕x, y, z轴的旋转弧度
     */
    var eulerParamExtract = function(m){
        var ry, rx, rz;

        ry = Math.atan2(-m[2], m[10]);
        rx = Math.asin(m[6]);
        rz = Math.atan2(-m[4], m[5]);
        
        return new Euler(rx, ry, rz);
    };

    var eulerParamExtractX = function(m){
        return Math.asin(m[6]);
    };

    var eulerParamExtractY = function(m){
        return Math.atan2(-m[2], m[10]);
    };

    var eulerParamExtractZ = function(m){
       
        return Math.atan2(-m[4], m[5]);
    };

	var rotationFromQuaternion = function(q){

        var te = mat()

		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 1 ] = xy - wz;
		te[ 2 ] = xz + wy;
        te[ 3 ] = 0.0;

		te[ 4 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 6 ] = yz - wx;
        te[ 7 ] = 0.0;

		te[ 8 ] = xz - wy;
		te[ 9 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );
        te[ 11 ] = 0.0;

		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;
        

        return te;
    };


	return {
        mat : mat,
        matClone : matClone,
        rotate3d : rotate3d,
        rotateXY : rotateXY,
        translate : translate,
        rotateAxis : rotateAxis,
        scale : scale,
        scaleXYZ : scaleXYZ,
        mul : mul,
        mulVec : mulVec,
        mulVecTo : mulVecTo,
        postTranslate : postTranslate,
        postRotateXY : postRotateXY,
        postRotate3d : postRotate3d,
        postScale : postScale,
        preTranslate : preTranslate,
        preRotateXY : preRotateXY,
        preRotate3d : preRotate3d,
        preScale : preScale,
        transpose : transpose,
        invert : invert,
        orthographic : orthographic,
        perspective : perspective,
        setTranslateZ : setTranslateZ,

        covariance3x3 : covariance3x3,
        eig3x3 : eig3x3,

        eulerParamExtract : eulerParamExtract,
        eulerParamExtractX : eulerParamExtractX,
        eulerParamExtractY : eulerParamExtractY,
        eulerParamExtractZ : eulerParamExtractZ,

        rotationFromQuaternion : rotationFromQuaternion
    };
}();



/**
 * 已知一个点P与法向量N
 * 过P与N垂直的平面可以定义为满足N·(Q-P)=0的点Q的集合
 * 平面方程表示为 A*x + B*y + C*z + D = 0
 * 其中A = Nx, B = Ny, C = Nz, D = -N·P
 *
 * 平面可以简单表示为一个4维向量L = <N,D>
 */
YFM.Math.Plane = function(){

    var plane = function(px, py, pz, nx, ny, nz){

        var p = YFM.Math.Vector.pos(px, py, pz);
        var n = YFM.Math.Vector.normalize(YFM.Math.Vector.vec(nx, ny, nz));

        var d = -YFM.Math.Vector.dot3(n, p);
        n[3] = d;

        return n;
    };

    var planePN = function(p, n){
        return plane(p[0], p[1], p[2], n[0], n[1], n[2]);
    };

    var planeRaw = function(p0, p1, p2, p3){
        return YFM.Math.Vector.vec(p0, p1, p2, p3);
    };

    var transform = function(p, mat){
        var imat = YFM.Math.Matrix.invert(mat);
        var timat;
        var retval;

        if(null == imat){
            throw new Error("transform a plane with a singular matrix");
        }else{
            timat = YFM.Math.Matrix.transpose(imat);
            retval = YFM.Math.Matrix.mulVec(timat, p);
        }

        return retval;
    };

    /**
     * 此距离是带符号的,
     * 正数代表点位于平面的法向一侧
     * 负数代表点位于平面的另一侧
     */
    var distance = function(p, x, y, z){
        var pos = YFM.Math.Vector.pos(x, y, z);

        return YFM.Math.Vector.dot4(p, pos);
    };

    var intersectionLine = function(p, line){
        var s = YFM.Math.Vector.pos(line[0], line[1], line[2]);
        var v = YFM.Math.Vector.vec(line[4], line[5], line[6]);

        var pdots, pdotv;

        pdots = YFM.Math.Vector.dot4(p, s);
        pdotv = YFM.Math.Vector.dot4(p, v);

        if(YFM.Math.floatEquals(pdotv, 0.0))
            throw new Error("Calc intersection of a line parallel to a plane");

        return -pdots / pdotv;
    };

    /**
     * 两平面相交
     */
    var intersectionPlane = function(p0, p1){
        var parallel;
        var nvmat, inv_nvmat;
        var v, q;

        /**
         * 两平面相交, 其交线的方向V一定等于N0XN1
         */
        v = YFM.Math.Vector.cross(p0, p1);

        /**
         * 如果v的模长为0, 表示两平面平行
         */
        parallel = Math.floatEquals(0.0, YFM.Math.Vector.norm3(v));

        if(!parallel){
            /**
             * 非平行时, 为确定平面相交的直线, 除了直线的方向V
             * 还需要直线上一点Q, Q可以用下面的公式算出
             *
             *      ┌              ┐-1 ┌   ┐
             *      │N0x  N0y  N0z │   │-D0│
             *      │              │   │   │
             *  Q = │N1x  N1y  N1z │   │-D1│
             *      │              │   │   │
             *      │Vx   Vy   Vz  │   │ 0 │
             *      └              ┘   └   ┘
             */
            nvmat    = [];

            nvmat.push(p0[0]);
            nvmat.push(p1[0]);
            nvmat.push(v[0]);
            nvmat.push(0.0);

            nvmat.push(p0[1]);
            nvmat.push(p1[1]);
            nvmat.push(v[1]);
            nvmat.push(0.0);

            nvmat.push(p0[2]);
            nvmat.push(p1[2]);
            nvmat.push(v[2]);
            nvmat.push(0.0);

            nvmat.push(0.0);
            nvmat.push(0.0);
            nvmat.push(0.0);
            nvmat.push(1.0);

            inv_nvmat = YFM.Math.Matrix.invert(nvmat);
            if(null == inv_nvmat){
                throw new Error("nv matrix is singular");
            }

            q = YFM.Math.Matrix.mulVec(inv_nvmat, YFM.Math.Vector.pos(-p0[3], -p1[3], 0.0));

            return {parallel : parallel,
                line : YFM.Math.Line.lineSV(q, v)};
        }else{
            return {parallel : parallel};
        }
    };

    var intersectionTriplePlane = function(p0, p1, p2){

        var singular, m, im, q;
        /**
         * 令L1=<N1, D1>, L2=<N2, D2>, L3=<N3, D3>
         * 为三个任意平面, 解如下方程组可得同时位于三平面的点Q
         *      L1·Q = 0
         *      L2·Q = 0
         *      L3·Q = 0
         *
         * 化成矩阵形式
         *           ┌   ┐
         *           │-D1│
         *           │   │
         *      MQ = │-D2│
         *           │   │
         *           │-D3│
         *           └   ┘
         *          ┌              ┐
         *          │N1x  N1y  N1z │
         *          │              │
         *      M = │N2x  N2y  N2z │
         *          │              │
         *          │N3x  N3y  N3z │
         *          └              ┘
         */
        m = [];
        m.push(p0[0]);
        m.push(p1[0]);
        m.push(p2[0]);
        m.push(0.0);

        m.push(p0[1]);
        m.push(p1[1]);
        m.push(p2[1]);
        m.push(0.0);

        m.push(p0[2]);
        m.push(p1[2]);
        m.push(p2[2]);
        m.push(0.0);

        m.push(0.0);
        m.push(0.0);
        m.push(0.0);
        m.push(1.0);

        /**
         * 如果矩阵是奇异的, 说明三平面不交于一点.
         * 当三平面法向量共面时会出现这种情况
         */
        im = YFM.Math.Matrix.invert(m);
        
        singular = null == im;

        /**
         * 如果M非奇异, 可以如下计算三平面的唯一交点Q
         *
         *           ┌   ┐
         *           │-D1│
         *        -1 │   │
         *   Q = M   │-D2│
         *           │   │
         *           │-D3│
         *           └   ┘
         */
        if(!singular){
            q = YFM.Math.Matrix.mulVec(im, YFM.Math.Vector.pos(-p0[3], -p1[3], -p2[3]));

            return { atAPoint : true,
                      point : q};
        }else{
            return { atAPoint : false};
        }
    };

	return {
        plane : plane,
        planePN : planePN,
        planeRaw : planeRaw,
        transform : transform,
        distance : distance,
        intersectionLine : intersectionLine,
        intersectionPlane : intersectionPlane,
        intersectionTriplePlane : intersectionTriplePlane
    };
}();


/**
 * 参考自three.js的四元数类
 */
function Quaternion(x, y, z, w){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;
}

Quaternion.prototype = {
    constructor : Quaternion,

    toString : function(fix){
        var ret = "(";
        ret = ret + this.x.toFixed(fix) + ", ";
        ret = ret + this.y.toFixed(fix) + ", ";
        ret = ret + this.z.toFixed(fix) + ", ";
        ret = ret + this.w.toFixed(fix) + ")";
        return ret;
    },

	clone : function(){
		return new this.constructor(this.x, this.y, this.z, this.w);
	},

	copy : function(quaternion){

		this.x = quaternion.x;
		this.y = quaternion.y;
		this.z = quaternion.z;
		this.w = quaternion.w;

		return this;
	},

	setFromEuler : function(euler) {

		var x = euler.x, y = euler.y, z = euler.z, order = euler.order;

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m
		var cos = Math.cos;
		var sin = Math.sin;

		var c1 = cos(x / 2);
		var c2 = cos(y / 2);
		var c3 = cos(z / 2);

		var s1 = sin(x / 2);
		var s2 = sin(y / 2);
		var s3 = sin(z / 2);

		if(order === 'XYZ'){

			this.x = s1 * c2 * c3 + c1 * s2 * s3;
			this.y = c1 * s2 * c3 - s1 * c2 * s3;
			this.z = c1 * c2 * s3 + s1 * s2 * c3;
			this.w = c1 * c2 * c3 - s1 * s2 * s3;

		}else if(order === 'YXZ'){

			this.x = s1 * c2 * c3 + c1 * s2 * s3;
			this.y = c1 * s2 * c3 - s1 * c2 * s3;
			this.z = c1 * c2 * s3 - s1 * s2 * c3;
			this.w = c1 * c2 * c3 + s1 * s2 * s3;

		}else if(order === 'ZXY'){

			this.x = s1 * c2 * c3 - c1 * s2 * s3;
			this.y = c1 * s2 * c3 + s1 * c2 * s3;
			this.z = c1 * c2 * s3 + s1 * s2 * c3;
			this.w = c1 * c2 * c3 - s1 * s2 * s3;

		}else if(order === 'ZYX') {

			this.x = s1 * c2 * c3 - c1 * s2 * s3;
			this.y = c1 * s2 * c3 + s1 * c2 * s3;
			this.z = c1 * c2 * s3 - s1 * s2 * c3;
			this.w = c1 * c2 * c3 + s1 * s2 * s3;

		}else if(order === 'YZX'){

			this.x = s1 * c2 * c3 + c1 * s2 * s3;
			this.y = c1 * s2 * c3 + s1 * c2 * s3;
			this.z = c1 * c2 * s3 - s1 * s2 * c3;
			this.w = c1 * c2 * c3 - s1 * s2 * s3;

		}else if(order === 'XZY'){

			this.x = s1 * c2 * c3 - c1 * s2 * s3;
			this.y = c1 * s2 * c3 - s1 * c2 * s3;
			this.z = c1 * c2 * s3 + s1 * s2 * c3;
			this.w = c1 * c2 * c3 + s1 * s2 * s3;

		}

		return this;

	},

	setFromAxisAngle : function(axis, angle){

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
		// assumes axis is normalized

		var halfAngle = angle / 2, s = Math.sin( halfAngle );

		this.x = axis[0] * s;
		this.y = axis[1] * s;
		this.z = axis[2] * s;
		this.w = Math.cos(halfAngle);

		return this;
	},

	setFromRotationMatrix : function(m){

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var m11 = m[0], m12 = m[4], m13 = m[8],
			m21 = m[1], m22 = m[5], m23 = m[9],
			m31 = m[2], m32 = m[6], m33 = m[10],

			trace = m11 + m22 + m33,
			s;

		if(trace > 0){
			s = 0.5 / Math.sqrt(trace + 1.0);

			this.w = 0.25 / s;
			this.x = (m32 - m23) * s;
			this.y = (m13 - m31) * s;
			this.z = (m21 - m12) * s;

		}else if(m11 > m22 && m11 > m33){

			s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

			this.w = ( m32 - m23 ) / s;
			this.x = 0.25 * s;
			this.y = ( m12 + m21 ) / s;
			this.z = ( m13 + m31 ) / s;

		}else if(m22 > m33){

			s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

			this.w = (m13 - m31) / s;
			this.x = (m12 + m21) / s;
			this.y = 0.25 * s;
			this.z = (m23 + m32) / s;

		}else{

			s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

			this.w = (m21 - m12) / s;
			this.x = (m13 + m31) / s;
			this.y = (m23 + m32) / s;
			this.z = 0.25 * s;

		}


		return this;
	},

	inverse : function () {
		return this.conjugate().normalize();
	},

	conjugate : function () {

		this.x *= - 1;
		this.y *= - 1;
		this.z *= - 1;

		return this;
	},

	dot : function (q) {

		return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	},

	length: function () {

		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	},

	normalize: function () {

		var l = this.length();

		if(l === 0){

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;
		}else{

			l = 1 / l;

			this.x = this.x * l;
			this.y = this.y * l;
			this.z = this.z * l;
			this.w = this.w * l;
		}

		return this;
	},

	multiply : function(q){

		return this.multiplyQuaternions(this, q);
	},

	premultiply : function(q){

		return this.multiplyQuaternions(q, this);
	},

	multiplyQuaternions : function(a, b){

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
		var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
		var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;
	},

	slerp : function(qb, t){

		if(t === 0) return this;
		if(t === 1) return this.copy(qb);

		var x = this.x, y = this.y, z = this.z, w = this.w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
		var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;

		if(cosHalfTheta < 0){

			this.w = - qb.w;
			this.x = - qb.x;
			this.y = - qb.y;
			this.z = - qb.z;

			cosHalfTheta = - cosHalfTheta;
		}else{
			this.copy(qb);
		}

		if(cosHalfTheta >= 1.0){

			this.w = w;
			this.x = x;
			this.y = y;
			this.z = z;

			return this;
		}

		var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

		if(Math.abs(sinHalfTheta) < 0.001){

			this.w = 0.5 * (w + this.w);
			this.x = 0.5 * (x + this.x);
			this.y = 0.5 * (y + this.y);
			this.z = 0.5 * (z + this.z);

			return this;
		}

		var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
		var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
			ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

		this.w = (w * ratioA + this.w * ratioB);
		this.x = (x * ratioA + this.x * ratioB);
		this.y = (y * ratioA + this.y * ratioB);
		this.z = (z * ratioA + this.z * ratioB);

		return this;
    }
}


YFM.Math.Vector = function(){

    /**
     * 向量运算目前只用4维的,其他的懒得实现了, 可以用四维代替
     */
    var pos = function(){
        var result = YFM.Math.argumentsToArray(arguments);
        switch(result.length){
        case 0: result.push(0.0);
        case 1: result.push(0.0);
        case 2: result.push(0.0);
        case 3: result.push(1.0);
        }
        return result.splice(0, 4);
    };

    var vec = function(){
        var result = YFM.Math.argumentsToArray(arguments);
        switch(result.length){
        case 0: result.push(0.0);
        case 1: result.push(0.0);
        case 2: result.push(0.0);
        case 3: result.push(0.0);
        }
        return result.splice(0, 4);
    };

    var vecClone = function(vec){

        return vec.slice(0);
    };

    var add = function(u, v){
        var result = [];
        result.push(u[0] + v[0]);
        result.push(u[1] + v[1]);
        result.push(u[2] + v[2]);
        result.push(u[3] + v[3]);
        return result;
    };

    var addTo = function(out, u, v){
        out[0] = u[0] + v[0];
        out[1] = u[1] + v[1];
        out[2] = u[2] + v[2];
        out[3] = u[3] + v[3];
    };

    var sub = function(u, v){
        var result = [];
        result.push(u[0] - v[0]);
        result.push(u[1] - v[1]);
        result.push(u[2] - v[2]);
        result.push(u[3] - v[3]);
        return result;
    };

    var subTo = function(out, u, v){
        out[0] = u[0] - v[0];
        out[1] = u[1] - v[1];
        out[2] = u[2] - v[2];
        out[3] = u[3] - v[3];
    };

    var scale = function(v, factor){
        var result = [];
        result.push(factor * v[0]);
        result.push(factor * v[1]);
        result.push(factor * v[2]);
        result.push(factor * v[3]);
        return result;
    };

    var scaleTo = function(v, factor){
        v[0] *= factor;
        v[1] *= factor;
        v[2] *= factor;
        v[3] *= factor;
    };

    /**
     * 齐次坐标三维內积
     */
    var dot3 = function(u, v){
        return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    };

    /**
     * 齐次坐标四维內积
     */
    var dot4 = function(u, v){
        return u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3];
    };

    var cross = function(u, v){
        var result = [];
        result.push(-v[1]*u[2] + v[2]*u[1]);
        result.push(v[0]*u[2] - v[2]*u[0]);
        result.push(-v[0]*u[1] + v[1]*u[0]);
        result.push(0.0);

        return result;
    };

    var norm3 = function(v){
        return Math.sqrt(dot3(v, v));
    };
    var norm4 = function(v){
        return Math.sqrt(dot4(v, v));
    };
    var norm3SQ = function(v){
        return dot3(v, v);
    };
    var norm4SQ = function(v){
        return dot4(v, v);
    };
    var distanceSQ = function(p0, p1){
        var s = sub(p1, p0);
        return dot3(s, s);
    };
    var distance = function(p0, p1){
        var s = sub(p1, p0);
        return Math.sqrt(dot3(s, s));
    };

    var normalize = function(v){
        var result = [];
        var m = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
        if(m > 0){
            result.push(v[0]/m);
            result.push(v[1]/m);
            result.push(v[2]/m);
            result.push(v[3]);
        } else {
            result.push(0.0);
            result.push(0.0);
            result.push(0.0);
            result.push(v[3]);
        }
        return result;
    };

    var normalizeTo = function(v){
        var m = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
        if(m > 0){
            v[0] = v[0]/m;
            v[1] = v[1]/m;
            v[2] = v[2]/m;
        } else {
            v[0] = 0.0;
            v[1] = 0.0;
            v[2] = 0.0;
        }
    };

    var limitTo = function(v, len){
        var normsq = dot3(v, v);
        if(normsq > len*len){
            var norm = Math.sqrt(normsq);
            v[0] /= norm;
            v[1] /= norm;
            v[2] /= norm;

            v[0] *= len;
            v[1] *= len;
            v[2] *= len;
        }
    };

    var limitToRange = function(v, min, max){
        var normsq = dot3(v, v);
        var norm;
        if(normsq > max*max){
            norm = Math.sqrt(normsq);
            v[0] /= norm;
            v[1] /= norm;
            v[2] /= norm;

            v[0] *= max;
            v[1] *= max;
            v[2] *= max;
        }else if(normsq < min*min){
            norm = Math.sqrt(normsq);
            v[0] /= norm;
            v[1] /= norm;
            v[2] /= norm;

            v[0] *= max;
            v[1] *= max;
            v[2] *= max;
        }
    };

    var mix = function(u, v, s){
        var ret = [];
        
        ret.push((1 - s)*u[0] + s*v[0]);
        ret.push((1 - s)*u[1] + s*v[1]);
        ret.push((1 - s)*u[2] + s*v[2]);
        ret.push((1 - s)*u[3] + s*v[3]);

        return ret;
    };

    var mid = function(p1, p2){

        var ret = [];

        ret.push((p1[0] + p2[0])/2.0);
        ret.push((p1[1] + p2[1])/2.0);
        ret.push((p1[2] + p2[2])/2.0);
        ret.push(1.0);

        return ret;
    };

    var midTo = function(out, p1, p2){

        out[0] = (p1[0] + p2[0])/2.0;
        out[1] = (p1[1] + p2[1])/2.0;
        out[2] = (p1[2] + p2[2])/2.0;
        out[3] = 1.0;
    };



	return {
        pos : pos,
        vec : vec,
        vecClone : vecClone,
        add : add,
        addTo : addTo,
        sub : sub,
        subTo : subTo,
        scale : scale,
        scaleTo : scaleTo,
        dot3 : dot3,
        dot4 : dot4,
        cross : cross,
        norm3 : norm3,
        norm4 : norm4,
        norm3SQ : norm3SQ,
        norm4SQ : norm4SQ,
        normalize : normalize,
        normalizeTo : normalizeTo,
        limitTo : limitTo,
        limitToRange : limitToRange,
        mix : mix,
        mid : mid,
        midTo : midTo,
        distanceSQ : distanceSQ,
        distance : distance
    };
}();




function PlanePolygon(pts)
{
    this.barrier = [];
    this.plane = this._makePlanePts(pts);
}

PlanePolygon.prototype = {
    constructor : PlanePolygon,

    /**
     * 这个我觉得还有优化的余地
     * 如果构造PlanePolygon时就先把各点变换到世界坐标系
     * 就不用每次检定时做坐标变换了
     */
    intersectionLine : function(line, floorMat){

        var len, i, d, min, t, point, mat;

        do{
            min = 0;
            t = YFM.Math.Plane.intersectionLine(this.plane, line);

            /**
             * 如果t小于0, 说明交点在射线的反方向, 在我们的使用场景中代表
             * 目标平面在视见体近平面之后, 此种情况, 返回非法的值1024
             */
            if(t < 0){
                min = 1024;
                break;
            }

            point = YFM.Math.Line.getPoint(line, t);
            mat = YFM.Math.Matrix.invert(floorMat);
            point = YFM.Math.Matrix.mulVec(mat, point);

            len = this.barrier.length;
            for(i = 0; i < len; i ++){
                d = YFM.Math.Plane.distance(this.barrier[i], point[0], point[1], point[2]);
                if(d < min)
                    min = d;
            }
        }while(false);

        return min;
    },

    _makePlanePts : function(pts){
        var n, v1, n1, v2, i, len;
        len = pts.length;
        if(len < 3){
            throw new Error("polygon pts count < 3");
        }
        i = 0;
        do{
            v1 = YFM.Math.Vector.sub(pts[(i+1)%len], pts[i%len]);
            v2 = YFM.Math.Vector.sub(pts[(i+2)%len], pts[(i+1)%len]);
            n = YFM.Math.Vector.cross(v1, v2);
            if(!YFM.Math.floatEquals(YFM.Math.Vector.norm3SQ(n), 0.0))
                break;
            i++;
        }while(i < len);

        if(YFM.Math.floatEquals(YFM.Math.Vector.norm3SQ(n), 0.0))
            throw new Error("polygon degenerate");
        n = YFM.Math.Vector.normalize(n);

        i = 0;
        do{
            v1 = YFM.Math.Vector.sub(pts[(i+1)%len], pts[i%len]);
            n1 = YFM.Math.Vector.cross(n, v1);
            n1 = YFM.Math.Vector.normalize(n1);
            this.barrier.push(YFM.Math.Plane.planePN(pts[i], n1));
            i++;
        }while(i < len);

        return YFM.Math.Plane.planePN(pts[0], n);
    }
}



function Mover(x, y, z)
{
    this.mass = this.DEFAULT_MASS;
    this.maxForce = this.DEFAULT_MAX_FORCE;
    this.maxSpeed = this.DEFAULT_MAX_SPEED;

    this.location = YFM.Math.Vector.pos(x||0, y||0, z||0);
    this.velocity = YFM.Math.Vector.vec(0, 0, 0);
    this.acceleration = YFM.Math.Vector.vec(0, 0, 0);
}

Mover.prototype = {
    constructor : Mover,

    DEFAULT_MASS : 1.0,
    DEFAULT_MAX_FORCE : 4.0,
    DEFAULT_MAX_SPEED : 4.0,

    setMass : function(mass){
        this.mass = mass;
    },

    setMaxForce : function(maxForce){
        this.maxForce = maxForce;
    },

    setMaxSpeed : function(maxSpeed){
        this.maxSpeed = maxSpeed;
    },

    setLocation : function(x, y, z){
        this.location[0] = x;
        this.location[1] = y;
        this.location[2] = z;
    },

    getLocation : function(){
        return this.location;
    },
    
    update : function(){
        YFM.Math.Vector.addTo(this.velocity, this.velocity, this.acceleration);
        YFM.Math.Vector.limitTo(this.velocity, this.maxSpeed);
        YFM.Math.Vector.addTo(this.location, this.location, this.velocity);

        this.acceleration[0] = 0;
        this.acceleration[1] = 0;
        this.acceleration[2] = 0;
    },

    applyForce : function(force){
        var f = YFM.Math.Vector.scale(force, 1.0/this.mass);
        YFM.Math.Vector.addTo(this.acceleration, this.acceleration, f);
    },

    seek : function(target){

        var desired, steer;

        desired = YFM.Math.Vector.normalize(YFM.Math.Vector.sub(target, this.location));
        YFM.Math.Vector.scaleTo(this.maxSpeed);

        steer = YFM.Math.Vector.limitTo(YFM.Math.Vector.sub(desired, this.velocity), this.maxForce);

        this.applyForce(steer);
    },

    flee : function(target){

        var desired, steer;

        desired = YFM.Math.Vector.normalize(YFM.Math.Vector.sub(target, this.location));
        YFM.Math.Vector.scaleTo(-this.maxSpeed);

        steer = YFM.Math.Vector.limitTo(YFM.Math.Vector.sub(desired, this.velocity), this.maxForce);

        this.applyForce(steer);
    },

    arrive : function(target, dist){
        var desired, steer;
        var d, m;


        desired = YFM.Math.Vector.sub(target, this.location);
        d = YFM.Math.Vector.norm3(desired);
        if(d <= dist)
            return true;

        desired = YFM.Math.Vector.normalize(desired);
        if(d < 100){
            m = YFM.Math.map(d, 0, 100, 0, this.maxSpeed);
            YFM.Math.Vector.scaleTo(desired, m);
        }else{
            YFM.Math.Vector.scaleTo(desired, this.maxSpeed);
        }

        steer = YFM.Math.Vector.sub(desired, this.velocity);
        YFM.Math.Vector.limitTo(steer, this.maxForce);

        this.applyForce(steer);

        return false;
    }
}

/**
 * 楼层四叉树
 * 
 * 分层地图的场景不适合八叉树
 * 
 * 用OBB描述节点的分层四叉树比较合适
 */
function FloorQuadTree(floor, height)
{
    this.floor = floor;
    this.root = new FloorQuadNode(null, floor, 0, floor.mapWidth, 0, floor.mapHeight, height, "0", 0);
    this.objMap = {};
}
FloorQuadTree.prototype = {
    constructor : FloorQuadTree,

    cursor : 0,

    shift : 10000,

    removeObject : function(id){
        var objWrap = this.objMap[id.toString()]

        /**
         * 从对象所在节点列表中删除对象
         */
        if(objWrap){
            var node = objWrap.node;
            var tmpList = [];
            var it;
            for(var i = 0, l = node.objectList.length; i < l ; i++){
                it = node.objectList[i];

                if(objWrap !== it)
                    tmpList.push(it);
            }
            node.objectList = tmpList;

            /**
             * 如果删除对象后, 对象所在节点列表空了
             * 触发节点的shrink检定
             */
            if(node.objectList.length <= 0){

                node.shrink();
            }
        }

        return objWrap;
    },
    
    insertObject : function(obj, floorIndex, floorX, floorY, floorZ){
        var id = FloorQuadTree.prototype.cursor * FloorQuadTree.prototype.shift + this.floor.index;
        FloorQuadTree.prototype.cursor += 1;
        var pos = this.floor.floorPos2Region(floorX, floorY);
        pos[2] += floorZ;
        var objWrap = { 
                        id : id,
                        obj : obj, 
                        pos : pos,
                        floor :floorIndex,
                        x : floorX,
                        y : floorY,
                        z : floorZ
                        };
        this.objMap[id.toString()] = objWrap;

        this.root.insertObject(objWrap);
        return id;
    },

    insertObjectOBB : function(obj, obb){
        var id = FloorQuadTree.prototype.cursor * FloorQuadTree.prototype.shift + this.floor.index;
        FloorQuadTree.prototype.cursor += 1;
        var objWrap = { 
                        id : id,
                        obj : obj,
                        pos : obb
                        };
        this.objMap[id.toString()] = objWrap;
        this.root.insertObject(objWrap);
        return id;
    },

    frustumCheck : function(frustum){
        return this.root.frustumCheck(frustum);
    },


    rayCheck : function(ray, distance, once){
        var result = [];    
        this.root.rayCheck(ray, distance*distance, result, once);

        return result;
    },

    rayCheckOBB : function(ray, result, once){
        var result = [];    
        this.root.rayCheckOBB(ray, result, once);

        return result;
    },

    render : function(frustum, fun, cl, rLevel){
        this.root.renderCheck(frustum, fun, cl, rLevel);
    },

    getContainLevel : function(frustum){
        var node;
        node = this.root.containCheck(frustum);

        if(node != null){
            return node.level;
        }else{
            return 1024;
        }
    }
}


function FloorQuadNode(parentNode, floor, xmin, xmax, ymin, ymax, height, mask, level)
{
    this.parentNode = parentNode;
    this.floor  = floor;
    this.xmin   = xmin;
    this.xmax   = xmax;
    this.ymin   = ymin;
    this.ymax   = ymax;
    this.height = height;
    this.mask   = mask;
    this.level  = level;

    var pts = [];
    var p0, p1, p2, p3;


    p0 = floor.floorPos2Region(xmin, ymin);
    p1 = floor.floorPos2Region(xmax, ymin);
    p2 = floor.floorPos2Region(xmax, ymax);
    p3 = floor.floorPos2Region(xmin, ymax);

    /**
     * 将包围盒底部的z降低一个单位, 以免出现检定地面上的点时,
     * 结果是相切, 而不得不继续遍历检定子空间
     * 而这种情况, 从设计意图来说, 应该是包含的
     */
    pts.push(YFM.Math.Vector.pos(p0[0], p0[1], p0[2] - 100.0));
    pts.push(YFM.Math.Vector.pos(p1[0], p1[1], p1[2] - 100.0));
    pts.push(YFM.Math.Vector.pos(p2[0], p2[1], p2[2] - 100.0));
    pts.push(YFM.Math.Vector.pos(p3[0], p3[1], p3[2] - 100.0));

    pts.push(YFM.Math.Vector.pos(p0[0], p0[1], p0[2] + height));
    pts.push(YFM.Math.Vector.pos(p1[0], p1[1], p1[2] + height));
    pts.push(YFM.Math.Vector.pos(p2[0], p2[1], p2[2] + height));
    pts.push(YFM.Math.Vector.pos(p3[0], p3[1], p3[2] + height));

    /**
     * 测试用展示节点范围的框架
    var dummyLinesBuf = [];
    dummyLinesBuf.push(pts[0]);
    dummyLinesBuf.push(pts[1]);

    dummyLinesBuf.push(pts[1]);
    dummyLinesBuf.push(pts[2]);

    dummyLinesBuf.push(pts[2]);
    dummyLinesBuf.push(pts[3]);

    dummyLinesBuf.push(pts[3]);
    dummyLinesBuf.push(pts[0]);

    dummyLinesBuf.push(pts[4]);
    dummyLinesBuf.push(pts[5]);

    dummyLinesBuf.push(pts[5]);
    dummyLinesBuf.push(pts[6]);

    dummyLinesBuf.push(pts[6]);
    dummyLinesBuf.push(pts[7]);

    dummyLinesBuf.push(pts[7]);
    dummyLinesBuf.push(pts[4]);

    dummyLinesBuf.push(pts[0]);
    dummyLinesBuf.push(pts[4]);

    dummyLinesBuf.push(pts[1]);
    dummyLinesBuf.push(pts[5]);

    dummyLinesBuf.push(pts[2]);
    dummyLinesBuf.push(pts[6]);

    dummyLinesBuf.push(pts[3]);
    dummyLinesBuf.push(pts[7]);

    this.dummyLinesVBO = YFM.gGL.createBuffer();
    YFM.gGL.bindBuffer(YFM.gGL.ARRAY_BUFFER, this.dummyLinesVBO);
    YFM.gGL.bufferData(YFM.gGL.ARRAY_BUFFER, YFM.Math.flatten(dummyLinesBuf, 3), YFM.gGL.STATIC_DRAW);
    this.dummyLinesSize = dummyLinesBuf.length;*/

    this.obb = new OBB(pts);

    this.objectList = [];
    this.children = new Array(null, null, null, null);
    this.splited = false;
}
FloorQuadNode.prototype = {
    constructor : FloorQuadNode,

    shrink : function(){
        if(this.isNodeEmpty()){

            this.children[0] = null;
            this.children[1] = null;
            this.children[2] = null;
            this.children[3] = null;
            this.splited = false;

            /**
             * 如果本节点shrink检定通过, 
             * 继续检查父节点
             */
            if(null !== this.parentNode){
                this.parentNode.shrink();
            }
        }
    },

    /**
     * 检查节点是否没有容纳对象了
     * 可能需要递归
     */
    isNodeEmpty : function(){

        if(this.objectList.length > 0){
            return false;
        }

        if(null !== this.children[0]){
            if(!this.children[0].isNodeEmpty()){
                return false;
            }
        }
        if(null !== this.children[1]){
            if(!this.children[1].isNodeEmpty()){
                return false;
            }
        }
        if(null !== this.children[2]){
            if(!this.children[2].isNodeEmpty()){
                return false;
            }
        }
        if(null !== this.children[3]){
            if(!this.children[3].isNodeEmpty()){
                return false;
            }
        }
                
        return true;
    },

    rayCheckOBB : function(ray, result, once){
        if(this.obb.lineCheck(ray)){

            var cnt = this.objectList.length;
            var pos;
            for(i = 0; i < cnt; i++){

                pos = this.objectList[i].pos;
                if(pos.isOBB){
                    if(pos.lineCheck(ray)){
                        result.push(this.objectList[i]);
                        if(once)
                            return true;
                    }
                }
            }
            
            /**
             * 本节点和射线相交, 子节点需要检定
             */
            if(null !== this.children[0] && this.children[0].rayCheckOBB(ray, result, once)){
                return true;
            }
            
            if(null !== this.children[1] && this.children[1].rayCheckOBB(ray, result, once)){
                return true;
            }
            
            if(null !== this.children[2] && this.children[2].rayCheckOBB(ray, result, once)){
                return true;
            }

            if(null !== this.children[3] && this.children[3].rayCheckOBB(ray, result, once)){
                return true;
            }
        }
        return false;
    },

    rayCheck : function(ray, distanceSQ, result, once){

        if(this.obb.lineCheck(ray)){


            var cnt = this.objectList.length;
            var distSQ, pos;
            for(i = 0; i < cnt; i++){
                pos = this.objectList[i].pos;
                distSQ = YFM.Math.Line.distancePointSQ(ray, pos[0], pos[1], pos[2]);

                /**
                 * 补丁, 如果这个等于零代表使用objWrap.radius
                 */
                if(distanceSQ === 0){
                    if(distSQ <= this.objectList[i].radiusSQ){
                        result.push(this.objectList[i]);
                        if(once)
                            return true;
                    }
                }else{
                    if(distSQ <= distanceSQ){
                        result.push(this.objectList[i]);
                        if(once)
                            return true;
                    }
                }
            }
            
            /**
             * 本节点和射线相交, 子节点需要检定
             */
            if(null !== this.children[0] && this.children[0].rayCheck(ray, distanceSQ, result, once)){
                return true;
            }
            
            if(null !== this.children[1] && this.children[1].rayCheck(ray, distanceSQ, result, once)){
                return true;
            }
            
            if(null !== this.children[2] && this.children[2].rayCheck(ray, distanceSQ, result, once)){
                return true;
            }

            if(null !== this.children[3] && this.children[3].rayCheck(ray, distanceSQ, result, once)){
                return true;
            }
        }
        return false;
    },

    containCheck : function(frustum){


        var check = this.obb.frustumCheck(frustum);
        var ret;

        /**
         * 如果本节点和视锥不相交, 子节点不用管了
         */
        if(-1 == check){
            return null;
        }

        /**
         * 本节点内含于视锥 返回自身
         */
        else if(1 == check){

            return this;
        }
        /**
         * 本节点和视锥相交, 子节点需要检定
         */
        else if(0 == check && null !== this.children[0]){

            /**
             * 这样是广度优先, 要这样才有效
             */
            var retList = [];
            retList.push(this.children[0].containCheck(frustum));
            retList.push(this.children[1].containCheck(frustum));
            retList.push(this.children[2].containCheck(frustum));
            retList.push(this.children[3].containCheck(frustum));

            /**
             * 要选尽量高层的节点
             */
            var minLevel = 1024;
            var minRet = null;
            for(i = 0; i < 4; i++){

                if(null !== retList[i]){
                    if(retList[i].level < minLevel){
                        minRet = retList[i];
                        minLevel = retList[i].level;
                    }
                }
            }
            return minRet;
        }

        return null;
    },

    renderEver : function(fun, cl, rLevel){
        var i, cnt;
        if(this.level > rLevel + 1){
            cnt = 0;
        }else if(this.level > rLevel ){
            cnt = 1;
        }else{
            cnt = 1024;
        }

        /**
         * 已经太深, 后面不用管了
         */
        if(0 == cnt){
            return;
        }
        
        /*
        if(cl._renderDummy){
            cl._renderDummy(cl, this, this.LEVEL_COLOR[this.level]);
        }*/

        for(i = 0; i < 4; i++){
            if(null !== this.children[i]){
                this.children[i].renderEver(fun, cl, rLevel);
            }
        }

        if(cnt > this.objectList.length){
            cnt = this.objectList.length;
        }
        for(i = 0; i < cnt; i++){
            fun(this.objectList[i], cl);
        }
    },

    renderCheck : function(frustum, fun, cl, rLevel){
        var i, cnt;
        if(this.level > rLevel + 1){
            cnt = 0;
        }else if(this.level > rLevel ){
            cnt = 1;
        }else{
            cnt = 1024;
        }

        /**
         * 已经太深, 后面不用管了
         */
        if(0 == cnt){
            return;
        }


        var check = this.obb.frustumCheck(frustum);

        /**
         * 如果本节点和视锥不相交, 后面不用管了
         */
        if(-1 == check){
            return;
        }

        /*
        if(cl._renderDummy){
            cl._renderDummy(cl, this, this.LEVEL_COLOR[this.level]);
        }*/


        /**
         * 本节点内含于视锥, 子节点后续检定不需要做
         * 直接调用子节点的总是渲染接口
         *
         */
        if(1 == check){


            for(i = 0; i < 4; i++){
                if(null !== this.children[i]){
                    this.children[i].renderEver(fun, cl, rLevel);
                }
            }

        }
        /**
         * 本节点和视锥相交, 子节点需要检定
         * 太深也不继续
         */
        else if(0 == check && this.level <= rLevel){
            for(i = 0; i < 4; i++){
                if(null !== this.children[i]){
                    this.children[i].renderCheck(frustum, fun, cl, rLevel);
                }
            }
        }

        if(cnt > this.objectList.length){
            cnt = this.objectList.length;
        }
        for(i = 0; i < cnt; i++){
            if(frustum.containCheckPoint(this.objectList[i].pos))
                fun(this.objectList[i], cl);
        }
    },

    insertObject : function(objWrap){

        /**
         * 如果空间没有分裂过, 而且对象列表长度没有达到阈值, 
         * 就直接插入对象列表
         */
        if(!this.splited && this.objectList.length < this.THRESHOLD){
            this._insert2ObjList(objWrap);
        }else{
            
            /**
             * 如果首次达到阈值, 开始分裂空间
             */
            if(!this.splited){
                this._spliteSpace();
            }

            this._insertToSubSpace(objWrap);
        }
    },

    frustumCheck : function(frustum){
        return this.obb.frustumCheck(frustum);
    },

    _insert2ObjList : function(objWrap){
        objWrap.node = this;
        this.objectList.push(objWrap);
    },

    _spliteSpace : function(){

        var subNode, objWrap, objCnt, i;
        var tmpList;

        this.splited = true;

        if(this.level >= 6){
            return;
        }

        this.children[this.NODE_0] = new FloorQuadNode(this,
                                    this.floor, 
                                    this.xmin,
                                    (this.xmin+this.xmax)/2.0, 
                                    this.ymin, 
                                    (this.ymin+this.ymax)/2.0, 
                                    this.height, 
                                    this.mask + "0",
                                    this.level+1);
        this.children[this.NODE_1] = new FloorQuadNode(this,
                                    this.floor, 
                                    (this.xmin+this.xmax)/2.0, 
                                    this.xmax, 
                                    this.ymin, 
                                    (this.ymin+this.ymax)/2.0, 
                                    this.height, 
                                    this.mask + "1",
                                    this.level+1);
        this.children[this.NODE_2] = new FloorQuadNode(this,
                                    this.floor, 
                                    (this.xmin+this.xmax)/2.0, 
                                    this.xmax,
                                    (this.ymin+this.ymax)/2.0,
                                    this.ymax, 
                                    this.height, 
                                    this.mask + "2",
                                    this.level+1);
        this.children[this.NODE_3] = new FloorQuadNode(this,
                                    this.floor, 
                                    this.xmin,
                                    (this.xmin+this.xmax)/2.0, 
                                    (this.ymin+this.ymax)/2.0,
                                    this.ymax, 
                                    this.height, 
                                    this.mask + "3",
                                    this.level+1);



        tmpList = [];
        while(this.objectList.length > 0){
            objWrap = this.objectList.pop();

            var checkList = [];
            checkList.push(this.children[0].obb.pointCheck(objWrap.pos));
            checkList.push(this.children[1].obb.pointCheck(objWrap.pos));
            checkList.push(this.children[2].obb.pointCheck(objWrap.pos));
            checkList.push(this.children[3].obb.pointCheck(objWrap.pos));

            for(i = 0; i < 4; i++){
                if(1 == checkList[i]){
                    this.children[i].insertObject(objWrap);
                    break;
                }
            }
            if(4 == i){
                tmpList.push(objWrap);
            }
        }

        this.objectList = tmpList;
    },

    _insertToSubSpace : function(objWrap){

        var checkList = [];


        if(null !== this.children[0]){
            checkList.push(this.children[0].obb.pointCheck(objWrap.pos));
            checkList.push(this.children[1].obb.pointCheck(objWrap.pos));
            checkList.push(this.children[2].obb.pointCheck(objWrap.pos));
            checkList.push(this.children[3].obb.pointCheck(objWrap.pos));

            for(var i = 0; i < 4; i++){
                if(1 == checkList[i]){

                    this.children[i].insertObject(objWrap);
                    return;
                }
            }
        }
        this._insert2ObjList(objWrap);
    },

    /**
     * 节点触发划分的阈值
     */
    THRESHOLD : 4,  


    /** 
     * 子空间节点编码
     */
    NODE_0    : 0,
    NODE_1    : 1,
    NODE_2    : 2,
    NODE_3    : 3,

    LEVEL_COLOR : new Array(
                YFM.Math.Vector.pos(1.0, 0.0, 0.0),
                YFM.Math.Vector.pos(1.0, 0.5, 0.0),
                YFM.Math.Vector.pos(1.0, 1.0, 0.0),
                YFM.Math.Vector.pos(0.0, 1.0, 0.0),
                YFM.Math.Vector.pos(0.0, 1.0, 1.0),
                YFM.Math.Vector.pos(0.0, 0.0, 1.0),
                YFM.Math.Vector.pos(0.5, 0.0, 1.0),
                YFM.Math.Vector.pos(0.0, 0.0, 0.0))
}


/**
 * 用于可见性判断的视锥
 * 使用场景为世界坐标系中判断大量点的可见性
 * 故不能用在观察坐标系下的视锥构建办法,
 * 而采用从PVM矩阵中提取视锥的办法
 */
function FrustumWorldSpace()
{
    this.near = YFM.Math.Vector.vec();
    this.far = YFM.Math.Vector.vec();

    this.left = YFM.Math.Vector.vec();
    this.right = YFM.Math.Vector.vec();

    this.top = YFM.Math.Vector.vec();
    this.bottom = YFM.Math.Vector.vec();
}

FrustumWorldSpace.prototype = {
    constructor : FrustumWorldSpace,

    /**
     * 从pvm矩阵提取视锥6平面
     * 算法参考自论文:
     * Fast Extraction of Viewing Frustum Planes from the World-
     * View-Projection Matrix
     * Authors:
     * Gil Gribb & Klaus Hartmann
     *
     * 非常管用, 以前我是在视空间构建视锥, 为了做剔除, 要把对象转换到视空间进行
     * 现在在每帧渲染时提取一下视锥就可以在世界坐标系做剔除, 效率很高
     */
    update : function(pvm){
        this.left[0]     = pvm[3] + pvm[0];
        this.left[1]     = pvm[7] + pvm[4];
        this.left[2]     = pvm[11]+ pvm[8];
        this.left[3]     = pvm[15]+ pvm[12];

        this.right[0]    = pvm[3] - pvm[0];
        this.right[1]    = pvm[7] - pvm[4];
        this.right[2]    = pvm[11]- pvm[8];
        this.right[3]    = pvm[15]- pvm[12];

        this.bottom[0]   = pvm[3] + pvm[1];
        this.bottom[1]   = pvm[7] + pvm[5];
        this.bottom[2]   = pvm[11]+ pvm[9];
        this.bottom[3]   = pvm[15]+ pvm[13];

        this.top[0]      = pvm[3] - pvm[1];
        this.top[1]      = pvm[7] - pvm[5];
        this.top[2]      = pvm[11]- pvm[9];
        this.top[3]      = pvm[15]- pvm[13];

        this.near[0]     = pvm[3] + pvm[2];
        this.near[1]     = pvm[7] + pvm[6];
        this.near[2]     = pvm[11]+ pvm[10];
        this.near[3]     = pvm[15]+ pvm[14];

        this.far[0]      = pvm[3] - pvm[2];
        this.far[1]      = pvm[7] - pvm[6];
        this.far[2]      = pvm[11]- pvm[10];
        this.far[3]      = pvm[15]- pvm[14];
    },

    containCheckPoint : function(pos){

        /**
         * 使得本函数兼容OBB
         */
        if(pos.isOBB){
            return -1 !== pos.frustumCheck(this);
        }

        var ret = false;

        do{
            if(YFM.Math.Vector.dot4(this.near, pos) < 0.0)
                break;
            if(YFM.Math.Vector.dot4(this.far, pos) < 0.0)
                break;

            if(YFM.Math.Vector.dot4(this.left, pos) < 0.0)
                break;
            if(YFM.Math.Vector.dot4(this.right, pos) < 0.0)
                break;

            if(YFM.Math.Vector.dot4(this.bottom, pos) < 0.0)
                break;
            if(YFM.Math.Vector.dot4(this.top, pos) < 0.0)
                break;

            ret = true;
        }while(false);

        return ret;
    }
}


/**
 * 方向包围盒
 */
function OBB(pts)
{
    this.isOBB = true;
    var c, eig;

    /**
     * 生成协方差矩阵
     */
    c = YFM.Math.Matrix.covariance3x3(pts);

    /**
     * 特征分解
     */
    eig = YFM.Math.Matrix.eig3x3(c);

    /**
     * 上式分解的结果会按特征值的权重排序
     * eigvalue[0] <= eigvalue[1] <= eigvalue[2] 
     * eigvec的三列与上面的三值对应
     * 第一列代表t轴 第二列代表s轴 第三列代表r轴
     *
     * 自然坐标系3三个正交基
     * r第一主轴
     * s第二主轴
     * t第三主轴
     * 归一化
     */
    this.t = YFM.Math.Vector.vec(eig.vec[0], eig.vec[1], eig.vec[2]);
    this.s = YFM.Math.Vector.vec(eig.vec[3], eig.vec[4], eig.vec[5]);
    this.r = YFM.Math.Vector.vec(eig.vec[6], eig.vec[7], eig.vec[8]);

    /**
     * 计算OBB范围
     */
    this._calc_bounding(pts);
    /**
     * 下列属性在
     * _calc_bounding
     * 中初始化
     
     * 
     * obb中心
     this.center

     * 三主轴向量, 保持长度
     *
    this.R
    this.S
    this.T

     * obb 6平面
     *
    this.r_min
    this.r_max
    this.s_min
    this.s_max
    this.t_min
    this.t_max

     * 将边界盒分成两半的三个平面分别是:
     *
    this.r_half
    this.s_half
    this.t_half

     * 三主轴的半长度
     *
    this.hr
    this.hs
    this.ht
    */
}

OBB.prototype = {
    constructor : OBB,

    /**
     * 对本OBB施以变换
     */
    transform : function(mat){
        /**
         * 准备对平面向量施以变换的转置逆矩阵
         */
        var M = YFM.Math.Matrix;
        var V = YFM.Math.Vector;
        var imat = YFM.Math.Matrix.invert(mat);
        var timat = YFM.Math.Matrix.transpose(imat);

        /**
         * 虽然有点怪, 但观察把点集全部用mat变换 再生成OBB
         * 和用点集生成OBB, 在用mat对OBB变换的结果
         * 总结如下:
         * 位置向量
         * center保持不变
         * 
         * 标量
         * hr, hs, ht需要重新计算, 因为可能有缩放
         *
         * 方向向量全部需要反向
         *
         * 平面向量两种情况:
         * r_half, s_half, t_half 需要反向
         *
         * r_min, r_max
         * s_min, s_max
         * t_min, t_max
         *
         * 需要对换, 不需要反向
         */
        
        /**
         * 位置向量 直接变换
         */
        this.center = M.mulVec(mat, this.center);

        /**
         * 方向向量
         * 需要校正:
         * 反向
         */
        this.r      = this._reserse3(M.mulVec(mat, this.r));
        this.s      = this._reserse3(M.mulVec(mat, this.s));
        this.t      = this._reserse3(M.mulVec(mat, this.t));
        this.R      = this._reserse3(M.mulVec(mat, this.R));
        this.S      = this._reserse3(M.mulVec(mat, this.S));
        this.T      = this._reserse3(M.mulVec(mat, this.T));

        /**
         * 平面向量, 
         *
         * 校正:
         * 边界对应平面只需交换
         * 中间三平面需要反向
         */
        this.r_max  = M.mulVec(timat, this.r_min);
        this.r_min  = M.mulVec(timat, this.r_max);
        this.s_max  = M.mulVec(timat, this.s_min);
        this.s_min  = M.mulVec(timat, this.s_max);
        this.t_max  = M.mulVec(timat, this.t_min);
        this.t_min  = M.mulVec(timat, this.t_max);
        this.r_half = this._reserse4(M.mulVec(timat, this.r_half));
        this.s_half = this._reserse4(M.mulVec(timat, this.s_half));
        this.t_half = this._reserse4(M.mulVec(timat, this.t_half));

        this.hr     = V.norm3(this.R)/2.0;
        this.hs     = V.norm3(this.S)/2.0;
        this.ht     = V.norm3(this.T)/2.0;
    },


    pointCheck : function(pos){

        /**
         * 让点检测 兼容obb检测
         */
        if(pos.isOBB){
            return this.obbCheck(pos);
        }

        var outCnt, inCnt, joinCnt;
        var radius, distance;

        outCnt = 0;
        inCnt = 0;
        joinCnt = 0;

        do{
            distance = YFM.Math.Plane.distance(this.r_min, pos);
            if(distance < 0.0){
                outCnt ++;
                break;
            }else if(distance > 0.0)
                inCnt ++;
            else
                joinCnt ++;

            distance = YFM.Math.Plane.distance(this.r_max, pos);
            if(distance < 0.0){
                outCnt ++;
                break;
            }else if(distance > 0.0)
                inCnt ++;
            else
                joinCnt ++;

            distance = YFM.Math.Plane.distance(this.s_min, pos);
            if(distance < 0.0){
                outCnt ++;
                break;
            }else if(distance > 0.0)
                inCnt ++;
            else
                joinCnt ++;

            distance = YFM.Math.Plane.distance(this.s_max, pos);
            if(distance < 0.0){
                outCnt ++;
                break;
            }else if(distance > 0.0)
                inCnt ++;
            else
                joinCnt ++;

            distance = YFM.Math.Plane.distance(this.t_min, pos);
            if(distance < 0.0){
                outCnt ++;
                break;
            }else if(distance > 0.0)
                inCnt ++;
            else
                joinCnt ++;

            distance = YFM.Math.Plane.distance(this.t_max, pos);
            if(distance < 0.0){
                outCnt ++;
                break;
            }else if(distance > 0.0)
                inCnt ++;
            else
                joinCnt ++;


            ret = true;
        }while(false);

        /**
         * 如果点在OBB的6个面之内视作包含
         * 只要点在任意面之外视作外离
         * 其他情况视作相交
         */
        if(6 == inCnt ){
            return 1;
        }else if(outCnt > 0){
            return -1;
        }else{
            return 0;
        }
    },

    lineCheck : function(line){
        var o, d, p, tMax, tMin, t1, t2, e, f, tmp;


        tMax = Number.MAX_VALUE;
        tMin = -Number.MAX_VALUE;
        o = YFM.Math.Vector.pos(line[0], line[1], line[2]);
        d = YFM.Math.Vector.normalize(YFM.Math.Vector.vec(line[4], line[5], line[6]));
        p = YFM.Math.Vector.sub(this.center, o);

        e = YFM.Math.Vector.dot3(this.r, p);
        f = YFM.Math.Vector.dot3(this.r, d);
        if(YFM.Math.floatNotZero(f)){
            t1 = (e + this.hr) / f;
            t2 = (e - this.hr) / f;
            if(t1 > t2){
                tmp = t2;
                t2 = t1;
                t1 = tmp;
            }
            if(t1 > tMin)
                tMin = t1;
            if(t2 < tMax)
                tMax = t2;


            if(tMin > tMax)
                return false;
            if(tMax < 0)
                return false;
        }else if((-e - this.hr) > 0 || (- e + this.hr) < 0)
            return false;

        e = YFM.Math.Vector.dot3(this.s, p);
        f = YFM.Math.Vector.dot3(this.s, d);
        if(YFM.Math.floatNotZero(f)){
            t1 = (e + this.hs) / f;
            t2 = (e - this.hs) / f;
            if(t1 > t2){
                tmp = t2;
                t2 = t1;
                t1 = tmp;
            }
            if(t1 > tMin)
                tMin = t1;
            if(t2 < tMax)
                tMax = t2;
            if(tMin > tMax)
                return false;
            if(tMax < 0)
                return false;
        }else if((-e - this.hs) > 0 || (- e + this.hs) < 0)
            return false;

        e = YFM.Math.Vector.dot3(this.t, p);
        f = YFM.Math.Vector.dot3(this.t, d);
        if(YFM.Math.floatNotZero(f)){
            t1 = (e + this.ht) / f;
            t2 = (e - this.ht) / f;
            if(t1 > t2){
                tmp = t2;
                t2 = t1;
                t1 = tmp;
            }
            if(t1 > tMin)
                tMin = t1;
            if(t2 < tMax)
                tMax = t2;
            if(tMin > tMax)
                return false;
            if(tMax < 0)
                return false;
        }else if((-e - this.ht) > 0 || (- e + this.ht) < 0)
            return false;

        return true;
    },

    /**
     * 本obb, 与另一个x的检定
     * 返回1代表本obb, 包含x
     * 返回0代表相交
     * 返回-1代表相离
     */
    obbCheck : function(x){
        var outCnt, inCnt, joinCnt;
        var radius, distance;

        outCnt = 0;
        inCnt = 0;
        joinCnt = 0;

        do{
            radius = x.effectiveRadius(this.r_min);
            distance = YFM.Math.Plane.distance(this.r_min, x.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = x.effectiveRadius(this.r_max);
            distance = YFM.Math.Plane.distance(this.r_max, x.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = x.effectiveRadius(this.s_min);
            distance = YFM.Math.Plane.distance(this.s_min, x.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = x.effectiveRadius(this.s_max);
            distance = YFM.Math.Plane.distance(this.s_max, x.center);
            if(distance < -radius)
                outCnt ++;
            else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = x.effectiveRadius(this.t_min);
            distance = YFM.Math.Plane.distance(this.t_min, x.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = x.effectiveRadius(this.t_max);
            distance = YFM.Math.Plane.distance(this.t_max, x.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

        }while(false);


        /**
         * 如果obb在frustum的6个面之内视作包含
         * 只要obb在任意面之外视作外离
         * 其他情况视作相交
         */
        if(6 == inCnt ){
            return 1;
        }else if(outCnt > 0){
            return -1;
        }else{
            return 0;
        }
    },

    /**
     * OBB与视锥的检定
     * 返回1代表视锥包含OBB
     * 返回0代表相交
     * 返回-1代表相离
     */
    frustumCheck : function(frustum){
        var outCnt, inCnt, joinCnt;
        var radius, distance;

        outCnt = 0;
        inCnt = 0;
        joinCnt = 0;

        do{
            radius = this.effectiveRadius(frustum.near);
            distance = YFM.Math.Plane.distance(frustum.near, this.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = this.effectiveRadius(frustum.far);
            distance = YFM.Math.Plane.distance(frustum.far, this.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = this.effectiveRadius(frustum.left);
            distance = YFM.Math.Plane.distance(frustum.left, this.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = this.effectiveRadius(frustum.right);
            distance = YFM.Math.Plane.distance(frustum.right, this.center);
            if(distance < -radius)
                outCnt ++;
            else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = this.effectiveRadius(frustum.bottom);
            distance = YFM.Math.Plane.distance(frustum.bottom, this.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

            radius = this.effectiveRadius(frustum.top);
            distance = YFM.Math.Plane.distance(frustum.top, this.center);
            if(distance < -radius){
                outCnt ++;
                break;
            }else if(distance > radius)
                inCnt ++;
            else
                joinCnt ++;

        }while(false);


        /**
         * 如果obb在frustum的6个面之内视作包含
         * 只要obb在任意面之外视作外离
         * 其他情况视作相交
         */
        if(6 == inCnt ){
            return 1;
        }else if(outCnt > 0){
            return -1;
        }else{
            return 0;
        }
    },


    /**
     * 计算OBB到某平面的有效半径
     */
    effectiveRadius : function(plane){
        return (Math.abs(YFM.Math.Vector.dot3(this.R, plane)) + 
                Math.abs(YFM.Math.Vector.dot3(this.S, plane)) + 
                Math.abs(YFM.Math.Vector.dot3(this.T, plane)))/2.0;
                
    },
    
    _reserse3 : function(v){
        v[0] = -v[0];
        v[1] = -v[1];
        v[2] = -v[2];
        return v;
    },

    _reserse4 : function(v){
        v[0] = -v[0];
        v[1] = -v[1];
        v[2] = -v[2];
        v[3] = -v[3];
        return v;
    },

    /**
     * 得到自然坐标系三轴后, 根据点集计算OBB的边界
     */
    _calc_bounding : function(pts){

        var i, cnt;
        var pdr, pds, pdt;
        var pdr_min, pdr_max, pds_min, pds_max, pdt_min, pdt_max;
        var a, b, c;
        var pv;
        var tripleResult;


        /**
         * 为确定最大值和最小值的范围, 
         * 可以通过计算每个顶点位置坐标Pi与单位向量R, S, T的內积来完成
         */
        pdr_min = Number.MAX_VALUE;
        pdr_max = -Number.MAX_VALUE;
        pds_min = Number.MAX_VALUE;
        pds_max = -Number.MAX_VALUE;
        pdt_min = Number.MAX_VALUE;
        pdt_max = -Number.MAX_VALUE;
        cnt = pts.length;
        for(i = 0; i < cnt; i++){

            pv = pts[i];

            pdr = YFM.Math.Vector.dot3(pv, this.r);
            pds = YFM.Math.Vector.dot3(pv, this.s);
            pdt = YFM.Math.Vector.dot3(pv, this.t);

            if(pdr > pdr_max){
                pdr_max = pdr;
            }
            if(pdr < pdr_min){
                pdr_min = pdr;
            }
            if(pds > pds_max){
                pds_max = pds;
            }
            if(pds < pds_min){
                pds_min = pds;
            }
            if(pdt > pdt_max){
                pdt_max = pdt;
            }
            if(pdt < pdt_min){
                pdt_min = pdt;
            }
        }

        /**
         * 边界盒的六平面分别为:
         * <R, -min{Pi·R}>      <-R, max{Pi·R}>
         * <S, -min{Pi·S}>      <-S, max{Pi·S}>
         * <T, -min{Pi·T}>      <-T, max{Pi·T}>
         */
        this.r_min = YFM.Math.Plane.planeRaw(this.r[0], this.r[1], this.r[2], -pdr_min);
        this.r_max = YFM.Math.Plane.planeRaw(-this.r[0], -this.r[1], -this.r[2], pdr_max);

        this.s_min = YFM.Math.Plane.planeRaw(this.s[0], this.s[1], this.s[2], -pds_min);
        this.s_max = YFM.Math.Plane.planeRaw(-this.s[0], -this.s[1], -this.s[2], pds_max);

        this.t_min = YFM.Math.Plane.planeRaw(this.t[0], this.t[1], this.t[2], -pdt_min);
        this.t_max = YFM.Math.Plane.planeRaw(-this.t[0], -this.t[1], -this.t[2], pdt_max);

        /**
         * a = (min{Pi·R} + max{Pi·R})/2
         * b = (min{Pi·S} + max{Pi·S})/2
         * c = (min{Pi·T} + max{Pi·T})/2
         *
         * 将边界盒分成两半的三个平面分别是:
         * <R, -a>, <S, -b>, <T, -c>
         */
        a = (pdr_min + pdr_max)/2.0;
        b = (pds_min + pds_max)/2.0;
        c = (pdt_min + pdt_max)/2.0;

        this.r_half = YFM.Math.Plane.planeRaw(this.r[0], this.r[1], this.r[2], -a);
        this.s_half = YFM.Math.Plane.planeRaw(this.s[0], this.s[1], this.s[2], -b);
        this.t_half = YFM.Math.Plane.planeRaw(this.t[0], this.t[1], this.t[2], -c);

        this.hr = (pdr_max - pdr_min)/2.0;
        this.hs = (pds_max - pds_min)/2.0;
        this.ht = (pdt_max - pdt_min)/2.0;

        this.R = YFM.Math.Vector.scale(this.r, pdr_max - pdr_min);
        this.S = YFM.Math.Vector.scale(this.s, pds_max - pds_min);
        this.T = YFM.Math.Vector.scale(this.t, pdt_max - pdt_min);
        
        tripleResult = YFM.Math.Plane.intersectionTriplePlane(this.r_half, this.s_half, this.t_half);

        if(tripleResult.atAPoint){
            this.center = tripleResult.point;
        }else{
            throw new Error("obb calc center failed");
        }
    }
}


/**
 * 文本块快速检查树
 */
function TextBlockQuickCheckTree(width, height){

    this.root = new AABBNode(this, "0", 0, 0, width, height);

    /**
     * 为了减少内存吞吐, 用列表来充当块池
     */
    this.blockPool = [];
    this.blockList = [];
}
TextBlockQuickCheckTree.prototype = {
    constructor : TextBlockQuickCheckTree,
    
    reset : function(){

        /**
         * 让现在树中使用的块列表成为下次的块缓存
         */
        this.blockPool = this.blockList;
        this.blockList = [];

        this.root.reset();
    },

    check : function(l, t, r, b){
        var c = this.root.check(l, t, r, b);
        if(!c){
            this.root.insert(l, t, r, b);
        }
        return c;
    }
}

function AABBNode(tree, mask, l, t, r, b){
    this.tree = tree;
    this.mask = mask;
    this.rect = [l, t, r, b];
    this.objList = [];
    if(this.level < 2){
        this._splite();
    }
}
AABBNode.prototype = {
    constructor : AABBNode,

    reset : function(){
        this.objList = [];
        if(this.children){
            this.children[0].reset();
            this.children[1].reset();
            this.children[2].reset();
            this.children[3].reset();
        }
    },



    insert : function(l, t, r, b){
        if(this._containBox(this.rect, l, t, r, b)){
            if(this.children){
                var selfObj = false;
                do{
                    if(this.children[0].insert(l, t, r, b))
                        break;
                    if(this.children[1].insert(l, t, r, b))
                        break;
                    if(this.children[2].insert(l, t, r, b))
                        break;
                    if(this.children[3].insert(l, t, r, b))
                        break;
                    selfObj = true;
                }while(false);

                if(selfObj){
                    this._insertBlock(l, t, r, b);
                }
            }else{
                this._insertBlock(l, t, r, b);
            }
            return true;
        }else{
            return false;
        }
    },


    /**
     * 检查一个范围是否和本节点, 及子节点中的某对象相交
     */
    check : function(l, t, r, b){

        if(!this._intersectBox(this.rect, l, t, r, b)){
            return false;
        }

        for(var i = 0, cnt = this.objList.length; i < cnt; i++){
            if(this._intersectBox(this.objList[i], l, t, r, b)){
                return true;
            }
        }

        if(this.children){
            if(this.children[0].check(l, t, r, b))
                return true;
            if(this.children[1].check(l, t, r, b))
                return true;
            if(this.children[2].check(l, t, r, b))
                return true;
            if(this.children[3].check(l, t, r, b))
                return true;
        }

        return false;
    },

    _insertBlock : function(l, t, r, b){
        var block;
        /**
         * 如果块池中还有, 就从块池中取出使用
         */
        if(this.tree.blockPool.length > 0){
            block = this.tree.blockPool.pop();
            block[0] = l;
            block[1] = t;
            block[2] = r;
            block[3] = b;
        }else{
            block = new Array(l, t, r, b);
        }

        this.objList.push(block);

        this.tree.blockList.push(block);
    },

    /**
     * 检验两个范围是否相交
     */
    _intersectBox : function(rect, l, t, r, b){
        return !(l > rect[2] ||
                 r < rect[0] ||
                 t > rect[3] ||
                 b < rect[1]);
    },

    /**
     *  检验一个范围是否包含另一个范围
     */
    _containBox : function(rect, l, t, r, b){
        return (l >= rect[0] &&
                t >= rect[1] &&
                r <= rect[2] &&
                b <= rect[3]);
    },

    _splite : function(){
        this.children = new Array(4);
        
        var mx = (this.rect[0] + this.rect[2]) / 2.0;
        var my = (this.rect[1] + this.rect[3]) / 2.0;

        this.children[0] = new AABBNode(
                                    this.tree,
                                    this.mask+"0",
                                    this.rect[0],
                                    this.rect[1],
                                    mx,
                                    my);
        this.children[1] = new AABBNode(
                                    this.tree,
                                    this.mask+"1",
                                    mx,
                                    this.rect[1],
                                    this.rect[2],
                                    my);
        this.children[2] = new AABBNode(
                                    this.tree,
                                    this.mask+"2",
                                    mx,
                                    my,
                                    this.rect[2],
                                    this.rect[3]);
        this.children[3] = new AABBNode(
                                    this.tree,
                                    this.mask+"3",
                                    this.rect[0],
                                    my,
                                    mx,
                                    this.rect[3]);
    }
}



/**
 * 材质属性项
 */
function MtlItem()
{
    this.Ns = 32.0;
    this.Ka = YFM.Math.Vector.pos();
    this.Kd = YFM.Math.Vector.pos();
    this.Ks = YFM.Math.Vector.pos();

    this.mapKd = null;
}

MtlItem.prototype = {
    constructor : MtlItem,

    setNs : function(Ns){
        this.Ns = Ns;
    },

    setKa : function(Ka0, Ka1, Ka2){
        this.Ka[0] = Ka0;
        this.Ka[1] = Ka1;
        this.Ka[2] = Ka2;
    },

    setKd : function(Kd0, Kd1, Kd2){
        this.Kd[0] = Kd0;
        this.Kd[1] = Kd1;
        this.Kd[2] = Kd2;
    },

    setKs : function(Ks0, Ks1, Ks2){
        this.Ks[0] = Ks0;
        this.Ks[1] = Ks1;
        this.Ks[2] = Ks2;
    },

    setMapKd : function(mapKd){
        this.mapKd = mapKd;
    },
    
    getNs : function(){
        return this.Ns;
    },

    getKa : function(){
        return this.Ka;
    },

    getKd : function(){
        return this.Kd;
    },

    getKs : function(){
        return this.Ks;
    },

    getMapKd : function(){
        return this.mapKd;
    }
}




/**
 * OBJ模型封装, 从THREE.js抄了不少代码
 */
YFM.Mesh.ObjModel = {};

/**
 * 用于解析OBJ文件时
 * 匹配各类行数据的
 * 正则表达式
 *
 *  VPatern         匹配代表顶点的行:           v float float float
 *  NPatern         匹配代表法向的行:           vn float float float
 *  UVPattern       匹配纹理坐标行:             vt float float
 *  FacePattern1    匹配只有顶点的面:           f vertex vertex vertex ...
 *  FacePattern2    匹配有顶点和纹理坐标的面:   f vertex/uv vertex/uv vertex/uv ...
 *  FacePattern3    匹配有顶点纹理和法向的面:   f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
 *  FacePattern4    匹配有顶点和法向的面:       f vertex//normal vertex//normal vertex//normal ... 
 */
YFM.Mesh.ObjModel.VPattern  = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
YFM.Mesh.ObjModel.NPattern  = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
YFM.Mesh.ObjModel.UVPattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
YFM.Mesh.ObjModel.FacePattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;
YFM.Mesh.ObjModel.FacePattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;
YFM.Mesh.ObjModel.FacePattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;
YFM.Mesh.ObjModel.FacePattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/
YFM.Mesh.ObjModel.NsPattern  = /Ns( +[\d|\.|\+|\-|e|E]+)/;
YFM.Mesh.ObjModel.KaPattern  = /Ka( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
YFM.Mesh.ObjModel.KdPattern  = /Kd( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
YFM.Mesh.ObjModel.KsPattern  = /Ks( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

function ObjModel(region)
{
    this.region = region;
    this.floor = null;
    this.obb = null;
    this.gl = region.gl;
    this.objects = [];
    this.texturePool = region.texturePool;

    this.modelMatrix = YFM.Math.Matrix.mat();
    this.baseUrl = null;

    this.hasMaterials = false;
    this.materials = {};
}

ObjModel.prototype = {
    constructor : ObjModel,


    setFloor : function(floor){
        this.floor = floor;
    },

    setModelMatrix : function(m){
        this.modelMatrix = m;

        /**
         * 变换更新时, 要对obb进行同步变换
         */
        var mat = YFM.Math.Matrix.mul(this.floor.getFloorMat(), this.modelMatrix);
        this.obb.transform(mat);
    },

    render : function(shader, vrfMat){
        var vrfmMat = YFM.Math.Matrix.mul(vrfMat, this.modelMatrix);
        var tvrfmMat = YFM.Math.Matrix.transpose(vrfmMat);
        var itvrfmMat = YFM.Math.Matrix.invert(tvrfmMat);
        shader.setNormalMatrix(itvrfmMat);
        shader.setModelMatrix(this.modelMatrix);
		for(var i = 0, l = this.objects.length; i < l; i ++){


            if(this.hasMaterials && this.objects[i].material.mtl){
                shader.setMTL(this.objects[i].material.mtl, this.texturePool); 
            }else{
                shader.setDefaultMTL();
            }
            shader.drawTriangles(this.objects[i].mesh);
        }
    },

    loadURLDir : function(baseUrl, name, onFinish, onFailed){

        this.baseUrl = baseUrl;

        var mtlUrl, objUrl;
		var ctx = this;

        mtlUrl = baseUrl + "/" + name + ".mtl";
        objUrl = baseUrl + "/" + name + ".obj";

        var xhrMtl = new XMLHttpRequest();
        xhrMtl.open('GET', mtlUrl, true);
        xhrMtl.responseType = 'text';
        xhrMtl.onload	= function(e){

            if(200 == this.status){
                ctx._parseMtl(this.response);
                var xhrObj = new XMLHttpRequest();
                xhrObj.open('GET', objUrl, true);
                xhrObj.responseType = 'text';
                xhrObj.onload	= function(e){

                    if(200 == this.status){
                        ctx._parseObj(this.response);
                        if(onFinish){
                            onFinish(ctx);
                        }
                        ctx.hasMaterials = true;
                    }else{
                        if(onFailed){
                            onFailed(this.status);
                        }
                    }
                };
                xhrObj.send();
            }else{
                if(onFailed){
                    onFailed(this.status);
                }
            }

        };
        xhrMtl.send();
    },

    loadURLWithMtl : function(objUrl, mtlUrl, onFinish, onFailed){

        this.baseUrl = mtlUrl.substr(0, mtlUrl.lastIndexOf("/") + 1);

		var ctx = this;
        var xhrMtl = new XMLHttpRequest();
        xhrMtl.open('GET', mtlUrl, true);
        xhrMtl.responseType = 'text';
        xhrMtl.onload	= function(e){

            if(200 == this.status){
                ctx._parseMtl(this.response);
                var xhrObj = new XMLHttpRequest();
                xhrObj.open('GET', objUrl, true);
                xhrObj.responseType = 'text';
                xhrObj.onload	= function(e){

                    if(200 == this.status){
                        ctx._parseObj(this.response);
                        if(onFinish){
                            onFinish(ctx);
                        }
                        ctx.hasMaterials = true;
                    }else{
                        if(onFailed){
                            onFailed(this.status);
                        }
                    }
                };
                xhrObj.send();
            }else{
                if(onFailed){
                    onFailed(this.status);
                }
            }

        };
        xhrMtl.send();
    },
    
	loadURL : function(url, onFinish, onFailed){

        this.baseUrl = url.substr(0, url.lastIndexOf("/") + 1);

		var ctx = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload	= function(e){

            if(200 == this.status){
                ctx._parseObj(this.response);
                if(onFinish){
                    onFinish(ctx);
                }
            }else{
                if(onFailed){
                    onFailed(this.status);
                }
            }

        };
        xhr.send();

	},

    _parseMtl : function(text){
        var mtlItem;
		var lines = text.split( '\n' );
		for(var i = 0; i < lines.length; i ++){

			var result;
			var line = lines[i];
			line = line.trim();

			if(line.length === 0 || line.charAt(0) === '#'){
				continue;
			}else if(/^newmtl /.test(line)){

                var name = line.substring(7).trim();
                mtlItem = new MtlItem();
                this.materials[name] = mtlItem;
            }else if(/^map_Kd /.test(line)){

                var mapName = line.substring(7).trim();
                mtlItem.setMapKd(mapName);
                this.texturePool.addTexture(mapName, this.baseUrl+"/"+mapName);
            }else if((result = YFM.Mesh.ObjModel.NsPattern.exec(line)) !== null){
                mtlItem.setNs(parseFloat(result[1]));
			}else if((result = YFM.Mesh.ObjModel.KaPattern.exec(line)) !== null){
                mtlItem.setKa(
                    parseFloat(result[1]),
                    parseFloat(result[2]),
                    parseFloat(result[3]));
			}else if((result = YFM.Mesh.ObjModel.KdPattern.exec(line)) !== null){
                mtlItem.setKd(
                    parseFloat(result[1]),
                    parseFloat(result[2]),
                    parseFloat(result[3]));
			}else if((result = YFM.Mesh.ObjModel.KsPattern.exec(line)) !== null){
                mtlItem.setKs(
                    parseFloat(result[1]),
                    parseFloat(result[2]),
                    parseFloat(result[3]));
            }
        }
    },

    _parseObj : function(text){

        var object;
		var geometry, material;
		var vertices = [];
		var normals = [];
		var uvs = [];

        /**
         * 从face行的元素解析顶点/法线/UV索引
         */
		function parseVertexIndex(value){

			var index = parseInt( value );

			return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;
		}
		function parseNormalIndex(value){

			var index = parseInt( value );

			return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;
		}
		function parseUVIndex(value){

			var index = parseInt( value );

			return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;
		}

        /**
         * 向几何体, 添加索引a, b, c所代表的三角形的三个顶点的
         * 位置, 法向, UV属性
         */
		function addVertex(a, b, c){

			geometry.vertices.push(
				vertices[a], vertices[a+1], vertices[a+2],
				vertices[b], vertices[b+1], vertices[b+2],
				vertices[c], vertices[c+1], vertices[c+2]
			);
		}
		function addNormal(a, b, c){

			geometry.normals.push(
				normals[a], normals[a+1], normals[a+2],
				normals[b], normals[b+1], normals[b+2],
				normals[c], normals[c+1], normals[c+2]
			);

		}
		function addUV( a, b, c ) {

			geometry.uvs.push(
				uvs[a], uvs[a+1],
				uvs[b], uvs[b+1],
				uvs[c], uvs[c+1]
			);

		}

        /**
         * 添加表面, 支持triangle表面和quad表面
         */
		function addFace(a, b, c, d,  ua, ub, uc, ud,  na, nb, nc, nd){

			var ia = parseVertexIndex(a);
			var ib = parseVertexIndex(b);
			var ic = parseVertexIndex(c);

			if(d === undefined){

				addVertex(ia, ib, ic);
			}else{

				var id = parseVertexIndex(d);

				addVertex(ia, ib, id);
				addVertex(ib, ic, id);
			}

			if(ua !== undefined){

				var ia = parseUVIndex(ua);
				var ib = parseUVIndex(ub);
				var ic = parseUVIndex(uc);

				if(d === undefined){

					addUV(ia, ib, ic);
				}else{

					var id = parseUVIndex(ud);

					addUV(ia, ib, id);
					addUV(ib, ic, id);
				}

			}

			if (na !== undefined){

				var ia = parseNormalIndex(na);
				var ib = parseNormalIndex(nb);
				var ic = parseNormalIndex(nc);

				if(d === undefined){

					addNormal(ia, ib, ic);
				}else{

					var id = parseNormalIndex(nd);

					addNormal(ia, ib, id);
					addNormal(ib, ic, id);
				}

			}

		}


        /**
         * 因为obj的格式没有硬性标准
         * 有可能没有o行,就有顶点数据了
         * 检查到这种情况, 先给它建一个默认的对象
         */
		if(/^o /gm.test(text) === false){

			geometry = {
				vertices: [],
				normals: [],
				uvs: []
			};

			material = {
				name: ''
			};

			object = {
				name: '',
				geometry: geometry,
				material: material
			};

			this.objects.push(object);
		}

		var lines = text.split( '\n' );

		for(var i = 0; i < lines.length; i ++){

			var result;
			var line = lines[ i ];
			line = line.trim();

			if(line.length === 0 || line.charAt(0) === '#'){

				continue;
			}else if((result = YFM.Mesh.ObjModel.VPattern.exec(line)) !== null){

				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				vertices.push(
					parseFloat(result[1]),
					parseFloat(result[2]),
					parseFloat(result[3])
				);
			}else if((result = YFM.Mesh.ObjModel.NPattern.exec(line)) !== null){

				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				normals.push(
					parseFloat(result[1]),
					parseFloat(result[2]),
					parseFloat(result[3])
				);
			}else if((result = YFM.Mesh.ObjModel.UVPattern.exec(line)) !== null){

				// ["vt 0.1 0.2", "0.1", "0.2"]
				uvs.push(
					parseFloat(result[1]),
					parseFloat(result[2])
				);
			}else if((result = YFM.Mesh.ObjModel.FacePattern1.exec(line)) !== null){

				// ["f 1 2 3", "1", "2", "3", undefined]
				addFace(
					result[1], result[2], result[3], result[4]
				);
			}else if((result = YFM.Mesh.ObjModel.FacePattern2.exec(line)) !== null){

				// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]
				addFace(
					result[2], result[5], result[8], result[11],
					result[3], result[6], result[9], result[12]
				);
			}else if((result = YFM.Mesh.ObjModel.FacePattern3.exec(line)) !== null){

				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
				addFace(
					result[2], result[6], result[10], result[14],
					result[3], result[7], result[11], result[15],
					result[4], result[8], result[12], result[16]
				);
			}else if((result = YFM.Mesh.ObjModel.FacePattern4.exec(line)) !== null){

				// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]
				addFace(
					result[2], result[5], result[8], result[11],
					undefined, undefined, undefined, undefined,
					result[3], result[6], result[9], result[12]
				);
			}else if(/^o /.test(line)){

				geometry = {
					vertices: [],
					normals: [],
					uvs: []
				};

				material = {
					name : '',
				};

				object = {
					name: line.substring(2).trim(),
					geometry: geometry,
					material: material
				};

                this.objects.push(object);
			}else if(/^g /.test(line)){
				// group
			}else if(/^usemtl /.test(line)){

				material.name = line.substring(7).trim();
                material.mtl = this.materials[material.name];
			}else if(/^mtllib /.test(line)){

				// mtl file
			}else if(/^s /.test(line)){

				// smooth shading
			}else{

                //unhandle
			}

		}

		for(var i = 0, l = this.objects.length; i < l; i ++){

			var obj = this.objects[i];
			var geo = obj.geometry;
            var meshBuffer = new MeshBuffer(this.gl);

            meshBuffer.addAttribute("position", geo.vertices, 3);
            //console.log("obj[%d], vertices length:"+geo.vertices.length);
            
            if(geo.normals.length > 0){
                meshBuffer.addAttribute("normal", geo.normals, 3);
            }
            //console.log("obj[%d], normals length:"+geo.normals.length);

            if(geo.uvs.length > 0){
                meshBuffer.addAttribute("uv", geo.uvs, 2);
            }
            //console.log("obj[%d], uvs length:"+geo.uvs.length);

            obj.mesh = meshBuffer;
		}

        /**
         *生成OBB
         */
        var pts = [];
        for(var i = 0, l = this.objects.length; i < l; i ++){
            var vertices = this.objects[i].geometry.vertices;
            for(var j = 0, cnt = vertices.length/3; j < cnt; j++){
                pts.push(YFM.Math.Vector.pos(vertices[j*3 + 0], vertices[j*3 + 1], vertices[j*3 + 2]));
            }
            /**
             * 删除不必要的顶点属性数据
             */
            delete this.objects[i].geometry;
        }
        this.obb= new OBB(pts);
    }
}


/**
 * 元相机
 */
function CameraRaw(){
    this.dirty = true;
    this.mat_base_view = YFM.Math.Matrix.mat();
    this.mat_t_view = YFM.Math.Matrix.mat();
    this.mat_r_view = YFM.Math.Matrix.mat();
    this.mat_view = YFM.Math.Matrix.mat();
    this.mat_projection = YFM.Math.Matrix.mat();
    this.mat_pv = YFM.Math.Matrix.mat();
    this.mat_ipv = YFM.Math.Matrix.mat();
    this.mat_iv = YFM.Math.Matrix.mat();
}

CameraRaw.prototype = {
	constructor : CameraRaw,

    setPerspective : function(fovy, aspect, znear, zfar){
        this.mat_projection = YFM.Math.Matrix.perspective(fovy, aspect, znear, zfar);
        this.dirty = true;
    },

    setOrthographic : function(left, right, bottom, top, near, far){
        this.mat_projection = YFM.Math.Matrix.orthographic(left, right ,bottom, top, near, far);
        this.dirty = true;
    },

    getProjectionMat : function(){
        return this.mat_projection;
    },

    getPVMat : function(){
        if(this.dirty){
            this.updateViewMat();
            this.dirty = false;
        }
        return this.mat_pv;
    },

    getIPVMat : function(){
        if(this.dirty){
            this.updateViewMat();
            this.dirty = false;
        }
        return this.mat_ipv;
    },

	getViewMat : function(){
        if(this.dirty){
            this.updateViewMat();
            this.dirty = false;
        }
        return this.mat_view;
	},

    getIViewMat : function(){
        if(this.dirty){
            this.updateViewMat();
            this.dirty = false;
        }
        return this.mat_iv;
    },


    setViewOffset : function(x, y, z){
        this.mat_t_view = YFM.Math.Matrix.translate(x, y, z);
        this.dirty = true;
    },

    /**
     * 元视图矩阵为I时, 位于原点, 看向Z轴负向
     * 如想看向世界坐标系下特定点, 相对于在视变换的最前(右), 先做一个逆的基变换
     */
    setViewBaseTranslate : function(azimuth, x, y, z){
        var v = YFM.Math.Vector.vec(x, y, z);
        var rm = YFM.Math.Matrix.rotate3d(azimuth, 0.0, 0.0, 1.0);
        v = YFM.Math.Matrix.mulVec(rm, v);

        this.mat_base_view = YFM.Math.Matrix.postTranslate(rm, -v[0], -v[1], -v[2]);
        this.dirty = true;
    },

    setViewBaseTranslateQu : function(quternion, x, y, z){
        var v = YFM.Math.Vector.vec(x, y, z);
        var rm = YFM.Math.Matrix.rotationFromQuaternion(quternion);
        v = YFM.Math.Matrix.mulVec(rm, v);

        this.mat_base_view = YFM.Math.Matrix.postTranslate(rm, -v[0], -v[1], -v[2]);
        this.dirty = true;
    },

    postViewTranslate : function(x, y, z){
        this.mat_t_view = YFM.Math.Matrix.postTranslate(this.mat_t_view, x, y, z);
        this.dirty = true;
    },

    postViewRotate : function(deg, x, y, z){
        this.mat_r_view = YFM.Math.Matrix.postRotate3d(this.mat_r_view, deg, x, y, z);
        this.dirty = true;
    },

    postViewPitch : function(deg, pos){
        var pm = YFM.Math.Matrix.postTranslate(
                                YFM.Math.Matrix.postRotate3d(YFM.Math.Matrix.translate(-pos[0], -pos[1], -pos[2]), deg, 1.0, 0.0, 0.0), pos[0], pos[1], pos[2]);
        this.mat_r_view = YFM.Math.Matrix.mul(this.mat_r_view, pm);
        this.dirty = true;
    },

    updateViewMat : function(){
        this.mat_view = YFM.Math.Matrix.mul(this.mat_t_view, YFM.Math.Matrix.mul(this.mat_r_view, this.mat_base_view));
        this.mat_pv = YFM.Math.Matrix.mul(this.mat_projection, this.mat_view);
        this.mat_ipv = YFM.Math.Matrix.invert(this.mat_pv);
        this.mat_iv = YFM.Math.Matrix.invert(this.mat_view);
        this.mat_iv[12] = 0.0;
        this.mat_iv[13] = 0.0;
        this.mat_iv[14] = 0.0;
        this.dirty = false;
    }
}


/**
 * 设备方向相机
 */
function DeviceOrientationCamera(){
    this.dirty = true;
    this.mat_base_view = YFM.Math.Matrix.mat();
    this.mat_t_view = YFM.Math.Matrix.mat();
    this.mat_view = YFM.Math.Matrix.mat();
    this.mat_projection = YFM.Math.Matrix.mat();
    this.mat_pv = YFM.Math.Matrix.mat();
    this.mat_ipv = YFM.Math.Matrix.mat();
    this.mat_iv = YFM.Math.Matrix.mat();
    this.quaternion = new Quaternion();

    this.pitchEnable = true;
    this.pitch = this.DEFAULT_PITCH;
    this.lookAt = YFM.Math.Vector.vec(0, 0, 0);
    this.lookOffset = YFM.Math.Vector.vec(0, 0, -400);

    //z轴, 后续多个方法需要做关于z轴的旋转
    this.zee = YFM.Math.Vector.vec(0, 0, 1);

    //由于我们地图建模时把xy平面作为水平面, z轴正向作为竖直方向, 左乘q0以提前校正这个旋转
    this.q0 = new Quaternion(Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));     

    //设备的方向传感器的坐标系是z轴垂直屏幕向用户, y向上, x向右, 右乘q1以做基变换
    this.q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

    //用于矫正屏幕旋转
    this.q2 = new Quaternion();

    this.enabled = false;
    this.deviceOrientation = null;
    this.screenOrientation = 0;
    this.roll = 0;
	this.alphaOffsetAngle = 0;
    var self = this;

	var onDeviceOrientationChangeEvent = function( event ) {
		self.deviceOrientation = event;
        self.dirty = true;
	};
	var onScreenOrientationChangeEvent = function() {
		self.screenOrientation = window.orientation || 0;
	};

	this.connect = function() {

		window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
		window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
		self.enabled = true;
        self.pitchEnable = false;
        self.dirty = true;
	};

	this.disconnect = function() {
		window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
		window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
		self.enabled = false;

        self.deviceOrientation = null;
        self.pitchEnable = true;
        /**
         * 关闭时, 把旋转归零
         */
        self.quaternion = new Quaternion();
        self.dirty = true;
        self.roll = 0;
	};

    this.ldsN = 4;
    this.ldsIndex = 0;

    this.rgss = [];
    this.rgss.push(YFM.Math.Vector.vec(0, 0.25));
    this.rgss.push(YFM.Math.Vector.vec(0.5, 0));
    this.rgss.push(YFM.Math.Vector.vec(0.75, 0.5));
    this.rgss.push(YFM.Math.Vector.vec(0.25, 0.75));

}

DeviceOrientationCamera.prototype = {
	constructor : DeviceOrientationCamera,

    DEFAULT_PITCH : -30.0,

    setPerspective : function(fovy, aspect, znear, zfar){
        this.mat_projection = YFM.Math.Matrix.perspective(fovy, aspect, znear, zfar);
        this.dirty = true;
    },

    setOrthographic : function(left, right, bottom, top, near, far){
        this.mat_projection = YFM.Math.Matrix.orthographic(left, right ,bottom, top, near, far);
        this.dirty = true;
    },

    getProjectionMat : function(){
        return this.mat_projection;
    },

    getProjectionMatWithLDS : function(viewWidth, viewHeight){

        var retMat = YFM.Math.Matrix.matClone(this.mat_projection);
        var d0 = LDS.halton(2, this.ldsIndex);
        var d1 = LDS.halton(3, this.ldsIndex);

        retMat[8] += ((d0 - 0.5) / viewWidth);
        retMat[9] += ((d1 - 0.5) / viewHeight);

        this.ldsIndex += 1;
        if(this.ldsIndex > this.ldsN){
            this.ldsIndex = 0;
        }

        return retMat;
    },

    getProjectionMatWithRGSS : function(index, viewWidth, viewHeight){

        var retMat = YFM.Math.Matrix.matClone(this.mat_projection);
        var dx = this.rgss[index][0];
        var dy = this.rgss[index][1];

        retMat[8] += ((dx*2.0 - 1.0) / viewWidth);
        retMat[9] += ((dy*2.0 - 1.0) / viewHeight);

        return retMat;
    },

    getPVMat : function(){
        if(this.dirty){
            this._updateViewMat();
        }
        return this.mat_pv;
    },

    getIPVMat : function(){
        if(this.dirty){
            this._updateViewMat();
        }
        return this.mat_ipv;
    },

	getViewMat : function(){
        if(this.dirty){
            this._updateViewMat();
        }
        return this.mat_view;
	},

    getRoll : function(){
        return this.roll;
    },

    getPitch : function(){
        return this.pitch;
    },

    setPitch : function(pitch){
        this.pitch = pitch;
        this.dirty = true;
    },

    getEyePos : function(){
        return this.eyePos;
    },

    getLookAt : function(){
        return YFM.Math.Vector.vecClone(this.lookAt);
    },

    getAzimuth : function(){
        var matLook = YFM.Math.Matrix.rotationFromQuaternion(this.quaternion);
        return -YFM.Math.Matrix.eulerParamExtractZ(matLook);
    },

    setAzimuth : function(azimuth){

        this.quaternion.setFromAxisAngle(this.zee, azimuth);
        this.dirty = true;
    },

    setLookAtAzimuth : function(azimuth, x, y, z){

        this.quaternion.setFromAxisAngle(this.zee, azimuth);

        this.lookAt[0] = x;
        this.lookAt[1] = y;
        this.lookAt[2] = z;
        this.dirty = true;
    },

    setLookAt : function(x, y, z){

        this.lookAt[0] = x;
        this.lookAt[1] = y;
        this.lookAt[2] = z;
        this.dirty = true;
    },

    getLookAt : function(){
        return YFM.Math.Vector.vecClone(this.lookAt);
    },

    getLookOffset : function(){
        return YFM.Math.Vector.vecClone(this.lookOffset);
    },

    getLookOffsetNormal : function(){
        return this.lookOffset[2];
    },

    setLookOffset : function(x, y, z){

        this.lookOffset[0] = x;
        this.lookOffset[1] = y;
        this.lookOffset[2] = z;
        this.dirty = true;
    },

    resetLookOffsetTan : function(){
        this.lookOffset[0] = 0;
        this.lookOffset[1] = 0;
        this.dirty = true;
    },


    _updaeQuaternion : function(){

		if(false === this.enabled) 
            return;

        if(null != this.deviceOrientation){
            var deg2Rad = YFM.Math.deg2Radian;
            var alpha = this.deviceOrientation.alpha ? deg2Rad(this.deviceOrientation.alpha) + this.alphaOffsetAngle : 0; // Z
            var beta = this.deviceOrientation.beta ? deg2Rad(this.deviceOrientation.beta) : 0; // X'
            var gamma = this.deviceOrientation.gamma ? deg2Rad(this.deviceOrientation.gamma) : 0; // Y''
		    var orient = this.screenOrientation ? deg2Rad(this.screenOrientation ) : 0; // O

            var euler = new Euler(beta, alpha, -gamma, 'YXZ');

            this.q2.setFromAxisAngle(this.zee, -orient);


            this.quaternion.setFromEuler(euler);
            this.quaternion.premultiply(this.q0);
            this.quaternion.multiply(this.q1);
            this.quaternion.multiply(this.q2);

            this.roll = this.deviceOrientation.gamma ? this.deviceOrientation.gamma : 0;
        }
    },

    _updateViewMat : function(){

        /**
         * 更新姿态
         */
        this._updaeQuaternion();


        /**
         * 观察位置和姿态, 先旋转到姿态决定的方向, 再平移到世界坐标系中的位置
         */
        var matLook = YFM.Math.Matrix.rotationFromQuaternion(this.quaternion);
        var v = YFM.Math.Matrix.mulVec(matLook, this.lookAt);
        matLook = YFM.Math.Matrix.postTranslate(matLook, -v[0], -v[1], -v[2]);

        /**
         * 视坐标原点对观察点的偏移
         */
        var matLookOffset = YFM.Math.Matrix.translate(this.lookOffset[0], this.lookOffset[1], this.lookOffset[2]);


        /**
         * 在姿态模式, 忽略俯仰
         */
        if(this.pitchEnable){
            //由俯仰值产生的俯仰矩阵
            var matPitch = YFM.Math.Matrix.rotate3d(this.pitch, 1.0, 0.0, 0.0);
            this.mat_view = YFM.Math.Matrix.mul(matLookOffset, YFM.Math.Matrix.mul(matPitch, matLook));
        }else{
            this.mat_view = YFM.Math.Matrix.mul(matLookOffset, matLook);
        }
        this.mat_pv = YFM.Math.Matrix.mul(this.mat_projection, this.mat_view);
        this.mat_ipv = YFM.Math.Matrix.invert(this.mat_pv);


        this.dirty = false;
    }
}



/**
 * 底图颜色着色器, 用于绘制无光照底图
 */
function BaseColorProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");
	this.aColor = gl.getAttribLocation(this.program, "aColor" );
    this.uModelMat = gl.getUniformLocation(this.program, "uModelMat");
    this.uFloorMat = gl.getUniformLocation(this.program, "uFloorMat");
    this.uRegionMat = gl.getUniformLocation(this.program, "uRegionMat");
    this.uViewMat = gl.getUniformLocation(this.program, "uViewMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjectionMat");
    this.uMapHeight = gl.getUniformLocation(this.program, "uMapHeight");
}

BaseColorProgram.prototype = {
	constructor : BaseColorProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

	drawTriangles : function(vbo, size){

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 6*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.vertexAttribPointer(this.aColor, 3, this.gl.FLOAT, false, 6*4, 3*4);
		this.gl.enableVertexAttribArray(this.aColor );
		this.gl.drawArrays(this.gl.TRIANGLES, 0, size);
	},

	drawLines : function(vbo, size, width){

        if(null != width)
            this.gl.lineWidth(width);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 6*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.vertexAttribPointer(this.aColor, 3, this.gl.FLOAT, false, 6*4, 3*4);
		this.gl.enableVertexAttribArray(this.aColor );
		this.gl.drawArrays(this.gl.LINES, 0, size);

        if(null != width)
            this.gl.lineWidth(1.0);
	},

    getProgram: function(){
        return this.program;
    },

    setMapHeight : function(height){
	    this.gl.uniform1f(this.uMapHeight, height);
    },

	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setViewMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uViewMat, false, YFM.Math.flatten(mat) );
	},
	setRegionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uRegionMat, false, YFM.Math.flatten(mat) );
	},
	setFloorMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uFloorMat, false, YFM.Math.flatten(mat) );
	},
	setModelMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uModelMat, false, YFM.Math.flatten(mat) );
	},

	vshader : 
"attribute  vec4 aPosition;\n"+
"attribute  vec4 aColor;\n"+
"uniform mat4 uModelMat;\n"+
"uniform mat4 uFloorMat;\n"+
"uniform mat4 uRegionMat;\n"+
"uniform mat4 uViewMat;\n"+
"uniform mat4 uProjectionMat;\n"+
"uniform float uMapHeight;\n"+
"varying vec4 vColor;\n"+
"void main()\n"+
"{\n"+
"	vec4 pos = vec4(aPosition.x, uMapHeight-aPosition.y, aPosition.z, 1.0);\n"+
"	gl_Position = uProjectionMat*uViewMat*uRegionMat*uFloorMat*uModelMat*pos;\n"+
"	vColor = aColor;\n"+
"}\n",

	fshader :
"precision mediump float;\n"+
"varying vec4 vColor;\n"+
"void main()\n"+
"{\n"+
"	gl_FragColor = vColor;\n"+
"}\n"

}



/**
 * 底图phong着色器, 用于绘制带光照的底图附属物品
 */
function BasePhongProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");
	this.aColor = gl.getAttribLocation(this.program, "aColor" );
	this.aNormal = gl.getAttribLocation(this.program, "aNormal" );

    this.uModelMat = gl.getUniformLocation(this.program, "uModelMat");
    this.uFloorMat = gl.getUniformLocation(this.program, "uFloorMat");
    this.uRegionMat = gl.getUniformLocation(this.program, "uRegionMat");
    this.uViewMat = gl.getUniformLocation(this.program, "uViewMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjMat");
    this.uNormalMat = gl.getUniformLocation(this.program, "uNormalMat");
    this.uMapHeight = gl.getUniformLocation(this.program, "uMapHeight");
    this.uLightPos = gl.getUniformLocation(this.program, "uLightPos");
    this.uLighting = gl.getUniformLocation(this.program, "uLighting");
}

BasePhongProgram.prototype = {
	constructor : BasePhongProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

	drawTriangles : function(vbo, size){

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 9*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.vertexAttribPointer(this.aColor, 3, this.gl.FLOAT, false, 9*4, 3*4);
		this.gl.enableVertexAttribArray(this.aColor);
		this.gl.vertexAttribPointer(this.aNormal, 3, this.gl.FLOAT, false, 9*4, 6*4);
		this.gl.enableVertexAttribArray(this.aNormal);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, size);
	},

	drawLines : function(vbo, size, width){

        if(null != width)
            this.gl.lineWidth(width);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, true, 9*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.vertexAttribPointer(this.aColor, 3, this.gl.FLOAT, false, 9*4, 3*4);
		this.gl.enableVertexAttribArray(this.aColor );
		this.gl.vertexAttribPointer(this.aNormal, 3, this.gl.FLOAT, false, 9*4, 6*4);
		this.gl.enableVertexAttribArray(this.aNormal);
		this.gl.drawArrays(this.gl.LINES, 0, size);

        if(null != width)
            this.gl.lineWidth(1.0);
	},

    getProgram: function(){
        return this.program;
    },

    setLightPos : function(lightPos){
        this.gl.uniform4fv(this.uLightPos, lightPos);
    },

    setLighting : function(value){
	    this.gl.uniform1i(this.uLighting, value);
    },
    setMapHeight : function(height){
	    this.gl.uniform1f(this.uMapHeight, height);
    },
	setNormalMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uNormalMat, false, YFM.Math.flatten(mat) );
	},
	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setViewMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uViewMat, false, YFM.Math.flatten(mat) );
	},
	setRegionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uRegionMat, false, YFM.Math.flatten(mat) );
	},
	setFloorMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uFloorMat, false, YFM.Math.flatten(mat) );
	},
	setModelMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uModelMat, false, YFM.Math.flatten(mat) );
	},


	vshader : 
"attribute vec4 aPosition;  \n"+
"attribute vec4 aNormal;    \n"+
"attribute vec4 aColor;     \n"+
"uniform int    uLighting;  \n"+
"uniform float  uMapHeight; \n"+
"uniform mat4   uModelMat;  \n"+
"uniform mat4   uFloorMat;  \n"+
"uniform mat4   uRegionMat; \n"+
"uniform mat4   uViewMat;   \n"+
"uniform mat4   uProjMat;   \n"+
"uniform mat4   uNormalMat; \n"+
"uniform vec4   uLightPos;  \n"+
"varying vec4   vColor;     \n"+
"                           \n"+
"void main(){               \n"+
"   vec4 tPos = vec4(aPosition.x, uMapHeight-aPosition.y, aPosition.z, 1.0);\n"+
"   mat4 modelViewMatrix = uViewMat*uRegionMat*uFloorMat*uModelMat;\n"+
"   if(1 == uLighting){\n"+
"       float shininess = 320.0;                                 \n"+
"       vec4 ambient, diffuse, specular;                        \n"+
"       vec4 ambientProduct = vec4(0.3, 0.3, 0.3, 1.0 );        \n"+
"       vec4 diffuseProduct = vec4(1.0, 1.0, 1.0, 1.0 );        \n"+
"       vec4 specularProduct= vec4(0.1, 0.1, 0.1, 1.0 );        \n"+
"                                                               \n"+
"       vec3 pos = (modelViewMatrix * tPos).xyz;                \n"+
"       vec3 L = normalize((uViewMat*uLightPos).xyz);           \n"+
"       vec3 E = -normalize(pos );                              \n"+
"       vec3 H = normalize(L + E );                             \n"+
"       vec3 N = normalize((uNormalMat*aNormal).xyz);           \n"+
"       ambient = ambientProduct;                               \n"+
"       float Kd = max( dot(L, N), 0.0 );                       \n"+
"       diffuse = Kd*diffuseProduct;                            \n"+
"       float Ks = pow(max(dot(N, H), 0.0), shininess);         \n"+
"       specular = Ks * specularProduct;                        \n"+
"       if(dot(L, N) < 0.0) {                                   \n"+
"           specular = vec4(0.0, 0.0, 0.0, 1.0);                \n"+
"       }                                                       \n"+
"       vColor = aColor*ambient+aColor*diffuse + aColor*specular;\n"+
"   }else{                                                  \n"+
"       vColor = aColor;                                    \n"+ 
"   }                                                       \n"+
"   gl_Position = uProjMat * modelViewMatrix * tPos;        \n"+
"}\n",

	fshader :
"precision mediump float;                                   \n"+
"varying vec4                   vColor;                     \n"+
"void main() {                                              \n"+
"       gl_FragColor = vColor;                              \n"+
"}\n"

}



/**
 * Billboard Icon着色器
 */
function BillboardIconProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");
	this.aTexCoord = gl.getAttribLocation(this.program, "aTexCoord" );

    this.uTex = gl.getUniformLocation(this.program, "uTex");
    this.uModelMat = gl.getUniformLocation(this.program, "uModelMat");
    this.uRegionMat = gl.getUniformLocation(this.program, "uRegionMat");
    this.uiViewMat = gl.getUniformLocation(this.program, "uiViewMat");
    this.uViewMat = gl.getUniformLocation(this.program, "uViewMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjMat");
}

BillboardIconProgram.prototype = {
	constructor : BillboardIconProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

    bindTexture : function(tex){
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.uTex, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    },

	drawTriangles : function(vbo, size, offset){


		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, true, 6*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.vertexAttribPointer(this.aTexCoord, 3, this.gl.FLOAT, false, 6*4, 3*4);
		this.gl.enableVertexAttribArray(this.aTexCoord);


        this.gl.enable(this.gl.BLEND);
        //png贴图要用这个,否则有黑边
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
		this.gl.drawArrays(this.gl.TRIANGLES, offset, size);
        this.gl.disable(this.gl.BLEND);
	},

	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setViewMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uViewMat, false, YFM.Math.flatten(mat) );
	},
	setIViewMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uiViewMat, false, YFM.Math.flatten(mat) );
	},
	setRegionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uRegionMat, false, YFM.Math.flatten(mat) );
	},
	setModelMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uModelMat, false, YFM.Math.flatten(mat) );
	},


	vshader : 
"attribute vec4  aPosition; \n"+
"attribute vec3  aTexCoord; \n"+
"varying vec3 vTexCoord;    \n"+
"uniform mat4   uModelMat;  \n"+
"uniform mat4   uRegionMat; \n"+
"uniform mat4   uiViewMat;  \n"+
"uniform mat4   uViewMat;   \n"+
"uniform mat4   uProjMat;   \n"+
"void main( void ) {                            \n"+
"    vTexCoord = aTexCoord;                     \n"+
"    gl_Position = uProjMat*uViewMat*uRegionMat*uModelMat*uiViewMat*aPosition;\n"+
"}\n",

	fshader :
"precision mediump float;                       \n"+
"varying vec3 vTexCoord;                        \n"+
"uniform sampler2D uTex;                        \n"+
"void main() {                                  \n"+
"   gl_FragColor = texture2D(uTex, vTexCoord.xy);  \n"+
"}\n"

}


/**
 * 颜色 2D着色器
 */
function Color2DProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");

    this.uColor = gl.getUniformLocation(this.program, "uColor");
    this.uModelMat = gl.getUniformLocation(this.program, "uModelMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjMat");
}

Color2DProgram.prototype = {
	constructor : Color2DProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },


	drawTriangles : function(vbo, color, offset, size){

        this.gl.uniform4fv(this.uColor, YFM.Math.flatten(color));

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 3*4, offset);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.drawArrays(this.gl.TRIANGLES, 0, size);
	},

	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setModelMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uModelMat, false, YFM.Math.flatten(mat) );
	},


	vshader : 
"attribute vec4 aPosition;\n"+
"uniform mat4   uModelMat;\n"+
"uniform mat4   uProjMat;\n"+
"uniform vec4   uColor;\n"+
"varying vec4   vColor;\n"+
"void main( void ) {                            \n"+
"    gl_Position = uProjMat*uModelMat*aPosition;\n"+
"    vColor = uColor;                           \n"+
"}\n",

	fshader :
"precision mediump float;                       \n"+
"varying vec4   vColor;                         \n"+
"void main() {                                  \n"+
"   gl_FragColor = vColor;                      \n"+
"}\n"

}


/**
 * Marker 2D着色器
 */
function Marker2DProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");
	this.aTexCoord = gl.getAttribLocation(this.program, "aTexCoord" );

    this.uTex = gl.getUniformLocation(this.program, "uTex");
    this.uModelMat = gl.getUniformLocation(this.program, "uModelMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjMat");
}

Marker2DProgram.prototype = {
	constructor : Marker2DProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

    bindTexture : function(tex){
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.uTex, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    },

	drawTriangles : function(vbo, size, offset){


		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 6*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.vertexAttribPointer(this.aTexCoord, 3, this.gl.FLOAT, false, 6*4, 3*4);
		this.gl.enableVertexAttribArray(this.aTexCoord);


        this.gl.enable(this.gl.BLEND);
        //png贴图要用这个,否则有黑边
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
		this.gl.drawArrays(this.gl.TRIANGLES, offset, size);
        this.gl.disable(this.gl.BLEND);
	},

	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setModelMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uModelMat, false, YFM.Math.flatten(mat) );
	},


	vshader : 
"attribute vec4  aPosition; \n"+
"attribute vec3  aTexCoord; \n"+
"uniform mat4   uModelMat;  \n"+
"uniform mat4   uProjMat;   \n"+
"varying vec3   vTexCoord;  \n"+
"void main( void ) {                            \n"+
"    vTexCoord = aTexCoord;                     \n"+
"    gl_Position = uProjMat*uModelMat*aPosition;\n"+
"}\n",

	fshader :
"precision mediump float;                       \n"+
"varying vec3 vTexCoord;                        \n"+
"uniform sampler2D uTex;                        \n"+
"void main() {                                  \n"+
"   gl_FragColor = texture2D(uTex, vTexCoord.xy);  \n"+
"}\n"

}


/**
 * model phong着色器, 用于Region坐标系下的带光照的对象
 */
function ModelPhongProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");
	this.aNormal = gl.getAttribLocation(this.program, "aNormal" );
	this.aTexCoord = gl.getAttribLocation(this.program, "aTexCoord" );

    this.uNs = gl.getUniformLocation(this.program, "uNs");
    this.uKa = gl.getUniformLocation(this.program, "uKa");
    this.uKd = gl.getUniformLocation(this.program, "uKd");
    this.uKs = gl.getUniformLocation(this.program, "uKs");

    this.uTexFlag = gl.getUniformLocation(this.program, "uTexFlag");
    this.uTex = gl.getUniformLocation(this.program, "uTex");
    this.uColorFlag = gl.getUniformLocation(this.program, "uColorFlag");
    this.uColor = gl.getUniformLocation(this.program, "uColor");
    this.uModelMat = gl.getUniformLocation(this.program, "uModelMat");
    this.uFloorMat = gl.getUniformLocation(this.program, "uFloorMat");
    this.uRegionMat = gl.getUniformLocation(this.program, "uRegionMat");
    this.uViewMat = gl.getUniformLocation(this.program, "uViewMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjMat");
    this.uNormalMat = gl.getUniformLocation(this.program, "uNormalMat");
    this.uLightPos = gl.getUniformLocation(this.program, "uLightPos");

    this.defaultNs      = 32.0;
    this.defaultColor   = YFM.Math.Vector.pos(1.0, 1.0, 1.0);
    this.defaultKa      = YFM.Math.Vector.pos(0.3, 0.3, 0.3);
    this.defaultKd      = YFM.Math.Vector.pos(1.0, 1.0, 1.0);
    this.defaultKs      = YFM.Math.Vector.pos(0.1, 0.1, 0.1);
}

ModelPhongProgram.prototype = {
	constructor : ModelPhongProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

	drawLines : function(vbo, color, offset, size){

        this.gl.uniform1f(this.uNs, this.defaultNs);
        this.gl.uniform4fv(this.uKa, this.defaultKa);
        this.gl.uniform4fv(this.uKd, this.defaultKd);
        this.gl.uniform4fv(this.uKs, this.defaultKs);
        this.gl.uniform1i(this.uTexFlag, 0);
        this.gl.uniform1i(this.uColorFlag, 1);
        this.gl.uniform4fv(this.uColor, color);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, true, 3*4, offset);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.drawArrays(this.gl.LINES, 0, size);
	},

	drawTriangles : function(meshBuffer){

        var position, normal, uv;

        position = meshBuffer.getAttribute("position");
        normal = meshBuffer.getAttribute("normal");
        uv = meshBuffer.getAttribute("uv");

        if(null !== position){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, position.vbo);
            this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 3*4, 0);
            this.gl.enableVertexAttribArray(this.aPosition );
        }else{
            this.gl.disableVertexAttribArray(this.aPosition );
        }

        if(null != normal){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normal.vbo);
            this.gl.vertexAttribPointer(this.aNormal, 3, this.gl.FLOAT, false, 3*4, 0);
            this.gl.enableVertexAttribArray(this.aNormal);
        }else{
            this.gl.disableVertexAttribArray(this.aNormal);
        }

        if(null != uv){

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uv.vbo);
            this.gl.vertexAttribPointer(this.aTexCoord, 2, this.gl.FLOAT, false, 2*4, 0);
            this.gl.enableVertexAttribArray(this.aTexCoord);
        }else{
            this.gl.disableVertexAttribArray(this.aTexCoord);
        }


		this.gl.drawArrays(this.gl.TRIANGLES, 0, position.length);
	},

    setTexFlag : function(value){
        this.gl.uniform1i(this.uTexFlag, value);
    },

    bindTexture : function(tex){
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.uTex, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    },

    setMTL : function(mtl, texturePool){

        this.gl.uniform1f(this.uNs, mtl.getNs());
        this.gl.uniform4fv(this.uKa, YFM.Math.flatten(mtl.getKa()));
        this.gl.uniform4fv(this.uKd, YFM.Math.flatten(mtl.getKd()));
        this.gl.uniform4fv(this.uKs, YFM.Math.flatten(mtl.getKs()));

        /**
         * 检查材质数据是否包含贴图
         * 如果包含, 先在贴图池中查找是否有对应贴图
         */
        if(null !== mtl.getMapKd()){
            var tex = texturePool.getTexture(mtl.getMapKd());
            if(null != tex){
                this.gl.uniform1i(this.uTexFlag, 1);
                this.gl.uniform1i(this.uColorFlag, 0);
                this.bindTexture(tex.tex); 
                return;
            }
        }

        /**
         * 如果材质没有包括贴图, 就使用默认颜色
         */
        this.gl.uniform1i(this.uTexFlag, 0);
        this.gl.uniform1i(this.uColorFlag, 1);
        this.gl.uniform4fv(this.uColor, this.defaultColor);
    },

    setDefaultMTL : function(){

        /**
         * 当模型没有指定材质时, 使用默认材质
         * 不使用贴图
         * 使用默认颜色(白)
         */
        this.gl.uniform1f(this.uNs, this.defaultNs);
        this.gl.uniform4fv(this.uKa, this.defaultKa);
        this.gl.uniform4fv(this.uKd, this.defaultKd);
        this.gl.uniform4fv(this.uKs, this.defaultKs);
        this.gl.uniform1i(this.uTexFlag, 0);
        this.gl.uniform1i(this.uColorFlag, 1);
        this.gl.uniform4fv(this.uColor, this.defaultColor);
    },

    setColorFlag : function(value){
        this.gl.uniform1i(this.uColorFlag, value);
    },

    setColor : function(color){
        this.gl.uniform4fv(this.uColor, color);
    },

    setLightPos : function(lightPos){
        this.gl.uniform4fv(this.uLightPos, lightPos);
    },
	setNormalMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uNormalMat, false, YFM.Math.flatten(mat) );
	},
	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setViewMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uViewMat, false, YFM.Math.flatten(mat) );
	},
	setRegionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uRegionMat, false, YFM.Math.flatten(mat) );
	},
	setFloorMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uFloorMat, false, YFM.Math.flatten(mat) );
	},
	setModelMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uModelMat, false, YFM.Math.flatten(mat) );
	},


	vshader : 
"attribute vec4 aPosition;  \n"+
"attribute vec4 aNormal;    \n"+
"attribute vec3 aTexCoord;  \n"+
"uniform int    uTexFlag;   \n"+
"uniform float  uNs;        \n"+
"uniform vec4   uKa;        \n"+
"uniform vec4   uKd;        \n"+
"uniform vec4   uKs;        \n"+
"uniform mat4   uModelMat;  \n"+
"uniform mat4   uFloorMat;  \n"+
"uniform mat4   uRegionMat; \n"+
"uniform mat4   uViewMat;   \n"+
"uniform mat4   uProjMat;   \n"+
"uniform mat4   uNormalMat; \n"+
"uniform vec4   uLightPos;  \n"+
"varying vec3   vTexCoord;  \n"+
"varying vec4   vAmbient;   \n"+
"varying vec4   vDiffuse;   \n"+
"varying vec4   vSpecular;  \n"+
"                           \n"+
"void main(){               \n"+
"   mat4 modelViewMatrix = uViewMat*uRegionMat*uFloorMat*uModelMat;\n"+
"   vec3 pos = (modelViewMatrix * aPosition).xyz;           \n"+
"   vec3 L = normalize((uViewMat*uLightPos).xyz);           \n"+
"   vec3 E = -normalize(pos );                              \n"+
"   vec3 H = normalize(L + E );                             \n"+
"   vec3 N = normalize((uNormalMat*aNormal).xyz);           \n"+
"   vAmbient = uKa;                                         \n"+
"   vDiffuse = max(dot(L,N), 0.0)*uKd;                      \n"+
"   vec4 specular = pow(max(dot(N, H), 0.0), uNs)*uKs;      \n"+
"   if(dot(L, N) < 0.0) {                                   \n"+
"       specular = vec4(0.0, 0.0, 0.0, 1.0);                \n"+
"   }                                                       \n"+
"   vSpecular = specular;                                   \n"+
"   if(1 == uTexFlag)                                       \n"+
"       vTexCoord = aTexCoord;                              \n"+
"   else                                                    \n"+
"       vTexCoord = vec3(0.0, 0.0, 0.0);                    \n"+
"   gl_Position = uProjMat * modelViewMatrix * aPosition;   \n"+
"}\n",

	fshader :
"precision mediump float;       \n"+
"uniform int        uColorFlag; \n"+
"uniform vec4       uColor;     \n"+
"uniform sampler2D  uTex;       \n"+
"varying vec3       vTexCoord;  \n"+
"varying vec4       vAmbient;   \n"+
"varying vec4       vDiffuse;   \n"+
"varying vec4       vSpecular;  \n"+
"void main() {                  \n"+
"       vec4 color;                                                     \n"+
"       if(1 == uColorFlag)                                             \n"+
"           color = uColor;                                             \n"+ 
"       else                                                            \n"+
"           color = texture2D(uTex, vTexCoord.xy);                      \n"+
"       gl_FragColor = color*vAmbient+color*vDiffuse+color*vSpecular;   \n"+
"}\n"

}


/**
 * 点精灵着色器
 */
function PointSpiritProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");

    this.uTex = gl.getUniformLocation(this.program, "uTex");
    this.uRegionMat = gl.getUniformLocation(this.program, "uRegionMat");
    this.uViewMat = gl.getUniformLocation(this.program, "uViewMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjMat");
}

PointSpiritProgram.prototype = {
	constructor : PointSpiritProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

    bindTexture : function(tex){
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.uTex, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    },

	drawPoints : function(vbo, size){


		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this.aPosition );


        this.gl.enable(this.gl.BLEND);
        //png贴图要用这个,否则有黑边
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
		this.gl.drawArrays(this.gl.POINTS, 0, size);
        this.gl.disable(this.gl.BLEND);
	},

	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setViewMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uViewMat, false, YFM.Math.flatten(mat) );
	},
	setRegionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uRegionMat, false, YFM.Math.flatten(mat) );
	},


	vshader : 
"attribute vec4  aPosition; \n"+
"uniform mat4   uRegionMat; \n"+
"uniform mat4   uViewMat;   \n"+
"uniform mat4   uProjMat;   \n"+
"void main( void ) {                            \n"+
"    gl_Position = uProjMat*uViewMat*uRegionMat*aPosition;\n"+
"    gl_PointSize = 24.0;                        \n"+
"}\n",

	fshader :
"precision mediump float;                       \n"+
"uniform sampler2D uTex;                        \n"+
"void main() {                                  \n"+
"   gl_FragColor = texture2D(uTex, gl_PointCoord);\n"+
"}\n"

}



/**
 * 朴素全景 着色器
 */
function RawPanoramaProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");
    this.uModelMat = gl.getUniformLocation(this.program, "uModelMat");
    this.uViewMat = gl.getUniformLocation(this.program, "uViewMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjectionMat");
    this.uTexMap = gl.getUniformLocation(this.program, "uTexMap");
}

RawPanoramaProgram.prototype = {
	constructor : RawPanoramaProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

	drawTriangles : function(vbo, size){

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 3*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.drawArrays(this.gl.TRIANGLES, 0, size);
	},

    getProgram: function(){
        return this.program;
    },

    bindTexture : function(tex){
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.uTexMap, 0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, tex);
    },

	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setViewMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uViewMat, false, YFM.Math.flatten(mat) );
	},
	setModelMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uModelMat, false, YFM.Math.flatten(mat) );
	},

	vshader : 
"attribute  vec4 aPosition;\n"+
"uniform mat4 uModelMat;\n"+
"uniform mat4 uViewMat;\n"+
"uniform mat4 uProjectionMat;\n"+
"varying vec3 V;\n"+
"void main()\n"+
"{\n"+
"	gl_Position = uProjectionMat*uViewMat*uModelMat*aPosition;\n"+
"   V = normalize(vec3(aPosition.x, aPosition.y, aPosition.z));\n"+
"}\n",

	fshader :
"precision mediump float;\n"+
"uniform samplerCube uTexMap;\n"+
"varying vec3 V;\n"+
"void main()\n"+
"{\n"+
"	gl_FragColor = textureCube(uTexMap, V);\n"+
"}\n"

}


/**
 * region phong着色器, 用于Region坐标系下的带光照的对象
 */
function RegionPhongProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");
	this.aNormal = gl.getAttribLocation(this.program, "aNormal" );

    this.uColor = gl.getUniformLocation(this.program, "uColor");
    this.uModelMat = gl.getUniformLocation(this.program, "uModelMat");
    this.uRegionMat = gl.getUniformLocation(this.program, "uRegionMat");
    this.uViewMat = gl.getUniformLocation(this.program, "uViewMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjMat");
    this.uNormalMat = gl.getUniformLocation(this.program, "uNormalMat");
    this.uLightPos = gl.getUniformLocation(this.program, "uLightPos");
}

RegionPhongProgram.prototype = {
	constructor : RegionPhongProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

	drawTriangles : function(vbo, size, offset){

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 6*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.vertexAttribPointer(this.aNormal, 3, this.gl.FLOAT, false, 6*4, 3*4);
		this.gl.enableVertexAttribArray(this.aNormal);
		this.gl.drawArrays(this.gl.TRIANGLES, offset, size-offset);
	},

	drawTrianglesPlus : function(vbo, start, end){

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 6*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.vertexAttribPointer(this.aNormal, 3, this.gl.FLOAT, false, 6*4, 3*4);
		this.gl.enableVertexAttribArray(this.aNormal);
		this.gl.drawArrays(this.gl.TRIANGLES, start, end-start);
	},

	drawLines : function(vbo, size, width){

        if(null != width)
            this.gl.lineWidth(width);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, true, 6*4, 0);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.vertexAttribPointer(this.aNormal, 3, this.gl.FLOAT, false, 6*4, 3*4);
		this.gl.enableVertexAttribArray(this.aNormal);
		this.gl.drawArrays(this.gl.LINES, 0, size);

        if(null != width)
            this.gl.lineWidth(1.0);
	},

    setColor : function(color){
        this.gl.uniform4fv(this.uColor, color);
    },

    setLightPos : function(lightPos){
        this.gl.uniform4fv(this.uLightPos, lightPos);
    },
	setNormalMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uNormalMat, false, YFM.Math.flatten(mat) );
	},
	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setViewMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uViewMat, false, YFM.Math.flatten(mat) );
	},
	setRegionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uRegionMat, false, YFM.Math.flatten(mat) );
	},
	setModelMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uModelMat, false, YFM.Math.flatten(mat) );
	},


	vshader : 
"attribute vec4 aPosition;  \n"+
"attribute vec4 aNormal;    \n"+
"uniform vec4   uColor;     \n"+
"uniform mat4   uModelMat;  \n"+
"uniform mat4   uRegionMat; \n"+
"uniform mat4   uViewMat;   \n"+
"uniform mat4   uProjMat;   \n"+
"uniform mat4   uNormalMat; \n"+
"uniform vec4   uLightPos;  \n"+
"varying vec4   vColor;     \n"+
"                           \n"+
"void main(){               \n"+
"   float shininess = 320.0;                                \n"+
"   vec4 ambient, diffuse, specular;                        \n"+
"   vec4 ambientProduct = vec4(0.5, 0.5, 0.5, 1.0 );        \n"+
//"   vec4 diffuseProduct = vec4(0.3, 0.3, 0.3, 1.0 );        \n"+
"   vec4 diffuseProduct = vec4(1.0, 1.0, 1.0, 1.0 );        \n"+
"   vec4 specularProduct= vec4(0.2, 0.2, 0.2, 1.0 );        \n"+
"                                                           \n"+
"   mat4 modelViewMatrix = uViewMat*uRegionMat*uModelMat;   \n"+
"   vec3 pos = (modelViewMatrix * aPosition).xyz;           \n"+
"   vec3 L = normalize((uViewMat*uLightPos).xyz);           \n"+
"   vec3 E = -normalize(pos );                              \n"+
"   vec3 H = normalize(L + E );                             \n"+
"   vec3 N = normalize((uNormalMat*aNormal).xyz);           \n"+
"   ambient = ambientProduct;                               \n"+
"   float Kd = max( dot(L, N), 0.0 );                       \n"+
"   diffuse = Kd*diffuseProduct;                            \n"+
"   float Ks = pow(max(dot(N, H), 0.0), shininess);         \n"+
"   specular = Ks * specularProduct;                        \n"+
"   if(dot(L, N) < 0.0) {                                   \n"+
"       specular = vec4(0.0, 0.0, 0.0, 1.0);                \n"+
"   }                                                       \n"+
"   gl_Position = uProjMat * modelViewMatrix * aPosition;   \n"+
"   vColor = uColor*ambient+uColor*diffuse+uColor*specular; \n"+
"}\n",

	fshader :
"precision mediump float;                                   \n"+
"varying vec4                   vColor;                     \n"+
"void main() {                                              \n"+
"       gl_FragColor = vColor;                              \n"+
"}\n"

}



/**
 * Screen Space Route 着色器
 */
function SSRProgram(gl, region){
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");
	this.aTexCoord = gl.getAttribLocation(this.program, "aTexCoord" );
	this.aLineDist = gl.getAttribLocation(this.program, "aLineDist" );
    this.uTime = gl.getUniformLocation(this.program, "uTime");
    this.uHH = gl.getUniformLocation(this.program, "uHH");
    this.uHW = gl.getUniformLocation(this.program, "uHW");
    this.uTotalLen = gl.getUniformLocation(this.program, "uTotalLen");
    this.uNaviArg = gl.getUniformLocation(this.program, "uNaviArg");
    this.uTranFlag = gl.getUniformLocation(this.program, "uTranFlag");
    this.uLimitFlag = gl.getUniformLocation(this.program, "uLimitFlag");
    this.uLimitMin = gl.getUniformLocation(this.program, "uLimitMin");
    this.uLimitMax = gl.getUniformLocation(this.program, "uLimitMax");

    this.useProgram();
    this.setHH(region.hh);
    this.setHW(region.hw);
}

SSRProgram.prototype = {
	constructor : SSRProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

    bindTexture : function(tex){
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.uTex, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    },

	drawTriangleStrip : function(attribs, offset, length){

        var position = attribs.getAttribute("position");
        var uv = attribs.getAttribute("uv");

        if(null !== position){
            if(position.length <= 0){
                return;
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, position.vbo);
            this.gl.vertexAttribPointer(this.aPosition, position.size, this.gl.FLOAT, false, position.size*4, 0);
            this.gl.enableVertexAttribArray(this.aPosition);

            if(null !== uv){
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uv.vbo);
                this.gl.vertexAttribPointer(this.aTexCoord, 2, this.gl.FLOAT, false, 2*4, 0);
                this.gl.enableVertexAttribArray(this.aTexCoord);

                var l = length || position.length-offset;
                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, l);
            }
        }
	},


    setTime : function(time){
        this.gl.uniform1f(this.uTime, time);
    },

    setHH : function(value){
        this.gl.uniform1f(this.uHH, value);
    },
    setHW : function(value){
        this.gl.uniform1f(this.uHW, value);
    },


    setTranFlag : function(value){
        this.gl.uniform1i(this.uTranFlag, value);
    },


	vshader : 
"attribute  vec4 aPosition; \n"+
"attribute vec3  aTexCoord; \n"+
"uniform float uTime;       \n"+
"uniform float uHH;         \n"+
"uniform float uHW;         \n"+
"varying vec3   vTexCoord;  \n"+
"void main(){               \n"+
"   gl_Position = vec4(aPosition.x/uHW, aPosition.y/uHH, aPosition.z, 1.0);\n"+
"   vTexCoord = vec3(aTexCoord.x, aTexCoord.y + uTime, 0.0);\n"+
"}\n",


	fshader :
"precision mediump float;   \n"+
"varying vec3 vTexCoord;    \n"+
"uniform int   uTranFlag;   \n"+
"uniform sampler2D uTex;    \n"+
"void main(){\n"+
"   vec4 c = texture2D(uTex, vTexCoord.xy);     \n"+
"   if(1 == uTranFlag)                          \n"+
"       gl_FragColor = c*vec4(0.5,0.5,0.5,0.5); \n"+
"   else                                        \n"+
"       gl_FragColor = c;                       \n"+
"}\n"

}


/**
 * 指定颜色着色器, 用于绘制无光照的小部件
 */
function SelectColorProgram(gl){
	this.init = false;
    this.gl = gl;
	this.program = YFM.WebGL.makeShader(gl, this.vshader, this.fshader);
	this.aPosition = gl.getAttribLocation(this.program, "aPosition");
    this.uModelMat = gl.getUniformLocation(this.program, "uModelMat");
    this.uRegionMat = gl.getUniformLocation(this.program, "uRegionMat");
    this.uViewMat = gl.getUniformLocation(this.program, "uViewMat");
    this.uProjectionMat = gl.getUniformLocation(this.program, "uProjectionMat");
    this.uColor = gl.getUniformLocation(this.program, "uColor");
}

SelectColorProgram.prototype = {
	constructor : SelectColorProgram,

    useProgram : function(){
        this.gl.useProgram(this.program);
    },

	drawTriangles : function(vbo, color, offset, size){

        this.gl.uniform4fv(this.uColor, YFM.Math.flatten(color));
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, false, 3*4, offset);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.drawArrays(this.gl.TRIANGLES, 0, size);
	},

	drawLines : function(vbo, color, offset, size){

        this.gl.uniform4fv(this.uColor, YFM.Math.flatten(color));
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		this.gl.vertexAttribPointer(this.aPosition, 3, this.gl.FLOAT, true, 3*4, offset);
		this.gl.enableVertexAttribArray(this.aPosition );
		this.gl.drawArrays(this.gl.LINES, 0, size);
	},

    getProgram: function(){
        return this.program;
    },

	setProjectionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uProjectionMat, false, YFM.Math.flatten(mat) );
	},
	setViewMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uViewMat, false, YFM.Math.flatten(mat) );
	},
	setRegionMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uRegionMat, false, YFM.Math.flatten(mat) );
	},
	setModelMatrix : function(mat){
		this.gl.uniformMatrix4fv(this.uModelMat, false, YFM.Math.flatten(mat) );
	},

	vshader : 
"attribute  vec4 aPosition;\n"+
"uniform vec4 uColor;\n"+
"uniform mat4 uModelMat;\n"+
"uniform mat4 uRegionMat;\n"+
"uniform mat4 uViewMat;\n"+
"uniform mat4 uProjectionMat;\n"+
"varying vec4 vColor;\n"+
"void main()\n"+
"{\n"+
"	gl_Position = uProjectionMat*uViewMat*uRegionMat*uModelMat*aPosition;\n"+
"	vColor = uColor;\n"+
"}\n",

	fshader :
"precision mediump float;\n"+
"varying vec4 vColor;\n"+
"void main()\n"+
"{\n"+
"	gl_FragColor = vColor;\n"+
"}\n"

}


/**
 * 贴图池
 */
function TexturePool(gl){
    this.gl = gl;
    this.pool = {};
}

TexturePool.prototype = {
	constructor : TexturePool,

    addTexture : function(name, url){
        if(null != this.pool[name]){
            return false;
        }else{
            var image = new Image();
            var texWrap = new TextureWrap(name, url, image);
            var ctx = this;
            
            image.crossOrigin = "Anonymous";
            image.onload = function() { ctx._handleTextureLoaded(texWrap);}
            image.src = url;
        }
    },

    addTextureMip : function(name, url){
        if(null != this.pool[name]){
            return false;
        }else{
            var image = new Image();
            var texWrap = new TextureWrap(name, url, image);
            var ctx = this;

            image.crossOrigin = "Anonymous";
            image.onload = function() { ctx._handleTextureLoadedMip(texWrap);}
            image.src = url;
        }
    },

    getTexture : function(name){
        var texWrap = this.pool[name];
        if(null != texWrap){
            return {
                    tex : texWrap.tex,
                    w : texWrap.w,
                    h : texWrap.h};
        }else{
            return null;
        }
    },

    _handleTextureLoaded : function(texWrap){
        this.pool[texWrap.name] = texWrap;


        var tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);

        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texWrap.img);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        texWrap.tex = tex;
        texWrap.w   = texWrap.img.width;
        texWrap.h   = texWrap.img.height;
        delete texWrap.img;
    },

    _handleTextureLoadedMip : function(texWrap){
        this.pool[texWrap.name] = texWrap;


        var tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);

        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texWrap.img);

        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        texWrap.tex = tex;
        texWrap.w   = texWrap.img.width;
        texWrap.h   = texWrap.img.height;
        delete texWrap.img;
    },
}


function TextureWrap(name, url, img){
    this.name = name;
    this.url  = url;
    this.img  = img;
    this.w    = 0;
    this.h    = 0;
}



/**
 * 封装一下顶点属性集合
 * 以隔离地图和WebGL的细节
 */
function VAttribs(gl){
    this.gl = gl;
    this.attributes = {};
}

VAttribs.prototype = {
    constructor : VAttribs,

    persistence : function(){

        var ret = {};

        for(var a in this.attributes){
            var attrib = this.attributes[a];

            ret[a] = {
                        rawArray : attrib.rawArray,
                        size : attrib.size,
                        length : attrib.length,
                        normalized : attrib.normalized};
        }

        return ret;
    },

    addAttributeFlat : function(name, array, size, normalized){
        var gl = this.gl;
        var normal = normalized || false;

        var f32Array = new Float32Array(array);
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, f32Array, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.attributes[name] = {
                                    vbo : vbo,
                                    flatArray : array,
                                    size : size,
                                    length : array.length/size,
                                    normalized : normal
        };
    },

    addAttribute : function(name, array, size, normalized){
        var gl = this.gl;
        var normal = normalized || false;

        var vbo = gl.createBuffer();
        var f32Array = YFM.Math.flatten(array, size);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, f32Array, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.attributes[name] = {
                                    vbo : vbo,
                                    //rawArray : array,
                                    size : size,
                                    length : array.length,
                                    normalized : normal
        };
    },

    updateAttribute : function(name, array){

        var gl = this.gl;
        var attri = this.attributes[name];
        if(attri){
            var f32Array = YFM.Math.flatten(array, attri.size);
            gl.bindBuffer(gl.ARRAY_BUFFER, attri.vbo);
            gl.bufferData(gl.ARRAY_BUFFER, f32Array, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
   },
    
    getAttribute : function(name){
        return this.attributes[name];
    },

    /**
     * 释放vbo
     * 在实践中发现, 在不断循环绘制时, 直接释放有时会导致gl报错并出现闪烁
     * 而延迟两秒释放可以绕过此问题
     */
    recycle : function(){
        for(var a in this.attributes){
            var pending = this.attributes[a].vbo;
            var gl = this.gl;
            setTimeout(function(){
                gl.deleteBuffer(pending); 
            }, 2000);
        }
    }
}

