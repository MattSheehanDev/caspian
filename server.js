var net = require('net');
var Socket = require('./socket');


var server = net.createServer(function(conn)
{
	//Create New Socket Class
	var socket = new Socket();

	conn.setEncoding('utf8');


	//Prompt to enter data.
	conn.write('IRC Client : v.0.0.1\r\n'
		+ 'Enter Nickname: '
		);


	//When data is received.
	//First data sent is name. Next Server. Next Channel. After that messages.
	conn.on('data', function(data)
	{
		if(data == '\r\n')
		{
			if(!socket.nickname)
			{
				socket.nickname = socket.buffer;

				conn.write('Enter Server: ');
			}

			else if(!socket.server)
			{
				socket.server = socket.buffer;

				conn.write('Enter Channel: ');
			}

			else if(!socket.channel)
			{
				socket.channel = socket.buffer;

				conn.write('Connecting...\r\n');

				socket.connect(conn);
			}
			else
			{
				socket.sendMessage();
			}

			socket.clearBuffer();
		}
		else
		{
			socket.buffer += data;
		}
	});


	//When socket is closed
	conn.on('close', function()
	{
		console.log(socket.nickname + ' closed.');
		socket.open = false;

		//End socket if open
		if(socket.socket)
		{
			socket.socket.end();
		}
	});


	//Poor error handling
	conn.on('error', function(err)
	{
		//swallow errors
	});

});

//Start listening
server.listen(23, function()
{
	console.log('\033[96mServer listening on *:23\033[39m');
})