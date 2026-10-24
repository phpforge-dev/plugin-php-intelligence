import {configure,wrapEditor} from './ui/sdk';
import {mountRefactorings,codeActions} from './ui/refactor-ui';
import {mountPhpInsights} from './ui/php-editor-insights';
import {NativeLanguage} from './native-language';
import {isPhpDeclaration} from './php-navigation';
export function activate(sdk:any){configure(sdk);const contribution={createLanguage:(call:any,makeHost:any)=>new NativeLanguage(call,makeHost),mountRefactorings:(api:any,editor:any,hooks:any)=>mountRefactorings(api,wrapEditor(editor),hooks),mountPhpInsights:(editor:any,hooks:any)=>mountPhpInsights(wrapEditor(editor),hooks),isPhpDeclaration,codeActions:(...args:any[])=>codeActions(...args as [any,any])};sdk.provide('phpIntelligence',contribution);return contribution;}
