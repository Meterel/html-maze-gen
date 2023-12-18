// Made by Meterel
// https://github.com/Meterel/html-maze-gen

"use strict";


onmessage=e=>{
    const [
        gridsize,
        few_dead_ends,
        px,
        offset_x,
        offset_y
    ]=e.data;


    const cells=new Array(gridsize);
    for(let x=0;x<gridsize;x++){
        cells[x]=new Array(gridsize);
        for(let y=0;y<gridsize;y++) cells[x][y]=[true,true,false]; //wall x, wall y, occupied
    }


    const occupied=[];
    let searching=false;

    let pos_x=Math.floor(Math.random()*gridsize);
    let pos_y=Math.floor(Math.random()*gridsize);

    let rot_x;
    let rot_y;

    for(;;){
        const posrot=[[1,0],[0,1],[-1,0],[0,-1]];

        for(let i=4;i>0;i--){
            const r=Math.floor(Math.random()*i);

            const to_x=pos_x+posrot[r][0];
            const to_y=pos_y+posrot[r][1];
            if(to_x>=0 && to_x<gridsize && to_y>=0 && to_y<gridsize && !cells[to_x][to_y][2]){
                pos_x=to_x;
                pos_y=to_y;
                [rot_x,rot_y]=posrot[r];
                occupied.push([to_x,to_y]);
                cells[to_x][to_y][2]=true;
                searching=false;
                break;
            }

            posrot.splice(r,1);
        }

        if(!posrot.length){
            if(!few_dead_ends || searching){
                if(!occupied.length) break;
                [pos_x,pos_y]=occupied.pop();
                continue;
            }

            const to_x=pos_x+rot_x;
            const to_y=pos_y+rot_y;
            if(to_x>=0 && to_x<gridsize && to_y>=0 && to_y<gridsize){
                pos_x=to_x;
                pos_y=to_y;
            }

            searching=true;
        }

        cells[pos_x-Math.min(rot_x,0)][pos_y-Math.min(rot_y,0)][Math.abs(rot_x)]=false;
    }


    const lines=[];
    
    for(let x=0;x<gridsize;x++) if(cells[x][0][1]) cells[x][0][0]=false;
    for(let y=1;y<gridsize;y++) if(cells[0][y][0]) cells[0][y][1]=false;
    
    for(let x=0;x<gridsize;x++){
        const xp=offset_x+x*7*px;
        let start_y=null;

        for(let y=0;y<gridsize;y++){
            if(start_y===null && cells[x][y][1]) start_y=offset_y+y*7*px-px;
            else if(start_y!==null && !cells[x][y][1]){
                lines.push(xp,start_y,xp,offset_y+y*7*px);
                start_y=null;
            }
        }

        if(start_y!==null && cells[x][gridsize-1][1]) lines.push(xp,start_y,xp,offset_y+gridsize*7*px);
    }

    for(let y=0;y<gridsize;y++){
        const yp=offset_y+y*7*px;
        let start_x=null;

        for(let x=0;x<gridsize;x++){
            if(start_x===null && cells[x][y][0]) start_x=offset_x+x*7*px-px;
            else if(start_x!==null && !cells[x][y][0]){
                lines.push(start_x,yp,offset_x+x*7*px,yp);
                start_x=null;
            }
        }

        if(start_x!==null && cells[gridsize-1][y][0]) lines.push(start_x,yp,offset_x+gridsize*7*px,yp);
    }
    
    /*
    //the old geometry generator is kept here to compare benchmarks with the newer versions
    for(let x=0;x<gridsize;x++){
        const xp=offset_x+x*7*px;
        for(let y=0;y<gridsize;y++){
            const yp=offset_y+y*7*px;
            if(cells[x][y][0]) lines.push(xp-px,yp,xp+7*px,yp);
            if(cells[x][y][1]) lines.push(xp,yp-px,xp,yp+7*px);
        }
    }
    */

    postMessage(new Float32Array(lines));
}