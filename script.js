const preload = async () => {
    try {
        const font = await loadFont('https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json');
        const particle = await loadImage('https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png');

        const environment = new Environment(font, particle);
        environment.addRotatingImage();
    } catch (error) {
        console.error('Error loading resources:', error);
    } 
};

const loadFont = (url) => {
    return new Promise((resolve, reject) => {
        const loader = new THREE.FontLoader();
        loader.load(url, (font) => {
            resolve(font);
        }, undefined, reject);
    });
};

const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(url, (image) => {
            resolve(image);
        }, undefined, reject);
    });
};

document.addEventListener('DOMContentLoaded', preload);

  class Environment {
	constructor(font, particle) {
	  this.font = font;
	  this.particle = particle;
	  this.container = document.querySelector('#magic');
	  this.scene = new THREE.Scene();
	  this.createCamera();
	  this.createRenderer();
	  this.createBackground(); // Create and add the background here
	  this.setup();
	  this.bindEvents();
	}
	
	

	
	


 
	createBackground() {
		const video = document.createElement('video');
		video.src = 'acm.mp4';
		video.loop = true;
		video.muted = true;
		video.play(); // You need to play the video for autoplay
		video.addEventListener('error', (e) => {
			console.error('Error loading video:', e);
		});
		video.addEventListener('loadeddata', () => {
			const videoTexture = new THREE.VideoTexture(video);
			videoTexture.encoding = THREE.sRGBEncoding;
	
			// Adjust the width and height of the video here
			const videoWidth = 1920; // Specify the desired width
			const videoHeight = 1080; // Specify the desired height
	
			const backgroundGeometry = new THREE.PlaneGeometry(videoWidth, videoHeight);
			const backgroundMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
	
			this.backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
			this.scene.add(this.backgroundMesh); // Add the background mesh to the scene
		});
	
		// Append the video element to the DOM to trigger loading
		document.body.appendChild(video);
	}
	
	
	
	
	
	addRotatingImage() {
		// Load the texture
		const texture = new THREE.TextureLoader().load('acm.png');
	
		// Create a material with the texture and enable transparency
		const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
	
		// Create a geometry for the image
		const geometry = new THREE.PlaneGeometry(100, 100); // Adjust the size as needed
	
		// Create the mesh using the geometry and material
		const imageMesh = new THREE.Mesh(geometry, material);
	
		// Function to update the position of the image mesh
		const updateImagePosition = () => {
			// Calculate the position relative to the container's size
			const offsetX = -this.container.clientWidth / 2 + 250;
			const offsetY = -this.container.clientHeight / 2 + 150;
	
			// Position the mesh in the bottom left corner of the screen
			imageMesh.position.set(offsetX, offsetY, -500);
		};
	
		// Initial position update
		updateImagePosition();
	
		// Add the mesh to the scene
		this.scene.add(imageMesh);
	
		// Update the rotation and position of the image mesh in the animation loop
		let time = 0;
		this.renderer.setAnimationLoop(() => {
			// Rotate the image mesh
			imageMesh.rotation.y += 0.01; // Adjust rotation speed as needed
			
			// Apply a sine wave motion to the mesh's position along the y-axis
			const offsetY = Math.sin(time) * 10; // Adjust the amplitude (50 in this case)
			imageMesh.position.y = -this.container.clientHeight / 2 + 150 + offsetY;
			
			// Increase time for the next frame
			time += 0.05; // Adjust speed of the wave motion
	
			// Render the scene
			this.render();
		});
	
		// Listen for window resize events to update the position of the image mesh
		window.addEventListener('resize', updateImagePosition);
	}
	
	
  
	bindEvents(){
  
	  window.addEventListener( 'resize', this.onWindowResize.bind( this ));
	  
	}

	 
	setup(){ 
  
	  this.createParticles = new CreateParticles( this.scene, this.font,             this.particle, this.camera, this.renderer );
	}
  
	render() {
	  
	   this.createParticles.render()
	   this.renderer.render( this.scene, this.camera )
	}
  
	/*createCamera() {
  
	  this.camera = new THREE.PerspectiveCamera( 65, this.container.clientWidth /  this.container.clientHeight, 1, 10000 );
	  this.camera.position.set( 0,0, 100 );
  
	}*/

	createCamera() {
		// Adjust the camera parameters as needed
		const fov = 52;//38; // Field of view in degrees
		const aspectRatio = this.container.clientWidth / this.container.clientHeight;
		const near = 1; // Near clipping plane
		const far = 10000; // Far clipping plane
	
		this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
	
		// Adjust the position of the camera based on your scene
		this.camera.position.set(0, 0, 1000); // Example position, modify as needed
	}
	
  
	createRenderer() {
  
	  this.renderer = new THREE.WebGLRenderer();
	  this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
  
	  this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2));
  
	  this.renderer.outputEncoding = THREE.sRGBEncoding;
	  this.container.appendChild( this.renderer.domElement );
  
	  this.renderer.setAnimationLoop(() => { this.render() })
  
	}
  
	onWindowResize(){
  
	  this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
	  this.camera.updateProjectionMatrix();
	  this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
  
	} 
  }
  
  class CreateParticles {
	  
	  constructor( scene, font, particleImg, camera, renderer ) {
	  
		  this.scene = scene;
		  this.font = font;
		  this.particleImg = particleImg;
		  this.camera = camera;
		  this.renderer = renderer;
		  
		  this.raycaster = new THREE.Raycaster();
		  this.mouse = new THREE.Vector2(-200, 200);
		  
		  this.colorChange = new THREE.Color();
  
		  this.buttom = false;
  
		  //this.text= new Date().toLocaleString();
  
		  this.data = {
  
			  text: 'By the order of Peaky coders',
			  amount: 1900,
			  particleSize: 8,
			  particleColor: 0xffffff,
			  textSize: 55,
			  area: 1150,
			  ease: .2,
		  }
			   this.setup();
			  this.bindEvents();
	  
		   
		  this.intervalId = setInterval(() => {
			   // Call the method to update the text
			  this.setup();
			  this.bindEvents();
			  this.updateText();
		  }, 1000);
		   
	  }
	   
	   
	  updateText() {
		// Get the current date and time
		const currentDate = new Date();
	
		// Parse the future date string in the format "YYYY MM DD hour minute second"
		const futureDateStr = "2024 2 24 17 00 00"; // Replace this with the actual future date string
		const futureDateArr = futureDateStr.split(" ");
		const futureDate = new Date(
			parseInt(futureDateArr[0]),  // Year
			parseInt(futureDateArr[1]) - 1,  // Month (0-indexed)
			parseInt(futureDateArr[2]),  // Day
			parseInt(futureDateArr[3]),  // Hour
			parseInt(futureDateArr[4]),  // Minute
			parseInt(futureDateArr[5])   // Second
		);
	
		// Calculate the time difference in milliseconds
		const timeDifference = futureDate - currentDate;
	
		// Calculate days, hours, minutes, and seconds
		const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
		const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
	
		// Update the text with the time remaining
		this.data.text = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
	}
	  
	  
  
	  /*setup(){//this normal
  
		  const geometry = new THREE.PlaneGeometry( this.visibleWidthAtZDepth( 100, this.camera ), this.visibleHeightAtZDepth( 100, this.camera ));
		  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true } );
		  this.planeArea = new THREE.Mesh( geometry, material );
		  this.planeArea.visible = false;
		  this.createText();
  
	  }*/
	  
	  setup() {//time changes but animation is ...
		  // Clear existing particles
		  if (this.particles) {
			  this.scene.remove(this.particles);
			  this.particles.geometry.dispose();
			  this.particles.material.dispose();
			  this.particles = null;
		  }
	  
		  const geometry = new THREE.PlaneGeometry(
			  this.visibleWidthAtZDepth(100, this.camera),
			  this.visibleHeightAtZDepth(100, this.camera)
		  );
		  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true });
		  this.planeArea = new THREE.Mesh(geometry, material);
		  this.planeArea.visible = false;
	  
		  this.createText();
	  }
	  
  
	  bindEvents() {
  
		  document.addEventListener( 'mousedown', this.onMouseDown.bind( this ));
		  document.addEventListener( 'mousemove', this.onMouseMove.bind( this ));
		  document.addEventListener( 'mouseup', this.onMouseUp.bind( this ));
		  
	  }
  
	  onMouseDown(){
		  
		  this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
		  const vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 0.5);
		  vector.unproject( this.camera );
		  const dir = vector.sub( this.camera.position ).normalize();
		  const distance = - this.camera.position.z / dir.z;
		  this.currenPosition = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
		  
		  const pos = this.particles.geometry.attributes.position;
		  this.buttom = true;
		  this.data.ease = .01;
		  
	  }
  
	  onMouseUp(){
  
		  this.buttom = false;
		  this.data.ease = .05;
	  }
  
	  onMouseMove( ) { 
  
		  this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
	  }
  
	  render( level ){ 
  
		  const time = ((.001 * performance.now())%12)/12;
		  const zigzagTime = (1 + (Math.sin( time * 2 * Math.PI )))/6;
  
		  this.raycaster.setFromCamera( this.mouse, this.camera );
  
		  const intersects = this.raycaster.intersectObject( this.planeArea );
  
		  if ( intersects.length > 0 ) {
  
			  const pos = this.particles.geometry.attributes.position;
			  const copy = this.geometryCopy.attributes.position;
			  const coulors = this.particles.geometry.attributes.customColor;
			  const size = this.particles.geometry.attributes.size;
  
			  const mx = intersects[ 0 ].point.x;
			  const my = intersects[ 0 ].point.y;
			  const mz = intersects[ 0 ].point.z;
  
			  for ( var i = 0, l = pos.count; i < l; i++) {
  
				  const initX = copy.getX(i);
				  const initY = copy.getY(i);
				  const initZ = copy.getZ(i);
  
				  let px = pos.getX(i);
				  let py = pos.getY(i);
				  let pz = pos.getZ(i);
  
				  this.colorChange.setHSL( .5, 1 , 1 )
				  coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
				  coulors.needsUpdate = true;
  
				  size.array[ i ]  = this.data.particleSize;
				  size.needsUpdate = true;
  
				  let dx = mx - px;
				  let dy = my - py;
				  const dz = mz - pz;
  
				  const mouseDistance = this.distance( mx, my, px, py )
				  let d = ( dx = mx - px ) * dx + ( dy = my - py ) * dy;
				  const f = - this.data.area/d;
  
				  if( this.buttom ){ 
  
					  const t = Math.atan2( dy, dx );
					  px -= f * Math.cos( t );
					  py -= f * Math.sin( t );
  
					  this.colorChange.setHSL( .5 + zigzagTime, 1.0 , .5 )
					  coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
					  coulors.needsUpdate = true;
  
					  if ((px > (initX + 70)) || ( px < (initX - 70)) || (py > (initY + 70) || ( py < (initY - 70)))){
  
						  this.colorChange.setHSL( .15, 1.0 , .5 )
						  coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
						  coulors.needsUpdate = true;
  
					  }
  
				  }else{
				  
					  if( mouseDistance < this.data.area ){
  
						  if(i%5==0){
  
							  const t = Math.atan2( dy, dx );
							  px -= .03 * Math.cos( t );
							  py -= .03 * Math.sin( t );
  
							  this.colorChange.setHSL( .15 , 1.0 , .5 )
							  coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
							  coulors.needsUpdate = true;
  
							  size.array[ i ]  =  this.data.particleSize /1.2;
							  size.needsUpdate = true;
  
						  }else{
  
							  const t = Math.atan2( dy, dx );
							  px += f * Math.cos( t );
							  py += f * Math.sin( t );
  
							  pos.setXYZ( i, px, py, pz );
							  pos.needsUpdate = true;
  
							  size.array[ i ]  = this.data.particleSize * 1.3 ;
							  size.needsUpdate = true;
						  }
  
						  if ((px > (initX + 10)) || ( px < (initX - 10)) || (py > (initY + 10) || ( py < (initY - 10)))){
  
							  this.colorChange.setHSL( .15, 1.0 , .5 )
							  coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
							  coulors.needsUpdate = true;
  
							  size.array[ i ]  = this.data.particleSize /1.8;
							  size.needsUpdate = true;
  
						  }
					  }
  
				  }
  
				  px += ( initX  - px ) * this.data.ease;
				  py += ( initY  - py ) * this.data.ease;
				  pz += ( initZ  - pz ) * this.data.ease;
  
				  pos.setXYZ( i, px, py, pz );
				  pos.needsUpdate = true;
  
			  }
		  }
	  }
  
	  createText(){ 
  
		  let thePoints = [];
  
		  let shapes = this.font.generateShapes( this.data.text , this.data.textSize  );
		  let geometry = new THREE.ShapeGeometry( shapes );
		  geometry.computeBoundingBox();
	  
		  const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		  const yMid =  (geometry.boundingBox.max.y - geometry.boundingBox.min.y)/2.85;
  
		  geometry.center();
  
		  let holeShapes = [];
  
		  for ( let q = 0; q < shapes.length; q ++ ) {
  
			  let shape = shapes[ q ];
  
			  if ( shape.holes && shape.holes.length > 0 ) {
  
				  for ( let  j = 0; j < shape.holes.length; j ++ ) {
  
					  let  hole = shape.holes[ j ];
					  holeShapes.push( hole );
				  }
			  }
  
		  }
		  shapes.push.apply( shapes, holeShapes );
  
		  let colors = [];
		  let sizes = [];
					  
		  for ( let  x = 0; x < shapes.length; x ++ ) {
  
			  let shape = shapes[ x ];
  
			  const amountPoints = ( shape.type == 'Path') ? this.data.amount/2 : this.data.amount;
  
			  let points = shape.getSpacedPoints( amountPoints ) ;
  
			  points.forEach( ( element, z ) => {
						  
				  const a = new THREE.Vector3( element.x, element.y, 0 );
				  thePoints.push( a );
				  colors.push( this.colorChange.r, this.colorChange.g, this.colorChange.b);
				  sizes.push( 1 )
  
				  });
		  }
  
		  let geoParticles = new THREE.BufferGeometry().setFromPoints( thePoints );
		  geoParticles.translate( xMid, yMid, 0 );
				  
		  geoParticles.setAttribute( 'customColor', new THREE.Float32BufferAttribute( colors, 3 ) );
		  geoParticles.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1) );
  
		  const material = new THREE.ShaderMaterial({
			uniforms: { 
				color: { value: new THREE.Color(0xFFA500) },
				pointTexture: { value: this.particleImg },
				// Add an ambient light color and intensity
				ambientLightColor: { value: new THREE.Color(0x303030) },
				ambientLightIntensity: { value: 0.2 }, // Adjust this value as needed
			},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
	
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
		});
	
		this.particles = new THREE.Points(geoParticles, material);
		this.scene.add(this.particles);
	
		this.geometryCopy = new THREE.BufferGeometry();
		this.geometryCopy.copy(this.particles.geometry);
	}
  
	  visibleHeightAtZDepth ( depth, camera ) {
  
		const cameraOffset = camera.position.z;
		if ( depth < cameraOffset ) depth -= cameraOffset;
		else depth += cameraOffset;
  
		const vFOV = camera.fov * Math.PI / 180; 
  
		return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
	  }
  
	  visibleWidthAtZDepth( depth, camera ) {
  
		const height = this.visibleHeightAtZDepth( depth, camera );
		return height * camera.aspect;
  
	  }
  
	  distance (x1, y1, x2, y2){
		 
		  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
	  }
  }
  
  
   