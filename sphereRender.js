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
    frequencyArray,
    sphereRad
) {
    const groupNum = 1024 / 3

    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    const max = Math.max(...frequencyArray) / 255
    const offset = max === 1 ? max + frequencyArray.filter(x => x === max).length * 0.02 : max
    const radiusOffset = offset > 0.90 ? offset : 0.90;

    turnAngle = (turnAngle + (turnSpeed % (2 * Math.PI)));
    setTurnAngle(turnAngle)

    let p = particleList.first;
    let nextParticle = {}
    let counter = 0

    while (p != null && counter < 1024) {
        nextParticle = p.next;

        // --------------------------------------------
        // Attempt to scale sphere based on max frequency of each frame

        const pOffset = 1.2 * frequencyArray[counter] / 255
        const particleOffset = (pOffset > 0.60) ? pOffset : 0.60;
        p.x = p.xInitial * sphereRad * radiusOffset * (particleOffset)
        p.y = p.yInitial * sphereRad * radiusOffset * (particleOffset)
        p.z = (p.zInitial * sphereRad * radiusOffset * (particleOffset)) + sphereCenterZ

        let sinAngle = Math.sin(turnAngle);
        let cosAngle = Math.cos(turnAngle);


        let rotX = cosAngle * p.x + sinAngle * (p.z - (sphereCenterZ));
        let rotZ = -sinAngle * p.x + cosAngle * (p.z - (sphereCenterZ)) + (sphereCenterZ);
        m = fLen / (fLen - rotZ);
        p.projX = rotX * m + sphereCenterX;
        p.projY = p.y * m + sphereCenterY;

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