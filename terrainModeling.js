/** @author lmarlow2
 *  @date 10/12/17
 */
var zMaxDecay = 0.4;
var zMinDecay = 0.2;

/**
 * Iteratively generate terrain from numeric inputs
 * @param {number} n
 * @param {number} minX Minimum X value
 * @param {number} maxX Maximum X value
 * @param {number} minY Minimum Y value
 * @param {number} maxY Maximum Y value
 * @param {Array} vertexArray Array that will contain vertices generated
 * @param {Array} faceArray Array that will contain faces generated
 * @param {Array} normalArray Array that will contain normals generated
 * @param (Array) colorArray Array that will contain colors generated
 * @return {number}
 */
function terrainFromIteration(n, minX, maxX, minY, maxY, vertexArray, faceArray, normalArray, colorArray){
    var deltaX = (maxX - minX)/n;
    var deltaY = (maxY - minY)/n;
	var heightMap = generateHeightMap(n, -0.5, -0.3, 0.1, 0.25, -1, 1);
    for(var i = 0; i <= n; i++){
       for(var j = 0; j <= n; j++){
		   var h = heightMap[i * (n + 1) + j];
           vertexArray.push(minX + deltaX * j);
           vertexArray.push(minY + deltaY * i);
           vertexArray.push(h);
		   
           //console.log(i,"*",n+1,"+",j,"=",i*(n+1)+j);
		   
           normalArray.push(0);
           normalArray.push(1);
           normalArray.push(0);
		   
		   var c = generateColors(h);
		   colorArray.push(c[0]);
		   colorArray.push(c[1]);
		   colorArray.push(c[2]);
		   colorArray.push(c[3]);
		}
	}
	
	recalculateNormals(vertexArray, normalArray);
	
    var numT = 0;
    for(var i = 0; i < n; i++){
       for(var j = 0; j < n; j++){
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid + 1);
           faceArray.push(vid + n + 1);
           
           faceArray.push(vid + 1);
           faceArray.push(vid + 1 + n + 1);
           faceArray.push(vid + n + 1);
           numT += 2;
        }
	}
    return numT;
}

/**
 * Generates colors based upon the given height
 * @param (number) height the height of the vertex to generate the color of
 * @return (Array) the RGBA color of the vertex based upon its height
 */
function generateColors(height){
	if(height > 0.6) return [1, 1, 1, 1]; //snow capped mountains
	
	if(height > 0.2 && height <= .6) return [0.48, 0.48, 0.48, 1]; //mountain grey
	
	if(height <= 0.2 && height >= -0.2) return [0.1333, 0.5451, 0.1333, 1]; //forest green
	
	if(height >= -0.4 && height < -0.2) return [0.34, 0.23, 0.047, 1]; //dirt brown
	
	if(height < -0.4) return [0, 0.467, 0.745, 0.3]; //ocean blue
}

/**
 * Calculates the normal for each vertex
 * @param (Array) vertex Array of vertices to find normals for
 * @param (Array) normal the array to store the normals in
 */
function recalculateNormals(vertex, normal){
	for(var i = 0; i + 8 <= vertex.length; i += 3){
		var x1 = vertex[i + 3] - vertex[i];
		var y1 = vertex[i + 4] - vertex[i + 1];
		var z1 = vertex[i + 5] - vertex[i + 2];
		var x2 = vertex[i + 6] - vertex[i];
		var y2 = vertex[i + 7] - vertex[i + 1];
		var z2 = vertex[i + 8] - vertex[i + 2];
		var v1 = vec3.fromValues(x1, y1, z1);
		var v2 = vec3.fromValues(x2, y2, z2);
		var v3 = vec3.create();
		vec3.cross(v3, v1, v2);
		vec3.normalize(v3,v3);
		var v4 = vec3.fromValues(normal[i], normal[i + 1], normal[1 + 2]);
		vec3.add(v3, v3, v4);
		vec3.normalize(v3,v3);
		normal[i] = v3[0];
		normal[i + 1] = v3[1];
		normal[i + 2] = v3[2];
		v4 = vec3.fromValues(normal[i + 3], normal[i + 4], normal[1 + 5]);
		vec3.add(v3, v3, v4);
		vec3.normalize(v3,v3);
		normal[i + 3] = v3[0];
		normal[i + 4] = v3[1];
		normal[i + 5] = v3[2];
		v4 = vec3.fromValues(normal[i + 3], normal[i + 4], normal[1 + 5]);
		vec3.add(v3, v3, v4);
		vec3.normalize(v3,v3);
		normal[i + 6] = v3[0];
		normal[i + 7] = v3[1];
		normal[i + 8] = v3[2];
	}
	var x1 = vertex[vertex.length - 6] - vertex[vertex.length - 3];
	var y1 = vertex[vertex.length - 5] - vertex[vertex.length - 2];
	var z1 = vertex[vertex.length - 4] - vertex[vertex.length - 1];
	var x2 = vertex[vertex.length - 9] - vertex[vertex.length - 3];
	var y2 = vertex[vertex.length - 8] - vertex[vertex.length - 2];
	var z2 = vertex[vertex.length - 7] - vertex[vertex.length - 1];
	var v1 = vec3.fromValues(x1, y1, z1);
	var v2 = vec3.fromValues(x2, y2, z2);
	var v3 = vec3.create();
	var v4 = vec3.fromValues(normal[vertex.length - 3], normal[vertex.length - 2], normal[vertex.length - 1]);
	vec3.cross(v3, v1, v2);
	vec3.normalize(v3, v3);
	vec3.add(v3, v3, v4);
	vec3.normalize(v3,v3);
	normal[vertex.length - 3] = v3[0];
	normal[vertex.length - 2] = v3[1];
	normal[vertex.length - 1] = v3[2];
	v4 = vec3.fromValues(normal[vertex.length - 6], normal[vertex.length - 5], normal[vertex.length - 4]);
	vec3.add(v3, v3, v4);
	vec3.normalize(v3,v3);
	normal[vertex.length - 6] = v3[0];
	normal[vertex.length - 5] = v3[1];
	normal[vertex.length - 4] = v3[2];
	v4 = vec3.fromValues(normal[vertex.length - 9], normal[vertex.length - 8], normal[vertex.length - 7]);
	vec3.add(v3, v3, v4);
	vec3.normalize(v3,v3);
	normal[vertex.length - 9] = v3[0];
	normal[vertex.length - 8] = v3[1];
	normal[vertex.length - 7] = v3[2];
	
	x1 = vertex[vertex.length - 9] - vertex[vertex.length - 6];
	y1 = vertex[vertex.length - 8] - vertex[vertex.length - 5];
	z1 = vertex[vertex.length - 7] - vertex[vertex.length - 4];
	x2 = vertex[vertex.length - 12] - vertex[vertex.length - 6];
	y2 = vertex[vertex.length - 11] - vertex[vertex.length - 5];
	z2 = vertex[vertex.length - 10] - vertex[vertex.length - 4];
	v1 = vec3.fromValues(x1, y1, z1);
	v2 = vec3.fromValues(x2, y2, z2);
	v3 = vec3.create();
	vec3.cross(v3, v1, v2);
	vec3.normalize(v3, v3);
	v4 = vec3.fromValues(normal[vertex.length - 6], normal[vertex.length - 5], normal[vertex.length - 4]);
	vec3.add(v3, v3, v4);
	vec3.normalize(v3,v3);
	normal[vertex.length - 6] += v3[0];
	normal[vertex.length - 5] += v3[1];
	normal[vertex.length - 4] += v3[2];
	v4 = vec3.fromValues(normal[vertex.length - 9], normal[vertex.length - 8], normal[vertex.length - 7]);
	vec3.add(v3, v3, v4);
	vec3.normalize(v3,v3);
	normal[vertex.length - 9] += v3[0];
	normal[vertex.length - 8] += v3[1];
	normal[vertex.length - 7] += v3[2];
	v4 = vec3.fromValues(normal[vertex.length - 12], normal[vertex.length - 11], normal[vertex.length - 10]);
	vec3.add(v3, v3, v4);
	vec3.normalize(v3,v3);
	normal[vertex.length - 12] += v3[0];
	normal[vertex.length - 11] += v3[1];
	normal[vertex.length - 10] += v3[2];
}

/**
 * Generates line values from faces in faceArray
 * @param {Array} faceArray array of faces for triangles
 * @param {Array} lineArray array of normals for triangles, storage location after generation
 */
function generateLinesFromIndexedTriangles(faceArray,lineArray){
    numTris = faceArray.length/3;
    for(var f = 0;f < numTris;f++){
        var fid = f * 3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid + 1]);
        
        lineArray.push(faceArray[fid + 1]);
        lineArray.push(faceArray[fid + 2]);
        
        lineArray.push(faceArray[fid + 2]);
        lineArray.push(faceArray[fid]);
    }
}

/**
 * Calculates the mean of an array of numbers
 * @param (Array) a the array of integers to find the mean of
 * @return (number) the mean of the values of the passed in array
 */
function calculateAverage(a){
	var i = 0;
	var s = 0;
	for(; i < a.length; i++)
		s += a[i]
	if(i == 0) return 0;
	return s/i;
}

/**
 * Returns an array containing the heights of the vertices in a square of dimensions 2 * radius x 2 * radius with the vertex at the given index at it's center
 * @param (number) index the index of the vertex to find the square around
 * @param (number) rad the radius of the square to find
 * @param (Array) array the height map used to return the values from
 * @param (number) n the value of n used for the vertex array where the array is of size (2^n)+1 x (2^n)+1
 * @param (Array) pos holds the indices of the returned heights; used for finding the set of vertices to be processed next
 * @return (Array) the heights of the vertices of the square around the center vertex at the given index
 */
function getSquare(index, rad, array, n, pos){
	var r = [];
	var radius = Math.floor(rad);
	var x = index % (n + 1);
	var y = Math.floor(index / (n + 1));
	var t = (x + radius) * (n + 1) + y - radius;
	if(t > 0 && t < array.length && x + radius <= n && y - radius >= 0){
		r.push(array[t]);
		pos.push(t);
	}
	t = (x + radius) * (n + 1) + y + radius;
	if(t > 0 && t < array.length && x + radius <= n && y + radius <= n){
		r.push(array[t]);
		pos.push(t);
	}
	t = (x - radius) * (n + 1) + y - radius;
	if(t > 0 && t < array.length && x - radius >= 0 && y - radius >= 0){
		r.push(array[t]);
		pos.push(t);
	}
	t = (x - radius) * (n + 1) + y + radius;
	if(t > 0 && t < array.length && x - radius >= 0 && y + radius <= n){
		r.push(array[t]);
		pos.push(t);
	}
	return r;
}
	
/**
 * Returns an array containing the heights of the vertices in a diamond of dimensions 2 * radius x 2 * radius with the vertex at the given index at it's center
 * @param (number) index the index of the vertex to find the diamond around
 * @param (number) rad the radius of the diamond to find
 * @param (Array) array the height map used to return the values from
 * @param (number) n the value of n used for the vertex array where the array is of size (2^n)+1 x (2^n)+1
 * @param (Array) pos holds the indices of the returned heights; used for finding the set of vertices to be processed next
 * @return (Array) the heights of the vertices of the diamond around the center vertex at the given index
 */
function getDiamond(index, rad, array, n, pos){
	var r = [];
	var radius = Math.floor(rad);
	var x = index % (n + 1);
	var y = Math.floor(index / (n + 1));
	var t = (x + radius) * (n + 1) + y;
	if(t > 0 && t < array.length && x + radius <= n){
		r.push(array[t]);
		pos.push(t);
	}
	t = (x) * (n + 1) + y + radius;
	if(t > 0 && t < array.length && y + radius <= n){
		r.push(array[t]);
		pos.push(t);
	}
	t = (x - radius) * (n + 1) + y;
	if(t > 0 && t < array.length && x - radius >= 0){
		r.push(array[t]);
		pos.push(t);
	}
	t = (x) * (n + 1) + y - radius;
	if(t > 0 && t < array.length && y - radius >= 0){
		r.push(array[t]);
		pos.push(t);
	}
	return r;
}

/**
 * Generates the height map for the terrain using the square diamond method
 * @param (number) n the value of n used for the vertex array where the array is of size (2^n)+1 x (2^n)+1
 * @param (number) seed0 the initial height of the 0 index of the height map which corresponds to the first corner
 * @param (number) seed1 the initial height of the (2^n) index of the height map which corresponds to the second corner
 * @param (number) seed2 the initial height of the (((2^n)+1)^2-(2^n)-1) index of the height map which corresponds to the third corner
 * @param (number) seed3 the initial height of the (((2^n)+1)^2)-1) index of the height map which corresponds to the fourth corner
 * @param (number) minZ the minimum height for the vertexes
 * @param (number) maxZ the maximum height for the 
 * @return (Array) a height map of size (2^n)+1 x (2^n)+1
 */
function generateHeightMap(n, seed0, seed1, seed2, seed3, minZ, maxZ){
	var r = []; //array of heights to be returned
	var todo = []; //array of vertices being processed
	var radius = n/2 //distance between the current vertex and previous/next vertices
	var past = []; //previously processed vertices used to calculate heights
	var next = []; //array of the next vertices to be processed
	dsFlag = 1; //flag used to switch between square and diamond steps: 1 - diamonds, 0 - squares
	
	for(var i = 0; i < (n + 1) * (n + 1); i++) r.push(0); //initialize array with zeroes
	
	//set corners to seed values
	r[0] = seed0;
	r[n] = seed1;
	r[(n + 1) * (n + 1) - n - 1] = seed2;
	r[(n + 1) * (n + 1) - 1] = seed3;
	
	todo.push(0);
	todo.push(n);
	todo.push((n + 1) * (n + 1) - n - 1);
	todo.push((n + 1) * (n + 1) - 1);
	todo.push(n * radius + n); //push the center vertex into the todo queue
	
	//process vertices
	for(var i = 4; i < todo.length;){
		if(dsFlag){
			//process all diamond steps in the todo queue
			for(; i < todo.length; i++){
				r[todo[i]] = calculateAverage(getSquare(todo[i], radius, r, n, past)) + (Math.random() * (maxZ - minZ) + minZ); //calculate vertex height
				getDiamond(todo[i], radius, r, n, next); //find next vertices
			}
			for(var j = 0; j < next.length; j++){
				if(!todo.includes(next[j]))
					todo.push(next[j]); //add all next vertices to the todo queue
				//else console.log("Attempted to add duplicate vertex!");
			}
			dsFlag = 0; //switch from diamonds to squares
			radius = radius/2; //cut the radius in half
			minZ *= zMinDecay; //reduce minimum Z
			maxZ *= zMaxDecay; //reduce maximum Z
		} else{
			//process all square steps in the todo queue
			for(; i < todo.length; i++){
				r[todo[i]] = calculateAverage(getDiamond(todo[i], radius * 2, r, n, past)) + (Math.random() * (maxZ - minZ) + minZ); //calculate vertex height
				getSquare(todo[i], radius, r, n, next); //find next vertices
			}
			for(var j = 0; j < next.length; j++){
				if(!todo.includes(next[j]))
					todo.push(next[j]); //add all next vertices to the todo queue
				//else console.log("Attempted to add duplicate vertex!");
			}
			dsFlag = 1; //switch from squares to diamonds
		}
	}
	return r; //return the height map
}
