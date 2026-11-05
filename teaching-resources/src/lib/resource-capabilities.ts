type Result = {type:string;id:string;ok:boolean;value?:unknown;error?:{message:string;name:string}};
export function hostRequest<T>(op:string, payload:Record<string,unknown>={}):Promise<T>{
  return new Promise((resolve,reject)=>{
    const id=crypto.randomUUID();
    const receive=(event:MessageEvent<Result>)=>{
      if(event.source!==window.parent||event.data?.type!=='nos-resource-capability-result'||event.data.id!==id)return;
      clearTimeout(timer);window.removeEventListener('message',receive);
      if(event.data.ok)resolve(event.data.value as T);else{const error=new Error(event.data.error?.message||'资源权限操作失败');error.name=event.data.error?.name||'Error';reject(error);}
    };
    const timer=setTimeout(()=>{window.removeEventListener('message',receive);reject(new Error('授权等待超时，请重试'));},60000);
    window.addEventListener('message',receive);window.parent.postMessage({type:'nos-resource-capability',id,op,...payload},'*');
  });
}
export async function exportResourcePng(svg:SVGElement,width:number,height:number):Promise<Blob>{
  const clone=svg.cloneNode(true) as SVGElement;clone.setAttribute('width',String(width));clone.setAttribute('height',String(height));
  const text=new XMLSerializer().serializeToString(clone);
  if(window.parent!==window){const result=await hostRequest<{bytes:ArrayBuffer}>('png',{svg:text,width,height});return new Blob([result.bytes],{type:'image/png'});}
  const url=URL.createObjectURL(new Blob([text],{type:'image/svg+xml'}));
  try{const image=new Image();await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=reject;image.src=url;});const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.getContext('2d')!.drawImage(image,0,0);return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('PNG 导出失败')),'image/png'));}finally{URL.revokeObjectURL(url);}
}
