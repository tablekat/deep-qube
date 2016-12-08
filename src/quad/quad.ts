
// http://cs.stanford.edu/people/karpathy/convnetjs/demo/rldemo.html

const convnet = require('convnet');
const deepqlearn = convnet.deepqlearn;

var num_inputs = 2; // x and y becuase lazy
var num_actions = 4; // directions
var temporal_window = 0; // amount of temporal memory. 0 = agent lives in-the-moment :)
var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs;

// the value function network computes a value of taking any of the possible actions
// given an input state. Here we specify one explicitly the hard way
// but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
// to just insert simple relu hidden layers.
var layer_defs = [];
layer_defs.push({type: 'input', out_sx: 1, out_sy: 1, out_depth:  network_size});
layer_defs.push({type: 'fc', num_neurons: 10, activation: 'relu'});
//layer_defs.push({type: 'fc', num_neurons: 50, activation: 'relu'});
layer_defs.push({type: 'regression', num_neurons: num_actions});

// options for the Temporal Difference learner that trains the above net
// by backpropping the temporal difference learning rule.
//var tdtrainer_options = {learning_rate: 0.001, momentum: 0.0, batch_size: 64, l2_decay: 0.01};
var tdtrainer_options = {learning_rate: 0.00001, momentum: 0.0, batch_size: 12, l2_decay: 0.01};

var opt: any = {};
opt.temporal_window = temporal_window;
opt.experience_size = 30000;
opt.start_learn_threshold = 1000;
opt.gamma = 0.7;
opt.learning_steps_total = 200000;
opt.learning_steps_burnin = 3000;
opt.epsilon_min = 0.05;
opt.epsilon_test_time = 0.05;
opt.layer_defs = layer_defs;
opt.tdtrainer_options = tdtrainer_options;

export var brain = new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo
