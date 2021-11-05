export default function render(ctx, frequencyArray, centerX, centerY, radius, renderCount, incrementRenderCount) {
    const velocityX = renderCount / 2;
    const velocityY = 0
    const velocityZ = 0
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0,centerX * 2, centerY * 2);
    radius = radius * (Math.max(...frequencyArray) / 240)
    frequencyArray.forEach((item, i) => {
        let theta = Math.random() * 2 * Math.PI;
        let phi = Math.acos(Math.random()*2-1);
        let x0 = centerX + radius * Math.sin(phi) * Math.cos(theta) + velocityX;
        let y0 = centerY + radius * Math.sin(phi) * Math.sin(theta) + velocityY;
        let z0 = radius * Math.cos(phi) + velocityZ;
        let centerZ = -3 - radius 
        let turnSpeed = 2 * Math.PI / 1600; //the sphere will rotate at this speed (one complete rotation every 1600 frames).
        let turnAngle = (0 + turnSpeed) % (2 * Math.PI);
        let sinAngle = Math.sin(turnAngle);
        let cosAngle = Math.cos(turnAngle);
        let rotX = cosAngle * x0 + sinAngle * (z0 - centerZ);
        let rotZ = -sinAngle * x0 + cosAngle * (z0 - centerZ) + centerZ;
        let m = 320 / (320 - rotZ);
        let zeroAlphaDepth = -750; 
        let r = 100;
        let g = 100;
        let b = 100;

        if (item < 80) r = 250;
        else if (item >= 80 && item < 150) g = 250;
        else b = 250;
        let rgbString = "rgba(" + r + "," + g + "," + b + ",";

        let depthAlphaFactor = (1 - rotZ / zeroAlphaDepth);
        depthAlphaFactor = (depthAlphaFactor > 1) ? 1 : ((depthAlphaFactor<0) ? 0 : depthAlphaFactor);
        ctx.fillStyle = rgbString + depthAlphaFactor * Math.random(1) + ")";
        
        ctx.beginPath();
        ctx.arc(x0 + (item / 20), y0 + (item / 20), m * item * radius / 16000, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    })
    incrementRenderCount()
}