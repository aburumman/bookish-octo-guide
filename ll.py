class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None


    def append(self,value):
        node = Node(value)

        if self.head is None:
            self.head = node 
            return 
        
        current = self.head

        while current.next:
            current = current.next 

        current.next = node

    def print_list(self):
        current = self.head 

        while current:
            print(current.value, end="")
            current = current.next

lst  = LinkedList()

lst.append(10)
lst.append(20)
lst.append(30)

lst.print_list()