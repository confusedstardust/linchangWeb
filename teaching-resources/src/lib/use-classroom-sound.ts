import {useEffect,useRef,useState} from 'react';
import {advanceSoundGate,initialSoundGate,microphoneError,powerToDbfs,soundPower,suggestedSoundThreshold,type SoundGate,type SoundSettings} from './classroom-sound';
import {hostRequest} from './resource-capabilities';
type Snapshot={status:'idle'|'requesting'|'running'|'paused'|'error';db:number|null;alarming:boolean;overSeconds:number;quietSeconds:number;calibrationSeconds:number;elapsedSeconds:number;alerts:number;peak:number|null;history:number[];microphone:string;message:string};
const empty=():Snapshot=>({status:'idle',db:null,alarming:false,overSeconds:0,quietSeconds:0,calibrationSeconds:0,elapsedSeconds:0,alerts:0,peak:null,history:[],microphone:'',message:''});
type Session={remote:boolean;gate:SoundGate;started:number;power:number|null;alerts:number;peak:number;history:number[];lastHistory:number;microphone:string;calibration:{since:number;samples:number[]}|null;audio?:AudioContext;stream?:MediaStream;timer?:ReturnType<typeof setInterval>};
export function useClassroomSound(){
 const [settings,setSettings]=useState<SoundSettings>({threshold:-35,holdSeconds:3});const [snapshot,setSnapshot]=useState(empty);const [devices,setDevices]=useState<MediaDeviceInfo[]>([]);const [deviceId,setDeviceId]=useState('');
 const current=useRef<Session|null>(null);const version=useRef(0);const latest=useRef(settings);
 useEffect(()=>{latest.current=settings;if(current.current){current.current.gate=initialSoundGate();current.current.calibration=null;}},[settings]);
 function release(){version.current++;const session=current.current;current.current=null;if(!session)return;clearInterval(session.timer);session.stream?.getTracks().forEach(track=>{track.onended=null;track.stop();});if(session.audio&&session.audio.state!=='closed')void session.audio.close().catch(()=>{});if(session.remote)void hostRequest('mic-stop').catch(()=>{});}
 function stop(message='监听已结束，麦克风已释放。'){release();setSnapshot({...empty(),message});}
 function sample(power:number){
  const session=current.current;if(!session||!Number.isFinite(power)||power<0)return;
  const now=performance.now();session.power=session.power===null?power:.55*session.power+.45*power;const db=powerToDbfs(session.power);session.peak=Math.max(session.peak,db);let calibrationSeconds=0;
  if(session.calibration){session.calibration.samples.push(db);calibrationSeconds=Math.max(0,5-(now-session.calibration.since)/1000);if(!calibrationSeconds){const threshold=suggestedSoundThreshold(session.calibration.samples);session.calibration=null;setSettings(value=>({...value,threshold}));}}
  else{const was=session.gate.alarming;session.gate=advanceSoundGate(session.gate,db,now,latest.current);if(!was&&session.gate.alarming)session.alerts++;}
  if(now-session.lastHistory>=500){session.history.push(db);session.history=session.history.slice(-60);session.lastHistory=now;}
  const gate=session.gate;setSnapshot(value=>({...value,status:'running',db,alarming:gate.alarming,overSeconds:gate.overSince===null?0:Math.min(latest.current.holdSeconds,(now-gate.overSince)/1000),quietSeconds:gate.quietSince===null?0:Math.min(2,(now-gate.quietSince)/1000),calibrationSeconds,elapsedSeconds:Math.floor((now-session.started)/1000),alerts:session.alerts,peak:session.peak,history:[...session.history],microphone:session.microphone,message:''}));
 }
 useEffect(()=>{
  const receive=(event:MessageEvent)=>{if(event.source!==window.parent||event.data?.type!=='nos-resource-microphone'||!current.current?.remote)return;if(event.data.stopped){setSnapshot(value=>({...value,status:'idle',db:null,alarming:false,message:'麦克风已停止，可重新开始。'}));return;}sample(event.data.power);};
  const hidden=()=>{if(document.hidden)stop('页面进入后台，麦克风已停止。');};
  window.addEventListener('message',receive);document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',release);
  return()=>{window.removeEventListener('message',receive);document.removeEventListener('visibilitychange',hidden);window.removeEventListener('pagehide',release);release();};
 // Sample processing reads mutable session/settings references.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 async function start(){
  if(current.current){release();}const token=++version.current;
  const session:Session={remote:window.parent!==window,gate:initialSoundGate(),started:performance.now(),power:null,alerts:0,peak:-90,history:[],lastHistory:0,microphone:'当前麦克风',calibration:null};current.current=session;
  setSnapshot({...empty(),status:'requesting',message:session.remote?'请点击页面顶部“允许本资源使用麦克风”，然后允许浏览器授权。':'请允许浏览器使用麦克风。'});
  try{
   if(session.remote){const result=await hostRequest<{devices:MediaDeviceInfo[];microphone:string}>('mic-start',{deviceId});if(version.current!==token)return;session.microphone=result.microphone;setDevices(result.devices);setSnapshot(value=>({...value,status:'running',microphone:result.microphone,message:''}));}
   else{
    if(!window.isSecureContext)throw new Error('麦克风需要 HTTPS 或 localhost');
    const Constructor=window.AudioContext||(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!Constructor)throw new Error('浏览器不支持麦克风分析');
    const audio=new Constructor();session.audio=audio;const resumed=audio.resume();
    const stream=await navigator.mediaDevices.getUserMedia({audio:{deviceId:deviceId?{exact:deviceId}:undefined,echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});await resumed;
    if(version.current!==token){stream.getTracks().forEach(track=>track.stop());return;}session.stream=stream;session.microphone=stream.getAudioTracks()[0]?.label||'当前麦克风';
    const analyser=audio.createAnalyser();analyser.fftSize=2048;audio.createMediaStreamSource(stream).connect(analyser);const values=new Float32Array(analyser.fftSize);
    session.timer=setInterval(()=>{if(audio.state!=='running')return;analyser.getFloatTimeDomainData(values);sample(soundPower(values));},100);
    stream.getAudioTracks()[0].onended=()=>stop('麦克风已断开');setDevices((await navigator.mediaDevices.enumerateDevices()).filter(device=>device.kind==='audioinput'));setSnapshot(value=>({...value,status:'running',message:''}));
   }
  }catch(error){if(version.current!==token)return;release();setSnapshot({...empty(),status:'error',message:microphoneError(error)});}
 }
 function calibrate(){if(current.current&&snapshot.status==='running'){current.current.calibration={since:performance.now(),samples:[]};current.current.gate=initialSoundGate();setSnapshot(value=>({...value,calibrationSeconds:5,alarming:false}));}}
 function selectDevice(value:string){stop('已切换输入设备，请重新开始监听。');setDeviceId(value);}
 return {snapshot,settings,setSettings,devices,deviceId,selectDevice,start,stop,resume:start,calibrate};
}
