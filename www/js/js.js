var retrievedObject = localStorage.getItem('testObject');
var data=JSON.parse(retrievedObject);

var retrievedObject1 = localStorage.getItem('restaurant_info');
var restaurant=JSON.parse(retrievedObject1);

var restaurant_id=restaurant.restaurantid;
var restaurant_details;

var items = localStorage.getItem('items_all');
var items_all=JSON.parse(items);
		
	function list()
	{
		for(var i=0;i<items_all.length;i++){
		$('#ItemCode'+items_all[i].ItemCode+' div .sub-span').addClass('green');
		}
		
	}
function tab(a){

	$.ajax({
		type :'POST',
		url :'http://app.skoruz.com:7979/DEV_ONLINE/RstCtl',
		data :'ses_id='+data.session+'&sol=r_vnd_list1&lat='+restaurant.Lat+'&log='+restaurant.Lon+'&rst_id='+a,
		dataType :'jsonp',
		success :function(data){
    	    var source   = $("#vendorListTemplate").html();
    	    var template = Handlebars.compile(source);
    	    var html = template(data.VND_LIST);
    	    $('.tab'+a).html(html);
		}
	});
	$('.more').children('.circle-green').children('b').html('+');
	$('.more'+a).children('.circle-green').children('b').html('--');
	$('.tab').hide();
	$('.tab'+a).show();
}

	function toggle(id)
	{
		loadMenuDetails(id, data.session, restaurant.Lat, restaurant.Lon);
	}


function calls()
	{
		loadRestaurantMenuDetails(restaurant.restaurantid, data.session, restaurant.Lat, restaurant.Lon);
	}


function loadRestaurantMenuDetails(restaurantId, sessionId, latitude, longitude){
	
	$.ajax({
		type :'POST',
		url :'http://app.skoruz.com:7979/DEV_ONLINE/RstCtl',
		data :'ses_id='+sessionId+'&sol=r_rst_det1&lat='+latitude+'&log='+longitude+'&rst_id='+restaurantId,
		dataType :'jsonp',
		success :function(data){
			
			if(data.RST_DET.arryOwnItems.length > 0){
				//adding restaurant
				restaurant_details=data;
				var  restaurantlayout  = $("#RestaurantLayout").html();
				var Layout = Handlebars.compile(restaurantlayout);
				var html = Layout(data);
				$('#mainList').append(html);
			}else{
			  // adding vendors (partner restaurant)	
				var vendorListJson = [];
				var vendorId = data.VND_ID;
				var vendorList = data.RST_DET.mapVndList;
				
				$.each(vendorList, function(k, v) {
				    var vendorjson = {'RestaurantID':k, 'RestaurantName':v.RestaurantName, 'vendorId':vendorId};
					vendorListJson.push(vendorjson);
				});
				
				var  restaurantlayout  = $("#RestaurantLayout").html();
				var Layout = Handlebars.compile(restaurantlayout);
				var html = Layout(vendorListJson);
				$('ul#mainList').append(html);
			}
			
				//adding info
	    	    var source = $('#infoTemplate').html();
	    	    var template =  Handlebars.compile(source);
	    	    var html = template(data.RST_DET);
	    	    $('#info').html(html);
	    	    
	    	    //adding photo
	    	    var source = $('#photoTemplate').html();
	    	    var template =  Handlebars.compile(source);
	    	    var html = template(data.RST_DET);
	    	    $('#photo').html(html);
				
		}
	});
// fetching reviews 
	$.ajax({
		type :'POST',
		url :'http://app.skoruz.com:7979/DEV_ONLINE/RstCtl',
		data :'ses_id='+sessionId+'&sol=view_review&rst_id='+restaurantId,
		dataType :'jsonp',
		success :function(data){
			
			$('#totalReview').text(data.feedBack_list.length);
			
    	    var source   = $("#feedBackTemplate").html();
    	    var template = Handlebars.compile(source);
    	    var html = template(data.feedBack_list);
			$('ul#feedBackList').append(html);
		}
		
	});
}

function loadMenuDetails(restaurantId, sessionId, latitude, longitude){
	
	$('.menuCategory').empty();
	$('.menuItem').empty();
	
	$.ajax({
		type :'POST',
		url :'http://app.skoruz.com:7979/DEV_ONLINE/RstCtl',
		data :'ses_id='+sessionId+'&sol=r_rst_det1&lat='+latitude+'&log='+longitude+'&rst_id='+restaurantId,
		dataType :'jsonp',
		success :function(data){
			
				restaurant_details=data;	
				
				if(data.RST_DET.arryOwnItems.length > 0){
					
	    	    	$('.all'+restaurantId).show();
		    	    var source   = $("#menuTemplate").html();
		    	    var template = Handlebars.compile(source);
		    	    var html = template(data.RST_DET.arryOwnItems);
					$('#id'+restaurantId+' .Menucategory'+restaurantId).append(html);
					
		    	    var source   = $("#menuDetailTemplate").html();
		    	    var template = Handlebars.compile(source);
		    	    var html = template(data.RST_DET.arryOwnItems);
					$('#id'+restaurantId+' .MenuItems'+restaurantId).append(html);
					
	    	    }
	    		
	    		$('#restaurant_details'+restaurantId).show();
	    	    
		}
	});

}


function menu_toggel(id)
{
	$('.menuDishDetails').hide();
	if(id=='all')
	{
		$('.menuDishDetails').show();
	}
	else
	{
		$('#Cat_'+id).show();
	}

}

function add_items(id){
	
	var d;
	var details;
	var name=[];
	var p=restaurant_details.RST_DET.arryOwnItems;
	
	for(var prop in p){ 
		
		var a=p[prop];
		for(var prop in a){
					
			if(prop=='menu')
			var c=a[prop];
			for(var prop in c){
				var menu=c[prop];
				
				if(menu.ItemCode==id)
				{	
				name=menu;
				}
			}
		}
	}
	
	var green=$('#ItemCode'+id+' div .sub-span').hasClass('green');
	if(items_all.length==0)
	{
	d={'RestaurantID':restaurant_id, 'ItemCode':id,'Itemdetails':name, 'numbers':'1'};
	items_all.push(d);
	}
	else
	{
				
		if(green)
		{
		var list=items_all;
		items_all=[];
		for(var i=0;i<list.length;i++){
				
			if(list[i].ItemCode!=id)
			{
				items_all.push(list[i]);
			}
		}
		}
		else
		{
		d={'RestaurantID':restaurant_id, 'ItemCode':id,'Itemdetails':name, 'numbers':'1'};
		items_all.push(d);
		}
		for(var prop in items_all){ 
		//alert(items_all[prop].ItemCode);
		//alert(prop+': '+items_all[prop]);
		}
	}
		$('#ItemCode'+id+' div .sub-span').toggleClass('green');
}

function Shopping()
{
	localStorage.setItem('items_all', JSON.stringify(items_all));
	window.location = 'order.html';
}
