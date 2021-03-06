    var canvas,contextEllipse, contextRoundRect,contextPoint,contextLine, flag,drag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
    	flagColor=0;
    
    var free_pointsX=[];
    var free_pointsY=[];
    var colorPoint=[];
    var thicknessPoint=[];
    var ellipse_parameter=[];
    var roundRect_parameter=[];
    var linePoints=[];

    var Action="resizeRect";  
	var  widthRect,heightRect=0;
    var color = "black",
        PenThickness = 2;
    var rect_background;
    var rect_background="black";
    var startRectX,startRectY=0;

    function init() {
    	canvas = document.getElementById('can');
        contextPoint = canvas.getContext("2d");
        contextLine = canvas.getContext("2d");
        contextEllipse=canvas.getContext("2d");
        contextRoundRect=canvas.getContext("2d");
        htmlCanvas = document.getElementById('can'),
        canvas.width=3*window.innerWidth/4; 
        canvas.height= 3*window.innerHeight/4;

        startRectX=Math.round(canvas.width/4);
    	startRectY=Math.round(canvas.height/4);
    	widthRect=canvas.width/2;
		heightRect=canvas.height/2;
		
        //canvas 2 for table
        canvas2 = document.getElementById('can2');
		canvas2.width=210;
		canvas2.height=100;
        context_table = canvas2.getContext("2d");
        
        circle = {},
        contextCircle = htmlCanvas.getContext('2d');
        contextRect = htmlCanvas.getContext('2d');     
       
        canvas4 = document.getElementById('current_color');
        currentColor_context=canvas4.getContext("2d");

		ResizeRect(startRectX,startRectY,widthRect,heightRect);
		
	 	document.getElementById("height_no").max = canvas.height;
	 	document.getElementById("width_no").max = canvas.width;
	 	
		circle.radius=Math.min(canvas.width,canvas.height)/2;
        Circle(); 	    
        Table();

        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e)   
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            findxy('out', e)
        }, false);

        file = document.getElementById("file"),
/////////////////////////////////
        file.addEventListener("input", function() {
            file = file.name;
        	  
        }, false); 
        
        ColorMap = document.getElementById("ColorMap"),  
        ColorMap.addEventListener("input", function() {
            color = ColorMap.value;
        	currentColor_context.beginPath();
     	    currentColor_context.fillStyle =color; 
     	    currentColor_context.fillRect(0,0,canvas4.width,canvas4.height);
     		currentColor_context.stroke();  
     	 	currentColor_context.closePath();  
        }, false);
        
	    var width__  = document.getElementById("width_no");
        width__ .addEventListener("input", wth, false);
        var height__  = document.getElementById("height_no");
        height__ .addEventListener("input", hgt, false);
        var diameter__  = document.getElementById("diameter_no");
        diameter__ .addEventListener("input", diamtr, false);
        
        window.addEventListener('resize', resizeCanvas, false);   
    }

    
    
 // Table on canvas id can2
    function Table(){
    	context_table.beginPath();
        context_table.strokeStyle = "blue";   	   
    	context_table.moveTo(70,0);
    	context_table.lineTo(70,100);
    	context_table.moveTo(140,0);
    	context_table.lineTo(140,100);
    	context_table.moveTo(0,50);
    	context_table.lineTo(210,50);
    	context_table.font = "14px Arial";
    	context_table.fillText('W',30,27);
    	context_table.fillText('L',100,27);
    	context_table.fillText('D',170,27);
    	context_table.stroke(); 
       	context_table.closePath();
        }
 
 // resize shape through table numbers   
    function wth(){                                     //resize width
    	widthRect=document.getElementById("width_no").value;
		ResizeRect(startRectX,startRectY,widthRect,heightRect);
    	 RedrawObjects();
    	Circle();
    }
    function hgt(){                                //resize height
        	heightRect=document.getElementById("height_no").value;
    		ResizeRect(startRectX,startRectY,widthRect,heightRect);
        	 RedrawObjects();
        	Circle();
        }  
    function diamtr(){                             //resize diameter
        	circle.radius=0.5*(document.getElementById("diameter_no").value);
        	ResizeCircle();
        }


// color of pencil
    function certainColor(obj) {
            switch (obj.id) {
                case "green":
                    color = "green";
                    break;
                case "blue":
                    color = "blue";
                    break;
                case "red":
                    color = "red";
                    break;
                case "yellow":
                    color = "yellow";
                    break;
                case "orange":
                    color = "orange";
                    break;
                case "black":
                    color = "black";
                    break;
                case "cyan":
                    color = "cyan";
                    break;
                case "violet":
                    color = "violet";
                    break;
                case "white":
                    color = "white";
                    break;
            }
           // PenThickness = 2;   //pencil height of thickness
            currentColor_context.beginPath();
      	    currentColor_context.fillStyle =color; 
      	    currentColor_context.fillRect(0,0,canvas4.width,canvas4.height);
     		currentColor_context.stroke();  
      	 	currentColor_context.closePath();
        }

// bool button function 
    function action(obj){
    	if (obj.id=="draw")
    		{ 
    			Action="draw";
    	    	document.getElementById("can").style.cursor = "url('./images/pencil2.png'),auto";// change cursor shape
    		}
    	else if (obj.id=="resizeRect")
    		{	
    			Action="resizeRect";
    	    	document.getElementById("can").style.cursor = "pointer";
    		}
    	else if (obj.id=="resizeCircle")
			{
    			Action="resizeCircle";
	    		document.getElementById("can").style.cursor = "pointer";
			}
    	else if (obj.id=="drawEllipse")
		{
			Action="drawEllipse";
    		document.getElementById("can").style.cursor = "pointer";
		}
    	else if (obj.id=="drawRoundRect")
		{
			Action="drawRoundRect";
    		document.getElementById("can").style.cursor = "pointer";
		}
    	else if (obj.id=="drawLine")
		{
			Action="drawLine";
    		document.getElementById("can").style.cursor = "pointer";
		}
    	
    	return;
    }
//
    function drawLine(startX,startY,stopX,stopY,colorLine,thickness) {
        contextLine.beginPath();
        contextLine.strokeStyle = colorLine;
        contextLine.moveTo(startX, startY);
        contextLine.lineTo(stopX, stopY);
        contextLine.lineWidth = thickness;
        contextLine.stroke();
        contextLine.closePath();
    }

 // free draw by pencil
    function draw() {
        contextPoint.beginPath();
        contextPoint.moveTo(prevX, prevY+20);
        contextPoint.lineTo(currX, currY+20);
        free_pointsX[free_pointsX.length]=currX;		//save points x to array
        free_pointsY[free_pointsY.length]=currY+20;		//save points y to array
        contextPoint.strokeStyle = color;
        colorPoint[colorPoint.length]=color;
        thicknessPoint[thicknessPoint.length]=PenThickness;
        contextPoint.lineWidth = PenThickness;
        contextPoint.stroke();
        contextPoint.closePath();
    }
// redraw the free drawing    
    function Redraw() {
        for (i=0;i<free_pointsX.length-2;i++){
        	prevX=	parseInt(free_pointsX[i]);
        	currX=parseInt(free_pointsX[i+1]);
        	prevY=	parseInt(free_pointsY[i]);
        	currY=parseInt(free_pointsY[i+1]);
        	if (currX!=-1|| currY!=-1)
        		{
        		contextPoint.beginPath();
    	        contextPoint.moveTo(prevX, prevY);
    	        contextPoint.lineTo(currX, currY);
    	        contextPoint.strokeStyle = colorPoint[i];
    	        contextPoint.lineWidth = thicknessPoint[i];
    	        contextPoint.stroke();
    	        contextPoint.closePath();
        		}
        	else{
        		i=i+2;
        		continue;
        		}
        }
        
    }
// clear button function
    function erase() {
        var m = confirm("Want to clear");
        if (m) {
            contextPoint.clearRect(0, 0,  window.innerWidth,  window.innerHeight);
            free_pointsX=[];		//clear array x points
            free_pointsY=[];		//clear array y points
            roundRect_parameter=[];
            ellipse_parameter=[];
            colorPoint=[];
            thicknessPoint=[];
            linePoints=[];
    		ResizeRect(startRectX,startRectY,widthRect,heightRect);
            Circle();
            
        }
    }

// init circle
    function Circle(){
    	contextCircle.beginPath();
        contextCircle.strokeStyle = "black";   	   
   	  contextCircle.lineWidth=2;
       contextCircle.arc(canvas.width/2, canvas.height/2, circle.radius, 0, 2.0 * Math.PI);
		document.getElementById("diameter_no").max = Math.min(canvas.width,canvas.height);
	 	document.getElementById("diameter_no").value = Math.round(circle.radius*2); 
       contextCircle.stroke();  
    	  contextCircle.closePath();
        }
// resize circle with certain center
 	function ResizeCircle(){
 	   contextCircle.clearRect(0,0, canvas.width, canvas.height);
		ResizeRect(startRectX,startRectY,widthRect,heightRect);
 	  RedrawObjects();
 	   contextCircle.beginPath();
 	   contextCircle.strokeStyle = "black";   
 	  contextCircle.lineWidth=2;
 	   contextCircle.arc(canvas.width/2,canvas.height/2 , circle.radius, 0, 2.0 * Math.PI);
       document.getElementById("diameter_no").max = Math.min(canvas.width,canvas.height);
	   document.getElementById("diameter_no").value = Math.round(circle.radius*2); 
 	   contextCircle.stroke();  
 	   contextCircle.closePath();
     }
   
     
    function ResizeRect(pointX,pointY,widthRect,heightRect){
   	   contextRect.clearRect(0,0, canvas.width,canvas.height); 
     	contextRect.beginPath();
  	    contextRect.fillStyle =rect_background; 
  	   contextRect.fillRect(pointX,pointY,widthRect,heightRect);
  	   Redraw();
 	 	document.getElementById("width_no").value = Math.round(widthRect); 
 	 	document.getElementById("height_no").value = Math.round(heightRect);
 	 	contextRect.stroke();  
  	 	contextRect.closePath();	
     }

    
// get the postion of x and y on the canvas 
//take the action to do free draw or draw ellipse,round rectangle,resize rectangle or circle
    function findxy(Mouse ,e) {
   	if (Action=="draw"){
        if (Mouse == 'down') {
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            prevX = currX;
            prevY = currY+20;//20 as image of the pen +20 px
            flag = true;
            free_pointsX[free_pointsX.length]=prevX;		//save points x to array of postions of x to redraw
            free_pointsY[free_pointsY.length]=prevY+20;		//save points y to array of postions of y to redraw
        }
        if (Mouse == 'up' || Mouse == "out") {
            flag = false;
            if(Mouse == 'up')
            	{
            free_pointsX[free_pointsX.length]=-1;//to indicate the line end in x postion
            free_pointsY[free_pointsY.length]=-1;//to indicate the line end in y postion
            	}
            }
        if (Mouse == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw();//to line between two points
            }
        }
    	}
    	
   	    else if (Action=="resizeRect")
        {
            if (Mouse == 'down') 
            {
                
                drag=true;
                }
            if (Mouse == 'up' || Mouse == "out") {
               drag = false;
            document.getElementById("can").style.cursor = "pointer";

            }
            if (Mouse == 'move') {
                curr_x=e.clientX - canvas.offsetLeft;
                curr_y=e.clientY - canvas.offsetTop;
                
                if (drag) {
                if(startRectY-10 < curr_y && startRectY +heightRect+10 > curr_y  && startRectX-10 < curr_x && startRectX+10 > curr_x )
                {
                    document.getElementById("can").style.cursor = "e-resize";
                    if (startRectX > curr_x){
                        widthRect  =widthRect+startRectX-curr_x;    
                    }
                    else if (startRectX < curr_x || startRectX == curr_x){
                        widthRect  =widthRect-(curr_x-startRectX);  
                    }
                    startRectX=curr_x;
                }
                 else if(startRectY-10 < curr_y && startRectY +heightRect+10 > curr_y  && startRectX +widthRect-10 < curr_x && startRectX+widthRect+10 > curr_x )
                {
                    document.getElementById("can").style.cursor = "e-resize";
                    if (startRectX+widthRect > curr_x){
                        widthRect  =curr_x-startRectX;  
                    }
                    else if (startRectX+widthRect < curr_x || startRectX+widthRect == curr_x){
                        widthRect  =curr_x-startRectX;  
                    }   
                }
                 else if(startRectY-10 < curr_y && startRectY +10 > curr_y  && startRectX -10 < curr_x && startRectX+widthRect+10 > curr_x )
                {
                    document.getElementById("can").style.cursor = "n-resize";
                    if (startRectY > curr_y){
                        heightRect  =heightRect-curr_y+startRectY;  
                    }
                    else if (startRectY < curr_y || startRectY == curr_y){
                        heightRect  =heightRect-curr_y+startRectY;
                        
                    }
                    startRectY=curr_y;

                    
                }
                 else if(startRectY+heightRect-10 < curr_y && startRectY+heightRect +10 > curr_y  && startRectX -10 < curr_x && startRectX+widthRect+10 > curr_x )
                {
                    document.getElementById("can").style.cursor = "n-resize";
                    if (startRectY+heightRect > curr_y){
                        heightRect  =curr_y-startRectY; 
                    }
                    else if (startRectY+heightRect < curr_y || startRectY+heightRect == curr_y){
                        heightRect  =curr_y-startRectY;
                        
                    }

                }
                else
                {
                    document.getElementById("can").style.cursor = "pointer";
                }
                ResizeRect(startRectX,startRectY,widthRect,heightRect);
                Circle();
                RedrawObjects();         
                    }
                }
            }
        
    	
        

   	else if (Action=="resizeCircle")
    	{
    		if (Mouse == 'down') {
    			circle.startX = canvas.width/2;
                circle.startY =  canvas.height/2;
                X_ =e.clientX - canvas.offsetLeft;
            	Y_ = e.clientY - canvas.offsetTop;
                r_=Math.sqrt(Math.pow((X_ - circle.startX ), 2) + Math.pow((Y_- circle.startY), 2));

		drag=true;
                }
            
            if (Mouse == 'up' || Mouse == "out") {
               drag = false;
            }
            if (Mouse == 'move') {
                if (drag) {
                	currX =e.clientX - canvas.offsetLeft;
                	currY = e.clientY - canvas.offsetTop;
                    r=Math.sqrt(Math.pow((currX - circle.startX ), 2) + Math.pow((currY- circle.startY), 2));
                    min_canvas=Math.min(canvas.width,canvas.height);
                    if(r < min_canvas/2)
		                    {
		                        circle.radius =r;
		                        ResizeCircle();
							}                   
                    }
                }
    		}
   	else if (Action=="drawLine")	
	{ 	
			if (Mouse == 'down') {
    			startX = e.clientX - canvas.offsetLeft;
    			startY=  e.clientY - canvas.offsetTop;
    			drag=true;
    			 }
 
            if (Mouse == 'up' || Mouse == "out") {
               drag = false; 
               linePoints[linePoints.length]=startX;
               linePoints[linePoints.length]=startY;
               linePoints[linePoints.length]=stopX;
               linePoints[linePoints.length]=stopY;
               linePoints[linePoints.length]=color;
               linePoints[linePoints.length]=PenThickness;


            }
            
            if (Mouse == 'move') {
                if (drag) {
                	stopX =e.clientX - canvas.offsetLeft;
                	stopY = e.clientY - canvas.offsetTop;
            		ResizeRect(startRectX,startRectY,widthRect,heightRect);
	  	 				Circle();	  	 			
	  	 			 RedrawObjects()

	        	        
	        	        drawLine(startX,startY,stopX,stopY,color,PenThickness);
                }
                }			
	}    	
   	else if (Action=="drawEllipse")	
    	{ 
    	
    			if (Mouse == 'down') {
        			centerEllipseX = e.clientX - canvas.offsetLeft;
        			centerEllipseY =  e.clientY - canvas.offsetTop;
        			drag=true;
        			 }
     
                if (Mouse == 'up' || Mouse == "out") {
                   drag = false;
                   
                   ellipse_parameter[ellipse_parameter.length]=centerEllipseX;
                   ellipse_parameter[ellipse_parameter.length]=centerEllipseY;

                   ellipse_parameter[ellipse_parameter.length]=Math.abs(currX_Ellipse-centerEllipseX);
                   ellipse_parameter[ellipse_parameter.length]=Math.abs(currY_Ellipse-centerEllipseY);
                   ellipse_parameter[ellipse_parameter.length]=color;
                   ellipse_parameter[ellipse_parameter.length]=PenThickness;


                }
                if (Mouse == 'move') {
                    if (drag) {
                    	currX_Ellipse =e.clientX - canvas.offsetLeft;
                    	currY_Ellipse = e.clientY - canvas.offsetTop;
                		ResizeRect(startRectX,startRectY,widthRect,heightRect);
  	  	 				Circle();
  	  	 				RedrawObjects();
	        	        drawEllipse(centerEllipseX ,centerEllipseY,Math.abs(currX_Ellipse-centerEllipseX),Math.abs(currY_Ellipse-centerEllipseY),color,PenThickness);			                   

        	        
                    }
                    }			
    	}
   	else if (Action=="drawRoundRect")	
    	{ 
    	
    			if (Mouse == 'down') {
        			centerRoundRectX = e.clientX - canvas.offsetLeft;
        			centerRoundRectY =  e.clientY - canvas.offsetTop;
        			drag=true; 
    			}
     
                if (Mouse == 'up' || Mouse == "out") {
                   drag = false;
                   if ((currX_RoundRect-centerRoundRectX)>0&&(currY_RoundRect-centerRoundRectY)>0){
                   roundRect_parameter[roundRect_parameter.length]=centerRoundRectX;
                   roundRect_parameter[roundRect_parameter.length]=centerRoundRectY;
                   }
                   else if ((currX_RoundRect-centerRoundRectX)<0&&(currY_RoundRect-centerRoundRectY)<0){
                	   roundRect_parameter[roundRect_parameter.length]=currX_RoundRect;
                       roundRect_parameter[roundRect_parameter.length]=currY_RoundRect;
                       }
                   else if ((currX_RoundRect-centerRoundRectX)>0&&(currY_RoundRect-centerRoundRectY)<0){
                	   roundRect_parameter[roundRect_parameter.length]=centerRoundRectX;
                       roundRect_parameter[roundRect_parameter.length]=currY_RoundRect;
                       }
                   else if ((currX_RoundRect-centerRoundRectX)<0&&(currY_RoundRect-centerRoundRectY)>0){
                	   roundRect_parameter[roundRect_parameter.length]=currX_RoundRect;
                       roundRect_parameter[roundRect_parameter.length]=centerRoundRectY;
                       }
                
                   roundRect_parameter[roundRect_parameter.length]=Math.abs(currX_RoundRect-centerRoundRectX);
                   roundRect_parameter[roundRect_parameter.length]=Math.abs(currY_RoundRect-centerRoundRectY);   
                   roundRect_parameter[roundRect_parameter.length]=color;
                   roundRect_parameter[roundRect_parameter.length]=PenThickness;

                   
                   
                }
                if (Mouse == 'move') {
                    if (drag) {
                    	currX_RoundRect =e.clientX - canvas.offsetLeft;
                    	currY_RoundRect = e.clientY - canvas.offsetTop;
                		ResizeRect(startRectX,startRectY,widthRect,heightRect);
  	  	 				Circle();
  	  	 				RedrawObjects();
  	  	 			if ((currX_RoundRect-centerRoundRectX)>0&&(currY_RoundRect-centerRoundRectY)>0){
	        	        roundRect(centerRoundRectX ,centerRoundRectY,currX_RoundRect-centerRoundRectX,currY_RoundRect-centerRoundRectY,color,PenThickness);
  	  	 			}
  	  	 			else if ((currX_RoundRect-centerRoundRectX)<0&&(currY_RoundRect-centerRoundRectY)>0){
	        	        roundRect(currX_RoundRect ,centerRoundRectY,Math.abs(currX_RoundRect-centerRoundRectX),Math.abs(currY_RoundRect-centerRoundRectY),color,PenThickness);
                    }
  	  	 			else if((currX_RoundRect-centerRoundRectX)>0&&(currY_RoundRect-centerRoundRectY)<0){
        	        roundRect(centerRoundRectX ,currY_RoundRect,Math.abs(currX_RoundRect-centerRoundRectX),Math.abs(currY_RoundRect-centerRoundRectY),color,PenThickness);
                    }
                    else if((currX_RoundRect-centerRoundRectX)<0&&(currY_RoundRect-centerRoundRectY)<0){
        	        roundRect(currX_RoundRect ,currY_RoundRect,Math.abs(currX_RoundRect-centerRoundRectX),Math.abs(currY_RoundRect-centerRoundRectY),color,PenThickness);
                    }
                }			
    	}	
   }
   	}
    
 // draw ellipse   
    function drawEllipse(EllipseCenterX,EllipseCenterY,radiusX, radiusY,colorEllipse,thickness) {
  		 if( EllipseCenterX>0 && EllipseCenterY>0&& radiusX>0&& radiusY>0){
      	contextEllipse.beginPath();
 		 contextEllipse.strokeStyle = colorEllipse;
 		contextEllipse.lineWidth=thickness;
      	contextEllipse.ellipse(EllipseCenterX,EllipseCenterY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      	contextEllipse.stroke();
        contextEllipse.closePath();
    }
  }
    
// draw round rectangle with radius 10
    function roundRect(centerX,centerY,width,height,colorRoundRect,thickness) {
		radius=10;
  	  	if (width< 2 * radius) radius = width / 2;
	  	if (height < 2 * radius) radius = height / 2;
	  	contextRoundRect.beginPath();
	  	contextRoundRect.strokeStyle = colorRoundRect;
	  	contextRoundRect.lineWidth=thickness;
	  	contextRoundRect.moveTo(centerX+radius, centerY);
	  	contextRoundRect.arcTo(centerX+width, centerY,   centerX+width, centerY+height, radius);
	  	contextRoundRect.arcTo(centerX+width, centerY+height, centerX,   centerY+height, radius);
	  	contextRoundRect.arcTo(centerX,   centerY+height, centerX,   centerY,   radius);
	  	contextRoundRect.arcTo(centerX,   centerY,   centerX+width, centerY,   radius);
	  	contextRoundRect.stroke();
	  	contextRoundRect.closePath();
    }

//canvas resized as window size change
    function resizeCanvas() {    	
        canvas.width = 3*window.innerWidth/4;
        canvas.height = 3*window.innerHeight/4; 
	 	document.getElementById("height_no").max = canvas.height;
	 	document.getElementById("width_no").max = canvas.width;
		ResizeRect(startRectX,startRectY,widthRect,heightRect);
        RedrawObjects();
        Circle(); 
        Redraw();
    }
    
//save the image    
    function  save(link) {
	    link.href = canvas.toDataURL();
	        link.download = "mypainting.png";
        }
    
//change rectangle color
    function RectBackground(){
    rect_background=color;
	ResizeRect(startRectX,startRectY,widthRect,heightRect);
    RedrawObjects();
    Circle();
    }

    function RedrawObjects(){
    	var i;
        for(i = 0; i < roundRect_parameter.length; i=i+6){
               roundRect(roundRect_parameter[i],roundRect_parameter[i+1],roundRect_parameter[i+2],roundRect_parameter[i+3],roundRect_parameter[i+4],roundRect_parameter[i+5]);  	        	             
    		}
    	      for(i = 0; i < ellipse_parameter.length; i=i+6){
    	     	drawEllipse(ellipse_parameter[i],ellipse_parameter[i+1],ellipse_parameter[i+2],ellipse_parameter[i+3],ellipse_parameter[i+4],ellipse_parameter[i+5]);  	        	           
    	     }
    	      
    	     for(i = 0; i < linePoints.length; i=i+6){
    	     	drawLine(linePoints[i],linePoints[i+1],linePoints[i+2],linePoints[i+3],linePoints[i+4],linePoints[i+5]);
    				}
    }
//change canvas Background color
	function CanvasBackground(){
        canvas.style.background=color;
        }
	
	function Thickness(obj){
		switch (obj.id) {
        case "2":
        	PenThickness = 2;
            break;
        case "5":
        	PenThickness = 5;
            break;
        case "7":
        	PenThickness = 7;
            break;
        case "10":
        	PenThickness =10;
            break;
        
	}
		}



