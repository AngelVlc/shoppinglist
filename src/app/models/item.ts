export class Item {
    name: string;
    remarks: string;
    important: boolean;
    quantity: number;

    constructor() {
        this.name = null;
        this.remarks = null;
        this.important = false;
        this.quantity = 1;
    }
}
