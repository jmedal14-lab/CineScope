import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../styles/tokens.css',import.meta.url),'utf8');
const tokens=block=>Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map(m=>[m[1],m[2]]));
const light=tokens(css.split(":root[data-theme")[0]);const dark={...light,...tokens(css.split(":root[data-theme")[1])};
function luminance(hex){return hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0)}
function contrast(a,b){const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(values[0]+.05)/(values[1]+.05)}
test('semantic text and control borders meet contrast thresholds in both themes',()=>{for(const theme of [light,dark]){for(const surface of ['color-canvas','color-surface','color-surface-subtle'])for(const text of ['color-text','color-text-muted','color-accent-text','color-error'])assert.ok(contrast(theme[surface],theme[text])>=4.5,`${surface}/${text}`);assert.ok(contrast(theme['color-brand'],theme['color-on-brand'])>=4.5);assert.ok(contrast(theme['color-footer'],theme['color-on-footer'])>=4.5);assert.ok(contrast(theme['color-control-border'],theme['color-surface'])>=3)}});
