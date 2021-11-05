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
    // radiusOffset
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

        p.age++;
        // p.x *= radiusOffset
        // p.y *= radiusOffset
        // p.z *= radiusOffset
        // p.x += frequencyArray[counter] / 50

        let rotX = cosAngle*p.x + sinAngle*(p.z - sphereCenterZ);
        let rotZ = -sinAngle*p.x + cosAngle*(p.z - sphereCenterZ) + sphereCenterZ;
        m = fLen/(fLen - rotZ);
        p.projX = rotX*m + sphereCenterX;
        p.projY = p.y*m + sphereCenterY;
            
        if (p.age < p.attack+p.hold+p.decay) {
            if (p.age < p.attack) {
                p.alpha = (p.holdValue - p.initValue)/p.attack*p.age + p.initValue;
            }
        }

        let depthAlphaFactor = (1-rotZ/zeroAlphaDepth);
        depthAlphaFactor = (depthAlphaFactor > 1) ? 1 : ((depthAlphaFactor<0) ? 0 : depthAlphaFactor);
        ctx.fillStyle = rgbString + depthAlphaFactor*p.alpha + ")";
        
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, m * particleRad, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        
        p = nextParticle;
        counter += 1
    }
}

export default render