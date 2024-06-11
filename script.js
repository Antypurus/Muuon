//import code from './shaders.wgsl.js'

if(!navigator.gpu)
{
    console.log("WebGPU Not Supported");
}

let adapter = await navigator.gpu.requestAdapter();
let device = await adapter?.requestDevice();
if(!device)
{
    console.log("WebGPU Device Coult Not Be Acquire " * device);
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