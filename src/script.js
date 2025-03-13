import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'



const textureloader = new THREE.TextureLoader();
const texture = textureloader.load('/textures/gradients/3.jpg')
/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const parameter = {
 color: '#ffeded',
 count :1000,
 size:0.03
}


const material = new THREE.MeshToonMaterial ({color: parameter.color,


} )
material.gradientMapmap = texture
texture.magFilter = THREE.NearestFilter


const distance = 4

/**
 * Test cube
 */
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60), material)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32), material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), 
material)
scene.add(mesh1 , mesh2 , mesh3)
const meshes =[mesh1 , mesh2 , mesh3]


mesh1.position.y =  - distance * 0
mesh2.position.y = -(distance * 1 )
mesh3.position.y = -(distance * 2 )

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

//particle

const position = new Float32Array(parameter.count * 3)

for (let i =0 ;i<parameter.count ;i++){

   const i3 = i *3
   
   position[i3]= (Math.random() - 0.5) *10
   position[i3 + 1] = distance * 0.5 -Math.random() * distance * 3
   position[i3 + 2] = (Math.random() - 0.5) *10 
}

const particlegeometry = new THREE.BufferGeometry()
particlegeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

const particlematerial = new THREE.PointsMaterial({
    size:parameter.size,
    sizeAttenuation:true
})
const particle = new THREE.Points(particlegeometry , particlematerial)
scene.add(particle)






const directionalLight = new THREE.DirectionalLight('#ffffff', 2 )
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)


gui.addColor(parameter, 'color').onChange(()=>{
     material.color.set(parameter.color  
     )
     particlematerial.color.set(parameter.color)
     
})
// gui.add(parameter, 'size').min(0.01).max(1).step(0.001).onFinishChange()
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
const camerabox = new THREE.Group()
scene.add(camerabox)
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
camerabox.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
        alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//scroll
let scrollY = window.scrollY
let currentsection = 0


window.addEventListener('scroll' ,()=>{
 
    scrollY = window.scrollY
    
    const newsection = Math.round(scrollY / sizes.height)

  if(newsection!=currentsection){

    currentsection = newsection

    gsap.to(
        meshes[currentsection].rotation,
        {
            duration:1.5,
            ease:'power2.inOut',
            x:'+=6',
            y:'+=3',
            z:'+=2'
        }
    )
       
  }


})



const cursor = {
    x:0,y:0
}

window.addEventListener('mousemove', (event)=>{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previoustime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
   
   const deltatime = elapsedTime - previoustime
   previoustime = elapsedTime



     for(const mesh of meshes){
        mesh.rotation.x += deltatime * 0.1
        mesh.rotation.y += deltatime * 0.12
     }


     //camera
   camera.position.y = - scrollY  / sizes.height * distance


  // paralaax
  const parallaxX = cursor.x * 0.5
  const parallaxY = -cursor.y * 0.5
  camerabox.position.x += (parallaxX - camerabox.position.x)  * 5 * deltatime
  camerabox.position.y += (parallaxY - camerabox.position.y) * 5 * deltatime


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()