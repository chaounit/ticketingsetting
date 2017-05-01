var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	router = express.Router(),
	moment = require('moment'),
	tickets = [{'id':0,'name':'Boss','station': '2','bath':'10','date':moment().subtract(3,'days')}, 
	       		{'id':1, 'name':'Chao','station': '3','bath':'20','date':moment().subtract(2,'days')},
	       		{'id':2, 'name':'Maey','station': '3','bath':'20','date':moment().subtract(1,'days')},
	       		{'id':3, 'name':'Fern','station': '4','bath':'30','date':moment().subtract(1,'days')}],
	idx = 4;
	var tables = [];
	tables.push({'date':tickets[0].date,'station2':0,'station3':0,'station4':0})

app.use(express.static(__dirname + '/public'));

router.route('/table')
	.get(function(req, res) { 
		cal();
    	res.json(tables);
    })

router.route('/tickets') 
	.get(function(req, res) { 
		//console.log(tickets); 
    	res.json(tickets);
    })


	.post(function(req, res) { 
		var ticket = {}; 
		ticket.id = idx++;
		ticket.name = req.body.name		
		ticket.station = req.body.station
		ticket.bath = req.body.bath
		ticket.date = moment()
		tickets.push(ticket); 
		//console.log(tickets);
		res.json({message : 'Success'})
	}) 

  
router.route('/tickets/:ticket_id')
	.get (function(req,res) {
    	res.json(tickets[req.params.ticket_id])
    })

	.put (function(req,res) {
		var id = req.params.ticket_id
        tickets[id].name = req.body.name;
        console.log(req.body.name)  
        tickets[id].station = req.body.station;
        tickets[id].bath = req.body.bath 
        editTable(tickets[id],req.body.station)
        res.json({ message: 'ticket updated!' });        
     })

	.delete (function(req,res) {
		var id = req.params.ticket_id
		deleteTable(tickets[id])
		delete 	tickets[id]
        res.json({ message: 'ticket deleted!' });        
    })
router.get('/', function(req, res) {
    res.json({ message: 'Welcome' }) 
});

function cal(){
	tables = [];
	tables.push({'date':tickets[0].date,'station2':0,'station3':0,'station4':0,'allStation':0})
	for (var i in tickets) {
		if(checktable(tickets[i])){
			tables.push({'date':tickets[i].date,'station2':0,'station3':0,'station4':0,'allStation':0})
			//console.log('push' + moment(tickets[i].date).date())
		}
		addTable(tickets[i])
	}
	//console.log(tickets)
}

function checktable(ticket){
	//console.log(moment(ticket.date).date())
	for(var j in tables){
		//console.log(moment(tables[j].date).date())
		if(moment(ticket.date).date() == moment(tables[j].date).date()){
			//console.log('ret')
			return false;
		}
	}
	return true;
}

function addTable(ticket){
	for(var j in tables){
		if(moment(ticket.date).date() == moment(tables[j].date).date()){
			if(ticket.station == 2){
				tables[j].station2++
			}
			else if(ticket.station == 3){
				tables[j].station3++
			}
			else{
				tables[j].station4++
			}
			tables[j].allStation++
		}
	}
}

function deleteTable(ticket){
	for(var j in tables){
		if(moment(ticket.date).date() == moment(tables[j].date).date()){
			if(ticket.station == 2){
				tables[j].station2--
			}
			else if(ticket.station == 3){
				tables[j].station3--
			}
			else{
				tables[j].station4--
			}
			tables[j].allStation--
		}
	}
}

function editTable(ticket,newStation){
	for(var j in tables){
		if(moment(ticket.date).date() == moment(tables[j].date).date()){
			if(ticket.station == 2 && newStation == 3){
				tables[j].station2--
				tables[j].station3++
			}
			else if(ticket.station == 2 && newStation == 4){
				tables[j].station2--
				tables[j].station4++
			}
			else if(ticket.station == 3 && newStation == 2){
				tables[j].station3--
				tables[j].station2++
			}
			else if(ticket.station == 3 && newStation == 4){
				tables[j].station3--
				tables[j].station4++
			}
			else if(ticket.station == 4 && newStation == 2){
				tables[j].station4--
				tables[j].station2++
			}
			else if(ticket.station == 4 && newStation == 3){
				tables[j].station4--
				tables[j].station3++
			}
		}
	}
}

app.use('/api', bodyParser.json(), router);  
 
app.use("*",function(req,res){
  res.status(404).send('404 Not found');
});

app.listen(50010, function() {
	console.log("Server is running")
});