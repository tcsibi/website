/*------------------------------------------------------------------------------
Copyright (c) 2011 Antoine Santo Aka NoNameNo

This File is part of the CODEF project.

More info : http://codef.santo.fr
Demo gallery http://www.wab.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
------------------------------------------------------------------------------*/


function codef3D(dst, camZ, fov, near, far){

	this.renderer = new THREE.WebGLRenderer({ canvas: dst.canvas});
	this.renderer.setSize( dst.width, dst.height );
	this.renderer.autoClear=false;

	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera( fov, dst.width / dst.height, near, far );
	this.camera.position.z = camZ;
	this.scene.add( this.camera );

	this.group = new THREE.Object3D();
	this.scene.add( this.group );
	
	this.line=function(p1,p2, params){
		var geom = new THREE.Geometry();
		geom.vertices.push( new THREE.Vector3( p1.x, p1.y, p1.z ) );
		geom.vertices.push( new THREE.Vector3( p2.x, p2.y, p2.z ) );
		var line = new THREE.Line( geom,  params  );
		this.group.add(line );
	}
	
	this.lines=function(vertices, object, params){
		for(var i=0; i<object.length; i++){
			this.line(vertices[object[i].p1],vertices[object[i].p2], params);
		}
	}
	
	this.faces=function(vertices, object,doubleSided,overdraw){
		var geom = new THREE.Geometry(); 
		for(var i=0; i<vertices.length; i++){
			geom.vertices.push(new THREE.Vector3( vertices[i].x,  vertices[i].y,  vertices[i].z));

		}
		
		for(var i=0; i<object.length; i++){
			object[i].params.overdraw = overdraw;
			geom.materials.push(object[i].params);
			geom.faces.push( new THREE.Face3( object[i].p1,object[i].p2,object[i].p3, null, null,i ));
			if(typeof(object[i].v3)!='undefined'){
				geom.faceVertexUvs[ 0 ].push( [
						new THREE.UV( object[i].u1,object[i].v1 ),
						new THREE.UV( object[i].u2,object[i].v2 ),
						new THREE.UV( object[i].u3,object[i].v3)
					] );
			}
			
		}


		geom.computeFaceNormals();
		geom.computeCentroids();
		geom.computeVertexNormals();


		form = new THREE.Mesh( geom, new THREE.MeshFaceMaterial());
		form.doubleSided=doubleSided;
		this.group.add(form );

		
	}

	this.faces4=function(vertices, object,doubleSided,overdraw){
		var geom = new THREE.Geometry(); 
		for(var i=0; i<vertices.length; i++){
			geom.vertices.push(new THREE.Vector3( vertices[i].x,  vertices[i].y,  vertices[i].z));

		}
		
		for(var i=0; i<object.length; i++){
			object[i].params.overdraw = overdraw;
			geom.materials.push(object[i].params);
			geom.faces.push( new THREE.Face4( object[i].p1,object[i].p2,object[i].p3, object[i].p4, null, null,i ));
			if(typeof(object[i].v4)!='undefined'){
				geom.faceVertexUvs[ 0 ].push( [
						new THREE.UV( object[i].u1,object[i].v1 ),
						new THREE.UV( object[i].u2,object[i].v2 ),
						new THREE.UV( object[i].u3,object[i].v3 ),
						new THREE.UV( object[i].u4,object[i].v4 )
					] );
			}
			
		}


		geom.computeFaceNormals();
		geom.computeCentroids();
		geom.computeVertexNormals();


		form = new THREE.Mesh( geom, new THREE.MeshFaceMaterial());
		form.doubleSided=doubleSided;
		this.group.add(form );

		
	}
	

			
	
	this.addAmbiLight=function(color){
                this.scene.add( new THREE.AmbientLight( color ) );
        }

        this.addDirLight=function(x,y,z,color,intens){

		if(intens!='undefined')
	                var directionalLight = new THREE.DirectionalLight( color, intens );
		else
	                var directionalLight = new THREE.DirectionalLight( color );

                directionalLight.position.x = x;
                directionalLight.position.y = y;
                directionalLight.position.z = z;
                directionalLight.position.normalize();
                this.scene.add( directionalLight );
        }
        
        this.vectorball_dot=function(vertices){

		
		for(var i=0; i<vertices.length; i++){
			eval('plop=function ( context ){context.beginPath(); context.arc( 0, 0, '+vertices[i].size+', 0, Math.PI*2, true ); context.closePath();context.fill();}');
			var material = new THREE.ParticleCanvasMaterial( {
			color: vertices[i].color,
			program: plop
			} );
			
			var particle = new THREE.Particle( material );
			particle.position.x = vertices[i].x;
			particle.position.y = vertices[i].y;
			particle.position.z = vertices[i].z;
			this.group.add( particle );
		}
		
	}
	
	this.vectorball_img=function(vertices,img){
		
			var spriteMap = new THREE.TextureLoader().load('ball0.png');
			var spriteMaterial = new THREE.SpriteCanvasMaterial( { map: spriteMap, color: 0xffffff } );
		
		for(var i=0; i<vertices.length; i++){
			eval('plop=function ( context ){context.drawImage(img['+vertices[i].img+'].img,-'+img[vertices[i].img].img.width/2+',-'+img[vertices[i].img].img.height/2+');}');
			var material = new THREE.SpriteCanvasMaterial( {
			program: plop
			} );
			

			
			var particle = new THREE.Sprite( spriteMaterial );
			particle.position.x = 100 * vertices[i].x ;
			particle.position.y = 100 * vertices[i].y;
			particle.position.z = 100 * vertices[i].z;
			
			var width = 128;//spriteMaterial.map.image.width;
			var height = 128;//spriteMaterial.map.image.height;

			particle.scale.set( width, height, 1 );
			
			this.group.add( particle );
		}
		
	}

	
	
	this.draw=function(){
		this.renderer.render( this.scene, this.camera );
	}
}

var FlatShading=THREE.FlatShading;
var Texture = THREE.Texture;
var SmoothShading=THREE.SmoothShading;
var SphericalReflectionMapping=THREE.SphericalReflectionMapping;
var LineBasicMaterial=THREE.LineBasicMaterial;
var MeshBasicMaterial=THREE.MeshBasicMaterial;
var MeshLambertMaterial=THREE.MeshLambertMaterial;
