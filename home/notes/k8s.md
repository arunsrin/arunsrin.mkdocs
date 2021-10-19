# Kubernetes

Some kubernetes overview links, with a focus on networking.

## Terminal Enhancements

(Cross posted from [here](https://www.arunsr.in/2021/07/16/k8s-terminal-enhancements/))

### k9s

Get it [here](https://k9scli.io/). My go-to cluster navigator of choice. Very
vim-like in behaviour.

### kubectl plugins

Get [krew](https://krew.sigs.k8s.io/) which is a plugin manager for kubectl. I
installed these plugins to start with:

- [ctx](https://github.com/ahmetb/kubectx) – Easily switch between contexts.
Integrates out of the box with fzf so it’s pretty sweet
- [ns](https://github.com/ahmetb/kubectx) – Same, for switching namespaces
rapidly
- [tail](https://github.com/boz/kail) – Tails across all pods in a service,
among other things
- [tree](https://github.com/ahmetb/kubectl-tree) – shows the hierarchy of
resources (like Service -> Endpoint) in a tree

## Books

- *Kubernetes in Action* by Marko Luksa.

## Links

- [A guide to the k8s networking model](https://sookocheff.com/post/kubernetes/understanding-kubernetes-networking-model/) - Thoroughly detailed, best link of the lot.
- [Network Plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) - official docs.
- [Understanding k8s networking](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
- [Multi network configuration with Multus-CNI](http://dougbtv.com/nfvpe/2017/02/22/multus-cni/)
- [Ingress system](https://www.joyfulbikeshedding.com/blog/2018-03-26-studying-the-kubernetes-ingress-system.html)
- [Another k8s networking](https://cloudnativelabs.github.io/post/2017-04-18-kubernetes-networking/)
- [Another k8s networking link](https://dzone.com/articles/how-to-understand-and-setup-kubernetes-networking)
