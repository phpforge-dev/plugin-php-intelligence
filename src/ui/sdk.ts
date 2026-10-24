export let monaco:any,keymap:any,tr:any,t:any,msg:any,api:any;
let sdk:any,live=false;const timeouts=new Set<any>();
export function own(value:any){sdk.own(value);return value;}
export function alive(){return live;}
export function timeout(fn:Function,delay=0){const id=globalThis.setTimeout(()=>{timeouts.delete(id);if(live)fn();},delay);timeouts.add(id);return id;}
export function clearTimer(id:any){timeouts.delete(id);globalThis.clearTimeout(id);}
export function event(target:any,name:string,listener:any,options?:any){target.addEventListener(name,listener,options);own(()=>target.removeEventListener(name,listener,options));}
export function wrapEditor(editor:any){return new Proxy(editor,{get(target,key){const v=target[key];if(typeof v!=='function')return v;return (...args:any[])=>{const result=v.apply(target,args);if(String(key).startsWith('on')||key==='addAction')own(result);if(key==='createDecorationsCollection')own(()=>result.clear());return result;};}});}
export function configure(value:any){sdk=value;live=true;api=sdk.api;const track=(target:any)=>new Proxy(target,{get(obj,key){const value=obj[key];if(typeof value!=='function')return value;return (...args:any[])=>{const result=value.apply(obj,args);if(String(key).startsWith('register'))own(result);return result;};}});monaco=new Proxy(sdk.monaco,{get(obj,key){return key==='languages'||key==='editor'?track(obj[key]):obj[key];}});keymap=sdk.keymap;tr=t=sdk.tr;msg=sdk.msg;own(()=>{live=false;for(const id of timeouts)globalThis.clearTimeout(id);timeouts.clear();for(const el of document.querySelectorAll('.refactor-dialog,.refactor-preview,.refactor-this,.php-hierarchy-menu,.refactor-toast')){if(el instanceof HTMLDialogElement&&el.open)el.close('cancel');el.remove();}});}
