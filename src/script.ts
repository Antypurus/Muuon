//import code from './shaders.wgsl.js'

export { }

if (!navigator.gpu) {
    console.log("WebGPU Not Supported");
}

let adapter = await navigator.gpu.requestAdapter();
let device = await adapter?.requestDevice();
if (!device) {
    console.log("WebGPU Device Coult Not Be Acquire");
}
else {
    console.log("WebGPU Device Acquired");
}

let canvas = document.querySelector("canvas");
let context = canvas.getContext("webgpu");
const swapchain_format = navigator.gpu.getPreferredCanvasFormat();
context.configure({
    device: device,
    format: swapchain_format,
});

const command_list = device.createCommandEncoder();
if (!command_list) {
    console.log("failed to create command list");
}


const vertices = new Float32Array([
    -1, -1,
    1, -1,
    0, 1
]);
const vertexBuffer = device.createBuffer({
    label: "Triangle Vertex Buffer",
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, vertices);
const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: 8,
    attributes: [{
        format: "float32x2",
        offset: 0,
        shaderLocation: 0,
    }],
};

const shaderModule = device.createShaderModule({
    label: "Cell Shader",
    code: `
    @group(0) @binding(0) var<uniform> grid: vec2f;

    @vertex
    fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
        return vec4f(pos / grid, 0, 1);
    }

    @fragment
    fn fragMain() -> @location(0) vec4f {
        return vec4f(1.0f);
    }
    `
});

const graphicsPipeline = device.createRenderPipeline({
    label: "Cell Pipeline",
    layout: "auto",
    vertex: {
        module: shaderModule,
        entryPoint: "vertexMain",
        buffers: [vertexBufferLayout],
    },
    fragment: {
        module: shaderModule,
        entryPoint: "fragMain",
        targets: [{
            format: swapchain_format,
        }]
    },
})

const GRID_SIZE = 5;
const uniformValueArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
const uniformBuffer = device.createBuffer({
    label: "uniform buffer",
    size: uniformValueArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(uniformBuffer, 0, uniformValueArray);

const bindGroup = device.createBindGroup({
    label: "cell shader bind group",
    layout: graphicsPipeline.getBindGroupLayout(0),
    entries: [{
        binding: 0,
        resource: {
            buffer: uniformBuffer
        },
    }],
});

const renderpass = command_list.beginRenderPass({
    colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        loadOp: "clear",
        storeOp: "store",
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
    }]
});

renderpass.setPipeline(graphicsPipeline);
renderpass.setVertexBuffer(0, vertexBuffer);
renderpass.setBindGroup(0, bindGroup);
renderpass.draw(vertices.length / 2);

renderpass.end();
device.queue.submit([command_list.finish()]);
