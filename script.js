function resToTile(tile){
    let tempTileNum=0;
    for(let i = 0;i < 5;i++){
        tempTileNum*=3;
        tempTileNum+=tile[i];
    }
    return tempTileNum;
}
function tileToRes(tile_num){
    let tile=[]
    for(var i = 0;i < 5;i++){
        tile[4-i]=tile_num%3;
        tile_num=(tile_num-(tile_num%3))/3;
    }
    return tile;
}
function checkTile(ans,test){
    //答えがansのもとで、testを与えたときにタイルがどうなるか　タイルの番号を返却
    let tileCheck=[0,0,0,0,0];
    let yellowList="";
    for(let i = 0;i < 5;i++){
        if(ans.substr(i,1)==test.substr(i,1)) tileCheck[i] = 2;
    }
    for(let i = 0;i < 5;i++){
        if(tileCheck[i]!=2){
            if(ans.indexOf(test.substr(i,1))!=-1 && yellowList.indexOf(test.substr(i,1))== -1){
                tileCheck[i]=1;
                yellowList+=test.substr(i,1);
            }
        }
    }
    return resToTile(tileCheck);
}
function calc_Acc(restriction,word,tileNum){
    //wordでテストしたとき、tileNumのタイルパターンが返ってくる確率を返却　restrictionは未実装
    let tempSum=0;
    for(var i = 0;i < wordlist_ans.length;i++){
        if(checkTile(wordlist_ans[i],wordlist[word])==tileNum) tempSum++;
    }
    return tempSum/wordlist_ans.length;
}
function calc_Inq(restriction){
    //評価値を計算する　　restrictionに適合している数の自然対数を返却
    let tempSum=0;
    let fitFlg=1;
    for(var i = 0;i < wordlist_ans.length;i++){
        fitFlg=1;
        for(var j = 0;j < restriction.length;j++){
            if(checkTile(wordlist_ans[i],restriction[j].word) != resToTile(restriction[j].tile)){
                fitFlg=0;
                break;
            }
        }
        if(fitFlg) tempSum++;
    }
    return Math.log(tempSum);
}
function set_Restriction(restriction){
    //restrictionに適合しているかどうかを示す配列を返却
    let rest_res=[];
    for(var i = 0;i < wordlist_ans.length;i++){
        rest_res[i]=1;
        for(var j = 0;j < restriction.length;j++){
            if(checkTile(wordlist_ans[i],restriction[j].word) != resToTile(restriction[j].tile)){
                rest_res[i]=0;
                break;
            }
        }
    }
    return rest_res;
}
function predict(){
    let word_input=[];
    let res_input=[];
    let res_input_each=[];
    let word_val=[];
    let word_pred=[];//出力用
//    let param=Number(document.getElementById("param").value);
    let word_sum=0;
    let result_text="";
    let restriction=[];
    for (let i = 0;i < 6;i++) res_input_each[i]=[];
    for (let i = 0;i < wordlist.length;i++) word_val[i]=0;

    for(var i = 0;i < 6;i++){
        if(document.getElementById("input"+(i+1)).value != ""){
            word_input[i] = document.getElementById("input"+(i+1)).value;
            res_input[i]=document.getElementById("result"+(i+1)).value;
            for(var j = 0;j < 5;j++){
                if(res_input[i].substr(j,1) == '-'){
                    res_input_each[i][j] = 0;
                } else if(res_input[i].substr(j,1)=='+'){
                    res_input_each[i][j] = 1;
                } else if(res_input[i].substr(j,1) == '*'){
                    res_input_each[i][j] = 2;
                }
            }
            restriction.push({word:word_input[i],tile:res_input_each[i]});
        }
    }

    let word_pos= set_Restriction(restriction);

    for (let i = 0;i < wordlist.length;i++){ //評価値の計算
        if(word_pos[i]){
            let tempWordVal=0;
            for (let j = 0;j < 243;j++){//タイルのパターンを全部網羅するため
                let tempRestriction=restriction;
                tempRestriction.push({word:wordlist[i],tile:tileToRes(j)});
                tempWordVal+=calc_Acc(restriction,i,j)*calc_Inq(restriction.push(tempRestriction));
            }
            word_pred.push({word:wordlist[i],val:tempWordVal});
        }
        if(i%50==0) document.getElementById("strategy").value= i + " / " + wordlist.length;
    }

    word_pred.sort((a,b)=>(b.val-a.val));
    word_sum=word_pred.length;
    result_text+="remains: " + word_sum + "\n\n";
    for(var i = 0;i < Math.min(100,word_pred.length);i++){
        result_text+=(i+1) +": " + word_pred[i].word + "\n";
    }
    document.getElementById("strategy").value=result_text;
}