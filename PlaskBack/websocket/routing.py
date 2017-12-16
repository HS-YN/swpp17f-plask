from channels.routing import route
from websocket.consumers import ws_add, ws_message, ws_disconnect

channel_routing = [
    route("websocket.connect", ws_add, path=r"^/notification"),
    route("websocket.receive", ws_message, path=r"^/notification"),
    route("websocket.disconnect", ws_disconnect, path=r"^/notification"),
]

