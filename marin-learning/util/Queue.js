

export default function() {

    let tail, head;

    this.isEmpty = () => {
        return (head === undefined);
    };

    this.enqueue = (element) => {
        let newElement = { element };

        if (this.isEmpty()) {
            head = newElement;
            tail = newElement;
        } else {
            tail.next = newElement;
            tail = tail.next;
        }
    };

    this.dequeue = () => {
        if (this.isEmpty()) {
            return undefined;
        }

        let { element, next } = head;
        head = next;

        return element;
    }

    this.peek = () => {
        return (this.isEmpty()) ? undefined : head.element;
    };
};
