import './style.css'
import * as THREE from 'three'
import * as lil from 'lil-gui'
import { TextureLoader } from 'three'
import gsap from 'gsap'
/**
 * Debug
 */
const gui = new lil.GUI()

const parameters = {
    materialColor: '#66717a'
}

/**
 * Textures
 */
    const textureLoader = new THREE.TextureLoader()
    const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
    gradientTexture.magFilter = THREE.NearestFilter
    /**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Material
const material = new THREE.MeshToonMaterial(
    { 
        color: parameters.materialColor,
        gradientMap: gradientTexture 
    })

const ObjectDistance = 4
// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = - ObjectDistance * 0
mesh2.position.y = - ObjectDistance * 1
mesh3.position.y = - ObjectDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2


scene.add(mesh1, mesh2, mesh3)




//lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Particles
 */


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
const cameraGroup = new THREE.Group()
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

scene.add(cameraGroup)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', ()=> {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if(newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration:1.5,
                ease:'power2.inOut',
                x:'+=6',
                y:'+=3',
                z: '+=1.5'
            }
        )
        console.log('changed', currentSection)
    }
})

console.log(scrollY)


const sectionMeshes = [mesh1,mesh2,mesh3]
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.height - 0.5
    cursor.y = event.clientY / sizes.width - 0.5

    console.log(cursor.x)
} )
/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)
for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = ObjectDistance * 0.5 - Math.random() * ObjectDistance * 3
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
//Material
    const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    //animate camera
    camera.position.y = -scrollY / sizes.height * ObjectDistance

    const parallaxX = cursor.x 
    const parallaxY = -cursor.y 

    cameraGroup.position.x = (parallaxX - cameraGroup.position.x) * 2 * deltaTime
    cameraGroup.position.y = (parallaxY - cameraGroup.position.y) * 2 * deltaTime


    //animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.2
        mesh.rotation.y += deltaTime * 0.12
    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()