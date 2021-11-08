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
    turnAngle,
    setTurnAngle,
    turnSpeed,
    frequencyArray
) {
    const groupNum = 1024 / 3

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

        let r = 0;
        let g = 0;
        let b = 0;

        if (counter < groupNum / 2) {
            r = 247;
            g = 38;
            b = 132;
        } else if (counter < groupNum) {
            r = 76;
            g = 201;
            b = 240;
        } else if (counter < 3 * groupNum / 2) {
            r = 15;
            g = 255;
            b = 149;
        } else if (counter < 2 * groupNum) {
            r = 218;
            g = 191;
            b = 255;
        } else if (counter <= 5 * groupNum / 2) {
            r = 252;
            g = 255;
            b = 75;
        }
        let rgbString = "rgba(" + r + "," + g + "," + b + ",";

        ctx.fillStyle = rgbString + frequencyArray[counter] / 225 + ")";
        
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, m * particleRad * frequencyArray[counter] / 125, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        
        p = nextParticle;
        counter += 1
    }
}

export default render