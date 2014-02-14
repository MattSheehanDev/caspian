module.exports = Socket;

//Include net module
var net = require('net');


//Socket class
function Socket() 
{
	this.nickname = '';
	this.server = '';
	this.channel = '';

	this.buffer = '';

	this.open = false;

	this.socket;
	this.connection;
}


//Connects socket to irc server
Socket.prototype.connect = function(conn)
{
	//Create net::socket
	var sock = net.Socket();

	this.connection = conn;
	this.socket = sock.connect(6667, this.server);

	this.socket.setKeepAlive(true);

	this.socket.setEncoding('utf8');


	//Start recursive pings.
	this.keepAlive();


	//When first connected.
	this.socket.on('connect', function()
	{
		this.socket.write('NICK ' + this.nickname + '\r\n');
		this.socket.write('USER ' + this.nickname + ' 0 * :realname\r\n');
		this.socket.write('JOIN  ' + this.channel + '\r\n');

		this.open = true;

	}.bind(this));


	//When data is received.
	//Write to connection.
	this.socket.on('data', function(data)
	{
		this.connection.write(data + '\r\n');

	}.bind(this));


	//When socket is closed.
	this.socket.on('close', function(err)
	{
		this.open = false;
		console.log('socket closed');
		this.connection.write('Socket closed. Restart and Reconnect.\r\n');

	}.bind(this));


	//Poor error checking
	this.socket.on('error', function(err)
	{
		//swallow errors
	});
}


//Sends public message to channel
Socket.prototype.sendMessage = function()
{
	if(this.open)
		this.socket.write('PRIVMSG ' + this.channel + ' :' + this.buffer + '\r\n');
}


//Clears message buffer
Socket.prototype.clearBuffer = function()
{
	this.buffer = '';
}


//Sends pings as long as socket is open.
//Recursively calls itself until the socket is closed.
Socket.prototype.keepAlive = function()
{
	setTimeout(function()
	{

		if(this.open)
		{
			this.socket.write('PING ' + this.socket.localAddress + '\r\n');

			this.keepAlive();
		}

	}.bind(this), 60000);
}