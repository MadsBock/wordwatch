import React from 'react';
import './App.css';
import {DateTime} from 'luxon';

function App() {
  return (
    <div className="App">
        <Watch/>
    </div>
  );
}

class Watch extends React.Component {
  constructor() {
    super()
    this.state = {
      time: DateTime.local()
    }

    
  }
  
  componentDidMount() {
    setInterval(() => {
      this.updateTime()
    }, 1000);
  }

  updateTime() {
    console.log("Updating")
    this.setState({
      time: DateTime.local()
    })
  }

  b(n,min,max) {
    return n >= min && n <= max
  }

  getOverUnder(m) {
    m = m%15
    return  this.b(m,1,7) ? "OVER" : (this.b(m,8,14) ? "I" : "")
  }

  getSecondOverUnder(m) {
    return this.b(m,8,22) ? "OVER" : (this.b(m,38,52) ? "I" : "")
  }

  getQualifier(m) {
    return this.b(m, 23,37) ? "HALV" : (this.b(m,8,22)||this.b(m,38,52) ? "KVART" : "")
  }

  getExtraMinutes(m) {
    var moddedM = m%15
    var targetMinute = [15,30,45,60].filter(n=>this.b(m,n-15,n))[0]
    return moddedM <=7 ? m-(targetMinute-15) : targetMinute-m
  }

  render() {
    var t = this.state.time
    var second = t.second
    var secondTier = second - (second%10)

    var minute = t.minute
    var overUnder = this.getOverUnder(minute)
    var secondOverUnder = this.getSecondOverUnder(minute)
    var qualifier = this.getQualifier(minute)
    var extraMinutes = this.getExtraMinutes(minute)
    var hour = t.hour
    var hourTier = hour - (hour%10)

    var kardinaltal = 
    ["NUL", "EN", "TO", "TRE", "FIRE", "FEM", "SEKS", "SYV", "OTTE", "NI",
     "TI", "ELLEVE", "TOLV", "TRETTEN", "FJORTEN", "FEMTEN", "SEKSTEN", "SYTTEN", "ATTEN", "NITTEN"]
    var tiere = ["NUL", "TI", "TYVE", "TREDIVE", "FYRRE", "HALVTREDS"]


    return <div className="watch">
      <h1>Klokken er nu...</h1>
      <Field text="ET" callback={()=>extraMinutes==1}/>
      {[2,3,4,5,6,7].map(v=>
        <Field text={kardinaltal[v]} callback={()=>extraMinutes==v}/>
      )}
      <Field text = "MINUT" callback={()=>extraMinutes}/>
      <Field text = "TER" callback={()=>extraMinutes>1}/>
      {["I", "OVER"].map(v=><Field text={v} callback={()=>overUnder==v}/>)}
      {["KVART", "HALV"].map(v=><Field text = {v} callback={()=>qualifier==v}/>)}
      {["I", "OVER"].map(v=><Field text={v} callback={()=>secondOverUnder==v}/>)}
      <Field text = "ET" callback={()=>hour==1}/>
      {[1,2,3,4,5,6,7,8,9].map((v)=>
        <Field text = {kardinaltal[v]} callback = {()=>(hour%10)==v && (hour > 19 | hour < 10) && hour != 1}/>
      )}
      {[10,11,12,13,14,15,16,17,18,19].map((v)=>
        <Field text = {kardinaltal[v]} callback = {()=>hour==v}/>
      )}
      <Field text = "OG" callback={()=>hourTier==20 && hour!= 20}/>
      <Field text = {tiere[2]} callback = {()=>hourTier==20}/>

      <Field text = "PLUS" callback={()=>second!=0}/>
      <Field text = "ET" callback={()=>second==1}/>
      {[1,2,3,4,5,6,7,8,9].map((v)=>
        <Field text = {kardinaltal[v]} callback = {()=>(second%10)==v && (second > 19 | second < 10) && second != 1}/>
      )}
      {[10,11,12,13,14,15,16,17,18,19].map((v)=>
        <Field text = {kardinaltal[v]} callback = {()=>second==v}/>
      )}
      <Field text = "OG" callback={()=>second%10!=0 && secondTier>10}/>
      {[2,3,4,5].map(v=>
        <Field text = {tiere[v]}  callback = {()=>secondTier/10==v}/>
      )}
      <Field text = "SEKUND" callback={()=>second!=0}/>
      <Field text = "ER" callback={()=>second>1}/>
    </div>
  }
}

function Field(props) {
  var cn = "field " + (props.callback() ? "active" : "")
  return <span className={cn}>{props.text}</span>
}

function Cf(props){
  return <span className="field active">{props.text}</span>
}

export default App;
