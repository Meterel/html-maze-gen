// Made by Meterel
// https://github.com/Meterel/html-maze-gen

"use strict";


onmessage=(e)=>{
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
        for(let y=0;y<gridsize;y++){
            cells[x][y]=[true,true,false]; //wall x, wall y, occupied
        }
    }


    const occupied=[];
    let searching=false;
    let pos=[Math.floor(Math.random()*gridsize),Math.floor(Math.random()*gridsize)];
    let rot;

    for(;;){
        const posrot=[[1,0],[0,1],[-1,0],[0,-1]];

        for(let i=4;i>0;i--){
            const r=Math.floor(Math.random()*i);
            const to=[pos[0]+posrot[r][0],pos[1]+posrot[r][1]];
            if(to[0]>=0 && to[0]<gridsize && to[1]>=0 && to[1]<gridsize && !cells[to[0]][to[1]][2]){
                pos=to;
                rot=posrot[r];
                occupied.push(to);
                cells[to[0]][to[1]][2]=true;
                searching=false;
                break;
            }
            posrot.splice(r,1);
        }

        if(!posrot.length){
            if(!few_dead_ends || searching){
                pos=occupied.pop();
                if(!pos) break;
                continue;
            }
            const to=[pos[0]+rot[0],pos[1]+rot[1]];
            if(to[0]>=0 && to[0]<gridsize && to[1]>=0 && to[1]<gridsize) pos=to;
            searching=true;
        }

        cells[pos[0]-Math.min(rot[0],0)][pos[1]-Math.min(rot[1],0)][Math.abs(rot[0])]=false;
    }


    const lines=[];
    
    for(let x=0;x<gridsize;x++) if(cells[x][0][1]) cells[x][0][0]=false;
    for(let y=1;y<gridsize;y++) if(cells[0][y][0]) cells[0][y][1]=false;
    
    for(let x=0;x<gridsize;x++){
        const xp=offset_x+x*7*px;
        let start=null;

        for(let y=0;y<gridsize;y++){
            if(!start && cells[x][y][1]){
                start=[xp,offset_y+y*7*px-px];
            }else if(start && !cells[x][y][1]){
                lines.push(...start,xp,offset_y+y*7*px);
                start=null;
            }
        }

        if(start && cells[x][gridsize-1][1]) lines.push(...start,xp,offset_y+gridsize*7*px);
    }

    for(let y=0;y<gridsize;y++){
        const yp=offset_y+y*7*px;
        let start=null;

        for(let x=0;x<gridsize;x++){
            if(!start && cells[x][y][0]){
                start=[offset_x+x*7*px-px,yp];
            }else if(start && !cells[x][y][0]){
                lines.push(...start,offset_x+x*7*px,yp);
                start=null;
            }
        }

        if(start && cells[gridsize-1][y][0]) lines.push(...start,offset_x+gridsize*7*px,yp);
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