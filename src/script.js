import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// Debug
const gui = new dat.GUI()

//texture loader
const textureLoader = new THREE.TextureLoader()
const matCapTexture = textureLoader.load('/matcaps/3.png')
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//axis helper 
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

//font loader
const fontLoader = new THREE.FontLoader()
    fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry =  new THREE.TextBufferGeometry(
            'Hello THREE.JS', 
            {
                font: font, 
                size: 0.5,
                height:0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5  // Subtract bevel thickness
        // )
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox)
       //gui.add('bevelSegments').min(0).max(100).step(1)
       textGeometry.center() 
       const textMaterial = new THREE.MeshMatcapMaterial({
            matcap: matCapTexture
        })
        
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
    }
)


const donutGeo = new THREE.TorusBufferGeometry(0.3,0.2,20,45)
const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matCapTexture})

for(let i = 0; i < 100; i++){
    const donut = new THREE.Mesh(donutGeo, donutMaterial)
    
donut.position.x = (Math.random() - 0.5) * 10
donut.position.y = (Math.random() - 0.5) * 10
donut.position.z = (Math.random() - 0.5) * 10

donut.rotation.x = Math.random() * Math.PI 
donut.rotation.y = Math.random() * Math.PI 
donut.rotation.z = Math.random() * Math.PI 

const scale = Math.random()
donut.scale.set(scale,scale,scale)

    scene.add(donut)
}

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.4)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()