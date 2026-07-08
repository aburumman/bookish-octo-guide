package main

import "fmt"

type Node struct {
	value int
	next  *Node
}

type LinkedList struct {
	head *Node
}

func (l *LinkedList) Append(value int) {
	node := &Node{value: value}

	if l.head == nil {
		l.head = node
		return
	}

	current := l.head

	for current.next != nil {
		current = current.next
	}

	current.next = node
}

func (l *LinkedList) Print() {
	current := l.head
	for current != nil {
		fmt.Println(current.value)
		current = current.next
	}
}
