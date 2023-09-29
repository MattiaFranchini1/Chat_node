import { WebSocketServer } from "ws";

let clients_socket = []
let utenti_totali = 0;
let nome_sender;
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {


    /*for(let i=0;i<clients_socket.length;i++){
        clients_socket[i].send(JSON.stringify({"joinato": "Utente" + parseInt(utenti_totali+1)}))
        //console.log(JSON.stringify({"online": user_online}))
    }*/

    ws.send(JSON.stringify({"user": utenti_totali+1}));
    //let nuovo_utente = new utenti("Utente" + parseInt(clients.length+1), clients.length+1)
    //clients.push(nuovo_utente);
    //ws.name = "Utente" + parseInt(utenti_totali+1)
    ws.id = parseInt(utenti_totali+1)
    clients_socket.push(ws);
    utenti_totali++;

    clients_socket.forEach(function(utenti){
        console.log(utenti.name);
    });

  ws.on('message', function message(data) {
    

    console.log('received:' + data);
    let message = JSON.parse(data)
    console.log(message)


    if(message.imposta){
        ws.name = message.imposta;
    }
    if(message.content){
        for(let j=0;j<clients_socket.length;j++){
            if(clients_socket[j].name == message.person){
                nome_sender = clients_socket[j].name
                console.log("trovato")
                console.log(nome_sender)
            }
        }


        for(let i=0;i<clients_socket.length;i++){
        //console.log(JSON.stringify({"content": message.content}))
        if(clients_socket[i].name != message.person){
            clients_socket[i].send(JSON.stringify({"content": message.content, "sender": nome_sender}))
        }else{
            clients_socket[i].send(JSON.stringify({"content": message.content, "sender": "Tu"}))
        }
    }
    }else if(message.online){
        let user_online = [];
        clients_socket.forEach(function(utenti){
            user_online.push(utenti.name);
            //console.log(utenti.name)
        });
        for(let i=0;i<clients_socket.length;i++){
            clients_socket[i].send(JSON.stringify({"online": user_online}))
            //console.log(JSON.stringify({"online": user_online}))
        }
    }
  });

  //ws.send('something');
  ws.onclose = () => {
    console.log("The connection has been closed successfully.");
    const index = clients_socket.indexOf(ws);
    for(let i=0;i<clients_socket.length;i++){
        clients_socket[i].send(JSON.stringify({"leftato": clients_socket[index].name}))
        //console.log(JSON.stringify({"online": user_online}))
    }
    clients_socket.splice(index, 1);
    ws.close()
  };

});