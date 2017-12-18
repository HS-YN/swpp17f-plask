from channels import Channel, Group
from channels.sessions import channel_session
from channels.auth import channel_session_user, channel_session_user_from_http
import json

# Connected to websocket.connect
@channel_session_user_from_http
def ws_add(message):
    # Accept connection
    message.reply_channel.send({"accept": True})
    # Add them to the right group
    print(message.user.userinfo.nickname);
    Group("chat-%s" % message.user.userinfo.nickname).add(message.reply_channel)

# Connected to websocket.receive
@channel_session_user
def ws_message(message):   
    #receiver = req_data['q_author']
    data = json.loads(message['text'])
    print("send: ", data['q_author'])
    Group("chat-%s" % data['q_author']).send({
        "text": data['text'],
    })

# Connected to websocket.disconnect
@channel_session_user
def ws_disconnect(message):
    Group("chat-%s" % message.user.userinfo.nickname).discard(message.reply_channel)