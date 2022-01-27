const ROMES=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
function getChar(arg){
    for(let i = 0;i < ROMES.length;i++){
        if(ROMES[i] == arg) return i;
    }
    return -1;
}

function predict(){
    let word_input=[];
    let res_input=[];
    let res_input_each=[];
    let charlist=[];//{char:'a',pos=[]} あり得ない文字はposを空に、それ以外は入る可能性のある場所を一覧にする
    let word_pos=[];
    let word_val=[];
    let word_pred=[];//出力用
    let param=Number(document.getElementById("param").value);
    let word_sum=0;
    let result_text="";
    for (let i = 0;i < 6;i++) res_input_each[i]=[];
    for (let i = 0;i < wordlist.length;i++) word_pos[i]=1,word_val[i]=0;

    for (let i = 0;i < 6;i++){      //char_posの構築
        word_input[i]=document.getElementById("input"+(i+1)).value;
        res_input[i]=document.getElementById("result"+(i+1)).value;
        for(let j = 0;j < 5;j++){
            if(res_input[i].substr(j,1)=='-') {
                res_input_each[i][j]=0;
                charlist.push({char:word_input[i].substr(j,1),pos:[]});
            }
            if(res_input[i].substr(j,1)=='+'){
                res_input_each[i][j]=1;
                let pushflg=1;
                for (let k = 0;k < charlist.length;k++){
                    if(charlist[k].char==word_input[i].substr(j,1)){
                        charlist[k].pos=charlist[k].pos.filter(item=>item!=j)
                        pushflg=0;
                    }
                }
                if(pushflg){
                    let pos_position=[0,1,2,3,4].filter(item=>item!=j);
                    charlist.push({char:word_input[i].substr(j,1),pos:pos_position})
                }
            }
            if(res_input[i].substr(j,1)=='*') {
                res_input_each[i][j]=2;
                let pushflg=1;
                for (let k = 0;k < charlist.length;k++){
                    if(charlist[k].char==word_input[i].substr(j,1)){
                        if(!charlist[k].pos.some(item=>item==j)) charlist[k].pos.push(j);
                        pushflg=0;
                    }
                }
                if(pushflg){
                    let pos_position=[0,1,2,3,4];
                    charlist.push({char:word_input[i].substr(j,1),pos:pos_position})
                }
            }
        }
    }

//    if(res_input[0]=='') return 0;

    for(let i = 0;i < wordlist.length;i++){ //それぞれのワードの可能性を判断
        for(let j = 0;j < 5;j++){//いらない文字が入っていないか
            for(let k = 0;k < charlist.length;k++){
                if(charlist[k].char==wordlist[i].substr(j,1) && 
                !charlist[k].pos.some(item=>item==j)){
                    word_pos[i]=0;
                    break;
                }
            }
            for(let k = 0;k < 6;k++){//"*"制約が満たされているか
                if(res_input_each[k][j]==2){
                    if(wordlist[i].substr(j,1) != word_input[k].substr(j,1)){
                        word_pos[i]=0;
                        break;    
                    }
                }    
            }
        }
        if(word_pos[i]){
            for(let j = 0;j < charlist.length;j++){//必要な文字が入っているか
                if (charlist[j].pos.length){
                    let nec_charflg=0;
                    for(k = 0;k < charlist[j].pos.length;k++){
                        if(wordlist[i].substr(charlist[j].pos[k],1) == charlist[j].char) nec_charflg=1;
                    }
                    if(!nec_charflg){
                        word_pos[i]=0;
                        break;
                    }
                }
            }
        }
        word_sum+=word_pos[i];
    }
    for (let i = 0;i < wordlist.length;i++){ //評価値の計算
        if(word_pos[i]){ //可能性のない単語を無駄撃ちしないため
            for (let j = 0;j < wordlist.length;j++){
                if(word_pos[j]){
                    let cnt_gr=0,cnt_ye=0;
                    for (var k = 0;k < 5;k++){
                        if(wordlist[i].substr(k,1) == wordlist[j].substr(k,1)){
                            cnt_gr++;
                        } else{
                            if(wordlist[j].indexOf(wordlist[i].substr(k,1)) != -1) cnt_ye++;
                        }
                    }
                    word_val[i]+=cnt_gr*param+cnt_ye;
                }   
            }
            word_pred.push({word:wordlist[i],val:word_val[i]});
        }
        if(i % 100 == 0) console.log(i);
    }
    word_pred.sort((a,b)=>(b.val-a.val));
    result_text+="remains: " + word_sum + "\n\n";
    for(var i = 0;i < Math.min(10,word_pred.length);i++){
        result_text+=word_pred[i].word+ ": " + word_pred[i].val + "\n";
    }
    document.getElementById("strategy").value=result_text;
}