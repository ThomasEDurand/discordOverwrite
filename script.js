async function randSleep() { await new Promise(resolve => setTimeout(resolve, (Math.floor(Math.random()*101)+2000)));} // RANDOM DELEAY MAY NEED ADJUSTING

async function randomMessage(){
    message = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipiscing velit sed quia non numquam doeius modi tempora incididunt, ut labore et dolore magnam aliquam quaerat voluptatem Ut enim ad minima veniam quis nostrumd exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum irure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum, qui dolorem eum fugiat quo voluptas nulla pariatur At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint obcaecati cupiditate non provident similique sunt in culpa qui officia deserunt mollitia animi id est laborum et dolorum fuga Et harum quidem rerum facilis est et expedita distinctio Nam libero tempore cum soluta nobis est eligendi optio, cumque nihil impedit quo minus id quod maxime placeat facere possimus omnis voluptas assumenda est omnis dolor repellendus Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat";
    mLen = Math.floor(Math.random() * 101)+5;
    startIdx = Math.floor(Math.random() * 101);
    return message.slice(startIdx, startIdx+mLen) + "Carthago delenda est";
}

async function overwriteMessage(channel_id, message_id){
    await randSleep();
    channel_url = `https://discord.com/api/v9/channels/${channel_id}/messages/${message_id}`
    editReq = new XMLHttpRequest();
    editReq.withCredentials = true;
    editReq.open("PATCH", channel_url);
    editReq.setRequestHeader("authorization", token);
    editReq.setRequestHeader("accept", "/");
    editReq.setRequestHeader("authority", "discord.com");
    editReq.setRequestHeader("content-type", "application/json");
    message = await randomMessage();
    console.log(message);
    try{editReq.send(JSON.stringify({ content: message }));}
    catch {console.log(`Error editing message ${message_id}`); await randSleep();}
}

async function writeChannel(token, guild_id, author_id){
    // search channel for all messages send by user
    console.log(author_id);
    search_url = `https://discord.com/api/v9/guilds/${guild_id}/messages/search?author_id=${author_id}`;
    searchReq = new XMLHttpRequest();
    searchReq.withCredentials = true;
    searchReq.open("GET", search_url, false);
    searchReq.setRequestHeader("authorization", token);
    searchReq.setRequestHeader("accept", "/");
    searchReq.setRequestHeader("authority", "discord.com");
    searchReq.setRequestHeader("content-type", "application/json");
    try {searchReq.send(null);}
    catch {console.log(`Error getting messages from guild ${guild_id}`);}

    const resp = await searchReq.response;
    const parsedResp = JSON.parse(resp);

    // overwrite all messages found
    for (i = 0; i < parsedResp.total_results; i++){
	    m_id = parsedResp.messages[i][0].id;
	    c_id = parsedResp.messages[i][0].channel_id;
	    content = parsedResp.messages[i][0].content;
	    if(content.search("Carthago delenda est") == -1){
	      await overwriteMessage(c_id ,m_id);
	    }
    }
}

async function getUserID(token){
    search_url = `https://discord.com/api/v9/users/@me`;
    gReq = new XMLHttpRequest();
    gReq.withCredentials = true;
    gReq.open("GET", search_url, false);
    gReq.setRequestHeader("authorization", token);
    gReq.setRequestHeader("accept", "/");
    gReq.setRequestHeader("authority", "discord.com");
    gReq.setRequestHeader("content-type", "application/json");
    try {gReq.send(null);}
    catch {console.log(`Error getting author id`); return -1;}

    const mResp = await gReq.response;
    const parsedMResp = JSON.parse(mResp);
    console.log("parsedMresp:", parsedMResp.id);
    return parsedMResp.id
}

async function mainFunction(){
    
    token = "YOUR TOKEN HERE";
    g_id = "GUILD ID HERE";
    a_id = await getUserID(token);
    if (a_id != -1){
	    await writeChannel(token, g_id, a_id);
    }
    console.log("finished overwritting messages");
}

mainFunction();
