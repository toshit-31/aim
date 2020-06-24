let aimLimit = {
    'minX' : window.innerWidth*0.4,
    'minY' : window.innerHeight*0.2,
    'maxX' : 0,
    'maxY' : 0
}
aimLimit.maxX = aimLimit.minX*2;
aimLimit.maxY = aimLimit.minY*3

//random coords values within limit
instCoords = (obj) => {
    let instX = parseInt(Math.random()*10000)%obj.maxX;
    let instY = parseInt(Math.random()*10000)%obj.maxY;
    if (instX <= obj.minX){
        instX = obj.minX;
    }
    if (instY <= obj.minY){
        instY = obj.minY;
    }
    return [instX, instY]
}

// check if the bullet hit the target
checkHit = (x, y, scoreArr) => {
    let result = {
        'score' : 0,
        'msg' : ''
    }
    let scoreCard = [10, 7, 5, 0];
    let msgCard = ['Bulls Eye !!', 'Good !', 'Nice...', 'Ooops :(']
    let hitRadius = Math.max(x, y);
    let hitCircleIndex = 0;
    for (var i = 0; i < scoreArr.length; i++){
        if (i >= 1 && hitRadius < scoreArr[i] && hitRadius >= scoreArr[i-1]){
            hitCircleIndex = i;
            break;
        } else if ( i == 0 && hitRadius <= scoreArr[i]){
            hitCircleIndex = i;
            break;
        } else {
            hitCircleIndex = 3;
        }
    }
    result.score = scoreCard[hitCircleIndex];
    result.msg = msgCard[hitCircleIndex];
    return result;
}

updateScoreCard = (s, t) => {
    document.getElementById('_score').innerHTML = data.score;
    let listItem = document.createElement('li');
    listItem.innerHTML = `score : <b>${s}</b>, delay : <b>${t}</b>`;
    document.querySelector('#score_card ul').appendChild(listItem);
}

function locateAim() {
    let aim = {
        'x' : 0,
        'y' : 0
    }

    //instant random values
    let inst = {
        'x' : instCoords(aimLimit)[0],
        'y' : instCoords(aimLimit)[1]
    }

    return [inst.x, inst.y]
}

// refresh time in secs, stay time in seconds
function bindEvents(){
    
    // check refresh time and stay time
    if (data.refTime < 2*data.stayTime){
        data.refTime = 2*data.stayTime
    }

    // initialise
    let crosshair = {
        'prop' : document.getElementById('prop_cross'),
        'size' : (this.screen.height*0.8)
    }
    
    //move the cross hair
    window.addEventListener('mousemove', function(e){
        crosshair.prop.style.height = crosshair.size
        crosshair.prop.style.top = (e.pageY*data.mouseSensitivity - crosshair.size/2)+'px';
        crosshair.prop.style.left = (e.pageX*data.mouseSensitivity - crosshair.size/2)+'px';
    })

}

function popAim(stay) {
    
    let propTarget = document.getElementById('prop_target');
    let startTime = new Date().getTime();
    // target coords
    let dx = Math.round(locateAim()[0]), dy = Math.round(locateAim()[1]);
    let mdx = 0, mdy = 0;
    //initiate Aim popup
    propTarget.style.visibility = 'visible';
    propTarget.style.top = (dy-25)+'px';
    propTarget.style.left = (dx-25)+'px';
    let fired = false;
    // capture first fire 
    document.addEventListener('mousedown', function(e){
        e.preventDefault()
        if (!fired){
            // capture fire coords and hit score
            fired = true;
            let fireTime = new Date().getTime();
            let timeDelay = 0;
            timeDelay = fireTime-startTime;
            if (timeDelay <= stay) {
                // fire coords
                mdx = e.pageX*data.mouseSensitivity;
                mdy = e.pageY*data.mouseSensitivity;
                data.timeDelay.push(timeDelay)
                data.target.push([dx,dy]);
                data.fire.push([mdx,mdy]);
                let hitResult = checkHit(Math.abs(dx-mdx), Math.abs(dy-mdy), [7.5, 17.5, 25]);
                data.score += hitResult.score;
                updateScoreCard(hitResult.score, `0.${timeDelay}s`);
                // add bullet impact point
                let bullMark = {
                    'prop' : document.createElement('div'),
                    'size' : 10
                }
                bullMark.prop.classList.add('bull_mark')
                bullMark.prop.style.top = (mdy-bullMark.size/2)+'px';
                bullMark.prop.style.left = (mdx-bullMark.size/2)+'px';
                document.body.appendChild(bullMark.prop);
                setTimeout(()=> bullMark.prop.remove(), (data.refTime/4));
            }
        }
    })
    setTimeout(()=>{
        var nowTime = new Date().getTime();
        if (!fired && nowTime-startTime > 1000){
            data.target.push([dx,dy]);
            data.fire.push([0,0]);
            updateScoreCard(0, 'missed');
        }
    }, stay)
    setTimeout(()=>{
        propTarget.style.visibility = 'hidden';
    }, stay);

}