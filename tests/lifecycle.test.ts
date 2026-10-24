import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {NativeLanguage} from '../src/native-language';
test('engine injects shared plugin host and preserves alias declaration navigation',async()=>{
 let hosts=0;const source='<?php use App\\User as Person; new Person();';const files={'a.php':source};
 const call=async(method:string,args:any[]=[])=>{if(method==='workspace')return {root:'/p',rootUri:'file:///p/'};if(method==='read')return {text:files[args[0]],uri:'file:///p/'+args[0]};if(method==='listFiles')return Object.keys(files);if(method==='language')return [];throw Error(method);};
 const host={define:async()=>null,complete:async()=>null,changed(){},diagnose:async()=>[]};const engine=new NativeLanguage(call,()=>{hosts++;return host;});
 const input={path:'a.php',text:source,version:1,position:{line:0,character:source.lastIndexOf('Person')+2},method:'textDocument/definition'};
 const result=await engine.request(input);assert.equal(result[0].uri,'file:///p/a.php');assert.equal(result[0].range.start.character,source.indexOf('Person'));assert.equal(hosts,1);engine.reset();await engine.request(input);assert.equal(hosts,2);
});
test('PHP UI providers, editor actions, listeners and decorations are released on disable',async()=>{
 const dom=new JSDOM('<div id="editor"></div>',{url:'https://ide.test'});for(const key of ['window','document','HTMLDialogElement'])globalThis[key]=dom.window[key];Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
 const {activate}=await import('../src/workbench');let registered=0,released=0,cleared=0;const disposable=()=>{registered++;return {dispose(){released++;}};};
 const editor={getModel:()=>null,onDidChangeModel:disposable,onDidChangeModelContent:disposable,onMouseDown:disposable,onKeyDown:disposable,createDecorationsCollection:()=>({clear(){cleared++;},set(){}}),updateOptions(){},addAction:disposable,getContainerDomNode:()=>document.getElementById('editor')};
 const monaco={languages:new Proxy({},{get:()=>disposable}),editor:{registerCommand:disposable,getModels:()=>[],setModelMarkers(){}},KeyCode:{},Range:class{},Position:class{}};
 const cleanup:any[]=[];let feature:any;const sdk={api:{},monaco,keymap:{defineContext(){},registerAction(){cleanup.push(()=>{});},shortcut:()=>''},tr:(v:string)=>v,msg:(v:TemplateStringsArray,...args:any[])=>v.reduce((s,p,i)=>s+p+(args[i]??''),''),own:(v:any)=>cleanup.push(v),provide:(_name:string,v:any)=>feature=v};
 activate(sdk);feature.mountPhpInsights(editor,{references:async()=>[],clean:()=>true,show(){}});feature.mountRefactorings({},editor,{pathOf:()=>undefined,status(){},buffer(){}});assert.ok(registered>10);
 for(const c of cleanup.reverse())typeof c==='function'?c():c.dispose();assert.equal(released,registered);assert.ok(cleared>=2);dom.window.dispatchEvent(new dom.window.Event('ide-project-files-changed'));await new Promise(r=>setTimeout(r,450));assert.equal(released,registered);dom.window.close();
});
