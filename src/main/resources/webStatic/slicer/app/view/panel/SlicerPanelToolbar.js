Ext.define('SlicerApp.view.panel.SlicerPanelToolbar' ,{
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.slicerpaneltoolbar',
    
    items : [
    	{
    		text : 'Split',
    		tooltip : 'Split',
    		handler : function(e){
    			//var toolbar = this.up();
    			var slicerPanel = this.up().up();
    			console.log('HSplit: ' + slicerPanel.title);
    			
    			var centerPanel = slicerPanel.items.findBy(function(item,key){
		    		return item.region === 'center';
		    	});
		    	
		    	
		    	if(centerPanel === null){
		    		slicerPanel.add(
					{
				        xtype: 'panel',
				        region: 'center',
				        layout: {
							type: 'border'

						},
						defaults: {
							split: true,
							padding: 0,
                            margin: 0,
                            border: 1
						},
	//			        title: 'center',
				        tbar : Ext.create('SlicerApp.view.panel.SlicerPanelToolbar'),
				       	width : '50%',
				       	padding: 0,
                        marginn: 0,
                        border: 1
				  //      html : 'center',
				  //      tools : [ //	{type : 'gear', callback: regionsMenu },
				    		//		{type: 'close',handler: closeRegion}
				//    			]
		        	});
		    	}
    			

				slicerPanel.add(
					
		        	{
				        xtype: 'panel',
				        region: 'east',
				        layout: {
							type: 'border'

						},
						defaults: {
							split: true,
							padding: 0,
                            margin: 0,
                            border: 1
						},
			//	        title: 'east',
				        tbar : Ext.create('SlicerApp.view.panel.SlicerPanelToolbar'),
				       	width : '50%',
				       	padding: 0,
                        marginn: 0,
                        border: 1
			//	        html : 'east',
			//	        tools : [ //	{type : 'gear', callback: regionsMenu },
			//	    				{type: 'close',handler: closeRegion}
			//	    			]
		        	}
            	 );
            	 
            	 this.hide();
    		}
    	},
    	
    	{
    		text : 'Rotate',
    		tooltip : 'Rotate',
    		handler : function(e){
    			var slicerPanel = this.up().up();
    			
    			var centerPanel = slicerPanel.items.findBy(function(item,key){
		    		return item.region === 'center';
		    	});
		    	
    			var rotatePanel = slicerPanel.items.findBy(function(item,key){
		    		return item.region === 'east' || item.region === 'north' || item.region === 'south' || item.region === 'west';
		    	});
    			
 				switch(rotatePanel.region){
 					case 'east':
 						centerPanel.height = '50%';
 						rotatePanel.height = '50%';
 						rotatePanel.setBorderRegion('south');
 					break;
 					case 'south':
 						centerPanel.width = '50%';
 						rotatePanel.width = '50%';
 						rotatePanel.setBorderRegion('west');
 					break;
 					case 'west':
 						centerPanel.height = '50%';
 						rotatePanel.height = '50%';
 						rotatePanel.setBorderRegion('north');
 					break;
 					case 'north':
 						centerPanel.width = '50%';
 						rotatePanel.width = '50%';
 						rotatePanel.setBorderRegion('east');
 					break;
 				}
    		}
    	},
    	
    	{
    		text : 'Close',
    		tooltip : 'Close',
    		handler : closeRegion
    	
    	}
    ]
    
});
    
    
    
function closeRegion (e, target, header, tool) {
        var panel = e.ownerCt.up();
        
        var slicerPanel = panel.up();
        
        //console.log('closeRegion panel.title ' + panel.title);
        
        slicerPanel.remove(panel);
        
        if(panel.region === 'center'){
        	var lastPanel = slicerPanel.items.findBy(function(item,key){
        		console.log('findBy: getXType ' + item.getXType())
        		return item.region === 'south' || item.region === 'east';
        	});
        	
        	if(lastPanel){
        		//console.log('closeRegion lastPanel.title ' + lastPanel.title);

        		lastPanel.setBorderRegion('center');
        	}
        	else{
        		
        	}
        	
        }
        
        var toolbar = slicerPanel.getDockedItems('toolbar[dock="top"]')[0];
        
        var btnSplit = toolbar.items.findBy(function(item,key){
        		//console.log('findBy: getXType ' + item.getXType())
        		return item.tooltip === 'Split';
        	});
        
        btnSplit.show();
    }
