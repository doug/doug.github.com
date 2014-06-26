---
layout: article
title: Go Dining Philosophers
author: Doug
description: 'Wrote a toy implementation of the dining philosophers problem to teach myself concurrency in <a href="http://www.golang.com">go</a>.'
---

{{ page.description }}

One of the coolest things I found was the way to do timeouts of go routines using case select
statements.

Read more about the dining philosophers problem here [Wikipedia Dining Philosophers Problem](http://en.wikipedia.org/wiki/Dining_philosophers_problem)

Grab the source code from github here [https://github.com/doug/go-dining-philosophers](https://github.com/doug/go-dining-philosophers).

{% highlight go %}

/**
* Toy Go implementation of Dining Philosophers problem
* http://en.wikipedia.org/wiki/Dining_philosophers_problem
* Author: Doug Fritz
* Date: 2011-01-05
**/

package main

import (
	"fmt"
	"rand"
	"time"
)

type Philosopher struct {
	name         string
	chopstick    chan bool
	neighbor     *Philosopher
}

func makePhilosopher(name string, neighbor *Philosopher) *Philosopher {
	phil := &Philosopher{name, make(chan bool, 1), neighbor}
	phil.chopstick <- true
	return phil
}

func (phil *Philosopher) think() {
	fmt.Printf("%v is thinking.\n",phil.name)
	time.Sleep(rand.Int63n(1e9))
}

func (phil *Philosopher) eat() {
	fmt.Printf("%v is eating.\n", phil.name)
	time.Sleep(rand.Int63n(1e9))
}

func (phil *Philosopher) getChopsticks() {
	timeout := make(chan bool, 1)
	go func() { time.Sleep(1e9); timeout <- true }()
	<-phil.chopstick
	fmt.Printf("%v got his chopstick.\n",phil.name)
	select {
		case <-phil.neighbor.chopstick:
			fmt.Printf("%v got %v's chopstick.\n",phil.name,phil.neighbor.name)
			fmt.Printf("%v has two chopsticks.\n",phil.name)
			return
		case <-timeout:
			phil.chopstick <- true
			phil.think()
			phil.getChopsticks()
	}
}

func (phil *Philosopher) returnChopsticks() {
	phil.chopstick <- true
	phil.neighbor.chopstick <- true
}

func (phil *Philosopher) dine(announce chan *Philosopher) {
	phil.think()
	phil.getChopsticks()
	phil.eat()
	phil.returnChopsticks()
	announce <- phil
}

func main() {
	names := []string{"Kant","Heidegger","Wittgenstein",
		"Locke","Descartes","Newton","Hume","Leibniz"}
	philosophers := make([]*Philosopher,len(names))
	var phil *Philosopher
	for i, name := range names {
		phil = makePhilosopher(name,phil)
		philosophers[i] = phil
	}
	philosophers[0].neighbor = phil
	fmt.Printf("There are %v philosophers sitting at a table.\n", len(philosophers))
	fmt.Println("They each have one chopstick, and must borrow from their neighbor to eat.")
	announce := make(chan *Philosopher)
	for _, phil := range philosophers {
		go phil.dine(announce)
	}
	for i :=0; i<len(names); i++ {
		phil := <-announce
		fmt.Printf("%v is done dining.\n",phil.name)
	}
}

{% endhighlight %}
