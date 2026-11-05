import type { AnchorHTMLAttributes } from 'react';
import logo from './assets/logo.png';
export function LocalLink({href, ...props}:AnchorHTMLAttributes<HTMLAnchorElement>){return <a {...props} href={href?.startsWith('/teacher-ecosystem')?'#top':href}/>}
const scrollController={resize(){},scrollTo(target:HTMLElement|number,options?:{offset?:number;immediate?:boolean}){window.scrollTo({top:(typeof target==='number'?target:target.getBoundingClientRect().top+window.scrollY)+(options?.offset||0),behavior:options?.immediate?'instant':'smooth'});}};
export function useLenis(){return scrollController;}
export function BrandLogo({size=34}:{size?:number}){return <img src={logo as unknown as string} width={size} height={size} alt="临场" style={{borderRadius:6}}/>}
