import React,{useState} from 'react'

export default function TextForm(props) {
   const [text, setText] = useState("Text area")
   const [prev,setprev]=useState(' ')
   const handleOnChange = (event)=>{
    console.log("Clicked handle on change");
    setText(event.target.value)
   }

   const Lowercase= () =>
   {
      console.log("Lower case");
      setText(text.toLowerCase());
   }

   const uppercasecon = ()=>
   {
    console.log("Upper case");
    let newtext=text.toUpperCase();
    setText(newtext);
   }

   const cleartext=()=>
   {
    setText(' ');
   }

   const countdigit = ()=>
   {
    let c=0;
    for(let i=0 ;i<text.length;i++)
    {
      if(!isNaN(text[i]) && text[i]!==' ')
        c=c+1;
    }
    setprev('Nummber of digits :'+c);
   }

   const countspecial = ()=>
    {
     let c=0;
     for(let i=0 ;i<text.length;i++)
     {
       if(isNaN(text[i]) && text[i]!==' ' && !(text[i] >= 'A' && text[i] <= 'Z') && !(text[i] >= 'a' && text[i] <= 'z'))
         c=c+1;
     }
     setprev('Nummber of special characters :'+c);
    }
  return (
    <div className='container' style={{backgroundColor:props.mode==='dark'?'black':'white', color:props.mode==='light'?'black':'white'}}>
    <h1>{props.heading}</h1>
<div className="mb-3" >
  <label htmlFor="mybox" className="form-label">Example textarea</label>
  <textarea className="form-control" id="exampleFormControlTextarea1" onChange={handleOnChange} style={{backgroundColor:props.mode==='dark'?'black':'white', color:props.mode==='light'?'black':'white'}} rows="8" value={text}></textarea>
</div>
<button className="btn btn-primary mx-1" onClick={uppercasecon}>Convert to uppercase</button>
<button className="btn btn-primary mx-1" onClick={Lowercase}>Convert to lowercase</button>
<button className="btn btn-primary mx-1" onClick={cleartext}>Clear text</button>
<button className="btn btn-primary mx-1" onClick={countdigit}>Number of digits</button>
<button className="btn btn-primary mx-1" onClick={countspecial}>Number of special characters</button>
<div className='Textcontainer my-1'>
  <h2>Text summary</h2>
<p>{text===''?0:text.trim().split(/\s+/).length} words and {text.length} characters</p>
<div>

{prev}
</div>
<h2>Preview</h2>
{text}
</div>
    </div>
  )
}
