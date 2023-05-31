var fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        var result = event.target.result;
        convertAndDisplayModel(result);
    };

    reader.readAsArrayBuffer(file);
});

function convertAndDisplayModel(fileData) {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x697377); // Set the background color to grey
    document.body.appendChild(renderer.domElement);

    // Add OrbitControls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable smooth camera movement
    controls.dampingFactor = 0.05; // Set the damping factor for the controls

    var loader = new THREE.GLTFLoader();
    var dracoLoader = new THREE.DRACOLoader(); // Create an instance of DRACOLoader
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.131.2/examples/js/libs/draco/'); // Set the path to the Draco decoder
    var exporter = new THREE.GLTFExporter();

    loader.setDRACOLoader(dracoLoader); // Set the DRACOLoader instance on the GLTFLoader
    loader.parse(fileData, '', function (gltf) {
        scene.add(gltf.scene);
            
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light with intensity 1
        directionalLight.position.set(1, 1, 1); // Set the position of the light
        scene.add(directionalLight);

        // Convert to glTF
        exporter.parse(gltf.scene, function (result) {
            var gltfData = JSON.stringify(result, null, 2);
            console.log(gltfData);
        }, {
            binary: false, // Set to true for binary glTF (.glb)
            trs: false, // Set to true for glTF with transformed coordinates
            onlyVisible: true // Set to true to export only visible objects
        });
    }, undefined, function (error) {
        console.error(error);
    });

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Update the OrbitControls
        renderer.render(scene, camera);
    }
    
    animate();
}
