
# DeepQube

This is a simple project with a deep Q neural network (convnetjs).

The player is a little threejs cube in the center of the screen that can move in any of the 4 directions: up, down, left, and right. It's attached to a deep Q brain that chooses these actions and is rewarded when it gets closer to the center. The cube randomly gets moved around the screen, and after not long at all, it learns to move straight to the center. There's a backdrop of arrows showing the direction the neural network would pick at each point, if the cube were there!

This was just a quick, fun experiment into the realm of artificially intelligent self-balance.

### Examples

Here's an early screenshot; it learns very quickly the approximate directions it should go:

![](http://i.imgur.com/VlFJ0LT.png)

Here's one later on, when it can already basically zip straight to the center, wherever it starts:

![](http://i.imgur.com/XzMqzSl.png)
