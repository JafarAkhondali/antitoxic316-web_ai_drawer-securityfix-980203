const tf = require("@tensorflow/tfjs")

class SketchPad{
   constructor(container, labelsContainer, size=680){
      this.canvas=document.createElement("canvas");
      this.canvas.width=size;
      this.canvas.height=size;
      this.canvas.style=`
         background-color:white;
         box-shadow: 0px 0px 10px 2px black;
      `;
      container.appendChild(this.canvas);

      const lineBreak=document.createElement("br");
      container.appendChild(lineBreak);

      this.undoBtn=document.createElement("button");
      this.undoBtn.innerHTML="UNDO";
      this.undoBtn.className = "drawer-btn"
      container.appendChild(this.undoBtn);

      this.saveIMGBtn=document.createElement("button")
      this.saveIMGBtn.innerHTML="SAVE";
      this.saveIMGBtn.className = "drawer-btn"
      container.appendChild(this.saveIMGBtn);

      this.ctx=this.canvas.getContext("2d");

      this.reset();

      this.addEventListeners();


      this.model = tf.loadLayersModel('file://./saved_model/statedict');

      this.labelsContainer = labelsContainer;
   }

   reset(){
      this.paths=[];
      this.isDrawing=false;
      this.redraw();
   }

   addEventListeners(){
      this.canvas.onmousedown=(evt)=>{
         const mouse=this.getMouse(evt);
         this.paths.push([mouse]);
         this.isDrawing=true;
      }
      this.canvas.onmousemove=(evt)=>{
         if(this.isDrawing){
            const mouse=this.getMouse(evt);
            const lastPath=this.paths[this.paths.length-1];
            lastPath.push(mouse);
            this.redraw();
         }
      }
      document.onmouseup=()=>{
         this.isDrawing=false;
      }
      this.canvas.ontouchstart=(evt)=>{
         const loc=evt.touches[0];
         this.canvas.onmousedown(loc);
      }
      this.canvas.ontouchmove=(evt)=>{
         const loc=evt.touches[0];
         this.canvas.onmousemove(loc);
         this.showNewEvaluation()
      }
      document.ontouchend=()=>{
         document.onmouseup();
      }
      this.undoBtn.onclick=()=>{
         this.paths.pop();
         thisredraw();
      }
      this.saveIMGBtn.onclick=()=>{
         const img = thisgetFullIMG();
         thissaveIMG();
         thisredraw();
      }
   }

   redraw(){
      this.ctx.clearRect(0,0,
         this.canvas.width,this.canvas.height);
      draw.paths(this.ctx,this.paths);
      if(this.paths.length>0){
         this.undoBtn.disabled=false;
      }else{
         this.undoBtn.disabled=true;
      }
   }

   getMouse(evt){
      const rect=this.canvas.getBoundingClientRect();
      return [
         Math.round(evt.clientX-rect.left),
         Math.round(evt.clientY-rect.top)
      ];
   }

   getFullIMG(){
      const img = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

      let result = []

      let row = []
      let showed = 50
      for(let i = 0; i < img.data.length; i+=4){
         if(row.length == this.canvas.width){
            result.push(row)
            row = []
         }
         row.push(img.data[i+3])         
      }
      
      result.push(new Array(this.canvas.height).fill(0))

      return result
   }

   get28x28IMG(){
      const img = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      let result = []

      let i_step = 1360*24*2
      for(let i = 0; i < img.data.length; i += i_step){
         let row = []
         for(let j = 0; j < this.canvas.width*4; j+=(4*24)){
            if(row.length === 28) break;
            row.push(img.data[i+j+3])  
         }
         if(result.length === 28) break;
         result.push(row)
      }

      return result
   }

   showNewEvaluation(){
      let compresed_img = thiget28x28IMG()
      compresed_img = tf.tensor2d(compresed_img)
      compresed_img = tf.expandDims(compresed_img, 0)
      let model_output = this.model.predict(compresed_img, batchSize=1)
      this.labelsContainer.updateNumLabels(model_output.data())
   }
   
   saveIMG(){

   }
}

module.exports = { 'SketchPad':SketchPad };