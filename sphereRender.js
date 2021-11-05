function render(
    ctx, 
    displayWidth,
    displayHeight,
    particleList,
    fLen,
    m,
    sphereCenterX,
    sphereCenterY,
    sphereCenterZ,
    particleRad,
    zeroAlphaDepth,
    rgbString,
    turnAngle,
    setTurnAngle,
    turnSpeed,
    frequencyArray
) {
    
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    turnAngle = (turnAngle + turnSpeed) % (2 * Math.PI);
    setTurnAngle(turnAngle)
    let sinAngle = Math.sin(turnAngle);
    let cosAngle = Math.cos(turnAngle);

    let p = particleList.first;
    let nextParticle = {}
    let counter = 0

    while (p != null) {
        nextParticle = p.next;

        // --------------------------------------------
        // Attempt to scale sphere based on max frequency of each frame

        // p.x = p.x * (Math.max(...frequencyArray) / 240)
        // p.y = p.y * (Math.max(...frequencyArray) / 240)
        // p.z = p.z * (Math.max(...frequencyArray) / 240)

        // --------------------------------------------
        // Attempt to offset particles prependicularly from orbit in correspondance with frequency

        // if (parseInt(p.age) % 20 === 0) {
        //     p.x = p.xInitial
        //     p.y = p.yInitial
        //     p.z = p.zInitial
        //     p.velX = 0.002*p.xInitial
        //     p.velY = 0.002*p.yInitial
        //     p.velZ = 0.002*p.zInitial
        // } else {
        //     p.velX += p.accelX + frequencyArray[counter] / 255;
        //     p.velY += p.accelY + frequencyArray[counter] / 255;
        //     p.velZ += p.accelZ + frequencyArray[counter] / 255;

        //     if (p.x > sphereCenterX) p.x += p.velX
        //     else if (p.x < sphereCenterX) p.x -= p.velX
            
        //     if (p.y > sphereCenterY) p.y -= p.velY
        //     else if (p.y < sphereCenterY) p.y += p.velY
            
        //     if (p.z > sphereCenterZ) p.z += p.velZ
        //     else if (p.z < sphereCenterZ) p.z -= p.velZ
        // }
        p.age++;

        let rotX = cosAngle*p.x + sinAngle*(p.z - sphereCenterZ);
        let rotZ = -sinAngle*p.x + cosAngle*(p.z - sphereCenterZ) + sphereCenterZ;
        m = fLen/(fLen - rotZ);
        p.projX = rotX*m + sphereCenterX;
        p.projY = p.y*m + sphereCenterY;

        ctx.fillStyle = rgbString + frequencyArray[counter] / 220 + ")";
        
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, m * particleRad, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        
        p = nextParticle;
        counter += 1
    }
}

export default render