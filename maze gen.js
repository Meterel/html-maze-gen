/*
    Made by Meterel
    https://github.com/Meterel/html-maze-gen
*/

"use strict";

onmessage=(e)=>{
    const gridsize=e.data[0];
    const few_dead_ends=e.data[1];
    const context=e.data[2].getContext("2d",{alpha:false,desynchronized:true});

    const walls=new Array(gridsize);
    for(let x=0;x<gridsize;x++){
        walls[x]=new Array(gridsize);
        for(let y=0;y<gridsize;y++){
            walls[x][y]=[true,true];
        }
    }

    const occupied=new Set();
    const search_idx=occupied.entries();
    let searching=false;
    let pos=[Math.round(Math.random()*(gridsize-1)),Math.round(Math.random()*(gridsize-1))];
    let rot;

    while(occupied.size<gridsize**2){
        const posrot=[[1,0],[0,1],[-1,0],[0,-1]];

        for(let i=3;i>=0;i--){
            const r=Math.round(Math.random()*i);
            const to=[pos[0]+posrot[r][0],pos[1]+posrot[r][1]];
            if(to[0]>=0 && to[0]<gridsize && to[1]>=0 && to[1]<gridsize){
                const toe=to[0]*100_000+to[1]; //encodes the array
                if(!occupied.has(toe)){
                    pos=to;
                    rot=posrot[r];
                    occupied.add(toe);
                    searching=false;
                    break;
                }
            }
            posrot.splice(r,1);
        }

        if(!posrot.length){
            if(!few_dead_ends || searching){
                const n=search_idx.next().value[0];
                pos=[Math.floor(n/100_000),n%100_000]; //decodes the array
                continue;
            }
            const to=[pos[0]+rot[0],pos[1]+rot[1]];
            if(to[0]>=0 && to[0]<gridsize && to[1]>=0 && to[1]<gridsize) pos=to;
            searching=true;
        }

        walls[pos[0]-Math.min(rot[0],0)][pos[1]-Math.min(rot[1],0)][Math.abs(rot[0])]=false;
    }

    context.fillStyle="#fff";
    for(let x=0;x<gridsize;x++){
        for(let y=0;y<gridsize;y++){
            if(!(!y && walls[x][y][1]) && walls[x][y][0]) context.fillRect(x*7,y*7,8,1);
            if(!(!x && walls[x][y][0]) && walls[x][y][1]) context.fillRect(x*7,y*7,1,8);
        }
    }

    postMessage(undefined);
}