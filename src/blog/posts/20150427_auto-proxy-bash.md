---
title: Control auto proxy discovery with bash
description: Use bash to control your auto proxy discovery with networksetup
tags:
- Mac OS X
- auto proxy discovery
- networksetup
- panda
---

I use OS X at work, and unfortunately the network and client configuration only work seamlessly for Windows. OS X users are second-class citizens (Linux/Unix users have it even worse).

When I am on my work's network, I must have Auto Proxy Discovery turned on in order to browse websites outside of the intranet. I would leave it on all the time, but then I have to wait for my browsers to attempt the proxy discovery when I am outside of my work network. 

You can toggle Auto Proxy Discovery in System Preferences. It is a 6-step process:

1. Go to the Network section of System Preferences
2. Open the Advanced settings of the Wi-Fi interface
3. Open the Proxies tab
4. Check the Auto Proxy Discovery checkbox
5. Click OK
6. Click Apply

Like other programmers, I am lazy and want this to be a one-step process. Terminal + bash functions to the rescue!

```bash
# toggle auto proxy discovery of the Wi-Fi interface
function autoproxtog() {
  autoproxStat="$(networksetup -getproxyautodiscovery "Wi-Fi")"
  if [ "$autoproxStat" = "Auto Proxy Discovery: Off" ]; then
    networksetup -setproxyautodiscovery "Wi-Fi" on
    echo "Auto Proxy Discovery: ON"
  elif [ "$autoproxStat" = "Auto Proxy Discovery: On" ]; then
    networksetup -setproxyautodiscovery "Wi-Fi" off
    echo "Auto Proxy Discovery: OFF"
  else
    echo "Something has gone wrong detecting the current Auto Proxy Discovery state :("
  fi
}
```

The above function toggles your Auto Proxy Discovery state on the network interface named "Wi-Fi". If you want to use it on a different interface, simply replace "Wi-Fi" with name of the interface you want to toggle (e.g. "USB Ethernet").

To use it, add the above code to your `.bash_profile`, then reload your `.bash_profile` with `source ~./bash_profile` or by opening up a new Terminal tab/window.

Then you can run the function by simply typing:
```
autoproxtog
```

Unfortunately, you have to provide your password when you run the command. But 2 steps is far better than 6.
