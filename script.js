var scene, camera, renderer, controls;

var fileInput = document.getElementById('file-input');
var uploadButton = document.getElementById('upload-button');
uploadButton.addEventListener('click', function (event) {
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        var result = event.target.result;
        convertAndDisplayModel(result);
    };

    reader.readAsArrayBuffer(file);
});

function convertAndDisplayModel(fileData) {
    cleanup();

    var fileTypeSelect = document.getElementById('file-type-select');
    //var selectedFileType = fileTypeSelect.value;

    scene = new THREE.Scene();
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light with intensity 1
    directionalLight.position.set(1, 1, 1); // Set the position of the light
    scene.add(directionalLight);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x697377); // Set the background color to grey
    document.body.appendChild(renderer.domElement);

    // Add OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable smooth camera movement
    controls.dampingFactor = 0.05; // Set the damping factor for the controls

    /*
    if (selectedFileType=="stl"){
        // Load STL file using STLLoader
        var loader = new THREE.STLLoader();
        loader.load(fileData, function (geometry) {
            // Create THREE.js mesh using the loaded geometry
            var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            var mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        });
    }else{*/
        var loader = new THREE.GLTFLoader();
        var dracoLoader = new THREE.DRACOLoader(); // Create an instance of DRACOLoader
        dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.131.2/examples/js/libs/draco/'); // Set the path to the Draco decoder
        var exporter = new THREE.GLTFExporter();

        loader.setDRACOLoader(dracoLoader); // Set the DRACOLoader instance on the GLTFLoader
        loader.parse(fileData, '', function (gltf) {
            scene.add(gltf.scene);

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
    //}

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Update the OrbitControls
        renderer.render(scene, camera);
    }

    animate();
}

function cleanup() {
    if (renderer && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    }

    if (scene) {
        scene.dispose();
    }

    if (camera) {
        camera = null;
    }

    scene = null;
    renderer = null;
    controls = null;
}
