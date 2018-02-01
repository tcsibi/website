

		

			var cs_camera, cs_scene, cs_renderer;



			function cs_init() {

				var geometry, material, mesh;

				var size = 150;

				cs_camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2000 );
				cs_camera.position.z = 800;

				cs_scene = new THREE.Scene();

				//

				geometry = new THREE.BoxGeometry( size, size, size );
				material = new THREE.MeshBasicMaterial( { wireframe: true } );

				mesh = new THREE.Mesh( geometry, material );
				mesh.position.x = -150;
				cs_scene.add( mesh );

				geometry = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry( size / 2, 32, 16 ) );

				setupAttributes( geometry );

				material = new THREE.ShaderMaterial( {
					uniforms: {},
					vertexShader: document.getElementById( 'vertexShader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentShader' ).textContent
				} );

				material.extensions.derivatives = true;

				mesh = new THREE.Mesh( geometry, material );
				mesh.position.x = -150;
				cs_scene.add( mesh );

				// renderer

				cs_renderer = new THREE.WebGLRenderer( { antialias: true } );
				//cs_renderer.setPixelRatio( window.devicePixelRatio );
				cs_renderer.setSize(640,480);
				//document.body.appendChild( renderer.domElement );


			}

			function setupAttributes( geometry ) {

				// TODO: Bring back quads

				var vectors = [
					new THREE.Vector3( 1, 0, 0 ),
					new THREE.Vector3( 0, 1, 0 ),
					new THREE.Vector3( 0, 0, 1 )
				];

				var position = geometry.attributes.position;
				var centers = new Float32Array( position.count * 3 );

				for ( var i = 0, l = position.count; i < l; i ++ ) {

					vectors[ i % 3 ].toArray( centers, i * 3 );

				}

				geometry.addAttribute( 'center', new THREE.BufferAttribute( centers, 3 ) );

			}




			function cs_animate() {

				for ( var i = 0; i < cs_scene.children.length; i ++ ) {

					var object = cs_scene.children[ i ];
					object.rotation.x += 0.005;
					object.rotation.y += 0.01;

				}

				cs_renderer.render( cs_scene, cs_camera );
				
				mycanvas.contex.drawImage(cs_renderer.domElement,0,0);

			}

		

