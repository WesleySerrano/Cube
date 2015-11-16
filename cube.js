/**
 * Created by Wesley on 01/11/2015.
 */

var gl;
var vertices;
var program;

var rotationAngle = 0;
var uniformModelViewLocation;
var uniformProjectionLocation;
var uniformRotationLocation;
var uniformLineFlagLocation;

var perspectiveMatrix;
var orthoMatrix;

var cubeRotationAngles = [0,0,0];
var cubeCurrentRotationAxis = 1;
var uniformCubeRotationLocation;

function worldRotateX()
{
    cubeCurrentRotationAxis = 0;
}

function worldRotateY()
{
    cubeCurrentRotationAxis = 1;
}

function worldRotateZ()
{
    cubeCurrentRotationAxis = 2;
}

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices =
        [
        /***Face 1***/
            0.5,0.5,0.5,
            0.5,-0.5,0.5,
            0.5,-0.5,-0.5,

            0.5,-0.5,-0.5,
            0.5,0.5,-0.5,
            0.5,0.5,0.5,
            /************/

        /***Face 2***/
            0.5,0.5,0.5,
            -0.5,0.5,-0.5,
            -0.5,0.5,0.5,

            0.5,0.5,0.5,
            0.5,0.5,-0.5,
            -0.5,0.5,-0.5,
            /************/

        /***Face 3***/
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,

            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            /************/


        /***Face 4***/
            -0.5,0.5,0.5,
            -0.5,-0.5,0.5,
            -0.5,-0.5,-0.5,

            -0.5,-0.5,-0.5,
            -0.5,0.5,-0.5,
            -0.5,0.5,0.5,
            /************/

        /***Face 5***/
            0.5,-0.5,0.5,
            -0.5,-0.5,-0.5,
            -0.5,-0.5,0.5,

            0.5,-0.5,0.5,
            0.5,-0.5,-0.5,
            -0.5,-0.5,-0.5,
            /************/

        /***Face 6***/
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,

            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5
            /************/

        ];


    var generatedColors = [
        1.0,  0.0,  0.0,  1.0,    // red
        1.0,  0.0,  0.0,  1.0,    // red
        1.0,  0.0,  0.0,  1.0,    // red

        1.0,  0.0,  0.0,  1.0,    // red
        1.0,  0.0,  0.0,  1.0,    // red
        1.0,  0.0,  0.0,  1.0,    // red

        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  1.0,  0.0,  1.0,    // green

        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  1.0,  0.0,  1.0,    // green

        0.0,  0.0,  1.0,  1.0,     // blue
        0.0,  0.0,  1.0,  1.0,     // blue
        0.0,  0.0,  1.0,  1.0,     // blue

        0.0,  0.0,  1.0,  1.0,     // blue
        0.0,  0.0,  1.0,  1.0,     // blue
        0.0,  0.0,  1.0,  1.0,     // blue

        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  1.0,  1.0,  1.0,    // white

        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  1.0,  1.0,  1.0,    // white

        1.0,  0.65,  0.0,  1.0,    // orange
        1.0,  0.65,  0.0,  1.0,    // orange
        1.0,  0.65,  0.0,  1.0,    // orange

        1.0,  0.65,  0.0,  1.0,    // orange
        1.0,  0.65,  0.0,  1.0,    // orange
        1.0,  0.65,  0.0,  1.0,    // orange

        1.0,  1.0,  0.0,  1.0,    // yellow
        1.0,  1.0,  0.0,  1.0,    // yellow
        1.0,  1.0,  0.0,  1.0,    // yellow

        1.0,  1.0,  0.0,  1.0,    // yellow
        1.0,  1.0,  0.0,  1.0,    // yellow
        1.0,  1.0,  0.0,  1.0     // yellow
    ];

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    // Load the data into the GPU
    uniformModelViewLocation = gl.getUniformLocation(program, "modelViewMatrix");
    uniformProjectionLocation = gl.getUniformLocation(program, "projectionMatrix");
    uniformRotationLocation = gl.getUniformLocation(program, "rotationMatrix");
    uniformCubeRotationLocation = gl.getUniformLocation(program, "cubeRotation");

    var verticesBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, verticesBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var verticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(generatedColors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "attributeVColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    uniformLineFlagLocation = gl.getUniformLocation(program, "lines");

    var eye = vec3(0,1,6);
    var at = vec3(0,0,1);
    var up = vec3(0,1,0);
    var modelViewMatrix = lookAt(eye,at,up);

    var aspectRatio = canvas.width/canvas.height;
    perspectiveMatrix = perspective( 30.0, aspectRatio, 1.0, 1000.0 );
    orthoMatrix = ortho(-2, 2, -2, 2, -100, 100);

    changeProjection();
    gl.uniformMatrix4fv(uniformModelViewLocation, false, flatten(modelViewMatrix));

    renderCube();
};

function changeProjection()
{
    var perspectiveFlag = document.getElementById("perspectiveCheckBox").checked;
    var projectionMatrix;

    if(perspectiveFlag)
    {
       projectionMatrix = perspectiveMatrix;
    }
    else
    {
       projectionMatrix = orthoMatrix;
    }
    gl.uniformMatrix4fv(uniformProjectionLocation, false, flatten(projectionMatrix));
}

function renderCube() {
    window.requestAnimationFrame(renderCube);

    var verticesBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.uniform1i(uniformLineFlagLocation, 0);

    var worldRotationFlag = document.getElementById("worldRotationCheckBox").checked;

    var rotationZ = rotate(rotationAngle, [0, 1, 0]);

    if (worldRotationFlag)
    {
        rotationAngle += 0.5;
        if (rotationAngle >= 360) rotationAngle = 0;
    }

    var rotationMatrix = rotationZ;
    gl.uniformMatrix4fv(uniformRotationLocation, false, flatten(rotationMatrix));

    var cubeRotationX = rotate(cubeRotationAngles[0],[1,0,0]);
    var cubeRotationY = rotate(cubeRotationAngles[1],[0,1,0]);
    var cubeRotationZ = rotate(cubeRotationAngles[2],[0,0,1]);
    cubeRotationAngles[cubeCurrentRotationAxis] += 0.25;

    var cubeRotation = mult(cubeRotationY,cubeRotationZ);
    cubeRotation = mult(cubeRotationX,cubeRotation);
    gl.uniformMatrix4fv(uniformCubeRotationLocation, false, flatten(cubeRotation));

    gl.clear( gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays( gl.TRIANGLES, 0, vertices.length/3);

    renderLines();
}

function renderLines()
{
    var linesVertices =
        [
            0.165,0.5,0.5, //0
            -0.165,0.5,0.5, //1

            0.165,-0.5,0.5, //2
            -0.165,-0.5,0.5, //3

            0.5,0.165,0.5, //4
            0.5,-0.165,0.5, //5

            -0.5,0.165,0.5, //6
            -0.5,-0.165,0.5, //7

            0.165,0.5,-0.5, //8
            -0.165,0.5,-0.5, //9

            0.165,-0.5,-0.5, //10
            -0.165,-0.5,-0.5, //11

            0.5,0.165,-0.5, //12
            0.5,-0.165,-0.5, //13

            -0.5,0.165,-0.5, //14
            -0.5,-0.165,-0.5, //15

            -0.5,-0.5,0.165, //16
            -0.5,0.5,0.165, //17
            0.5,-0.5,0.165, //18
            0.5,0.5,0.165, //19

            -0.5,-0.5,-0.165, //20
            -0.5,0.5,-0.165, //21
            0.5,-0.5,-0.165, //22
            0.5,0.5,-0.165, //23

            0.0,0.0,0.0, //24
            1.0,0.0,0.0, //25
            0.0,1.0,0.0, //26
            0.0,0.0,1.0, //27


            1.0,-0.5,-100, //28
            1.0,-0.5,100, //29

            -1.0,-0.5,-100, //30
            -1.0,-0.5,100, //31
        ];

    var linesIndices = new Uint16Array(
        [
          0,2,
          1,3,
          4,6,
          5,7,
          8,10,
          9,11,
          12,14,
          13,15,

          0,8,
          1,9,
          2,10,
          3,11,
          4,12,
          5,13,
          6,14,
          7,15,

          16,17,
          18,19,
          20,21,
          22,23,
          16,18,
          17,19,
          20,22,
          21,23,

          24,25,
          24,26,
          24,27,

          28,29,
          30,31
        ]);


    gl.uniform1i(uniformLineFlagLocation, 1);

    var verticesBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, verticesBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(linesVertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var elementsBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementsBufferId );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER,linesIndices, gl.STATIC_DRAW );

    gl.drawElements(gl.LINES, linesIndices.length, gl.UNSIGNED_SHORT, 0);
}