---
layout: article
title: Turn HTTP
---

# TurnHTTP

TurnHTTP is a simple Go package and setup for creating a deploying a scalable TURN server for use with WebRTC. Please read the [godocs](http://godocs.org/github.com/dataarts/turhttp) on the package for more info. Below is a brief writeup on why it was written and how to use it.

## WebRTC

[WebRTC](www.webrtc.org) is wonderful, it provides a great mechanism for a plugin free peer to peer connection for voice, video, and data. When used over simple network configuration it is realatively easy to set up. However, with more complicated network topologies we are faced with firewall scenarios which complicate direct communication.

The first method of punching through the firewall is what is called a STUN server. This uses an outside server, like this one from Google [stun.google.com](stun.google.com) 

INSERT PHOTO

Second in scenarios where both peers are behind a firewall  

this is an paragraph of stuff


this is some more code

```javascript
function test() {
  var stuff = 33;
  console.log(stuff);
}

test();
```
