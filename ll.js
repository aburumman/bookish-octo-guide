class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Linkedlist {
    constructor(){
        this.head = null
    }

    append(value) {
        const node = new Node(value);
        if (!this.head) {
            this.head = node;
            return;
        }
        let current = this.head;

        while (current.next) {
            current = current.next;
        }
        current.next = node;
    }

    print(){
        let current = this.head;
        while(current) {
            console.log(current.value);
            current = current.next;
        }
    }


}