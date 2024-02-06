const preload = async () => {
    try {
        const font = await loadFont('https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json');
        const particle = await loadImage('https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png');

        const environment = new Environment(font, particle);
        environment.addImage();
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
	addImage() {
        const logoTexture = new THREE.TextureLoader().load('acm.png');
        const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture, side: THREE.DoubleSide });
        const logoSize = { width: 100, height: 45 }; // Initial size, adjust as needed
        const logoGeometry = new THREE.PlaneGeometry(logoSize.width, logoSize.height);

        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);

        // Update logo position and size on resize
        const updateLogo = () => {
            const aspectRatio = this.container.clientWidth / this.container.clientHeight;
            const targetWidth = this.container.clientWidth * 0.1; // Adjust as needed
            const targetHeight = targetWidth / aspectRatio;

            logoMesh.scale.set(targetWidth / logoSize.width, targetHeight / logoSize.height, 1);
            logoMesh.position.set(targetWidth-650, aspectRatio-200 , -350);
        };

        // Call the updateLogo function initially
        updateLogo();

        // Add the logo mesh to the scene
        this.scene.add(logoMesh);

        // Listen for window resize event
        window.addEventListener('resize', () => {
            updateLogo();
        });
    }



 
	createBackground() {
		const backgroundTexture = new THREE.TextureLoader().load('code.jpg', function(texture) {
			texture.encoding = THREE.sRGBEncoding;
		 
		});
	
		const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });
	
		// Adjust opacity or brightness as needed
		backgroundMaterial.opacity = 0.7; // Adjust the opacity level
		backgroundMaterial.transparent = true;
	
		const aspectRatio = window.innerWidth / window.innerHeight;
		const backgroundGeometry = new THREE.PlaneGeometry(2000 * aspectRatio, 2000);
		const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
		backgroundMesh.position.z = -1500;
		this.scene.add(backgroundMesh);
	}
	
	
	
	
  
	bindEvents(){
  
	  window.addEventListener( 'resize', this.onWindowResize.bind( this ));
	  
	}

	 createCamera() {
        this.camera = new THREE.PerspectiveCamera(65, this.container.clientWidth / this.container.clientHeight, 1, 10000);
        this.camera.position.set(0, 0, 1000); // Adjust the position based on your scene
    }
  
	setup(){ 
  
	  this.createParticles = new CreateParticles( this.scene, this.font,             this.particle, this.camera, this.renderer );
	}
  
	render() {
	  
	   this.createParticles.render()
	   this.renderer.render( this.scene, this.camera )
	}
  
	createCamera() {
  
	  this.camera = new THREE.PerspectiveCamera( 65, this.container.clientWidth /  this.container.clientHeight, 1, 10000 );
	  this.camera.position.set( 0,0, 100 );
  
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
			  amount: 1200,
			  particleSize: 1,
			  particleColor: 0xffffff,
			  textSize: 8,
			  area: 250,
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
		const futureDateStr = "2024 2 24 08 00 00"; // Replace this with the actual future date string
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
  
  
   