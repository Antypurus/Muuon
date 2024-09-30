//import code from './shaders.wgsl.js'

export {}

if(!navigator.gpu)
{
    console.log("WebGPU Not Supported");
}

let adapter = await navigator.gpu.requestAdapter();
let device = await adapter?.requestDevice();
if(!device)
{
    console.log("WebGPU Device Coult Not Be Acquire");
}
else
{
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
if(!command_list)
{
    console.log("failed to create command list");
}

const renderpass = command_list.beginRenderPass({
    colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        loadOp: "clear",
        storeOp: "store",
    }]
});
renderpass.end();
