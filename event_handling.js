var data = {
    'timeDelay' : [],
    'target' : [],
    'fire' : [],
    'score' : 0,
    'refTime' : 3,
    'stayTime': 1.5,
    'mouseSensitivity': 1,
    'shotCount' : 15,
}

window.addEventListener('load', function(){

    Math.__proto__.between = function(min, max, num){
        if(num <= max && num >= min) {
            return num
        } else if (num <= min) {
            return min
        } else return max
    }
    document.getElementById('start').addEventListener('click', function(e){
        if (document.getElementById('_play_name').value === ''){
            e.preventDefault();
            return
        }
        document.getElementById('_name').innerHTML = 'Name: <b>'+document.getElementById('_play_name').value+'</b>';
        data.mouseSent = document.getElementById('sent_factor');
        data.refTime = Math.between(2, 4, document.getElementById('ref').value)*1000;
        data.stayTime = Math.between(1, 2, document.getElementById('stay').value)*1000;
        data.mouseSensitivity = Math.between(0.5, 3, parseFloat(document.getElementById('sent_factor').value))
        document.getElementById('score_card').style.visibility = 'visible'
        bindEvents();
        // game ends
        function endGame(){
            let retryBtn = document.createElement('button');
            retryBtn.classList.add('btn');
            retryBtn.setAttribute('onclick', 'location.reload()')
            retryBtn.id = 'retry';
            retryBtn.innerHTML= 'Restart'
            let endSpan = document.createElement('span');
            endSpan.innerHTML = `Your score is ${data.score} !!`;
            endSpan.classList.add('end_tag');
            document.body.innerHTML = '';
            document.body.appendChild(endSpan);
            document.body.appendChild(retryBtn);
            document.body.style.cursor = 'initial';
        }
        document.addEventListener('keyup', function(e){
            if(e.keyCode === 27){
                endGame()
            }
        })
        // iterating aim popping
        var currentCount = 1;
        var intId = setInterval(() => {
            if(currentCount <= data.shotCount){
                popAim(data.stayTime)
                currentCount++
            } else {
                clearInterval(intId);
                endGame();
            }
        }, data.refTime);
        this.parentNode.remove()
    })

    // form beautification
    let doc = document;
    let textInput = document.querySelectorAll('._inp');
    [].forEach.call(textInput, function(e){
        e.addEventListener('focus', (el)=>{
            el.target.classList.add('non_empty');
            el.target.parentNode.querySelector('label').classList.add('focused')
        })
        e.addEventListener('blur', (el)=>{
            if (el.target.value == ''){
                el.target.classList.remove('non_empty');
                el.target.parentNode.querySelector('label').classList.remove('focused');
            }
        })
    })

})