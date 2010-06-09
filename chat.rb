require 'rubygems'
require 'em-websocket'

EventMachine.run {
  @channel = EM::Channel.new
  
  @userList = []

  EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8085, :debug => true) do |ws|

    ws.onopen {
      sid = @channel.subscribe { |msg| ws.send msg }
      #@channel.push "(Push)#{sid} connected!"
      #ws.send "test DM"

      ws.onmessage { |msg|
        @channel.push "#{msg}"
      }

      ws.onclose {
        @channel.unsubscribe(sid)
      }

    }
  end

  puts "Server started"
}
