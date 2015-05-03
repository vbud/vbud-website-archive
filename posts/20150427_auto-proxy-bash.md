---
title: Control auto proxy discovery with bash
description: Use bash to control your auto proxy discovery with networksetup
tags:
- Mac OS X
- auto proxy discovery
- networksetup
- panda
---

If you use OS X at work, you may have a similar issue.

When I am on my work's network, I have to have Auto Proxy Discovery turned on to browse websites outside of the intranet. It is a 6-step process to do this from the UI:

1. Go to the Network section of System Preferences
2. Open the Advanced settings of the Wi-Fi interface
3. Open the Proxies tab
4. Check the Auto Proxy Discovery checkbox
5. Click OK
6. Click Apply

Like other people who write code, I am lazy and want this to be a one-step process. Bash functions to the rescue!

```
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

The above function is simple to use and will toggle your Auto Proxy Discovery state on the network interface named "Wi-Fi". If you want to use it on a different interface, simply replace "Wi-Fi" with name of the interface you want to toggle (e.g. "USB Ethernet").

To use it, add the above code into your `.bash_profile`, then reload your `.bash_profile` with `source ~./bash_profile` or by opening up a new Terminal tab/window.

Then you can run the function by simply typing:
```
autoproxtog
```

Unfortunately, you have to provide your password when you run the command. But 2 steps is far better than 6.
