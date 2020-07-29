class QueueIterator {
	constructor(queue) {
		this._queue = queue;
		this._count = 0;
	}

	next() {
		return {
			value: this._queue[this._count],
			done: this._count++ === this._queue.size,
		}
	}
}

class Queue {
	constructor(maxSize = 1000) {
		this._size = 0;
		this._maxSize = maxSize;
	}

	get isEmpty() {
		return this._size === 0;
	}

	get size() {
		return this._size;
	}

	enqueue(elem) {
		this[this._size++] = elem;

		if (this._size > this._maxSize) {
			throw new RangeError('Queue is full!')
		}

		return this._size;
	}

	front() {
		if (this.isEmpty) {
			throw new RangeError('Queue is empty!');
		}

		return this[0];
	}

	dequeue() {
		if (this.isEmpty) {
			throw new RangeError('Queue is empty!');
		}
		const firstElem = this[0];
		for (let i = 0; i < this._size - 1; i++) {
			this[i] = this[i + 1];
		}

		delete this[--this._size];
		return firstElem;
	}

	[Symbol.iterator]() {
		return new QueueIterator(this);
	}
}

class PriorityQueueItem {

	constructor(priority, value) {
		this.priority = priority;
		this.value = value;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		this._value = value;
	}

	get priority() {
		return this._priority;
	}

	set priority(value) {
		if (typeof value !== 'number') {
			throw new TypeError('Priority must be a number');
		}
		if (value <= 0) {
			throw new RangeError('Priority must be > 0');
		}
		this._priority = value;
	}
}

class PriorityQueue extends Queue {
	enqueue(...args) {
		let item;
		if (args.length === 1) {
			item = args[0];
		} else {
			item = new PriorityQueueItem(args[0], args[1]);
		}
		if (this.isEmpty) {
			this[0] = item;
		} else {
			for (let i = this.size - 1; i >= 0; i--) {
				if (item.priority >= this[i].priority) {
					this[i + 1] = item;
					break;
				} else {
					this[i + 1] = this[i];
				}
				if (i === 0) {
					this[this.size] = item;
					break;
				}
			}
		}
		return ++this._size;
	}
}